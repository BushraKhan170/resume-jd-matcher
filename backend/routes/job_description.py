from fastapi import APIRouter
from backend.models.job_description import JobDescription

router = APIRouter()


@router.post("/job-description")
def receive_job_description(data: JobDescription):

    return {
        "message": "Job description received successfully!",
        "job_description": data.job_description
    }