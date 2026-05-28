from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from typing import List

from db import get_db
from middleware.auth import get_current_user
from services.file_parser import parse_resume_file
from config import settings

router = APIRouter(prefix="/resume", tags=["resume"])

MAX_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    # Validate extension
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ("pdf", "docx"):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    contents = await file.read()
    if len(contents) > MAX_BYTES:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_FILE_SIZE_MB}MB limit")

    # Parse text
    try:
        raw_text = parse_resume_file(file.filename, contents)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse file: {str(e)}")

    if len(raw_text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Resume appears to be empty or unreadable")

    db = get_db()
    doc = {
        "user_id": str(current_user["_id"]),
        "filename": file.filename,
        "raw_text": raw_text,
        "created_at": datetime.utcnow(),
    }
    result = await db.resumes.insert_one(doc)

    return {"resume_id": str(result.inserted_id), "filename": file.filename}


@router.get("/history")
async def get_history(current_user=Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])

    # Join resumes with their analyses
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$sort": {"created_at": -1}},
        {"$limit": 20},
        {
            "$lookup": {
                "from": "analyses",
                "localField": "_id",
                "foreignField": "resume_id",
                "as": "analyses",
            }
        },
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "filename": 1,
                "created_at": 1,
                "score": {"$arrayElemAt": ["$analyses.score", 0]},
                "target_role": {"$arrayElemAt": ["$analyses.target_role", 0]},
                "has_latex": {
                    "$gt": [
                        {"$size": {"$filter": {"input": "$analyses", "cond": {"$ne": ["$$this.latex", None]}}}},
                        0,
                    ]
                },
                "analysis_id": {
                    "$toString": {"$arrayElemAt": ["$analyses._id", 0]}
                },
            }
        },
    ]
    results = await db.resumes.aggregate(pipeline).to_list(20)
    return results


@router.post("/generate-latex")
async def generate_latex_endpoint(
    data: dict,
    current_user=Depends(get_current_user),
):
    from services.groq_service import generate_latex

    analysis_id = data.get("analysis_id")
    if not analysis_id:
        raise HTTPException(status_code=400, detail="analysis_id required")

    db = get_db()
    analysis = await db.analyses.find_one({"_id": ObjectId(analysis_id)})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    if analysis["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")

    resume = await db.resumes.find_one({"_id": ObjectId(str(analysis["resume_id"]))})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        latex = await generate_latex(
            analysis.get("resume_data", {}),
            analysis.get("target_role", "Software Engineer"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LaTeX generation failed: {str(e)}")

    # Save latex to analysis document
    await db.analyses.update_one(
        {"_id": ObjectId(analysis_id)},
        {"$set": {"latex": latex, "latex_generated_at": datetime.utcnow()}},
    )

    return {"latex": latex, "analysis_id": analysis_id}


@router.get("/latex/{analysis_id}")
async def get_latex(analysis_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    analysis = await db.analyses.find_one({"_id": ObjectId(analysis_id)})
    if not analysis:
        raise HTTPException(status_code=404, detail="Not found")
    if analysis["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"latex": analysis.get("latex"), "analysis_id": analysis_id}
