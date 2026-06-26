from app import db
from app.models.expense_model import Expense
from datetime import datetime
from sqlalchemy import extract, func

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
    def get_expenses(current_user_id, page= 1, per_page=10):
        
        # sort expenses by date in descending order and paginate the results
        pagination = Expense.query.filter_by(
            user_id=current_user_id
            ).order_by(Expense.created_at.desc()
            ).paginate(
                page=page, 
                per_page=per_page, 
                error_out=False)
        
        return pagination
    
    
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
    def filter_expenses(current_user_id, start_date=None, end_date=None, page=1, per_page=10):
        
        expenses = Expense.query.filter(Expense.user_id == current_user_id)
        
        if start_date:
            start_date = datetime.strptime(start_date, "%d-%m-%Y")
            expenses = expenses.filter(Expense.created_at >= start_date)
            
        if end_date:
            end_date = datetime.strptime(end_date, "%d-%m-%Y")
            expenses = expenses.filter(Expense.created_at <= end_date)
            
        pagination = expenses.order_by(Expense.created_at.desc()
            ).paginate(
                page=page, 
                per_page=per_page, 
                error_out=False)
        
        return pagination
    
    
    @staticmethod
    def get_monthly_summary(current_user_id, year, month, page, per_page):
        expenses = Expense.query.filter(
            Expense.user_id == current_user_id,
            extract('year', Expense.created_at) == year,
            extract('month', Expense.created_at) == month
        )
        # compute aggregates (total amount and count) for the whole month BEFORE paginating
        filters = [
            Expense.user_id == current_user_id,
            extract('year', Expense.created_at) == year,
            extract('month', Expense.created_at) == month,
        ]

        total_amount = db.session.query(func.coalesce(func.sum(Expense.amount), 0)).filter(*filters).scalar() or 0
        number_of_expenses = db.session.query(func.count(Expense.id)).filter(*filters).scalar() or 0

        pagination = expenses.order_by(Expense.created_at.desc()
            ).paginate(
                page=page, 
                per_page=per_page, 
                error_out=False)

        summary = {
            "year": year,
            "month": month,
            "total_amount": float(total_amount),
            "number_of_expenses": int(number_of_expenses),
        }

        # return both the pagination object and the pre-computed summary
        return pagination, summary
    
    
    @staticmethod
    def search_expenses(current_user_id, keyword, page=1, per_page=10):
        query = Expense.query.filter(
            Expense.user_id == current_user_id,
            Expense.title.ilike(f"%{keyword}%")
        )

        pagination = query.order_by(Expense.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False,
        )

        return pagination
    
    
    @staticmethod
    def get_analytics(current_user_id):
        
        analytics = db.session.query(
            func.date_trunc('month', Expense.created_at).label('month'),
            func.sum(Expense.amount).label('total_amount'),
            func.count(Expense.id).label('number_of_expenses'),
            func.avg(Expense.amount).label('average_spent'),
            func.max(Expense.amount).label('max_spent'),
            func.min(Expense.amount).label('min_spent')
        ).filter(
            Expense.user_id == current_user_id
        ).group_by(
            func.date_trunc('month', Expense.created_at)
        ).order_by(
            func.date_trunc('month', Expense.created_at).desc()
        ).all()

        # Convert the result to a list of dictionaries
        analytics_data = [
            {
                "month": record.month.strftime("%Y-%m"),
                "total_amount": float(record.total_amount),
                "number_of_expenses": int(record.number_of_expenses),
                "average_spent": float(record.average_spent),
                "max_spent": float(record.max_spent),
                "min_spent": float(record.min_spent)
            }
            for record in analytics
        ]

        return analytics_data