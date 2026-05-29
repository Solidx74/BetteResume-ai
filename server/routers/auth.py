import secrets
from datetime import datetime, timedelta

import httpx
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt

from config import settings
from db import get_db
from models.user import UserCreate, UserLogin, UserOut, TokenResponse
from middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


class VerifyOtpRequest(BaseModel):
    email: str
    otp: str


def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


def generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


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
        is_verified=user.get("is_verified", False),
        created_at=user.get("created_at", datetime.utcnow()),
    )


async def send_verification_email(to_email: str, otp: str):
    if not settings.RESEND_API_KEY or not settings.FROM_EMAIL:
        print("Verification email skipped: Resend settings are missing")
        return

    payload = {
        "from": settings.FROM_EMAIL,
        "to": [to_email],
        "subject": "Verify your BetteResume account",
        "html": (
            "<p>Welcome to BetteResume.</p>"
            f"<p>Your verification code is <strong>{otp}</strong>.</p>"
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

    otp = generate_otp()
    user_doc = {
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "is_verified": False,
        "otp": otp,
        "created_at": datetime.utcnow(),
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    await send_verification_email(data.email, otp)
    print(f"\n[OTP INTERCEPT] Generated 6-digit OTP code for {data.email}: {otp}\n")

    token = create_token(str(result.inserted_id))
    return TokenResponse(access_token=token, user=user_to_out(user_doc))


@router.post("/verify-otp")
async def verify_otp(payload: VerifyOtpRequest):
    db = get_db()
    email = payload.email.strip()
    otp = payload.otp.strip()

    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("is_verified") is True:
        return {"message": "Email already verified"}

    if user.get("otp") != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"is_verified": True},
            "$unset": {"otp": ""},
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
        raise HTTPException(
            status_code=403,
            detail="Please verify your email address to log in.",
        )

    token = create_token(str(user["_id"]))
    return TokenResponse(access_token=token, user=user_to_out(user))


@router.get("/me", response_model=UserOut)
async def me(current_user=Depends(get_current_user)):
    return user_to_out(current_user)
