import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database Configuration
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("CRITICAL: DATABASE_URL environment variable is MISSING!")
    
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # CORS Configuration
    CORS_HEADERS = 'Content-Type'
