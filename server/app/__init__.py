import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure CORS for production and development
    allowed_origins = [
        os.environ.get("FRONTEND_URL")
    ]
    
    # Add local development origins if not in production
    if os.environ.get("FLASK_ENV") != "production":
        allowed_origins.extend([
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ])

    # Remove None values and ensure uniqueness
    allowed_origins = list(set(origin for origin in allowed_origins if origin))
    
    # Configure CORS - More permissive for local development
    if os.environ.get("FLASK_ENV") != "production":
        CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    else:
        allowed_origins = [os.environ.get("FRONTEND_URL")]
        allowed_origins = list(set(origin for origin in allowed_origins if origin))
        CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Emergency Schema Check for Users table
    # This runs once when the app is created
    with app.app_context():
        try:
            from sqlalchemy import text
            # Check if semester_id exists in users
            db.session.execute(text("SELECT semester_id FROM users LIMIT 1"))
        except Exception:
            db.session.rollback()
            try:
                print("EMERGENCY: Adding missing semester_id to users table...")
                db.session.execute(text("ALTER TABLE users ADD COLUMN semester_id INTEGER REFERENCES semesters(id)"))
                db.session.commit()
                print("SUCCESS: Database repaired.")
            except Exception as e:
                print(f"FAILED to repair database: {e}")
                db.session.rollback()

    # Health Check and DB status
    @app.route('/api/health')
    def health_check():
        try:
            # Check DB connection
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            
            # Check for Google Credentials
            google_env_exists = os.getenv('GOOGLE_CREDENTIALS_JSON') is not None
            
            return {
                "status": "healthy", 
                "database": "connected",
                "google_credentials_detected": google_env_exists
            }, 200
        except Exception as e:
            return {"status": "unhealthy", "database": "disconnected", "error": str(e)}, 500

    @app.before_request
    def check_db():
        # This will fail on the first request if the DB is misconfigured
        if not app.config.get('SQLALCHEMY_DATABASE_URI'):
            return {"error": "DATABASE_URL is not configured properly!"}, 500

    # Import models here to ensure they are registered with SQLAlchemy
    from app.models.user import User
    from app.models.announcement import Announcement
    from app.models.event import Event
    from app.models.setting import Setting
    from app.models.academic import Semester, Course

    # Register Blueprints
    from app.api.auth import auth_bp
    from app.api.announcements import announcements_bp
    from app.api.timetables import timetables_bp
    from app.api.courses import courses_bp
    from app.api.drive import drive_bp
    from app.api.users import users_bp
    from app.api.events import events_bp
    from app.api.settings import settings_bp
    from app.api.academic import academic_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(announcements_bp, url_prefix='/api/announcements')
    app.register_blueprint(timetables_bp, url_prefix='/api/timetables')
    app.register_blueprint(courses_bp, url_prefix='/api/courses')
    app.register_blueprint(drive_bp, url_prefix='/api/drive')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(academic_bp, url_prefix='/api/academic')

    # Global Database Error Handler
    from sqlalchemy.exc import SQLAlchemyError
    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(error):
        return {
            "error": "Database error occurred. Please ensure your database is reachable and configured correctly.",
            "details": str(error) if app.debug else "Database connection failure."
        }, 500

    return app
