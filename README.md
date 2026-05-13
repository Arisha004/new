# 🌿 LogicLand

A full-stack educational platform with a FastAPI backend and Next.js frontend.

---

## 🚀 Quick Start

### Windows (Recommended)

**Option 1 — Double-click:**
```
start_all.bat
```

**Option 2 — PowerShell:**
```powershell
powershell -ExecutionPolicy Bypass -File start_all.ps1
```

### Linux / macOS / Git Bash
```bash
bash start_all.sh
```

---

## 📋 Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | https://www.python.org (✅ check "Add to PATH") |
| Node.js | 18+ | https://nodejs.org |

---

## 🌐 URLs After Starting

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| API Docs | http://localhost:8000/docs |

---

## 🎮 Demo Login

| Field | Value |
|-------|-------|
| Email | demo@logicland.io |
| Password | Demo1234! |

---

## ⚙️ Configuration

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://...    # Your Neon DB URL
SECRET_KEY=your-secret-key
ANTHROPIC_API_KEY=sk-ant-...     # Your Anthropic API key
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
logicland/
├── start_all.bat          ← Windows one-click launcher
├── start_all.ps1          ← Windows PowerShell launcher
├── start_all.sh           ← Linux/macOS/Git Bash launcher
├── start_backend.bat/.sh  ← Backend only
├── start_frontend.bat/.sh ← Frontend only
├── backend/               ← FastAPI + SQLAlchemy
│   ├── main.py
│   ├── routers/
│   ├── services/
│   ├── database/
│   └── requirements.txt
└── frontend/              ← Next.js + Tailwind
    ├── src/app/
    ├── src/components/
    └── package.json
```

---

## 🛠️ Run Individually

### Backend only
- Windows: `start_backend.bat`
- Linux/Mac: `bash start_backend.sh`

### Frontend only
- Windows: `start_frontend.bat`
- Linux/Mac: `bash start_frontend.sh`
