# Spently — Expense Tracker

A full-stack expense tracking application with a **Flask** REST API backend and a **React** (Vite) frontend.  
Register an account, log expenses, filter and search entries, and view spending analytics — all from a single dashboard.

---

## Tech Stack

| Layer      | Technology                                                    |
| ---------- | ------------------------------------------------------------- |
| Frontend   | React 19, Vite, Tailwind CSS v4, React Hook Form, Axios       |
| Backend    | Flask, Flask-JWT-Extended, Flask-Bcrypt, Flask-SQLAlchemy      |
| Database   | PostgreSQL                                                    |
| Migrations | Flask-Migrate (Alembic)                                       |
| Docs       | Flasgger (Swagger UI)                                         |

---

## Features

### Frontend
- JWT-based authentication with protected routes and auto-logout on token expiry.
- Dashboard with analytics cards — total spend, average, highest expense, and count.
- Full CRUD for expenses with modal forms and inline delete confirmation.
- Filters by category, date range, keyword search, and sort order.
- Server-side pagination.
- Account deletion with confirmation modal.

### Backend
- User registration, login, profile retrieval, and account deletion.
- Password hashing with bcrypt.
- Expense CRUD scoped to the authenticated user.
- Date filtering, keyword search, monthly summary, and analytics endpoints.
- Request validation on all endpoints.
- Interactive API docs at `/docs`.

---

## Project Structure

```
Expense_Tracker/
├── app/
│   ├── __init__.py               # App factory, extensions init
│   ├── config.py                 # Environment-based configuration
│   ├── models/
│   │   ├── user_model.py         # User table
│   │   └── expense_model.py      # Expense table
│   ├── routes/
│   │   ├── auth_routes.py        # Auth endpoints
│   │   └── expense_routes.py     # Expense endpoints
│   ├── services/
│   │   ├── auth_service.py       # Auth business logic
│   │   └── expense_service.py    # Expense business logic
│   ├── repositories/
│   │   └── auth_repo.py          # User DB queries
│   ├── validators/
│   │   ├── auth_validators.py    # Registration & login validation
│   │   └── expense_validator.py  # Expense payload validation
│   ├── utils/
│   │   ├── error_handlers.py     # Global error handlers
│   │   └── pagination_helper.py  # Pagination utility
│   └── docs/                     # Swagger YAML specs
│       ├── Authentications/
│       └── expenses/
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios instance & interceptors
│   │   ├── components/
│   │   │   ├── common/           # ConfirmModal, Loader, EmptyState, ProtectedRoute
│   │   │   ├── expenses/         # ExpenseCard, ExpenseForm, ExpenseFilters, Pagination
│   │   │   └── layout/           # Navbar, Sidebar
│   │   ├── context/              # AuthContext provider
│   │   ├── hooks/                # useAuth, useExpenses
│   │   ├── pages/                # Login, Register, Dashboard
│   │   ├── services/             # authService, expenseService
│   │   └── utils/                # Constants (categories, sort options)
│   ├── vite.config.js            # Dev server & proxy config
│   └── index.html
│
├── migrations/                   # Alembic migration versions
├── run.py                        # Flask entry point
├── requirements.txt
└── .env                          # Environment variables (not committed)
```

---

## API Reference

All endpoints except **Register** and **Login** require a valid JWT in the `Authorization: Bearer <token>` header.

### Authentication

| Method   | Endpoint           | Description               |
| -------- | ------------------ | ------------------------- |
| `POST`   | `/register`        | Create a new user account |
| `POST`   | `/login`           | Authenticate & get token  |
| `GET`    | `/profile`         | Get current user profile  |
| `DELETE` | `/delete-account`  | Delete current user       |

### Expenses

| Method   | Endpoint              | Description                        |
| -------- | --------------------- | ---------------------------------- |
| `POST`   | `/expenses`           | Create an expense                  |
| `GET`    | `/expenses`           | List expenses (paginated)          |
| `GET`    | `/expenses/<id>`      | Get a single expense               |
| `PUT`    | `/expenses/<id>`      | Update an expense                  |
| `DELETE` | `/expenses/<id>`      | Delete an expense                  |
| `GET`    | `/expenses/filter`    | Filter by date range               |
| `GET`    | `/expenses/search`    | Search by keyword                  |
| `GET`    | `/expenses/summary`   | Monthly summary (year & month)     |
| `GET`    | `/expenses/analytics` | Aggregate stats (total, avg, max)  |

Full request/response schemas are available in the Swagger UI at `http://127.0.0.1:5000/docs`.

---

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **PostgreSQL** running locally (or a remote connection string)

---

## Getting Started

### 1. Backend

```powershell
# Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
JWT_SECRET_KEY=your_secret_key_here
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/expense_tracker
FLASK_APP=run.py
```

Run migrations and start the server:

```powershell
flask db upgrade
python run.py
```

The API will be available at **http://127.0.0.1:5000**.  
Swagger docs at **http://127.0.0.1:5000/docs**.

> **Note:** If PowerShell blocks script execution, run:  
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force`

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Opens at **http://localhost:5173**.  
The Vite dev server proxies API requests (`/login`, `/register`, `/profile`, `/expenses`, `/delete-account`) to the Flask backend automatically.

---

## Environment Variables

| Variable         | Description                          |
| ---------------- | ------------------------------------ |
| `JWT_SECRET_KEY` | Secret key for signing JWT tokens    |
| `DATABASE_URL`   | PostgreSQL connection string         |
| `FLASK_APP`      | Flask entry point (`run.py`)         |

---

## Troubleshooting

| Issue                  | Fix                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| CORS errors            | Access the frontend at `http://localhost:5173` — the Vite proxy handles forwarding to Flask.         |
| DB connection failures | Verify PostgreSQL is running and `DATABASE_URL` in `.env` has the correct credentials and port.      |
| Token expired          | Tokens expire after 24 hours. Log in again to get a new token.                                      |