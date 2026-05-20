# services/auth_service.py
# WHY: Business logic lives here, NOT inside routes.
# Routes should be thin — just receive request, call service, return response.

import bcrypt
import jwt
from datetime import datetime, timedelta
from config.settings import JWT_SECRET, JWT_EXPIRY_HOURS

def hash_password(plain_password):
    # WHY bcrypt: It adds 'salt' automatically (random data mixed in)
    # Same password hashed twice gives DIFFERENT results — prevents rainbow table attacks
    password_bytes = plain_password.encode('utf-8')
    salt = bcrypt.gensalt()  # generates random salt
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')  # store as string in MongoDB

def verify_password(plain_password, stored_hash):
    # bcrypt compares plain password against stored hash correctly
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        stored_hash.encode('utf-8')
    )

def generate_token(user_id, email):
    # WHY JWT: A signed token the client stores and sends with every request
    # 'payload' = data inside the token (not secret, but tamper-proof)
    payload = {
        "user_id": str(user_id),
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS)
        # 'exp' = expiry time. Token auto-invalidates after 24 hours.
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def decode_token(token):
    # Verifies the token signature and returns payload
    # Raises exception if expired or tampered
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])