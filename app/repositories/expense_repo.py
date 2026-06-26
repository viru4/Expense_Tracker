from app import db
from app.models.expense_model import Expense
from datetime import datetime
from sqlalchemy import extract

class ExpenseRepository:
    
    @staticmethod
    def create_expense(data, current_user_id):
        
        expense = Expense(
            title = data["title"],
            amount = data["amount"],
            category = data.get("category"),
            user_id = current_user_id
        )

        db.session.add(expense)
        db.session.commit()

        return expense
    
    @staticmethod
    def get_expenses(current_user_id):
        expenses = Expense.query.filter_by(user_id=current_user_id).order_by(Expense.created_at.desc()).all()
        return expenses
    
    
    @staticmethod
    def get_single_expense(id, current_user_id):
        expense = Expense.query.filter_by(id=id, user_id=current_user_id).first()
        return expense
    
    
    @staticmethod
    def update_expense(id, data, current_user_id):
        expense = Expense.query.filter_by(id=id, user_id=current_user_id).first()
        if not expense:
            return None
        
        expense.title = data.get("title", expense.title)
        expense.amount = data.get("amount", expense.amount)
        expense.category = data.get("category", expense.category)

        db.session.commit()
        
        return expense
    
    
    @staticmethod
    def delete_expense(id, current_user_id):
        expense = Expense.query.filter_by(id=id, user_id=current_user_id).first()
        if not expense:
            return None
        
        db.session.delete(expense)
        db.session.commit()
        
        return expense
    
    
    @staticmethod
    def filter_expenses(current_user_id, start_date=None, end_date=None):
        expenses = Expense.query.filter(Expense.user_id == current_user_id)
        
        if start_date:
            start_date = datetime.strptime(start_date, "%d-%m-%Y")
            expenses = expenses.filter(Expense.created_at >= start_date)
            
        if end_date:
            end_date = datetime.strptime(end_date, "%d-%m-%Y")
            expenses = expenses.filter(Expense.created_at <= end_date)
            
        expenses = expenses.order_by(Expense.created_at.desc()).all()
        
        return expenses
    
    
    @staticmethod
    def get_monthly_summary(current_user_id, year, month):
        expenses = Expense.query.filter(
            Expense.user_id == current_user_id,
            extract('year', Expense.created_at) == year,
            extract('month', Expense.created_at) == month
        ).all()
        
        total_amount = sum(expense.amount for expense in expenses)
        
        return {
            "year": year,
            "month": month,
            "total_amount": total_amount,
            "number_of_expenses": len(expenses),
            "expenses": [expense.to_dict() for expense in expenses]
        }