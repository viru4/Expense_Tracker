from flask import jsonify
from flask_jwt_extended import JWTManager

jwt = JWTManager()
def register_error_handlers(app, jwt):

    # 400 — Bad Request
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "error": "Bad request",
            "message": str(error)
        }), 400

    # 401 — Unauthorised
    @app.errorhandler(401)
    def unauthorised(error):
        message = getattr(error, "description", None) or str(error)
        return jsonify({
            "error": "Unauthorised",
            "message": message or "Unauthorized"
        }), 401

    # 403 — Forbidden
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            "error": "Forbidden",
            "message": "You don't have permission"
        }), 403

    # 404 — Not Found
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "error": "Not found",
            "message": str(error)
        }), 404

    # 500 — Server Error
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({
            "error": "Internal server error",
            "message": "Something went wrong"
        }), 500

    # catch ALL unhandled exceptions
    @app.errorhandler(Exception)
    def handle_exception(error):
        return jsonify({
            "error": "Unexpected error",
            "message": str(error)
        }), 500
        

    # missing token
    @jwt.unauthorized_loader
    def missing_token(error):
        return jsonify({
            "error": "Unauthorised",
            "message": "Token is missing"
        }), 401

    # expired token
    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_data):
        return jsonify({
            "error": "Unauthorised",
            "message": "Token has expired"
        }), 401
