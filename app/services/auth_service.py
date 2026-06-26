from app import db, bcrypt
from flask_jwt_extended import create_access_token
from app.models.user_model import User
from werkzeug.exceptions import Conflict, Unauthorized

class AuthService:

    @staticmethod
    def register_user(data):
        
        # check if user already exists
        existing_user = User.query.filter_by(email=data.get("email")).first()   
        if existing_user:
            raise Conflict("User already exists")
        
        # hash the password
        hashed_password = bcrypt.generate_password_hash(data.get("password")).decode("utf-8")
        
        # create a new user
        new_user = User(
            username=data.get("username"),
            email=data.get("email"),
            password=hashed_password
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return new_user
    
    
    @staticmethod
    def login_user(data):

        # check if the user exists and the password is correct
        user = User.query.filter_by(email=data.get("email")).first()
        if not user:
            raise Unauthorized("User does not exist")
        
        is_correct_password = bcrypt.check_password_hash(user.password, data.get("password"))
        
        if not is_correct_password:
            raise Unauthorized("Invalid email or password")
        
        access_token = create_access_token(identity= str(user.id))
        
        return access_token
    
    
    @staticmethod
    def get_user_profile(current_user_id):
        
        user = User.query.filter_by(id=current_user_id).first()
        if not user:
            raise Unauthorized("User does not exist")
        
        return user