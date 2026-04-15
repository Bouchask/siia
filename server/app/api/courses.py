from flask import Blueprint, jsonify
from app.services.google_drive import GoogleDriveService

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/<folder_name>', methods=['GET'])
def get_courses(folder_name):
    try:
        service = GoogleDriveService()
        # folder_name would be "CourseMaterials" or specific module names
        contents = service.get_folder_contents(folder_name)
        return jsonify(contents), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
