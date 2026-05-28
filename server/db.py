from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING
from config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db

    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=10_000,  # fail fast with clear error
        connectTimeoutMS=10_000,
        socketTimeoutMS=30_000,
        tls=True,                         # Atlas always requires TLS
        tlsAllowInvalidCertificates=False,
    )

    db = client[settings.DB_NAME]

    # Verify Atlas is actually reachable before continuing startup
    await client.admin.command("ping")

    # motor 3.x API — use create_indexes with IndexModel, not create_index
    await db.users.create_indexes([
        IndexModel([("email", ASCENDING)], unique=True),
    ])
    await db.resumes.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
    ])
    await db.analyses.create_indexes([
        IndexModel([("resume_id", ASCENDING)]),
        IndexModel([("user_id", ASCENDING)]),
    ])

    print(f"✓ MongoDB connected → {settings.DB_NAME}")


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return db
