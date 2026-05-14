from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db, User, Badge, ModuleProgress
from services import get_current_user

router = APIRouter()

AVATARS = ["🦊","🐉","🦁","🐺","🦅","🐬","🐸","🦄","🐼","🦋","🐯","🦖","🚀","⭐","🌟"]

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    avatar: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int; username: str; email: str; full_name: str; age: int; avatar: str
    skill_level: str; xp_points: int; streak_days: int
    badges_count: int; modules_mastered: int; total_modules: int
    member_since: str; available_avatars: List[str]

def _build(user: User, db: Session) -> ProfileResponse:
    bc = db.query(Badge).filter(Badge.user_id == user.id).count()
    mm = db.query(ModuleProgress).filter(ModuleProgress.user_id == user.id, ModuleProgress.is_mastered == True).count()
    tm = db.query(ModuleProgress).filter(ModuleProgress.user_id == user.id).count()
    return ProfileResponse(
        id=user.id, username=user.username, email=user.email,
        full_name=user.full_name or user.username, age=user.age or 10,
        avatar=user.avatar or "🦊", skill_level=user.skill_level or "Beginner",
        xp_points=user.xp_points or 0, streak_days=user.streak_days or 0,
        badges_count=bc, modules_mastered=mm, total_modules=tm or 6,
        member_since=user.created_at.strftime("%B %Y") if user.created_at else "May 2026",
        available_avatars=AVATARS,
    )

@router.get("/", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _build(current_user, db)

@router.patch("/", response_model=ProfileResponse)
def update_profile(update: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if update.full_name is not None: current_user.full_name = update.full_name.strip()
    if update.age is not None:
        if not (6 <= update.age <= 18): raise HTTPException(400, "Age must be 6–18")
        current_user.age = update.age
    if update.avatar is not None:
        if update.avatar not in AVATARS: raise HTTPException(400, "Invalid avatar")
        current_user.avatar = update.avatar
    db.commit(); db.refresh(current_user)
    return _build(current_user, db)
