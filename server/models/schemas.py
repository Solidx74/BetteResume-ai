from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Resume ────────────────────────────────────────────────────────────────────

class ResumeUploadResponse(BaseModel):
    resume_id: str
    filename: str
    message: str = "Resume uploaded successfully"


class ResumeHistoryItem(BaseModel):
    id: str
    filename: str
    target_role: Optional[str] = None
    score: Optional[int] = None
    has_latex: bool = False
    analysis_id: Optional[str] = None
    created_at: datetime


# ── Analysis ──────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    resume_id: str
    target_role: str


class Recommendation(BaseModel):
    title: str
    description: Optional[str] = None
    url: Optional[str] = None


class AnalysisResponse(BaseModel):
    analysis_id: str
    resume_id: str
    filename: str
    target_role: str
    score: int
    summary: str
    extracted_skills: List[str] = []
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    recommendations: List[Any] = []
    created_at: datetime


# ── LaTeX ─────────────────────────────────────────────────────────────────────

class LatexGenerateRequest(BaseModel):
    analysis_id: str


class LatexResponse(BaseModel):
    analysis_id: str
    latex: str


class LatexFetchResponse(BaseModel):
    analysis_id: str
    latex: Optional[str] = None
