from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.setting import Setting
from app import db
from app.utils.decorators import requires_role

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/', methods=['GET'])
def get_settings():
    all_settings = Setting.query.all()
    settings_dict = {s.key: s.value for s in all_settings}
    return jsonify(settings_dict), 200

@settings_bp.route('/', methods=['POST'])
@jwt_required()
@requires_role('admin', 'professor')
def update_settings():
    data = request.get_json()
    try:
        for key, value in data.items():
            Setting.set(key, value)
        return jsonify({"message": "Settings updated successfully"}), 200
    except Exception as e:
        error_str = str(e).lower()
        # If the error is "value too long" or "truncation"
        if "too long" in error_str or "varying(500)" in error_str or "truncation" in error_str:
            try:
                from sqlalchemy import text
                db.session.rollback() # CRITICAL: Clear the failed state
                
                # Use a more standard and powerful ALTER syntax
                db.session.execute(text("ALTER TABLE settings ALTER COLUMN value SET DATA TYPE TEXT"))
                db.session.commit()
                
                # Retry one more time
                for key, value in data.items():
                    Setting.set(key, value)
                return jsonify({"message": "Database expanded and settings updated successfully!"}), 200
            except Exception as retry_e:
                db.session.rollback()
                print(f"AUTO-FIX CRITICAL FAILURE: {str(retry_e)}")
                return jsonify({
                    "error": "Database expansion failed.",
                    "details": f"The database is locked at 500 chars. Error: {str(retry_e)}",
                    "suggestion": "Please try to run 'flask db upgrade' manually or click 'Sync DB Schema' in Timetables."
                }), 500
        
        return jsonify({"error": "Update failed.", "details": str(e)}), 500

@settings_bp.route('/migrate', methods=['POST'])
@jwt_required()
@requires_role('admin')
def run_migrations():
    try:
        from sqlalchemy import text
        # Force the column to TEXT type using raw SQL
        db.session.execute(text("ALTER TABLE settings ALTER COLUMN value TYPE TEXT"))
        db.session.commit()
        
        # Also run standard migrations if any exist
        from flask_migrate import upgrade
        upgrade()
        
        return jsonify({"message": "Database schema synchronized and column expanded successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
