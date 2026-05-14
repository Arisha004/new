#!/bin/bash
# ── LogicLand Frontend Startup ────────────────────────────────────────────────
set -e

echo ""
echo "🌿 LogicLand — Starting Frontend"
echo "================================="

cd "$(cd "$(dirname "$0")" && pwd)/frontend"

if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install Node.js 18+ from https://nodejs.org"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm packages..."
  npm install
else
  echo "📦 Dependencies already installed."
fi

echo ""
echo "✅ Frontend starting at http://localhost:3000"
echo ""
npm run dev
