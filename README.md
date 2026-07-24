# AI Resume Screener & Feedback

## Project Description

This project compares a resume with a job description using AI and provides:

- Resume match score
- Missing keywords
- Resume strengths
- Improvement suggestions

## Features

- Upload Resume (PDF/DOCX)
- Resume Text Extraction
- Job Description Input
- AI Resume Analysis
- Match Score (0–100)
- Missing Keywords Detection
- Suggestions for Resume Improvement

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- FastAPI
- Python

### AI
- OpenAI API

## Project Structure

```
backend/
frontend/
README.md
```

## Installation

### Backend

```bash
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```
http://localhost:3000
```

Backend:

```
http://127.0.0.1:8000
```

## Author

Bushra Khan
