import secrets
import string
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from bson import ObjectId

from config import settings
from db import get_db
from models.user import UserCreate, UserLogin, UserOut, TokenResponse
from middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
CODE_ALPHABET = string.ascii_uppercase + string.digits


class VerifyCodeRequest(BaseModel):
    email: str
    code: str


def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


def generate_verification_code() -> str:
    return "".join(secrets.choice(CODE_ALPHABET) for _ in range(6))


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def ensure_aware_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def create_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": user_id, "exp": expire},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def user_to_out(user: dict) -> UserOut:
    return UserOut(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        created_at=user.get("created_at", datetime.utcnow()),
    )


async def send_verification_email(to_email: str, code: str):
    if not settings.RESEND_API_KEY or not settings.FROM_EMAIL:
        print("Verification email skipped: Resend settings are missing")
        return

    payload = {
        "from": settings.FROM_EMAIL,
        "to": [to_email],
        "subject": "Verify your BetteResume account",
        "html": (
            "<p>Welcome to BetteResume.</p>"
            f"<p>Your verification code is <strong>{code}</strong>.</p>"
            "<p>This code expires in 10 minutes.</p>"
        ),
    }
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                json=payload,
                headers=headers,
            )
        if response.status_code != 200:
            print(f"Verification email failed: Resend returned {response.status_code}")
    except httpx.HTTPError as exc:
        print(f"Verification email failed: {exc}")
    except Exception as exc:
        print(f"Verification email failed unexpectedly: {exc}")


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserCreate):
    db = get_db()
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    code = generate_verification_code()
    now = utc_now()
    user_doc = {
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "is_verified": False,
        "verification_code": code,
        "code_expires_at": now + timedelta(minutes=10),
        "created_at": now,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    await send_verification_email(data.email, code)

    token = create_token(str(result.inserted_id))
    return TokenResponse(access_token=token, user=user_to_out(user_doc))


@router.post("/verify-code")
async def verify_code(payload: VerifyCodeRequest):
    db = get_db()
    email = payload.email.strip()
    code = payload.code.strip().upper()

    if not email or not code:
        raise HTTPException(status_code=400, detail="Email and verification code are required")

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("is_verified") is True:
        return {"message": "Email already verified"}

    expires_at = user.get("code_expires_at")
    if not isinstance(expires_at, datetime):
        raise HTTPException(status_code=400, detail="Verification code is invalid or expired")

    if utc_now() > ensure_aware_utc(expires_at):
        raise HTTPException(status_code=400, detail="Verification code has expired")

    if user.get("verification_code") != code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"is_verified": True},
            "$unset": {"verification_code": "", "code_expires_at": ""},
        },
    )
    return {"message": "Email verified successfully"}


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.get("is_verified", False):
        raise HTTPException(status_code=400, detail="Please verify your email before logging in.")

    token = create_token(str(user["_id"]))
    return TokenResponse(access_token=token, user=user_to_out(user))


@router.get("/me", response_model=UserOut)
async def me(current_user=Depends(get_current_user)):
    return user_to_out(current_user)
