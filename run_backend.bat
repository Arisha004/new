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

:: Install/update dependencies
echo Installing/verifying dependencies...
venv\Scripts\pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

:: Reset demo user with fresh password hash
echo Setting up demo user...
venv\Scripts\python reset_demo.py
echo.

echo Starting FastAPI on http://localhost:8000
echo API Docs at http://localhost:8000/docs
echo Press Ctrl+C to stop
echo.

venv\Scripts\uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
