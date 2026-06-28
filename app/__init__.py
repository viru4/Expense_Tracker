from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flasgger import Swagger
from dotenv import load_dotenv
from app.config import get_config

from app.utils.error_handlers import (
    register_error_handlers
)

db= SQLAlchemy()

migrate= Migrate()

jwt = JWTManager()

bcrypt= Bcrypt()

def create_app():
    app= Flask(__name__)
    # load_dotenv()
    
    app.config.from_object(get_config())

    db.init_app(app)
    
    jwt.init_app(app)
    
    bcrypt.init_app(app)
    
    migrate.init_app(app, db)
    
    #import blueprint
    from app.routes.expense_routes import expense_bp 
    from app.routes.auth_routes import auth_bp
    
    # swagger config
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route":    "/apispec.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/docs"          # ← visit /docs to see UI
    }

    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title":       "Expense Tracker API",
            "description": "API for managing personal expenses",
            "version":     "1.0.0"
        },
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in":   "header",
                "description": "JWT token — format: Bearer <token>"
            }
        },
        "security": [
            {"Bearer": []}
        ]
    }

    Swagger(app, config=swagger_config, template=swagger_template)
    
    # import models
    from app.models.user_model import User
    from app.models.expense_model import Expense
    
    # register the blueprint
    app.register_blueprint(expense_bp)
    app.register_blueprint(auth_bp)
    
    register_error_handlers(app, jwt)
    
    return app