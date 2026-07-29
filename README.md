# 🏏 CricX — Cricket ScoreHub AI

> **Next-generation AI-inspired Cricket Scoring & Tournament Management Platform**
> Ball-by-ball live console · 3D Toss Simulator · Automated Scorecards · Tournament Engine

![Tech Stack](https://img.shields.io/badge/Backend-FastAPI-009485?style=flat-square&logo=fastapi)
![DB](https://img.shields.io/badge/Database-SQLite%20%7C%20PostgreSQL-4169E1?style=flat-square&logo=postgresql)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=flat-square&logo=javascript)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Project Structure](#-project-structure)
4. [Tech Stack](#-tech-stack)
5. [Prerequisites](#-prerequisites)
6. [Local Development Setup](#-local-development-setup)
7. [Environment Variables](#-environment-variables)
8. [Running the Application](#-running-the-application)
9. [Demo Credentials](#-demo-credentials)
10. [API Reference](#-api-reference)
11. [Database Models](#-database-models)
12. [Frontend Architecture](#-frontend-architecture)
13. [Deploying to Vercel](#-deploying-to-vercel)
14. [Switching to PostgreSQL (Production)](#-switching-to-postgresql-production)
15. [Troubleshooting](#-troubleshooting)

---

## 🌐 Project Overview

**CricX** (also known as **ScoreX.AI** / **Cricket ScoreHub**) is a full-stack web application for managing cricket matches, tournaments, and player statistics in real time. It is built with a **FastAPI** backend and a **Vanilla JS** SPA frontend, deployable to **Vercel** as a monorepo.

The platform auto-seeds demo data on first launch, so you can explore all features without any manual configuration.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔴 **Live Ball-by-Ball Scoring** | Real-time keypad console — record runs, extras, wickets |
| 🔁 **Undo Last Ball** | Instantly revert the last ball entry with full scorecard rollback |
| 🎲 **3D Toss Simulator** | Animated coin flip to determine batting/bowling order |
| 📊 **Full Scorecard** | Batting & bowling scorecards, over-by-over breakdown |
| 🏆 **Tournament Engine** | Create tournaments, fixtures, and track NRR standings |
| 👥 **Team & Player Management** | Roster management with career stats |
| 📈 **Statistics Dashboard** | Orange Cap (top batsmen), Purple Cap (top bowlers), charts |
| 🕐 **Match History** | Archive of all completed matches with results |
| 🔐 **Auth System** | JWT-based login (admin & user roles) |
| 📱 **Responsive UI** | Mobile-first design with cyber/dark aesthetic |

---

## 📁 Project Structure

```
CRIC/                          <- Project root (deploy from here)
├── vercel.json                <- Root Vercel deployment config
├── .gitignore
│
├── backend/
│   ├── requirements.txt       <- Python dependencies
│   ├── vercel.json            <- (Informational only - do NOT deploy from here)
│   └── app/
│       ├── __init__.py
│       ├── index.py           <- Vercel serverless entry point
│       ├── main.py            <- FastAPI app + CORS + seeding
│       ├── database.py        <- SQLAlchemy engine (SQLite / PostgreSQL)
│       ├── models.py          <- ORM models (User, Team, Player, Match)
│       ├── schemas.py         <- Pydantic request/response schemas
│       ├── crud.py            <- Database CRUD operations
│       ├── auth.py            <- JWT auth, password hashing
│       └── routers/
│           ├── auth_router.py
│           ├── team_router.py
│           ├── player_router.py
│           ├── match_router.py
│           ├── tournament_router.py
│           ├── stats_router.py
│           └── admin_router.py
│
└── frontend/
    ├── index.html             <- SPA shell (single HTML file)
    └── static/
        ├── css/
        │   ├── main.css       <- Global design system, variables, layout
        │   ├── components.css <- Reusable UI components
        │   ├── scoring.css    <- Live scoring console styles
        │   └── responsive.css <- Mobile breakpoints
        └── js/
            ├── api.js         <- All fetch() calls to /api/* endpoints
            ├── store.js       <- Global client-side state
            ├── toss.js        <- 3D coin-flip animation logic
            ├── scoring.js     <- Ball recording & keypad logic
            ├── charts.js      <- Statistics chart rendering
            ├── views.js       <- All page/view renderers
            └── app.js         <- Router, nav, app bootstrap
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.10+, FastAPI, Uvicorn |
| **ORM** | SQLAlchemy 2.0 |
| **Validation** | Pydantic v2 |
| **Auth** | PyJWT, PBKDF2-HMAC (passlib bcrypt) |
| **Database (Dev)** | SQLite (zero-config, auto-created) |
| **Database (Prod)** | PostgreSQL (Neon, Supabase, or any PG) |
| **Frontend** | Vanilla HTML5 + CSS3 + JavaScript (ES6 modules) |
| **Icons** | Font Awesome 6 |
| **Deployment** | Vercel (monorepo — static frontend + Python serverless) |

---

## ✅ Prerequisites

Make sure the following tools are installed on your system:

- **Python 3.10 or higher** → https://www.python.org/downloads/
- **pip** (comes with Python)
- **Git** → https://git-scm.com
- **Node.js & npm** *(optional — only needed if you want to use the Vercel CLI)* → https://nodejs.org

Verify your installations:

```bash
python --version     # Should be 3.10+
pip --version
git --version
```

---

## 🚀 Local Development Setup

Follow these steps exactly, in order.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CRIC.git
cd CRIC
```

> If you already have the project folder on your Desktop, skip this step and just open a terminal in `C:\Users\Admin\OneDrive\Desktop\CRIC`.

---

### Step 2 — Create a Python Virtual Environment

```bash
# Windows (PowerShell)
python -m venv venv

# macOS / Linux
python3 -m venv venv
```

---

### Step 3 — Activate the Virtual Environment

```bash
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Windows (Command Prompt)
venv\Scripts\activate.bat

# macOS / Linux
source venv/bin/activate
```

You should see `(venv)` appear at the start of your terminal prompt.

---

### Step 4 — Install Python Dependencies

```bash
pip install -r backend/requirements.txt
```

This installs:

| Package | Purpose |
|---|---|
| `fastapi` | Web framework |
| `uvicorn` | ASGI server |
| `sqlalchemy` | ORM / database |
| `pydantic` | Data validation |
| `pyjwt` | JSON Web Tokens |
| `passlib[bcrypt]` | Password hashing |
| `python-multipart` | Form data parsing |
| `psycopg2-binary` | PostgreSQL driver (for production) |
| `python-dotenv` | .env file loading |

---

### Step 5 — (Optional) Create a `.env` File

For local development, the app works out of the box with **no `.env` file** — it uses SQLite automatically.

If you want to customize settings, create a `.env` file in the **project root** (`CRIC/`):

```env
# Secret key for JWT token signing (change this in production!)
SECRET_KEY=your_super_secret_key_here

# Allowed frontend origins (use * for development)
ALLOWED_ORIGINS=*

# Leave this blank to use SQLite (recommended for local dev)
# DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## ▶ Running the Application

### Step 6 — Start the FastAPI Backend Server

From the **project root** (`CRIC/`), run:

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

**Or**, navigate into the backend folder first:

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see output like:

```
[INFO] Seeding initial demo data for Cricket ScoreHub...
[INFO] Database seeding completed successfully!
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

The first run will automatically:
- Create the SQLite database file at `backend/app/cricket_scorehub.db`
- Create all database tables
- Seed demo teams, players, a tournament, and sample matches

---

### Step 7 — Open the App

Once the server is running, open your browser to:

- **App:** http://localhost:8000
- **API Docs (Swagger UI):** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/health

Expected health response:
```json
{
  "status": "online",
  "system": "Cricket ScoreHub Cyber-Sports Engine v1.0",
  "database": "sqlite (local dev)"
}
```

---

## 🔑 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | `cyber_sports_scorehub_secret_key_2026_x89a` | JWT signing key — **change in production!** |
| `ALLOWED_ORIGINS` | `*` | Comma-separated allowed CORS origins |
| `DATABASE_URL` | *(none)* | PostgreSQL connection string. Leave blank to use SQLite. |

---

## 👤 Demo Credentials

The database is automatically seeded with two user accounts on first startup:

| Role | Username | Password | Email |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | admin@scorehub.ai |
| **Demo User** | `demouser` | `demo123` | demo@scorehub.ai |

> ⚠️ Change these passwords before deploying to production!

**Pre-seeded Demo Data includes:**
- 4 Teams: Cyber Strikers, Quantum Titans, Solar Knights, Aero Velocity
- 10 Players with full career statistics
- 1 Tournament: Cyber Premier League 2026
- 2 Matches (1 Live, 1 Completed)

---

## 📡 API Reference

All API endpoints are prefixed with `/api/`. Full interactive docs available at `/docs`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/me` | Get current user profile |

### Teams

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/teams` | List all teams |
| `POST` | `/api/teams` | Create a new team |
| `GET` | `/api/teams/{id}` | Get team details |
| `DELETE` | `/api/teams/{id}` | Delete a team |

### Players

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/players` | List all players |
| `POST` | `/api/players` | Add a new player |
| `GET` | `/api/players/{id}` | Get player details |

### Matches & Scoring

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/matches` | List all matches (filter by ?status=Live) |
| `POST` | `/api/matches` | Create a new match |
| `GET` | `/api/matches/{id}` | Get match details + full scorecard |
| `POST` | `/api/matches/{id}/toss` | Submit toss result |
| `POST` | `/api/matches/{id}/score-ball` | Record a ball (runs, extras, wicket) |
| `POST` | `/api/matches/{id}/undo-ball` | Undo the last ball |
| `GET` | `/api/matches/{id}/scorecard` | Get detailed scorecard |

### Tournaments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tournaments` | List all tournaments |
| `POST` | `/api/tournaments` | Create a new tournament |
| `GET` | `/api/tournaments/{id}` | Get tournament + fixtures |

### Statistics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats/top-batsmen` | Orange Cap leaderboard |
| `GET` | `/api/stats/top-bowlers` | Purple Cap leaderboard |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `DELETE` | `/api/admin/reset-db` | Reset and re-seed the database |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |

---

## 🗄 Database Models

The application uses the following SQLAlchemy models:

```
User               -> Users with roles (admin / user)
Team               -> Cricket teams with roster
Player             -> Individual players with career stats
Tournament         -> Tournament with format & status
Fixture            -> Scheduled match slots within a tournament
Match              -> A cricket match (Scheduled -> Toss -> Live -> Completed)
Innings            -> Each innings of a match (innings 1 & 2)
BallEvent          -> Individual ball delivery records
BattingScorecard   -> Per-player batting figures for an innings
BowlingScorecard   -> Per-player bowling figures for an innings
```

---

## 🖥 Frontend Architecture

The frontend is a **Single Page Application (SPA)** built with pure Vanilla JavaScript — no framework, no build step required.

| File | Responsibility |
|---|---|
| `index.html` | App shell — nav, header, footer, script imports |
| `app.js` | Hash-based router, navigation, app bootstrap |
| `api.js` | All HTTP fetch calls to the FastAPI backend |
| `store.js` | Global in-memory client state (current match, user, etc.) |
| `views.js` | All view renderers (home, dashboard, teams, scoring) |
| `scoring.js` | Ball-recording keypad logic |
| `toss.js` | Animated 3D coin-flip logic |
| `charts.js` | Statistics chart drawing (Canvas API) |

Navigation is **hash-based**: clicking a nav link changes `window.location.hash` (e.g., `#live-scoring`) and `app.js` renders the matching view inside `#view-container`.

---

## ☁ Deploying to Vercel

### Step 1 — Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2 — Login to Vercel

```bash
vercel login
```

### Step 3 — Deploy from the Project Root

> ⚠️ Always deploy from the `CRIC/` root directory, NOT from the `backend/` subfolder.

```bash
# From CRIC/ directory:
vercel
```

Vercel will detect the `vercel.json` at the root and:
- Build the **Python serverless function** from `backend/app/index.py`
- Deploy the **static frontend** from `frontend/`
- Route all `/api/*` requests to the Python function
- Route all other requests to `frontend/index.html`

### Step 4 — Set Environment Variables on Vercel

In your Vercel project dashboard → **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `SECRET_KEY` | `your_production_secret_key` |
| `DATABASE_URL` | `postgresql://user:pass@host/db` |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` |

### Step 5 — Deploy to Production

```bash
vercel --prod
```

Your app will be live at `https://your-project.vercel.app`.

---

## 🐘 Switching to PostgreSQL (Production)

In production, set the `DATABASE_URL` environment variable to your PostgreSQL connection string. The app automatically detects it and uses PostgreSQL instead of SQLite.

### Using Neon (Recommended — Free Tier)

1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the **Connection String** (it looks like `postgres://user:pass@host/db`)
4. Set it as `DATABASE_URL` in Vercel environment variables

> **Note:** The app automatically converts `postgres://` to `postgresql://` for SQLAlchemy compatibility.

### Using Supabase

1. Go to https://supabase.com and create a project
2. Go to **Settings → Database → Connection String → URI**
3. Copy the connection string and set it as `DATABASE_URL`

---

## 🔧 Troubleshooting

### ❌ ModuleNotFoundError when starting the server

**Cause:** The virtual environment is not activated, or dependencies are not installed.

**Fix:**
```bash
# Activate venv first
.\venv\Scripts\Activate.ps1   # Windows PowerShell

# Then install dependencies
pip install -r backend/requirements.txt
```

---

### ❌ uvicorn: command not found

**Cause:** Uvicorn is not installed or venv is not activated.

**Fix:**
```bash
.\venv\Scripts\Activate.ps1
pip install uvicorn
```

---

### ❌ Address already in use on port 8000

**Cause:** Another process is using port 8000.

**Fix:** Use a different port:
```bash
uvicorn backend.app.main:app --reload --port 8080
```

---

### ❌ CORS errors in the browser console

**Cause:** The frontend is trying to call the API from a different origin.

**Fix:** Set the `ALLOWED_ORIGINS` environment variable to include your frontend URL:
```env
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

---

### ❌ Database is out of sync / Stale data

**Fix:** Delete the SQLite file and restart the server to re-seed fresh data:
```bash
# Windows
del backend\app\cricket_scorehub.db

# macOS / Linux
rm backend/app/cricket_scorehub.db

# Then restart
uvicorn backend.app.main:app --reload --port 8000
```

Or use the admin reset endpoint: `DELETE /api/admin/reset-db`

---

### ❌ Vercel deployment fails with Python errors

**Cause:** Dependency not in requirements.txt, or wrong entry point.

**Fix:**
- Ensure `backend/app/index.py` exists and imports your `app` object
- Ensure all packages are in `backend/requirements.txt`
- Check that root `vercel.json` points to `backend/app/index.py`

---

### ❌ Frontend shows blank page after deploy

**Cause:** Static file routes may be misconfigured.

**Fix:** Ensure your root `vercel.json` has:
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/app/index.py" },
    { "src": "/static/(.*)", "dest": "frontend/static/$1" },
    { "src": "/", "dest": "frontend/index.html" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

## 🙌 Credits

- **Backend:** FastAPI, SQLAlchemy, PyJWT
- **Frontend:** Vanilla JS, Font Awesome 6, CSS Custom Properties
- **Deployment:** Vercel Serverless Platform
- **Design:** Cyber Sports dark theme with glassmorphism & neon accents

---

*Built with love for cricket fans, club scorers, and tournament managers.*
