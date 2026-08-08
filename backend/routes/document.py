from fastapi import APIRouter, UploadFile, File
import os

from backend.services.text_extractor import (
    extract_text_from_pdf,
    extract_text_from_docx
)
from backend.services.chunking import chunk_document
from backend.services.embedding_service import generate_embeddings
from backend.services.qdrant_service import store_embeddings

router = APIRouter()

UPLOAD_FOLDER = "backend/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Extract text
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)

    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file_path)

    elif file.filename.endswith(".txt"):
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

    else:
        return {
            "error": "Only PDF, DOCX and TXT files are supported."
        }

    # Split document into chunks
    chunks = chunk_document(text)

    # Generate embeddings
    embeddings = generate_embeddings(chunks)

    # Store embeddings in Qdrant
    store_embeddings(chunks, embeddings)

    return {
        "filename": file.filename,
        "total_chunks": len(chunks),
        "embedding_dimension": len(embeddings[0]) if embeddings else 0,
        "message": "Embeddings stored successfully in Qdrant."
    }