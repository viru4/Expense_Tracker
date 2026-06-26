from app import db, bcrypt
from flask_jwt_extended import create_access_token
from app.models.user_model import User
from werkzeug.exceptions import Conflict, Unauthorized

from app.repositories.auth_repo import AuthRepository

class AuthService:

    @staticmethod
    def register_user(data):
        
        existing_user = AuthRepository.get_user_by_email(data.get("email"))
        if existing_user:
            raise Conflict("User with this email already exists")
        
        # hash the password
        hashed_password = bcrypt.generate_password_hash(data.get("password")).decode("utf-8")
        data = {
            "username": data.get("username"),
            "email": data.get("email"),
            "password": hashed_password
        }
        new_user = AuthRepository.create_user(data)
        return new_user
    
    
    @staticmethod
    def login_user(data):

        # check if the user exists and the password is correct
        user = AuthRepository.get_user_by_email(data.get("email"))
        if not user:
            raise Unauthorized("email or password is invalid")
        
        is_correct_password = bcrypt.check_password_hash(user.password, data.get("password"))
        
        if not is_correct_password:
            raise Unauthorized("Invalid email or password")
        
        access_token = create_access_token(identity= str(user.id))
        
        return access_token
    
    
    @staticmethod
    def get_user_profile(current_user_id):
        user = AuthRepository.get_user_by_id(current_user_id)
        if not user:
            raise Unauthorized("User does not exist")
        
        return user