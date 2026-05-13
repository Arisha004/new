@echo off
REM ── LogicLand Backend Startup (Windows) ───────────────────────────────────────
echo.
echo  LogicLand — Starting Backend
echo  ================================
echo.

cd /d "%~dp0backend"

REM ── Detect python ────────────────────────────────────────────────
SET PYTHON=
where python >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    python -c "import sys; exit(0 if sys.version_info >= (3,10) else 1)" >nul 2>&1
    IF %ERRORLEVEL% EQU 0 SET PYTHON=python
)
IF "%PYTHON%"=="" (
    where python3 >nul 2>&1
    IF %ERRORLEVEL% EQU 0 SET PYTHON=python3
)
IF "%PYTHON%"=="" (
    echo  ERROR: Python 3.10+ not found.
    echo  Install from https://www.python.org — check "Add Python to PATH"
    pause & exit /b 1
)
echo  Using: %PYTHON%

REM ── Create venv ───────────────────────────────────────────────────
IF NOT EXIST "venv\" (
    echo  Creating virtual environment...
    %PYTHON% -m venv venv
    IF %ERRORLEVEL% NEQ 0 (
        echo  ERROR: Failed to create venv.
        pause & exit /b 1
    )
)

REM ── Activate venv ────────────────────────────────────────────────
call venv\Scripts\activate.bat
IF %ERRORLEVEL% NEQ 0 (
    echo  ERROR: Could not activate venv.
    pause & exit /b 1
)

REM ── Upgrade pip silently, then install deps ───────────────────────
echo  Upgrading pip...
python -m pip install --upgrade pip --quiet

echo  Installing dependencies...
pip install --only-binary :all: psycopg2-binary==2.9.10 --quiet
IF %ERRORLEVEL% NEQ 0 (
    echo  Retrying psycopg2-binary with latest version...
    pip install --only-binary :all: psycopg2-binary --quiet
)
pip install -r requirements.txt --quiet
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: pip install failed. See errors above.
    pause & exit /b 1
)

REM ── Seed database ────────────────────────────────────────────────
echo  Seeding database...
python seed.py
IF %ERRORLEVEL% NEQ 0 (
    echo  (seed skipped — user may already exist)
)

REM ── Start server ─────────────────────────────────────────────────
echo.
echo  Backend starting at http://localhost:8000
echo  API docs at   http://localhost:8000/docs
echo.
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
