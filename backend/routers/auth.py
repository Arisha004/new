from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from database import get_db, User, Badge, ModuleProgress
from services import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

# ── seed data applied to every new account ────────────────────────────────────
_SEED_BADGES = [
    {"name": "First Steps",   "icon": "👣"},
    {"name": "Loop Master",   "icon": "🔄"},
    {"name": "Variable Whiz", "icon": "⚡"},
    {"name": "7-Day Streak",  "icon": "🔥"},
]
_SEED_MODULES = [
    dict(module_name="Variables",     module_icon="📦", module_color="#4a8c5c", difficulty_tier=8, accuracy_rate=92.0, puzzles_completed=24, total_puzzles=26, is_mastered=True),
    dict(module_name="Loops",         module_icon="🔄", module_color="#e8a030", difficulty_tier=6, accuracy_rate=78.5, puzzles_completed=18, total_puzzles=28, is_mastered=False),
    dict(module_name="Conditionals",  module_icon="🔀", module_color="#2a90a8", difficulty_tier=5, accuracy_rate=71.0, puzzles_completed=14, total_puzzles=26, is_mastered=False),
    dict(module_name="Functions",     module_icon="⚙️", module_color="#7b6fa0", difficulty_tier=3, accuracy_rate=55.0, puzzles_completed=8,  total_puzzles=30, is_mastered=False),
    dict(module_name="Data Flow",     module_icon="🌊", module_color="#c4603a", difficulty_tier=2, accuracy_rate=40.0, puzzles_completed=4,  total_puzzles=24, is_mastered=False),
    dict(module_name="How AI Thinks", module_icon="🧠", module_color="#7fb896", difficulty_tier=1, accuracy_rate=0.0,  puzzles_completed=0,  total_puzzles=20, is_mastered=False),
]


def _seed(db: Session, user: User):
    for b in _SEED_BADGES:
        db.add(Badge(user_id=user.id, **b))
    for m in _SEED_MODULES:
        db.add(ModuleProgress(user_id=user.id, **m))
    user.xp_points   = 1340
    user.streak_days = 7
    user.skill_level = "Intermediate"
    db.commit()


# ── Schemas ───────────────────────────────────────────────────────────────────
class RegisterReq(BaseModel):
    username:  str
    email:     str
    password:  str
    full_name: str = ""
    age:       int = 12

class LoginReq(BaseModel):
    email:    str
    password: str

class AuthResp(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user_id:      int
    username:     str
    avatar:       str
    skill_level:  str
    xp_points:    int


# ── Routes ────────────────────────────────────────────────────────────────────
@router.post("/register", response_model=AuthResp)
def register(req: RegisterReq, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(400, "Email already registered")
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(400, "Username already taken")

    user = User(
        username=req.username,
        email=req.email,
        hashed_password=hash_password(req.password),
        full_name=req.full_name or req.username,
        age=req.age,
    )
    db.add(user); db.commit(); db.refresh(user)
    _seed(db, user); db.refresh(user)

    return AuthResp(
        access_token=create_access_token(user.id),
        user_id=user.id, username=user.username,
        avatar=user.avatar, skill_level=user.skill_level, xp_points=user.xp_points,
    )


@router.post("/login", response_model=AuthResp)
def login(req: LoginReq, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user:
            raise HTTPException(401, "Invalid email or password")
        try:
            pwd_ok = verify_password(req.password, user.hashed_password)
        except Exception as e:
            raise HTTPException(500, f"Password verify error: {str(e)}")
        if not pwd_ok:
            raise HTTPException(401, "Invalid email or password")
        try:
            token = create_access_token(user.id)
        except Exception as e:
            raise HTTPException(500, f"Token error: {str(e)}")
        return AuthResp(
            access_token=token,
            user_id=user.id, username=user.username,
            avatar=user.avatar, skill_level=user.skill_level, xp_points=user.xp_points,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Login error: {str(e)}")


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id, "username": current_user.username,
        "email": current_user.email, "avatar": current_user.avatar,
        "skill_level": current_user.skill_level, "xp_points": current_user.xp_points,
    }
