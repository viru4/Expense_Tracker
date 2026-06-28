# delete_users.py

from app import create_app, db
from app.models.user_model import User

app = create_app()

with app.app_context():

    # the user id you want to KEEP
    keep_user_id = 1

    # find the user you're keeping — just to confirm
    keep_user = User.query.get(keep_user_id)

    if not keep_user:
        print(f"User with id {keep_user_id} not found — aborting")
        exit()

    print(f"Keeping user: {keep_user.username} ({keep_user.email})")

    # find all users EXCEPT the one to keep
    users_to_delete = User.query.filter(
        User.id != keep_user_id     # != means "not equal to"
    ).all()

    print(f"Deleting {len(users_to_delete)} users...")

    # delete each one
    for user in users_to_delete:
        print(f"  Deleting: {user.username} ({user.email})")
        db.session.delete(user)

    # commit once after all deletions
    db.session.commit()

    print("Done — all other users deleted")
    print(f"Remaining users: {User.query.count()}")