from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.retrieval_service import retrieve_chunks

router = APIRouter()


class QueryRequest(BaseModel):
    query: str


@router.post("/retrieve")
def retrieve(data: QueryRequest):

    chunks = retrieve_chunks(data.query)

    return {
        "results": chunks
    }