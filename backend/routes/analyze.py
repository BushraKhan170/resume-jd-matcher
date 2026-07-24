from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.ai_service import analyze_resume

router = APIRouter()


class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/analyze")
def analyze(data: ResumeRequest):

    result = analyze_resume(
        data.resume_text,
        data.job_description
    )

    return result