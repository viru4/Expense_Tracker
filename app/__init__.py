from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db= SQLAlchemy()

def create_app():
    app= Flask(__name__)
    
    app.config.from_object("app.config.Config")
    
    db.init_app(app)
    
    from app.routes.expense_routes import expense_bp #import blueprint
    # register the blueprint
    app.register_blueprint(expense_bp)
    
    return app