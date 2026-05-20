# config/settings.py
# WHY THIS FILE EXISTS:
# One place to load and expose all environment variables.
# If a variable name changes in .env, you update it here only.

import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("JWT_SECRET")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

JWT_EXPIRY_HOURS = 24  # Token stays valid for 24 hours after login