from dotenv import load_dotenv
load_dotenv()
from services.auth_service import hash_password, verify_password
from database.models import SessionLocal, User

# Test bcrypt
h = hash_password('Demo1234!')
print('Hash OK:', h[:20])
print('Verify OK:', verify_password('Demo1234!', h))

# Test DB connection and user lookup
db = SessionLocal()
user = db.query(User).filter(User.email == 'demo@logicland.io').first()
if user:
    print('User found:', user.email)
    print('Stored hash:', user.hashed_password[:20])
    print('Password match:', verify_password('Demo1234!', user.hashed_password))
else:
    print('ERROR: User not found in DB!')
db.close()
