from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.user import User
from app import db
from app.utils.decorators import requires_role

from app.models.announcement import Announcement
from app.models.event import Event

users_bp = Blueprint('users', __name__)

@users_bp.route('/stats', methods=['GET'])
@jwt_required()
@requires_role('admin', 'professor')
def get_stats():
    stats = {
        "total_users": User.query.count(),
        "students": User.query.filter_by(role='student').count(),
        "professors": User.query.filter_by(role='professor').count(),
        "announcements": Announcement.query.count(),
        "events": Event.query.count()
    }
    return jsonify(stats), 200

@users_bp.route('/', methods=['GET'])
@jwt_required()
@requires_role('admin')
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@users_bp.route('/', methods=['POST'])
@jwt_required()
@requires_role('admin')
def create_user():
    data = request.get_json()
    email = data.get('email')
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400
        
    new_user = User(
        email=email,
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        role=data.get('role', 'student')
    )
    new_user.set_password(data.get('password'))
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()), 201

@users_bp.route('/<uuid:user_id>', methods=['DELETE'])
@jwt_required()
@requires_role('admin')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200
