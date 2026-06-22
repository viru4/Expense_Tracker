from flask import request, jsonify, Blueprint
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from app.models.expense_model import Expense
from app import db

expense_bp = Blueprint("expense_bp", __name__)

# @expense_bp.route("/expenses", methods=["GET"])
# def test_route():
#     return jsonify({
#         "messsage": "expenses routes working"
#     })
    
    
# creating an expense
@expense_bp.route("/expenses", methods=["POST"])
@jwt_required()
def add_expense():
    user_id = get_jwt_identity()
    
    data= request.get_json()
    
    new_expense= Expense(
        title= data["title"],
        amount = data["amount"],
        category = data.get("category"),
        user_id = user_id
    )
    
    db.session.add(new_expense)
    db.session.commit()
    
    return jsonify({
        "message": "expense added successfully",
        "expense": new_expense.to_dict()
        }),201
    
    
# fetching the expenses of an id
@expense_bp.route("/expenses", methods=["GET"])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    
    expenses= Expense.query.filter_by(user_id = user_id).all()
    # expense_list=[]
    # for expense in expenses:
    #     expense_list.append(expense.to_dict())
    expense_list=[expense.to_dict() for expense in expenses]
    return jsonify(expense_list)
        
        
# getting a single expense
@expense_bp.route("/expenses/<int:id>", methods=["GET"])
@jwt_required()
def get_single_expense(id):
    user_id = get_jwt_identity()
    
    # method 1: no need to  check manually check the ownership using if
    # more secure and cleaner approach
    expense = Expense.query.filter_by(id = id, user_id = user_id).first()
    
    # method 2: need to check the ownership manually using if 
    # expense = Expense.query.get(id)
    
    if not expense:
        return jsonify({
            "error": "expense not found"
        }), 404
        
    # if expense.user_id != user_id:
    #     return jsonify({
    #         "error": "unauthorized"
    #     }),403
        
    return jsonify(expense.to_dict())

# updating the expense by id
@expense_bp.route("/expenses/<int:id>", methods=["PUT"])
@jwt_required()
def update_expense(id):
    
    # method 1 more secure
    expense = Expense.query.filter_by(id =  id, user_id = get_jwt_identity()).first()
    
    # method 2
    # expense= Expense.query.get(id)
    
    if not expense:
        return jsonify({
            "message": "expense not found"
        }), 404
        
    # if expense.user_id != get_jwt_identity():
    #     return jsonify({
    #         "error": "unauthorized"
    #     }),403
        
    data= request.get_json()
    
    expense.title = data.get("title", expense.title)
    expense.amount = data.get("amount", expense.amount)
    expense.category = data.get("category", expense.category)
    
    db.session.commit()
    
    return jsonify({
        "message": "expense updated",
        "expense": expense.to_dict()
    })
    
# deleting the expense by id
@expense_bp.route("/expenses/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_expense(id):
    
    # expense = Expense.query.get(id)
    expense = Expense.query.filter_by(id = id, user_id = get_jwt_identity()).first()
    
    if not expense:
        return jsonify({
            "message": "expense not found"
        }), 404
    
    # if expense.user_id != get_jwt_identity():
    #     return jsonify({
    #         "error": "unauthorized"
    #     })
        
    db.session.delete(expense)
    db.session.commit()
    
    return jsonify({
        "message": "expense deleted successfully"
    })