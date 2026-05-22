from flask import request, jsonify, Blueprint
from app.models.expense_model import Expense
from app import db

expense_bp = Blueprint("expense_bp", __name__)

# @expense_bp.route("/expenses", methods=["GET"])
# def test_route():
#     return jsonify({
#         "messsage": "expenses routes working"
#     })
    
@expense_bp.route("/expenses", methods=["POST"])
def add_expense():
    data= request.get_json()
    
    new_expense= Expense(
        title= data["title"],
        amount = data["amount"],
        category = data.get("category")
    )
    db.session.add(new_expense)
    db.session.commit()
    
    return jsonify({
        "message": "expense added successfully",
        "expense": new_expense.to_dict()
        }),201
    
@expense_bp.route("/expenses", methods=["GET"])
def get_expenses():
    expenses= Expense.query.all()
    # expense_list=[]
    # for expense in expenses:
    #     expense_list.append(expense.to_dict())
    expense_list=[expense.to_dict() for expense in expenses]
    return jsonify(expense_list)
        
# getting a single expense
@expense_bp.route("/expenses/<int:id>", methods=["GET"])
def get_single_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({
            "error": "expense not found"
        }), 404
        
    return jsonify(expense.to_dict())

# updating the expense by id
@expense_bp.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):
    expense= Expense.query.get(id)
    if not expense:
        return jsonify({
            "message": "expense not found"
        }), 404
    data= request.get_json()
    expense.title = data.get("title", expense.title)
    expense.amount = data.get("amount", expense.amount)
    expense.category = data.get("category", expense.category)
    db.session.commit()
    return jsonify({
        "message": "expense updated",
        "expense": expense.to_dict()
    })
    
@expense_bp.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({
            "message": "expense not found"
        }), 404
        
    db.session.delete(expense)
    db.session.commit()
    return jsonify({
        "message": "expense dwlwted successfully"
    })