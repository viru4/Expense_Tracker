from blinker.base import F
import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()   # reads .env file

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

class DevelopmentConfig(Config):
    """
    Development configuration - Debug mode enabled
    """
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite://expenses.db" #fallback for local dev
    )
    # Set a more realistic token expiry for development
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)


class ProductionConfig(Config):
    """
    Production configuration - Debug mode disabled
    """
    DEBUG = False
    db_url = os.environ.get("DATABASE_URL")
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = db_url


# map string to config class
config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}

def get_config():
    env = os.environ.get("FLASK_ENV", "development")
    return config_map.get(env, DevelopmentConfig)