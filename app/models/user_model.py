from app import db

class User(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    expenses = db.relationship("Expense",
        backref="owner",
        lazy=True,
        cascade="all, delete-orphan"
        )
    def to_dict(self):
        return{
            "id": self.id,
            "username": self.username,
            "email": self.email
        }