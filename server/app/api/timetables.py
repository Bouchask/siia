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

@timetables_bp.route('/service-account', methods=['GET'])
@jwt_required()
@requires_role('admin')
def get_service_account():
    try:
        service = GoogleDriveService()
        if not service.service:
            return jsonify({"error": f"Google Drive Service not configured: {service.error_message or 'Unknown error'}"}), 500
        if hasattr(service, 'service_account_email'):
            return jsonify({"email": service.service_account_email}), 200
        return jsonify({"error": "Service account not initialized"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@timetables_bp.route('/check-permissions/<file_id>', methods=['GET'])
@jwt_required()
@requires_role('admin')
def check_permissions(file_id):
    try:
        service = GoogleDriveService()
        if not service.service:
            return jsonify({"error": f"Google Drive Service not configured: {service.error_message or 'Unknown error'}"}), 500
        
        # Try to get metadata with write fields
        file_data = service.service.files().get(
            fileId=file_id, 
            fields="id, name, capabilities(canEdit, canRename)"
        ).execute()
        
        return jsonify({
            "status": "success",
            "name": file_data.get('name'),
            "can_edit": file_data.get('capabilities', {}).get('canEdit', False)
        }), 200
    except Exception as e:
        return jsonify({"error": f"Access Denied: {str(e)}"}), 403

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
