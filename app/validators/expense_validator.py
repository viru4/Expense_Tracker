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


def validate_pagination(page, per_page):
    errors = {}
    
    if page is not None:
        if not isinstance(page, int) or page < 1:
            errors["page"] = "Page must be a positive integer"
            
    if per_page is not None:
        if not isinstance(per_page, int) or per_page < 1:
            errors["per_page"] = "Per page must be a positive integer"
        elif per_page > 100:
            errors["per_page"] = "Per page must be under 100"
            
    return errors


def validate_search(search):
    errors = {}

    if search is not None:

        if not isinstance(search, str):
            errors["search"] = "Search must be a string"

        elif len(search.strip()) == 0:
            errors["search"] = "Search cannot be blank"

        elif len(search.strip()) < 2:
            errors["search"] = "Search must be at least 2 characters"

        elif len(search.strip()) > 100:
            errors["search"] = "Search must be under 100 characters"

    return errors