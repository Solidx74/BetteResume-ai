from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ResumeOut(BaseModel):
    resume_id: str
    filename: str
    user_id: str
    created_at: datetime


class HistoryItem(BaseModel):
    _id: str
    filename: str
    target_role: Optional[str] = None
    score: Optional[int] = None
    has_latex: bool = False
    analysis_id: Optional[str] = None
    created_at: datetime


class AnalyzeRequest(BaseModel):
    resume_id: str
    target_role: str


class LatexRequest(BaseModel):
    analysis_id: str
