from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.event import Event
from app import db
from app.utils.decorators import requires_role
from datetime import datetime

events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.event_date.asc()).all()
    return jsonify([e.to_dict() for e in events]), 200

@events_bp.route('/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get_or_404(id)
    return jsonify(event.to_dict()), 200

@events_bp.route('/', methods=['POST'])
@jwt_required()
@requires_role('admin', 'professor')
def create_event():
    data = request.get_json()
    
    try:
        # Robust date parsing
        date_str = data.get('event_date', '')
        if not date_str:
            return jsonify({"error": "Event date is required"}), 400
            
        event_date = datetime.fromisoformat(date_str.replace('Z', ''))

        new_event = Event(
            title=data.get('title'),
            description=data.get('description'),
            location=data.get('location'),
            event_date=event_date,
            image_url=data.get('image_url')
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Event creation error: {e}")
        return jsonify({"error": str(e)}), 400

@events_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
@requires_role('admin', 'professor')
def update_event(id):
    event = Event.query.get_or_404(id)
    data = request.get_json()
    
    try:
        event.title = data.get('title', event.title)
        event.description = data.get('description', event.description)
        event.location = data.get('location', event.location)
        
        if data.get('event_date'):
            event.event_date = datetime.fromisoformat(data.get('event_date').replace('Z', ''))
            
        event.image_url = data.get('image_url', event.image_url)
        
        db.session.commit()
        return jsonify(event.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        print(f"Event update error: {e}")
        return jsonify({"error": str(e)}), 400

@events_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
@requires_role('admin', 'professor')
def delete_event(id):
    event = Event.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted"}), 200
