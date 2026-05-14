#!/bin/bash
# ── LogicLand Backend Startup ─────────────────────────────────────────────────
set -e

echo ""
echo "🌿 LogicLand — Starting Backend"
echo "================================"

cd "$(cd "$(dirname "$0")" && pwd)/backend"

if command -v python3 &>/dev/null; then PYTHON=python3
elif command -v python &>/dev/null; then PYTHON=python
else echo "❌ Python not found. Install Python 3.10+"; exit 1; fi

if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  $PYTHON -m venv venv
fi

if [ -f "venv/Scripts/activate" ]; then source venv/Scripts/activate
elif [ -f "venv/bin/activate" ]; then source venv/bin/activate; fi

echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

echo "🌱 Seeding database..."
$PYTHON seed.py || echo "⚠️  Seed skipped (user may already exist)"

echo ""
echo "✅ Backend starting at http://localhost:8000"
echo "📖 API docs at http://localhost:8000/docs"
echo ""
uvicorn main:app --reload --host 0.0.0.0 --port 8000
