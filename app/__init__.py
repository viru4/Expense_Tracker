from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

from dotenv import load_dotenv

from app.utils.error_handlers import (
    register_error_handlers
)

db= SQLAlchemy()

migrate= Migrate()

jwt = JWTManager()

bcrypt= Bcrypt()

def create_app():
    app= Flask(__name__)
    load_dotenv()
    
    app.config.from_object("app.config.Config")

    db.init_app(app)
    
    jwt.init_app(app)
    
    bcrypt.init_app(app)
    
    migrate.init_app(app, db)
    
    #import blueprint
    from app.routes.expense_routes import expense_bp 
    from app.routes.auth_routes import auth_bp
    
    # import models
    from app.models.user_model import User
    from app.models.expense_model import Expense
    
    # register the blueprint
    app.register_blueprint(expense_bp)
    app.register_blueprint(auth_bp)
    
    register_error_handlers(app, jwt)
    
    return app