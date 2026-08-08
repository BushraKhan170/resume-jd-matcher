from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.retrieval_service import retrieve_chunks
from backend.services.study_plan_service import generate_study_plan

router = APIRouter()


class StudyPlanRequest(BaseModel):
    topic: str


@router.post("/study-plan")
def study_plan(data: StudyPlanRequest):

    print("Study Plan endpoint called")

    chunks = retrieve_chunks(data.topic)

    print(chunks)

    result = generate_study_plan(
        data.topic,
        chunks
    )

    return result