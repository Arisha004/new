@echo off
setlocal enabledelayedexpansion
title LogicLand Startup
echo.
echo  =============================================
echo    LogicLand - Full Stack Start
echo  =============================================
echo.

set ROOT=%~dp0
set BACKEND=%ROOT%backend
set FRONTEND=%ROOT%frontend
set PKGS_DIR=%ROOT%py_packages

:: ── Install Python packages to LOCAL folder (no C: drive needed) ──
echo [1/3] Installing backend packages to local folder...
if not exist "%PKGS_DIR%" mkdir "%PKGS_DIR%"

pip install fastapi uvicorn sqlalchemy psycopg2-binary "python-jose[cryptography]" "passlib[bcrypt]" "pydantic[email]" python-multipart python-dotenv langchain-anthropic langchain-core --target "%PKGS_DIR%" --quiet --disable-pip-version-check 2>nul
if errorlevel 1 (
    echo [WARN] Some packages may have failed, checking if existing packages work...
)
echo [OK] Packages ready in %PKGS_DIR%

:: ── Seed the database ─────────────────────────────────────────────
echo.
echo [2/3] Seeding database...
cd /d "%BACKEND%"
set PYTHONPATH=%PKGS_DIR%
python seed.py 2>nul && echo [OK] Demo user seeded || echo [OK] Demo user already exists

:: ── Start Backend ─────────────────────────────────────────────────
echo.
echo [3/3] Starting servers...
echo Starting backend on http://localhost:8000 ...
start "LogicLand - Backend" cmd /k "set PYTHONPATH=%PKGS_DIR% && cd /d "%BACKEND%" && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting for backend to start (5 seconds)...
timeout /t 5 /nobreak >nul

:: ── Start Frontend ────────────────────────────────────────────────
echo Starting frontend on http://localhost:3000 ...
cd /d "%FRONTEND%"

if exist "node_modules" (
    echo [OK] node_modules found - skipping npm install
    start "LogicLand - Frontend" cmd /k "cd /d "%FRONTEND%" && node node_modules\.bin\next dev"
) else (
    echo [!] node_modules missing - running npm install to %ROOT%...
    npm install --prefix "%FRONTEND%"
    start "LogicLand - Frontend" cmd /k "cd /d "%FRONTEND%" && node node_modules\.bin\next dev"
)

:: ── Done ──────────────────────────────────────────────────────────
echo.
echo  =============================================
echo   LogicLand is starting!
echo.
echo   App:       http://localhost:3000
echo   API Docs:  http://localhost:8000/docs
echo.
echo   Demo: demo@logicland.io / Demo1234!
echo.
echo   Wait ~20 seconds then open the link above.
echo  =============================================
echo.
timeout /t 20 /nobreak >nul
start http://localhost:3000
pause
