from app.repositories.expense_repo import ExpenseRepository
from werkzeug.exceptions import NotFound


class ExpenseService:

    @staticmethod
    def create_expense(data, current_user_id):
        
        if not data:
            raise NotFound("No data provided")
        return ExpenseRepository.create_expense(data, current_user_id)
    
    
    @staticmethod
    def get_expenses( current_user_id):
        
        # sort expenses by date in descending order
        expenses = ExpenseRepository.get_expenses(current_user_id)
        if not expenses:
            raise NotFound("No expenses found")
        
        return expenses
    
    @staticmethod
    def get_single_expense(id, current_user_id):
        
        expense = ExpenseRepository.get_single_expense(id, current_user_id)
        
        if not expense:
            raise NotFound("expense not found")
    
        return expense
    
    
    @staticmethod
    def update_expense(id, data, current_user_id):
        if not data:
            raise NotFound("No data provided")
        expense = ExpenseRepository.update_expense(id, data, current_user_id)
        if not expense:
            raise NotFound("expense not found")
        
        return expense
    
    
    @staticmethod
    def delete_expense(id, current_user_id):
        
        expense = ExpenseRepository.delete_expense(id, current_user_id)
        if not expense:
            raise NotFound("expense not found")
        
        return expense
        
    
    # filtering thee expenses by date range
    @staticmethod
    def filter_expenses_by_date(start_date, end_date, current_user_id):
        
        expenses = ExpenseRepository.filter_expenses(current_user_id, start_date, end_date)
        
        if not expenses:
            raise NotFound("No expenses found in the given date range")
        
        return expenses
    
    
    @staticmethod
    def get_monthly_expense_summary(current_user_id, year, month):
        
        if not year or not month:
            raise NotFound("Year and month are required")
        summary = ExpenseRepository.get_monthly_summary(current_user_id, year, month)
        
        return summary
    