# LogicLand - PowerShell Starter (Right-click → Run with PowerShell)
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND = "$ROOT\backend"
$FRONTEND = "$ROOT\frontend"

Write-Host ""
Write-Host "  =============================================" -ForegroundColor Green
Write-Host "    LogicLand - Starting Up" -ForegroundColor Green
Write-Host "  =============================================" -ForegroundColor Green
Write-Host ""

# Install backend packages into system Python
Write-Host "[1/3] Installing backend packages..." -ForegroundColor Cyan
pip install fastapi uvicorn sqlalchemy psycopg2-binary "python-jose[cryptography]" "passlib[bcrypt]" "pydantic[email]" python-multipart python-dotenv langchain-anthropic langchain-core --quiet --disable-pip-version-check
Write-Host "[OK] Packages ready" -ForegroundColor Green

# Seed DB
Write-Host "[2/3] Seeding database..." -ForegroundColor Cyan
Set-Location $BACKEND
python seed.py 2>$null
Write-Host "[OK] Database ready" -ForegroundColor Green

# Start backend
Write-Host "[3/3] Starting servers..." -ForegroundColor Cyan
$backend = Start-Process -FilePath "python" -ArgumentList "-m uvicorn main:app --host 0.0.0.0 --port 8000 --reload" -WorkingDirectory $BACKEND -PassThru -WindowStyle Normal

Start-Sleep -Seconds 4

# Start frontend (using pre-bundled node_modules)
Set-Location $FRONTEND
if (Test-Path "node_modules") {
    Write-Host "[OK] node_modules found - no install needed" -ForegroundColor Green
} else {
    Write-Host "[!] Running npm install..." -ForegroundColor Yellow
    npm install --prefer-offline --silent
}
$frontend = Start-Process -FilePath "node" -ArgumentList "node_modules\.bin\next dev" -WorkingDirectory $FRONTEND -PassThru -WindowStyle Normal

Write-Host ""
Write-Host "  =============================================" -ForegroundColor Green
Write-Host "   App:      http://localhost:3000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "   Demo:     demo@logicland.io / Demo1234!" -ForegroundColor White
Write-Host "  =============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Opening browser in 15 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
Start-Process "http://localhost:3000"

Write-Host "Press Enter to stop all servers..." -ForegroundColor Red
Read-Host
Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
Write-Host "Servers stopped. Goodbye!" -ForegroundColor Green
