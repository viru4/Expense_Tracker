from flask import request, jsonify, Blueprint

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