@echo off
title LogicLand Backend
echo  ================================
echo   LogicLand Backend Starting...
echo  ================================
echo.

cd /d "%~dp0backend"

:: Create venv if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Python not found. Install Python 3.10+ from https://python.org
        pause
        exit /b 1
    )
)

:: Install dependencies
echo Installing/verifying dependencies...
venv\Scripts\pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

:: Seed the database
echo Seeding database...
venv\Scripts\python seed.py
echo.

echo Starting FastAPI on http://localhost:8000
echo API Docs at http://localhost:8000/docs
echo Press Ctrl+C to stop
echo.

venv\Scripts\uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
