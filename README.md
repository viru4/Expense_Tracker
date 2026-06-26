# Expense Tracker — Setup

Quick setup (Windows PowerShell):

```powershell
# create the virtual environment (this project uses `.venv` by convention)
python -m venv .venv

# PowerShell (recommended)
. .venv\Scripts\Activate.ps1

# If PowerShell blocks the script, allow it for this session:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
. .venv\Scripts\Activate.ps1

# Command Prompt (cmd.exe)
.venv\Scripts\activate.bat

# Git Bash / WSL
source .venv/Scripts/activate

# install dependencies
pip install -r requirements.txt

# Run the app (either):
# 1) Using Flask CLI
$env:FLASK_APP = "run.py"
flask run

# 2) Or directly with Python
python run.py

# Database migrations (example)
flask --app run.py db upgrade
```

VS Code tip: run the **Python: Select Interpreter** command and choose the `.venv` interpreter so the integrated terminal and language server auto-activate and resolve imports.

# All the migration commands you need
## run once ever
flask db init                           # set up migrations folder

## run every time you change a model
flask db migrate -m "describe change"   # generate migration file
flask db upgrade                        # apply migration to database

## other useful commands
flask db downgrade                      # undo last migration
flask db history                        # see all migrations
flask db current                        # see current migration version
flask db status                         # see what's pending