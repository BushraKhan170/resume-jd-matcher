from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.study_plan import router as study_plan_router
from backend.routes.upload import router as upload_router
from backend.routes.job_description import router as jd_router
from backend.routes.analyze import router as analyze_router
from backend.routes.document import router as document_router
from backend.routes.retrieve import router as retrieve_router

app = FastAPI(title="AI Resume Screener")

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(jd_router)
app.include_router(analyze_router)
app.include_router(document_router)
app.include_router(retrieve_router)
app.include_router(study_plan_router)

@app.get("/")
def home():
    return {
        "message": "AI Resume Screener API is Running!"
    }