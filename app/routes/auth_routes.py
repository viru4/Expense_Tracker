from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token

from app.models.user_model import User
from app import db, bcrypt

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    #chek if user exist
    existing_user= User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({
            "error": "user already exists"
        }), 400
        
    #Hash Password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    
    #craete user
    new_user = User(
        username= username, 
        email= email, 
        password = hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "message ": "user registered successfully",
        "user": new_user.to_dict()
    }),201
    
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    email = data.get("email")
    password = data.get("password")
    
    # find user
    user =  User.query.filter_by(email=email).first()
    if not user:
        return jsonify({
            "error": "invalid emails or password"
        }),401
# check password
    is_correct_password = bcrypt.check_password_hash(
        user.password,
        password
    )
    if not is_correct_password:
        return jsonify({
            "error": "invalid password"
        }),401
        
    # create jwt token
    access_token = create_access_token(identity = user.id)
    return jsonify({
        "message": "login successful",
        "access_token": access_token
    }),200
        