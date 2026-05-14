@echo off
title LogicLand Frontend
echo  ================================
echo   LogicLand Frontend Starting...
echo  ================================
echo.

cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo Installing packages...
    npm install
)

echo Starting Next.js on http://localhost:3000
echo Press Ctrl+C to stop
echo.

npx next dev
pause
