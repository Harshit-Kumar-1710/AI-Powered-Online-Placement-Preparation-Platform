# models/user_model.py
# WHY: Defines exactly what a user document looks like in MongoDB.
# Consistency — every user stored the same way.

from datetime import datetime

def create_user_document(name, email, password_hash):
    return {
        "name": name,
        "email": email,
        "password_hash": password_hash,   # NEVER store plain password
        "streak": 0,
        "xp_points": 0,
        "last_activity": None,
        "profile_complete": False,
        "joined_at": datetime.utcnow()
    }