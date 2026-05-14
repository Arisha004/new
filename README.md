# 🌿 LogicLand — AI-Powered Learning Platform for Kids

An adaptive, game-based coding education platform for children aged 8–16.
Built with Next.js, FastAPI, and Neon PostgreSQL.

---

## ▶️ How to Run (Every Time)


### Terminal 1 — Start Backend
```cmd
cd d:\logicland\backend
venv\Scripts\uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 — Start Frontend
```cmd
cd d:\logicland\frontend
npm run dev
```

Then open → **http://localhost:3000**

---

## 🔧 First Time Setup Only

Run these once when you first clone the project:

### Backend setup
```cmd
cd d:\logicland\backend
python -m venv venv
venv\Scripts\pip install -r requirements.txt
venv\Scripts\python seed.py
```

### Frontend setup
```cmd
cd d:\logicland\frontend
npm install
```

---

## 🔑 Demo Login
```
Email:    demo@logicland.io
Password: Demo1234!
```

---

## 📄 Pages

| Page | URL |
|------|-----|
| Landing | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Dashboard | http://localhost:3000/dashboard |
| Profile | http://localhost:3000/profile |
| API Docs | http://localhost:8000/docs |

---

## ✨ Features Built

### 🏠 Landing Page (`/`)
- Animated 3D background with Three.js
- Scrolling ticker, testimonials, pricing section
- Interactive puzzle demo
- **Login** and **Register** buttons in navbar linked to app

### 📊 Dashboard (`/dashboard`)
- XP points, streak, accuracy, leaderboard rank
- 6 CS module cards with progress bars
  - Variables, Loops, Conditionals, Functions, Data Flow, How AI Thinks
- Weekly XP bar chart
- Logi AI personalised tip
- Badges earned, recent activity feed
- Today's summary panel

### 👤 Profile (`/profile`)
- View XP level bar and skill level
- Edit name, age, avatar (15 emoji options)
- Stats: badges, modules mastered, streak days

### 🔐 Auth (`/login`, `/register`)
- JWT-based login and registration
- 7-day persistent sessions via cookies
- New accounts auto-seeded with demo progress

---

## 🗄️ Database

Uses **Neon** (cloud PostgreSQL) — no local database needed.
Connection is pre-configured in `backend/.env`.

Tables: `users` · `badges` · `module_progress` · `puzzle_sessions`

---

## 🤖 AI Tutor (Logi)

To enable live AI responses, add your key to `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
Without a key the app still works — Logi uses pre-written hints.

---


---

*SZABIST University — Artificial Intelligence 2026*
Arisha Mumtaz (2312358) & Farheen Imam (2312363) · 