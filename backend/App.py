# App.py — Flask entry point
# This is the file that starts your entire backend server.
# We keep app.py clean — it just sets things up and delegates.

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient

# Load .env file first — before anything else reads environment variables
load_dotenv()

# Import our database initializer and route blueprints
from config.db import init_db
from routes.auth_routes import auth_bp

# ─────────────────────────────────────────────
# Create the Flask application
# ─────────────────────────────────────────────
app = Flask(__name__)

# ─────────────────────────────────────────────
# CORS — allows your React frontend (port 5173)
# to talk to this Flask backend (port 5000)
# Without this, browser blocks all requests
# ─────────────────────────────────────────────
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",      # React dev server
            "http://localhost:3000",      # alternate React port
            "https://your-app.vercel.app" # add your Vercel URL later
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# ─────────────────────────────────────────────
# Connect to MongoDB Atlas
# init_db() attaches db to app.db
# ─────────────────────────────────────────────
init_db(app)

# ─────────────────────────────────────────────
# Register route blueprints
# url_prefix='/api' means all routes get /api/... prefix
# So auth_bp's /register becomes /api/register
# ─────────────────────────────────────────────
app.register_blueprint(auth_bp, url_prefix='/api')

# ─────────────────────────────────────────────
# Root route — quick health check
# Visit http://localhost:5000/ to confirm it's running
# ─────────────────────────────────────────────
@app.route("/")
def home():
    return {
        "status":  "running",
        "message": "AI Placement Platform API is live",
        "version": "2.0"
    }

# ─────────────────────────────────────────────
# Start the server
# debug=True means auto-restart on file save
# ─────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)