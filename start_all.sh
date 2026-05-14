#!/bin/bash
# ══════════════════════════════════════════════════════════════════
#  LogicLand — One-command startup
#  Usage:  bash start_all.sh
# ══════════════════════════════════════════════════════════════════
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║   🌿  LogicLand — Full Stack Start    ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# ── Backend ───────────────────────────────────────────────────────
echo "🔧 Starting Backend (FastAPI)..."
cd "$ROOT/backend"

# Install deps only if venv missing (pre-installed in this zip)
if [ ! -d "venv" ]; then
  echo "   Creating venv & installing packages..."
  python3 -m venv venv
  venv/bin/pip install -q -r requirements.txt
fi

echo "   Seeding demo user..."
venv/bin/python seed.py 2>/dev/null && echo "   ✅ Seeded" || echo "   ℹ️  Already seeded"

echo "   Starting on http://localhost:8000 ..."
venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend
for i in $(seq 1 15); do
  curl -s http://localhost:8000/health >/dev/null 2>&1 && echo "   ✅ Backend ready!" && break
  sleep 1
done

# ── Frontend ──────────────────────────────────────────────────────
echo ""
echo "🎨 Starting Frontend (Next.js)..."
cd "$ROOT/frontend"

# Install only if node_modules missing (pre-installed in this zip)
if [ ! -d "node_modules" ]; then
  echo "   Installing npm packages..."
  npm install --silent
fi

echo "   Starting on http://localhost:3000 ..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  ✅ LogicLand is running!                        ║"
echo "║                                                  ║"
echo "║  🌐 App      →  http://localhost:3000            ║"
echo "║  📖 API Docs →  http://localhost:8000/docs       ║"
echo "║                                                  ║"
echo "║  🎮 Demo: demo@logicland.io / Demo1234!          ║"
echo "║  Press Ctrl+C to stop                            ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "Stopped. 🌿"; exit 0' INT TERM
wait $BACKEND_PID $FRONTEND_PID
