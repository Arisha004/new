# ══════════════════════════════════════════════════════════════════
#  LogicLand — One-command startup (PowerShell)
#  Usage: powershell -ExecutionPolicy Bypass -File start_all.ps1
# ══════════════════════════════════════════════════════════════════

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host " LogicLand — Full Stack Start" -ForegroundColor Cyan
Write-Host " ═══════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ── Detect Python ────────────────────────────────────────────────
$python = $null
foreach ($cmd in @("python", "python3")) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        $ver = & $cmd -c "import sys; print(sys.version_info >= (3,10))" 2>$null
        if ($ver -eq "True") { $python = $cmd; break }
    }
}
if (-not $python) {
    Write-Host " ERROR: Python 3.10+ not found." -ForegroundColor Red
    Write-Host " Install from https://www.python.org (check Add to PATH)" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}
Write-Host " Using: $python" -ForegroundColor Green

# ── Check Node ───────────────────────────────────────────────────
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host " ERROR: Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}

# ── Backend Setup ────────────────────────────────────────────────
Write-Host ""
Write-Host "[1/2] Setting up Backend..." -ForegroundColor Yellow
Set-Location "$ROOT\backend"

if (-not (Test-Path "venv")) {
    Write-Host "   Creating virtual environment..."
    & $python -m venv venv
}

& "venv\Scripts\Activate.ps1"
Write-Host "   Upgrading pip..."
python -m pip install --upgrade pip --quiet
Write-Host "   Installing psycopg2-binary (pre-built)..."
pip install --only-binary ":all:" psycopg2-binary==2.9.10 --quiet
Write-Host "   Installing remaining packages..."
pip install -r requirements.txt --quiet

Write-Host "   Seeding database..."
try { & $python seed.py } catch { Write-Host "   (seed skipped)" }

Write-Host "   Starting backend..." -ForegroundColor Green
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ROOT\backend'; .\venv\Scripts\Activate.ps1; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000" -PassThru

# ── Frontend Setup ───────────────────────────────────────────────
Write-Host ""
Write-Host "[2/2] Setting up Frontend..." -ForegroundColor Yellow
Set-Location "$ROOT\frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing npm packages (~60s)..."
    npm install
}

Write-Host "   Starting frontend..." -ForegroundColor Green
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ROOT\frontend'; npm run dev" -PassThru

Write-Host ""
Write-Host " LogicLand is running!" -ForegroundColor Cyan
Write-Host "   App      => http://localhost:3000" -ForegroundColor White
Write-Host "   API Docs => http://localhost:8000/docs" -ForegroundColor White
Write-Host "   Login: demo@logicland.io / Demo1234!" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit (servers stay running)"
