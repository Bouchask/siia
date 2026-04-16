from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.setting import Setting
from app.utils.decorators import requires_role

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/', methods=['GET'])
@jwt_required()
@requires_role('admin')
def get_settings():
    all_settings = Setting.query.all()
    settings_dict = {s.key: s.value for s in all_settings}
    return jsonify(settings_dict), 200

@settings_bp.route('/', methods=['POST'])
@jwt_required()
@requires_role('admin')
def update_settings():
    data = request.get_json()
    for key, value in data.items():
        Setting.set(key, value)
    return jsonify({"message": "Settings updated successfully"}), 200
