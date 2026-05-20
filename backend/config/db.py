# config/db.py
# WHY THIS FILE EXISTS:
# MongoDB connection lives here — one place, reusable everywhere.
# We attach the database to the Flask app object using init_db(app).
# Any route can then access it via current_app.db

from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def init_db(app):
    """
    Connects Flask to MongoDB Atlas.
    Attaches database to app.db so every route
    can access it via current_app.db
    """
    mongo_uri = os.getenv("MONGO_URI")

    if not mongo_uri:
        raise ValueError("❌ MONGO_URI not found in .env file!")

    client = MongoClient(mongo_uri)
    app.db = client["ai_placement_db"]

    # Index on email = MongoDB searches users by email very fast
    # unique=True = no two users can register with same email
    app.db.users.create_index("email", unique=True)

    print("✅ MongoDB Connected — ai_placement_db ready")