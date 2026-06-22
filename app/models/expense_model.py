from app import db

class Expense(db.Model):
    id= db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
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
            "user_id": self.user_id
        }