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
    
    CORS(app, resources={r"/api/*": {"origins": allowed_origins, "allow_headers": ["Content-Type", "Authorization"]}})
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

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

    return app
