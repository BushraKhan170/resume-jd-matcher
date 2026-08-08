# AI Resume Screener & Feedback

## Project Description

This project compares a resume with a job description using AI and provides:

- Resume match score
- Missing keywords
- Resume strengths
- Improvement suggestions

The project was extended in **Week 3** with an AI Study Planner using a Retrieval-Augmented Generation (RAG) pipeline.

## Features

### AI Resume Screener

- Upload Resume (PDF/DOCX)
- Resume Text Extraction
- Job Description Input
- AI Resume Analysis
- Match Score (0–100)
- Missing Keywords Detection
- Suggestions for Resume Improvement

### AI Study Planner — Week 3

- Upload syllabus or notes
- Support for PDF, DOCX, and TXT files
- Document text extraction
- Document chunking
- Vector embedding generation
- Store embeddings in Qdrant
- Retrieve relevant document chunks
- Generate a basic study plan using Gemini
- Return structured JSON
- Display the generated study plan in the frontend

## Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS

### Backend

- FastAPI
- Python

### AI / LLM

- Google Gemini API

### Embeddings

- Sentence Transformers
- `all-MiniLM-L6-v2`

### Vector Database

- Qdrant

## Week 3 RAG Pipeline

The Study Planner follows this retrieval pipeline:

```text
Upload Syllabus / Notes
        ↓
   Extract Text
        ↓
     Chunking
        ↓
Generate Embeddings
        ↓
 Store in Qdrant
        ↓
  Enter Study Topic
        ↓
Retrieve Relevant Chunks
        ↓
Retrieved Content + Topic
        ↓
      Gemini
        ↓
 Structured JSON
        ↓
  Study Plan in Frontend
```

## Installation

### Backend

```bash
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Qdrant Setup

Qdrant is required for the Week 3 retrieval pipeline.

Make sure Docker Desktop is running, then run:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

The backend connects to Qdrant at:

```text
http://localhost:6333
```

The application uses the collection:

```text
study_notes
```

The embedding model is:

```text
all-MiniLM-L6-v2
```

The embedding dimension is:

```text
384
```

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Do **not** commit the actual API key to GitHub.

Make sure `.env` is included in `.gitignore`.

## Week 3 API Endpoints

### Upload Document

```text
POST /upload-document
```

Uploads a PDF, DOCX, or TXT document, extracts its text, chunks it, generates embeddings, and stores the embeddings in Qdrant.

### Retrieve Relevant Chunks

```text
POST /retrieve
```

Example:

```json
{
  "query": "Deadlock"
}
```

The query is converted into an embedding and the most relevant chunks are retrieved from Qdrant.

### Generate Study Plan

```text
POST /study-plan
```

Example:

```json
{
  "topic": "Deadlock"
}
```

The endpoint retrieves relevant chunks from Qdrant and sends them with the topic to Gemini to generate a structured study plan.

## Week 3 Working Demo

A Deadlock chapter PDF was successfully processed:

```text
File: Chapter 8 Deadlock.pptx.pdf
Chunks: 70
Embedding Dimension: 384
```

The embeddings were stored in the Qdrant `study_notes` collection.

Using the topic **Deadlock**, the system successfully retrieved relevant content and generated a study plan covering deadlock concepts such as:

- Deadlock characterization
- Mutual exclusion
- Hold and wait
- No preemption
- Circular wait
- Deadlock prevention
- Deadlock avoidance
- Deadlock detection
- Deadlock recovery

## Security

API keys must not be hardcoded.

Use environment variables and never commit `.env` to GitHub.

## Week 3 Scope

This week's implementation includes:

- Document upload
- Chunking
- Embeddings
- Qdrant storage
- Retrieval
- Basic study plan generation
- Frontend rendering

Adaptive quizzes and progress tracking are planned for Week 4.

## Author

Bushra Khan