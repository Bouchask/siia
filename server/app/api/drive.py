from flask import Blueprint, jsonify, Response, request
from app.services.google_drive import GoogleDriveService

drive_bp = Blueprint('drive', __name__)

@drive_bp.route('/proxy/<file_id>', methods=['GET'])
def proxy_file(file_id):
    try:
        service = GoogleDriveService()
        # 1. Get file metadata first to find the mimeType
        file_metadata = service.service.files().get(fileId=file_id, fields="mimeType, name").execute()
        mime_type = file_metadata.get('mimeType', 'application/pdf')
        
        # 2. Download the actual content
        file_bytes = service.download_file(file_id)
        
        if file_bytes:
            return Response(
                file_bytes,
                mimetype=mime_type,
                headers={"Content-disposition": f"inline; filename={file_metadata.get('name')}"}
            )
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        print(f"Proxy Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
