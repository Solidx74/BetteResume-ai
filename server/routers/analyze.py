from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId

from db import get_db
from middleware.auth import get_current_user
from models.resume import AnalyzeRequest
from services.groq_service import extract_resume_data, analyze_skill_gap

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("/resume")
async def analyze_resume(
    data: AnalyzeRequest,
    current_user=Depends(get_current_user),
):
    db = get_db()
    user_id = str(current_user["_id"])

    # Fetch resume
    resume = await db.resumes.find_one({"_id": ObjectId(data.resume_id)})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    raw_text = resume.get("raw_text", "")
    if not raw_text:
        raise HTTPException(status_code=422, detail="Resume has no extractable text")

    # Step 1: Extract structured data from resume
    try:
        resume_data = await extract_resume_data(raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume parsing failed: {str(e)}")

    # Step 2: Skill gap analysis
    try:
        gap_result = await analyze_skill_gap(resume_data, data.target_role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill gap analysis failed: {str(e)}")

    # Save to DB
    analysis_doc = {
        "user_id": user_id,
        "resume_id": ObjectId(data.resume_id),
        "filename": resume["filename"],
        "target_role": data.target_role,
        "resume_data": resume_data,
        "score": gap_result.get("score", 0),
        "matching_skills": gap_result.get("matching_skills", []),
        "missing_skills": gap_result.get("missing_skills", []),
        "summary": gap_result.get("summary", ""),
        "recommendations": gap_result.get("recommendations", []),
        "extracted_skills": resume_data.get("skills", []),
        "latex": None,
        "created_at": datetime.utcnow(),
    }
    result = await db.analyses.insert_one(analysis_doc)

    return {
        "analysis_id": str(result.inserted_id),
        "score": analysis_doc["score"],
        "target_role": data.target_role,
    }


@router.get("/{analysis_id}")
async def get_analysis(analysis_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    try:
        oid = ObjectId(analysis_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")

    analysis = await db.analyses.find_one({"_id": oid})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    if analysis["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")

    return {
        "analysis_id": str(analysis["_id"]),
        "resume_id": str(analysis["resume_id"]),
        "filename": analysis.get("filename", ""),
        "target_role": analysis.get("target_role", ""),
        "score": analysis.get("score", 0),
        "matching_skills": analysis.get("matching_skills", []),
        "missing_skills": analysis.get("missing_skills", []),
        "summary": analysis.get("summary", ""),
        "recommendations": analysis.get("recommendations", []),
        "extracted_skills": analysis.get("extracted_skills", []),
        "has_latex": bool(analysis.get("latex")),
        "created_at": analysis.get("created_at"),
    }
