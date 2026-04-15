from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required
from app.services.google_drive import GoogleDriveService
from app.utils.decorators import requires_role

timetables_bp = Blueprint('timetables', __name__)

@timetables_bp.route('/', methods=['GET'])
def get_timetables():
    try:
        service = GoogleDriveService()
        files = service.get_timetables()
        return jsonify(files), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@timetables_bp.route('/proxy/<file_id>', methods=['GET'])
def proxy_file(file_id):
    try:
        service = GoogleDriveService()
        file_bytes = service.download_file(file_id)
        if file_bytes:
            return Response(
                file_bytes,
                mimetype='application/pdf',
                headers={"Content-disposition": "inline"}
            )
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@timetables_bp.route('/rename/<file_id>', methods=['POST'])
@jwt_required()
@requires_role('admin')
def rename_timetable(file_id):
    data = request.get_json()
    new_name = data.get('name')
    service = GoogleDriveService()
    if service.rename_file(file_id, new_name):
        return jsonify({"message": "Renamed successfully"}), 200
    return jsonify({"error": "Rename failed"}), 500

@timetables_bp.route('/upload/<file_id>', methods=['POST'])
@jwt_required()
@requires_role('admin')
def upload_timetable(file_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty file"}), 400

    service = GoogleDriveService()
    file_bytes = file.read()
    if service.update_file_content(file_id, file_bytes):
        return jsonify({"message": "File updated successfully"}), 200
    return jsonify({"error": "Update failed"}), 500
