# LogicLand - PowerShell Starter (Right-click -> Run with PowerShell)
$ROOT     = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND  = "$ROOT\backend"
$FRONTEND = "$ROOT\frontend"

Write-Host ""
Write-Host "  =============================================" -ForegroundColor Green
Write-Host "    LogicLand - Starting Up" -ForegroundColor Green
Write-Host "  =============================================" -ForegroundColor Green
Write-Host ""

# Check Python
try { python --version | Out-Null } catch {
    Write-Host "ERROR: Python not found. Install from https://python.org" -ForegroundColor Red
    Read-Host; exit 1
}

# Check Node
try { node --version | Out-Null } catch {
    Write-Host "ERROR: Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    Read-Host; exit 1
}

# --- Backend setup ---
Write-Host "[1/3] Setting up backend virtual environment..." -ForegroundColor Cyan
Set-Location $BACKEND

if (-not (Test-Path "venv")) {
    Write-Host "      Creating venv..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "      Installing dependencies..." -ForegroundColor Yellow
& "venv\Scripts\pip.exe" install -q -r requirements.txt

Write-Host "[2/3] Seeding database..." -ForegroundColor Cyan
& "venv\Scripts\python.exe" seed.py
Write-Host "[OK] Database ready" -ForegroundColor Green

# --- Start backend with venv python ---
Write-Host "[3/3] Starting servers..." -ForegroundColor Cyan
$backendProc = Start-Process -FilePath "$BACKEND\venv\Scripts\uvicorn.exe" `
    -ArgumentList "main:app --host 0.0.0.0 --port 8000 --reload" `
    -WorkingDirectory $BACKEND -PassThru -WindowStyle Normal

Start-Sleep -Seconds 6

# --- Frontend setup ---
Set-Location $FRONTEND
if (-not (Test-Path "node_modules")) {
    Write-Host "[!] Running npm install..." -ForegroundColor Yellow
    npm install --silent
} else {
    Write-Host "[OK] node_modules found" -ForegroundColor Green
}

$frontendProc = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/k npx next dev" `
    -WorkingDirectory $FRONTEND -PassThru -WindowStyle Normal

Write-Host ""
Write-Host "  =============================================" -ForegroundColor Green
Write-Host "   App:      http://localhost:3000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "   Demo:     demo@logicland.io / Demo1234!" -ForegroundColor White
Write-Host "  =============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Opening browser in 20 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 20
Start-Process "http://localhost:3000"

Write-Host "Press Enter to stop all servers..." -ForegroundColor Red
Read-Host
Stop-Process -Id $backendProc.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontendProc.Id -Force -ErrorAction SilentlyContinue
Write-Host "Servers stopped. Goodbye!" -ForegroundColor Green
