from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from db import connect_db, close_db
from routers import auth, resume, analyze
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="BetteResume",
    description="Resume analyzer, skill gap finder, and LaTeX resume generator powered by Groq LLaMA 3.3 70B",
    version="1.0.0",
    lifespan=lifespan,
)

# Dynamic CORS: always allow localhost for dev + FRONTEND_URL for prod (Vercel)
allowed_origins = list({
    "http://localhost:5173",
    "http://localhost:3000",
    settings.FRONTEND_URL.rstrip("/"),
})

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(resume.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": "llama-3.3-70b-versatile"}
