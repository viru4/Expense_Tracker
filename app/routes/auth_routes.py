from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import auth_service
from werkzeug.exceptions import BadRequest

from app.validators.auth_validators import validate_login_data, validate_registration_data


auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    
    data = request.get_json()
    if not data:
        raise BadRequest("No data provided")
    
    errors =validate_registration_data(data)
    if errors:
        return jsonify({
            "errors": errors
        }), 400
    
    new_user = auth_service.AuthService.register_user(data)
    
    return jsonify({
        "message ": "user registered successfully",
        "user": new_user.to_dict()
    }),201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        raise BadRequest("No data provided")
    
    errors = validate_login_data(data)
    if errors:
        return jsonify({
            "errors": errors
        }), 400

    access_token = auth_service.AuthService.login_user(data)
        
    return jsonify({
        "message": "login successful",
        "access_token": access_token
    }),200
        
# GET Profile route
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    
    user = auth_service.AuthService.get_user_profile(current_user_id)

    return jsonify({
        "message": "Profile route accessed",
        "user": user.to_dict()
    })