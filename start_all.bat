@echo off
setlocal enabledelayedexpansion
title LogicLand Startup
echo.
echo  =============================================
echo    LogicLand - Starting (No Install Needed)
echo  =============================================
echo.

set ROOT=%~dp0
set BACKEND=%ROOT%backend
set FRONTEND=%ROOT%frontend

:: ── Check Python ──────────────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install from https://python.org
    pause & exit /b 1
)
echo [OK] Python: 
python --version

:: ── Check Node ────────────────────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause & exit /b 1
)
echo [OK] Node: 
node --version

:: ── Install backend packages using system pip (no venv needed) ────
echo.
echo [1/3] Installing backend packages into system Python...
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose[cryptography] passlib[bcrypt] pydantic[email] python-multipart python-dotenv langchain-anthropic langchain-core --quiet --disable-pip-version-check
if errorlevel 1 (
    echo [WARN] Some packages may have failed - trying to continue...
)
echo [OK] Backend packages ready

:: ── Seed the database ─────────────────────────────────────────────
echo.
echo [2/3] Seeding database...
cd /d "%BACKEND%"
python seed.py 2>nul && echo [OK] Demo user seeded || echo [OK] Demo user already exists

:: ── Start Backend ─────────────────────────────────────────────────
echo.
echo [3/3] Starting servers...
echo Starting backend on http://localhost:8000 ...
start "LogicLand - Backend" cmd /c "cd /d "%BACKEND%" && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: Wait a moment for backend to start
echo Waiting for backend to start...
timeout /t 4 /nobreak >nul

:: ── Start Frontend ────────────────────────────────────────────────
echo Starting frontend on http://localhost:3000 ...
cd /d "%FRONTEND%"

:: node_modules is pre-bundled in the zip - no npm install needed
if exist "node_modules" (
    echo [OK] node_modules found - skipping npm install
) else (
    echo [!] node_modules missing - running npm install...
    npm install --prefer-offline --silent
)

start "LogicLand - Frontend" cmd /c "cd /d "%FRONTEND%" && node node_modules\.bin\next dev"

:: ── Done ──────────────────────────────────────────────────────────
echo.
echo  =============================================
echo   LogicLand is starting in 2 new windows!
echo.
echo   App:       http://localhost:3000
echo   API Docs:  http://localhost:8000/docs
echo.
echo   Demo login:
echo     Email:    demo@logicland.io
echo     Password: Demo1234!
echo.
echo   Wait ~15 seconds for Next.js to compile,
echo   then open http://localhost:3000
echo  =============================================
echo.
echo Opening browser in 15 seconds...
timeout /t 15 /nobreak >nul
start http://localhost:3000
echo.
echo Close this window to keep servers running.
echo Close the Backend and Frontend windows to stop.
pause
