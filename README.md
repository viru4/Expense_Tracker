# Expense Tracker — Setup

Quick setup (Windows PowerShell):

```powershell
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt

# set the FLASK_APP environment variable and run
$env:FLASK_APP = "run.py"
flask run
```

If using VS Code, select the `venv` interpreter so the language server can resolve imports.
