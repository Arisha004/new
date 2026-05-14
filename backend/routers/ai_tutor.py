from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from database import User
from services import get_current_user
import os, random

router = APIRouter()

class HintReq(BaseModel):
    module: str; puzzle_description: str
    student_attempt: Optional[str] = None; skill_level: str = "Beginner"

class HintResp(BaseModel):
    hint: str; encouragement: str

class ChatReq(BaseModel):
    message: str

class ChatResp(BaseModel):
    reply: str

_ENC = [
    "You're doing amazing — keep going! 🌟",
    "Every expert was once a beginner. You've got this! 💪",
    "Mistakes are just learning in disguise! 🎯",
    "Your brain is growing stronger with every puzzle! 🧠",
]
_HINTS = [
    "Try breaking the problem into smaller steps — what's the very first thing you need to do? 🤔",
    "Think about what you already know! What similar puzzle have you solved before? 💡",
    "Read the puzzle slowly one more time — the clue is often hiding in the description! 🔍",
    "Remember: every big problem is just small problems stacked together. Start small! 🧩",
]

def _call_claude(system: str, msg: str) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY","")
    if not api_key or api_key.startswith("sk-ant-your"):
        return random.choice(_HINTS)
    try:
        from langchain_anthropic import ChatAnthropic
        from langchain_core.messages import HumanMessage, SystemMessage
        llm = ChatAnthropic(model="claude-sonnet-4-20250514", anthropic_api_key=api_key, max_tokens=300, temperature=0.7)
        r = llm.invoke([SystemMessage(content=system), HumanMessage(content=msg)])
        return r.content
    except Exception:
        return random.choice(_HINTS)

@router.post("/hint", response_model=HintResp)
def get_hint(req: HintReq, _: User = Depends(get_current_user)):
    sys = f"You are Logi, a friendly AI tutor for LogicLand (kids 8–16). Student is {req.skill_level} on {req.module}. Give a SHORT 2–3 sentence hint WITHOUT giving the answer. Be warm and fun. Use 1 emoji."
    hint = _call_claude(sys, f"Puzzle: {req.puzzle_description}\nAttempt: {req.student_attempt or 'none'}\nGive a hint.")
    return HintResp(hint=hint, encouragement=random.choice(_ENC))

@router.post("/chat", response_model=ChatResp)
def ai_chat(req: ChatReq, _: User = Depends(get_current_user)):
    sys = "You are Logi, LogicLand's friendly AI tutor for kids 8–16. Answer coding questions simply, max 4 sentences, end with an emoji."
    return ChatResp(reply=_call_claude(sys, req.message))
