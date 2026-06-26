from datetime import datetime


def validate_expense(data):
    errors = {}

    title  = data.get("title")
    amount = data.get("amount")

    # ── title checks ──────────────────────────────────────────
    if title is None:
        errors["title"] = "Title is required"

    elif not isinstance(title, str):
        errors["title"] = "Title must be a string"

    elif len(title.strip()) == 0:
        errors["title"] = "Title cannot be blank"

    elif len(title.strip()) > 100:
        errors["title"] = "Title must be under 100 characters"

    # ── amount checks ─────────────────────────────────────────
    if amount is None:
        errors["amount"] = "Amount is required"

    elif not isinstance(amount, (int, float)):  # ✅ type check before value check
        errors["amount"] = "Amount must be a number"

    elif amount <= 0:
        errors["amount"] = "Amount must be greater than 0"

    return errors

# validation for updating an expense
def validate_expense_update(data):
    errors = {}

    # ── title checks (only if sent) ───────────────────────────
    if "title" in data:
        title = data.get("title")

        if title is None or (isinstance(title, str) and len(title.strip()) == 0):
            errors["title"] = "Title cannot be empty"

        elif not isinstance(title, str):
            errors["title"] = "Title must be a string"

        elif len(title.strip()) > 100:
            errors["title"] = "Title must be under 100 characters"

    # ── amount checks (only if sent) ──────────────────────────
    if "amount" in data:
        amount = data.get("amount")

        if amount is None:
            errors["amount"] = "Amount cannot be empty"

        elif not isinstance(amount, (int, float)):  # ✅ type check first
            errors["amount"] = "Amount must be a number"

        elif amount <= 0:
            errors["amount"] = "Amount must be greater than 0"

    return errors


# validation for filtering expenses by date
def validate_date_filter(start_date, end_date):
    errors = {}
    if start_date:
        try:
            datetime.strptime(start_date, "%d-%m-%Y")
        except ValueError:
            errors["start_date"] = "Invalid start date format. Use DD-MM-YYYY."
            
    if end_date:
        try:
            datetime.strptime(end_date, "%d-%m-%Y")
        except ValueError:
            errors["end_date"] = "Invalid end date format. Use DD-MM-YYYY."
    return errors