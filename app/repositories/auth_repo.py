from werkzeug.exceptions import Unauthorized
from app import db, bcrypt
from app.models.user_model import User


class AuthRepository:
    @staticmethod
    def create_user(data):
        new_user = User(
            username=data.get("username"),
            email=data.get("email"),
            password=bcrypt.generate_password_hash(data.get("password")).decode('utf-8')
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user
    
    
    @staticmethod
    def login_user(data):
        user = User.query.filter_by(email=data.get("email")).first()
        return user
    
    
    @staticmethod
    def get_user_profile(current_user_id):
        user = User.query.filter_by(id=current_user_id).first()
        return user
    
    
    @staticmethod
    def get_user_by_email(email):
        user = User.query.filter_by(email=email).first()
        return user
    
    
    @staticmethod
    def get_user_by_id(user_id):
        user = User.query.filter_by(id=user_id).first()
        return user

    
    @staticmethod
    def delete_user(user_id):
        user = User.query.filter_by(id=user_id).first()
        if not user:
            raise Unauthorized("User not found")
        db.session.delete(user)
        db.session.commit()

        return user