from pathlib import Path
from pydantic_settings import BaseSettings

# Absolute path to .env — works regardless of where uvicorn is launched from on Windows/Linux
ENV_FILE = Path(__file__).parent / ".env"


class Settings(BaseSettings):
    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DB_NAME: str = "betteresume"

    # Auth
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # AI
    GROQ_API_KEY: str = ""

    # Email
    RESEND_API_KEY: str = ""
    FROM_EMAIL: str = "onboarding@resend.dev"

    # Upload
    MAX_FILE_SIZE_MB: int = 10

    # Deployment
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"

    # Pydantic v2 style config
    model_config = {
        "env_file": str(ENV_FILE),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()

# Startup sanity check — warns loudly if Atlas URI never loaded
if "localhost" in settings.MONGODB_URI and "27017" in settings.MONGODB_URI:
    import warnings
    warnings.warn(
        f"\nWARNING: MONGODB_URI is still localhost:27017.\n"
        f"   .env expected at: {ENV_FILE}\n"
        f"   Make sure .env exists inside the server/ folder and contains MONGODB_URI.",
        stacklevel=2,
    )
