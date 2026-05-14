"""
Run this if login is failing for the demo account.
It deletes and re-creates the demo user with a fresh password hash.
  cd backend
  venv\Scripts\python reset_demo.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from dotenv import load_dotenv
load_dotenv()

from database.models import create_tables, SessionLocal, User, Badge, ModuleProgress
from services.auth_service import hash_password
from datetime import datetime

def reset():
    create_tables()
    db = SessionLocal()

    # Delete existing demo user and all related data
    existing = db.query(User).filter(User.email == "demo@logicland.io").first()
    if existing:
        db.delete(existing)
        db.commit()
        print("🗑️  Deleted old demo user")

    # Re-create with fresh hash
    user = User(
        username="CodeExplorer", email="demo@logicland.io",
        hashed_password=hash_password("Demo1234!"),
        full_name="Alex Explorer", age=12, avatar="🦊",
        skill_level="Intermediate", xp_points=1340, streak_days=7,
        created_at=datetime(2026, 5, 1),
    )
    db.add(user); db.commit(); db.refresh(user)

    db.add_all([
        Badge(user_id=user.id, name="First Steps",   icon="👣", earned_at=datetime(2026,5,1)),
        Badge(user_id=user.id, name="Loop Master",   icon="🔄", earned_at=datetime(2026,5,5)),
        Badge(user_id=user.id, name="Variable Whiz", icon="⚡", earned_at=datetime(2026,5,10)),
        Badge(user_id=user.id, name="7-Day Streak",  icon="🔥", earned_at=datetime(2026,5,11)),
    ])
    db.add_all([
        ModuleProgress(user_id=user.id, module_name="Variables",     module_icon="📦", module_color="#4a8c5c", difficulty_tier=8, accuracy_rate=92.0, puzzles_completed=24, total_puzzles=26, is_mastered=True),
        ModuleProgress(user_id=user.id, module_name="Loops",         module_icon="🔄", module_color="#e8a030", difficulty_tier=6, accuracy_rate=78.5, puzzles_completed=18, total_puzzles=28, is_mastered=False),
        ModuleProgress(user_id=user.id, module_name="Conditionals",  module_icon="🔀", module_color="#2a90a8", difficulty_tier=5, accuracy_rate=71.0, puzzles_completed=14, total_puzzles=26, is_mastered=False),
        ModuleProgress(user_id=user.id, module_name="Functions",     module_icon="⚙️", module_color="#7b6fa0", difficulty_tier=3, accuracy_rate=55.0, puzzles_completed=8,  total_puzzles=30, is_mastered=False),
        ModuleProgress(user_id=user.id, module_name="Data Flow",     module_icon="🌊", module_color="#c4603a", difficulty_tier=2, accuracy_rate=40.0, puzzles_completed=4,  total_puzzles=24, is_mastered=False),
        ModuleProgress(user_id=user.id, module_name="How AI Thinks", module_icon="🧠", module_color="#7fb896", difficulty_tier=1, accuracy_rate=0.0,  puzzles_completed=0,  total_puzzles=20, is_mastered=False),
    ])
    db.commit(); db.close()
    print("✅ Demo user reset successfully!")
    print("   email:    demo@logicland.io")
    print("   password: Demo1234!")

if __name__ == "__main__":
    reset()
