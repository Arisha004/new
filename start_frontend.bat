@echo off
REM ── LogicLand Frontend Startup (Windows) ──────────────────────────────────────
echo.
echo  LogicLand — Starting Frontend
echo  =================================
echo.

cd /d "%~dp0frontend"

where node >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  ERROR: Node.js not found. Install from https://nodejs.org
    pause & exit /b 1
)

IF NOT EXIST "node_modules\" (
    echo  Installing npm packages...
    npm install
    IF %ERRORLEVEL% NEQ 0 (
        echo  ERROR: npm install failed.
        pause & exit /b 1
    )
) ELSE (
    echo  Dependencies already installed.
)

echo.
echo  Frontend starting at http://localhost:3000
echo.
npm run dev
pause
