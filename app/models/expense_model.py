from app import db
from datetime import datetime

class Expense(db.Model):
    id= db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )
    def to_dict(self):
        return{
            "id": self.id,
            "title": self.title,
            "amount": self.amount,
            "category": self.category,
            "user_id": self.user_id,
            "created_at": self.created_at.strftime("%d %B %Y, %I:%M %p") if self.created_at else None
        }