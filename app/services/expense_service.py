from app.repositories.expense_repo import ExpenseRepository
from werkzeug.exceptions import NotFound
from app.utils.pagination_helper import paginate_response

class ExpenseService:

    @staticmethod
    def create_expense(data, current_user_id):
        
        if not data:
            raise NotFound("No data provided")
        return ExpenseRepository.create_expense(data, current_user_id)
    
    
    #get all expense with pagination
    @staticmethod
    def get_expenses( current_user_id, page, per_page):
        
        # sort expenses by date in descending order
        pagination = ExpenseRepository.get_expenses(
            current_user_id =current_user_id, 
            page=page, 
            per_page=per_page)
        
        if not pagination.items:
            raise NotFound("No expenses found")
        
        return paginate_response(pagination, [expense.to_dict() for expense in pagination.items])
    
    
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
    def filter_expenses_by_date(start_date, end_date, current_user_id, page, per_page):
        
        pagination = ExpenseRepository.filter_expenses(
            current_user_id=current_user_id,
            start_date=start_date,
            end_date=end_date,
            page=page,
            per_page=per_page
        )
        
        if not pagination.items:
            raise NotFound("No expenses found in the given date range")
        
        return paginate_response(pagination, [expense.to_dict() for expense in pagination.items]) 


    @staticmethod
    def get_monthly_expense_summary(current_user_id, year, month, page, per_page):
        
        if not year or not month:
            raise NotFound("Year and month are required")
        pagination, summary = ExpenseRepository.get_monthly_summary(current_user_id, year, month, page, per_page)

        if not pagination.items:
            raise NotFound("No expenses found for the given month and year")

        # attach current page's expenses to the summary and return a paginated response
        data = summary.copy()
        data["expenses"] = [expense.to_dict() for expense in pagination.items]

        return paginate_response(pagination, data)
    
    
    @staticmethod
    def search_expenses(current_user_id, keyword, page, per_page):
        
        pagination = ExpenseRepository.search_expenses(
            current_user_id=current_user_id,
            keyword=keyword,
            page=page,
            per_page=per_page
        )
        
        if not pagination.items:
            raise NotFound(f"No expenses found with the matching '{keyword}'")
        
        return paginate_response(pagination, [expense.to_dict() for expense in pagination.items])
    
    
    @staticmethod
    def get_analytics(current_user_id):
        analytics = ExpenseRepository.get_analytics(current_user_id)
        return analytics