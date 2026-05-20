# middleware/auth_middleware.py
# WHY: A reusable 'guard' that protects any route you apply it to.
# Without this, anyone could call /api/me or /api/progress without logging in.

from functools import wraps
from flask import request, jsonify, g
from services.auth_service import decode_token
import jwt

def token_required(f):
    # 'wraps' preserves the original function's name (needed for Flask)
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # JWT token is sent in the Authorization header as:
        # "Authorization: Bearer <token>"
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]  # extract just the token

        if not token:
            return jsonify({"error": "Access denied. No token provided."}), 401

        try:
            # Decode and verify the token
            payload = decode_token(token)
            # Store user info in Flask's 'g' object (request-scoped global)
            # WHY 'g': Available throughout this request without passing it around
            g.current_user_id = payload['user_id']
            g.current_user_email = payload['email']

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired. Please login again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401

        return f(*args, **kwargs)  # proceed to the actual route

    return decorated