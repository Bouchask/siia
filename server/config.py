import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database Configuration
    db_url = os.environ.get('DATABASE_URL')
    
    if db_url:
        # 1. Fix 'postgres://' to 'postgresql://' for SQLAlchemy 1.4+
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        
        # 2. Force Aiven-compatible SSL parameters
        if "postgresql" in db_url:
            if "sslmode=" not in db_url:
                db_url += ("?" if "?" not in db_url else "&") + "sslmode=require"
    
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # 3. Aiven/Vercel Connection Stability
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300, # Shorter recycle for serverless
        "pool_size": 10,
        "max_overflow": 20,
        "connect_args": {
            "sslmode": "require",
            "connect_timeout": 10
        }
    }
    
    # Security Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # CORS Configuration
    CORS_HEADERS = 'Content-Type'
