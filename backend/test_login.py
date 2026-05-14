from dotenv import load_dotenv
load_dotenv()

from database.models import SessionLocal, User
from services.auth_service import verify_password, create_access_token

db = SessionLocal()
user = db.query(User).filter(User.email == 'demo@logicland.io').first()
print('User:', user.email)
print('Password OK:', verify_password('Demo1234!', user.hashed_password))

try:
    token = create_access_token(user.id)
    print('Token OK:', token[:30])
except Exception as e:
    print('Token ERROR:', e)

try:
    from routers.auth import AuthResp
    resp = AuthResp(
        access_token=token,
        user_id=user.id,
        username=user.username,
        avatar=user.avatar,
        skill_level=user.skill_level,
        xp_points=user.xp_points,
    )
    print('AuthResp OK:', resp)
except Exception as e:
    print('AuthResp ERROR:', e)

db.close()
