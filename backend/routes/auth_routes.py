from flask import Blueprint, request, jsonify, current_app, g
from models.user_model import create_user_document
from services.auth_service import hash_password, verify_password, generate_token
from middleware.auth_middleware import token_required
from bson import ObjectId

auth_bp = Blueprint('auth', __name__)


# POST /api/register
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not all(k in data for k in ['name', 'email', 'password']):
        return jsonify({"error": "Name, email, and password are required"}), 400

    name     = data['name'].strip()
    email    = data['email'].strip().lower()
    password = data['password']

    if len(name) < 2:
        return jsonify({"error": "Name must be at least 2 characters"}), 400

    if '@' not in email or '.' not in email:
        return jsonify({"error": "Please enter a valid email address"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    existing_user = current_app.db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already registered. Please login."}), 409

    password_hash = hash_password(password)
    user_doc = create_user_document(name, email, password_hash)
    result = current_app.db.users.insert_one(user_doc)
    token = generate_token(result.inserted_id, email)

    return jsonify({
        "message": "Registration successful! Welcome aboard.",
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": name,
            "email": email
        }
    }), 201


# POST /api/login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({"error": "Email and password are required"}), 400

    email    = data['email'].strip().lower()
    password = data['password']

    user = current_app.db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not verify_password(password, user['password_hash']):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user['_id'], email)

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email']
        }
    }), 200


# GET /api/me  (protected)
@auth_bp.route('/me', methods=['GET'])
@token_required
def get_profile():
    user = current_app.db.users.find_one(
        {"_id": ObjectId(g.current_user_id)},
        {"password_hash": 0}
    )
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user['_id']),
        "name": user['name'],
        "email": user['email'],
        "streak": user.get('streak', 0),
        "xp_points": user.get('xp_points', 0),
        "profile_complete": user.get('profile_complete', False),
        "joined_at": str(user.get('joined_at', ''))
    }), 200