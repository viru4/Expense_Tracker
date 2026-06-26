from flask import request, jsonify, Blueprint
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from werkzeug.exceptions import NotFound, Forbidden, BadRequest
from app.services.expense_service import ExpenseService
from app.validators.expense_validator import (
    validate_expense, 
    validate_expense_update, 
    validate_date_filter,
    validate_pagination
)

from app import db

expense_bp = Blueprint("expense_bp", __name__)

    
# creating an expense
@expense_bp.route("/expenses", methods=["POST"])
@jwt_required()
def add_expense():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    errors = validate_expense(data)
    if errors:
        return jsonify({
            "errors": errors
        }),400
        
    expense = ExpenseService.create_expense(data, current_user_id)
    
    return jsonify({
        "message": "expense added successfully",
        "expense": expense.to_dict()
        }),201
    
    
# GET all expenses
@expense_bp.route("/expenses", methods=["GET"])
@jwt_required()
def get_expenses():
    
    current_user_id = int(get_jwt_identity())
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)
    errors = validate_pagination(page, per_page)
    if errors:
        return jsonify({
            "errors": errors
        }), 400
        
    expenses = ExpenseService.get_expenses(current_user_id, page, per_page)
    
    return jsonify({
        "message": "expenses retrieved successfully",
        **expenses
    }), 200
        
        
# getting a single expense
@expense_bp.route("/expenses/<int:id>", methods=["GET"])
@jwt_required()
def get_single_expense(id):
    
    current_user_id = int(get_jwt_identity())
    
    expense = ExpenseService.get_single_expense(id, current_user_id)

    return jsonify(expense.to_dict()),200


# updating the expense
@expense_bp.route("/expenses/<int:id>", methods=["PUT"])
@jwt_required()
def update_expense(id):
    current_user_id= int(get_jwt_identity())
    
    data= request.get_json()
    
    errors = validate_expense_update(data)
    if  errors:
        return jsonify({
            "errors": errors
        }),400
            
    expense = ExpenseService.update_expense(id, data, current_user_id)
    
    return jsonify({
        "message": "expense updated",
        "expense": expense.to_dict()
    }),200
    
    
# deleting the expense
@expense_bp.route("/expenses/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_expense(id):
    
    current_user_id = int(get_jwt_identity())
    
    ExpenseService.delete_expense(id, current_user_id)
    
    return jsonify({
        "message": "expense deleted successfully"
    }),200
    

@expense_bp.route("/expenses/filter", methods=["GET"])
@jwt_required()
def filter_expenses():
    current_user_id = int(get_jwt_identity())
    
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)
    
    date_errors = validate_date_filter(start_date, end_date)
    if date_errors:
        return jsonify({
            "errors": date_errors
        }), 400
    
    page_errors = validate_pagination(page, per_page)
    if page_errors:
        return jsonify({
            "errors": page_errors
        }), 400
        
    expenses = ExpenseService.filter_expenses_by_date(
        start_date, 
        end_date, 
        current_user_id,
        page,
        per_page
    )
    
    return jsonify({
        "message": "expenses retrieved successfully",
        **expenses
    }), 200

    
@expense_bp.route("/expenses/summary", methods=["GET"])
@jwt_required()
def monthly_summary():
        
    current_user_id = int(get_jwt_identity())
        
    year = request.args.get("year", type=int)
    month = request.args.get("month", type=int)
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)
    
    pagination_errors = validate_pagination(page, per_page)
    if pagination_errors:   
        return jsonify({
            "errors": pagination_errors
        }), 400
    
    if not year or not month:
        raise BadRequest("Year and month are required")
    
    summary = ExpenseService.get_monthly_expense_summary(current_user_id, year, month, page, per_page)
    return jsonify(summary), 200


@expense_bp.route("/expenses/search", methods=["GET"])
@jwt_required()
def search_expenses():
    current_user_id = int(get_jwt_identity())
    keyword = request.args.get("keyword", "")
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)

    pagination_errors = validate_pagination(page, per_page)
    if pagination_errors:
        return jsonify({
            "errors": pagination_errors
        }), 400

    expenses = ExpenseService.search_expenses(keyword, current_user_id, page, per_page)

    return jsonify({
        "message": "expenses retrieved successfully",
        **expenses
    }), 200
    
    
@expense_bp.route("/expenses/analytics", methods=["GET"])
@jwt_required()
def get_analytics():    
    current_user_id = int(get_jwt_identity())
    
    analytics = ExpenseService.get_analytics(current_user_id)
    
    return jsonify({
        "message": "analytics retrieved successfully",
        "analytics": analytics
    }), 200