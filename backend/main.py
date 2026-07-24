from fastapi import FastAPI

from backend.routes.upload import router as upload_router
from backend.routes.job_description import router as jd_router
from backend.routes.analyze import router as analyze_router

app = FastAPI(title="AI Resume Screener")

app.include_router(upload_router)
app.include_router(jd_router)
app.include_router(analyze_router)

@app.get("/")
def home():
    return {
        "message": "AI Resume Screener API is Running!"
    }