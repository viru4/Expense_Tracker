from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

db= SQLAlchemy()

jwt = JWTManager()

bcrypt= Bcrypt()

def create_app():
    app= Flask(__name__)
    load_dotenv()
    
    app.config.from_object("app.config.Config")
    
    # secret key
    import os
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")

    db.init_app(app)
    
    jwt.init_app(app)
    
    bcrypt.init_app(app)
    
    #import blueprint
    from app.routes.expense_routes import expense_bp 
    from app.routes.auth_routes import auth_bp
    
    # register the blueprint
    app.register_blueprint(expense_bp)
    app.register_blueprint(auth_bp)
    
    return app