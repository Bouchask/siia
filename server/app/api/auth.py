from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.models.user import User
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        # Create access token with user ID and role
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role}
        )
        return jsonify({
            "access_token": access_token,
            "user": user.to_dict()
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    print(f"[AUTH] Register attempt for email: {email}")

    if not all([email, password, first_name, last_name]):
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=data.get('role', 'student') # Use provided role or default to 'student'
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    # Automatically log in the user after registration
    access_token = create_access_token(
        identity=str(new_user.id),
        additional_claims={"role": new_user.role}
    )

    return jsonify({
        "message": "User registered successfully",
        "access_token": access_token,
        "user": new_user.to_dict()
    }), 201

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200
