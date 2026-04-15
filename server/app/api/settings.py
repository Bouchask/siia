from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.setting import Setting
from app.utils.decorators import requires_role

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/', methods=['GET'])
@jwt_required()
@requires_role('admin')
def get_settings():
    settings = {
        "timetable_s6_id": Setting.get('timetable_s6_id', '13kxh1ef3rkI-Mrc2UrhlcOXpU4U9FQa7'),
        "timetable_s8_id": Setting.get('timetable_s8_id', '1kJu5eY9ceLd2FjYIZIbyrv3DFeHfhhcz'),
        "s8_special_doc_id": Setting.get('s8_special_doc_id', '1AfXI58ik0elLXAwng3pCY9l2TC5XQCUn')
    }
    return jsonify(settings), 200

@settings_bp.route('/', methods=['POST'])
@jwt_required()
@requires_role('admin')
def update_settings():
    data = request.get_json()
    for key, value in data.items():
        Setting.set(key, value)
    return jsonify({"message": "Settings updated successfully"}), 200
