from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database.models import create_tables
from routers import auth, dashboard, profile, ai_tutor
import traceback

app = FastAPI(
    title="LogicLand API",
    version="1.0.0",
    description="AI-powered game-based learning platform for kids",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_detail = traceback.format_exc()
    print("GLOBAL ERROR:", error_detail)
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "detail": error_detail},
    )

@app.on_event("startup")
def startup():
    create_tables()

app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(profile.router,   prefix="/api/profile",   tags=["Profile"])
app.include_router(ai_tutor.router,  prefix="/api/ai",        tags=["AI Tutor"])

@app.get("/")
def root():
    return {"status": "ok", "message": "LogicLand API 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/test")
def test():
    return {"status": "test ok"}
