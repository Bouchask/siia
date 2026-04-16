from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.announcement import Announcement
from app import db
from app.utils.decorators import requires_role
from app.utils.tiptap import generate_excerpt

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
    
    content = data.get('content')
    excerpt = generate_excerpt(content)

    new_announcement = Announcement(
        title=data.get('title'),
        content=content,
        excerpt=excerpt,
        image_url=data.get('image_url'),
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
    
    if 'content' in data:
        announcement.content = data.get('content')
        announcement.excerpt = generate_excerpt(announcement.content)

    announcement.title = data.get('title', announcement.title)
    announcement.image_url = data.get('image_url', announcement.image_url)
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
