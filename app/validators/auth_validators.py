import re

from app.models.user_model import User
def validate_registration_data(data):
    errors = {}
    
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    # Username validation
    if not username:
        errors["username"] = "Username is required"
    elif len(username) < 3:
        errors["username"] = "Username must be at least 3 characters long"
    elif len(username) > 20:
        errors["username"] = "Username must not exceed 20 characters"
    elif not username.isalnum():
        errors["username"] = "Username can only contain letters and numbers"
    elif not re.match(r"^[a-zA-Z0-9_]+$", username):
        errors["username"] = "Username can only contain letters, numbers, and underscores"
    
    # Email validation
    if not email:
        errors["email"] = "Email is required"
    elif not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        errors["email"] = "Invalid email format"
    elif User.query.filter_by(email=email).first():
        errors["email"] = "Email already exists"

    # Password validation
    if not password:
        errors["password"] = "Password is required"
    elif len(password) < 6 or len(password) > 20:
        errors["password"] = "Password must be between 6 and 20 characters long"
    elif not re.search(r"[A-Z]", password):
        errors["password"] = "Password must contain at least one uppercase letter"
    elif not re.search(r"[a-z]", password):
        errors["password"] = "Password must contain at least one lowercase letter"
    elif not re.search(r"[0-9]", password):
        errors["password"] = "Password must contain at least one digit"
    elif not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        errors["password"] = "Password must contain at least one special character"
    return errors

def validate_login_data(data):
    errors = {}
    
    email = data.get("email")
    password = data.get("password")
    
    # Email validation
    if not email:
        errors["email"] = "Email is required"
    elif not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        errors["email"] = "Invalid email format"

    # Password validation
    if not password:
        errors["password"] = "Password is required"
    
    return errors