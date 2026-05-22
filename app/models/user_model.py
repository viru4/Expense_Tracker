from app import db

class User(db.Model):
    id= db.column(db.Integer, primary_key=True)
    username = db.column(db.String(100),  unique=True, nullable=False)
    email = db.column(db.String(120), unique=True, nullable=False)
    password= db.column(db.String(255), nullable=False)
    def to_dict(self):
        return{
            "id": self.id,
            "username": self.username,
            "email": self.email
        }