from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.announcement import Announcement
from app import db
from app.utils.decorators import requires_role

announcements_bp = Blueprint('announcements', __name__)

@announcements_bp.route('/', methods=['GET'])
def get_announcements():
    announcements = Announcement.query.order_by(Announcement.created_at.desc()).all()
    return jsonify([a.to_dict() for a in announcements]), 200

@announcements_bp.route('/<int:id>', methods=['GET'])
def get_announcement(id):
    announcement = Announcement.query.get_or_404(id)
    return jsonify(announcement.to_dict()), 200

@announcements_bp.route('/', methods=['POST'])
@jwt_required()
@requires_role('professor', 'admin')
def create_announcement():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    new_announcement = Announcement(
        title=data.get('title'),
        content=data.get('content'),
        image_url=data.get('image_url'), # Handle image URL
        author_id=user_id,
        is_published=data.get('is_published', True)
    )
    db.session.add(new_announcement)
    db.session.commit()
    return jsonify(new_announcement.to_dict()), 201

@announcements_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
@requires_role('professor', 'admin')
def update_announcement(id):
    announcement = Announcement.query.get_or_404(id)
    data = request.get_json()
    
    announcement.title = data.get('title', announcement.title)
    announcement.content = data.get('content', announcement.content)
    announcement.image_url = data.get('image_url', announcement.image_url) # Update image URL
    announcement.is_published = data.get('is_published', announcement.is_published)
    
    db.session.commit()
    return jsonify(announcement.to_dict()), 200

@announcements_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
@requires_role('professor', 'admin')
def delete_announcement(id):
    announcement = Announcement.query.get_or_404(id)
    db.session.delete(announcement)
    db.session.commit()
    return jsonify({"message": "Announcement deleted"}), 200
