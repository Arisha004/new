@echo off
title LogicLand
echo.
echo  =============================================
echo    LogicLand - Full Stack Start
echo  =============================================
echo.

set ROOT=%~dp0

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

:: Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

:: Install npm packages if missing
if not exist "%ROOT%frontend\node_modules" (
    echo Installing frontend packages (first time only)...
    cd /d "%ROOT%frontend"
    npm install
    cd /d "%ROOT%"
) else (
    echo Frontend packages already installed.
)

echo.
echo Starting both servers in separate windows...
echo.

:: Start backend in its own window
start "LogicLand Backend" cmd /k "%ROOT%run_backend.bat"

:: Give backend 8 seconds to start before launching frontend
timeout /t 8 /nobreak >nul

:: Start frontend in its own window
start "LogicLand Frontend" cmd /k "%ROOT%run_frontend.bat"

echo.
echo  =============================================
echo   Both servers starting in new windows!
echo.
echo   App:      http://localhost:3000
echo   API Docs: http://localhost:8000/docs
echo   Demo:     demo@logicland.io / Demo1234!
echo.
echo   Wait ~20 seconds for Next.js to compile.
echo  =============================================
echo.
timeout /t 20 /nobreak >nul
start http://localhost:3000
echo Done! You can close this window.
pause
