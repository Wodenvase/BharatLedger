# BharatLedger: A Full-Stack Intelligent Ledger for Financial Inclusion

BharatLedger is a high-performance financial analysis platform designed to bridge the credit gap for India's informal economy. It transforms fragmented, messy data from SMS, UPI messages, and notebooks into a structured, queryable financial ledger.

This project is a modern, decoupled full-stack application. The frontend is a Next.js (React/TypeScript) app, and the backend is a data-engineering powerhouse built in Python (FastAPI, Polars, DuckDB, Ray, and HuggingFace).

> “Good morning, Professor. Our project is called BharatLedger.
>
> The idea came from looking at a very common but under-served problem in India: informal credit. Across small shops, local vendors, and even personal transactions, people often maintain records through SMS, WhatsApp messages, or simple notebooks. These methods are fragmented, prone to error, and don’t provide any real insights into repayment or risk.
>
> In the last decade, with the surge of UPI, BHIM, and other digital payment systems, millions of Indians have entered the digital financial space. However, many of them still don’t have a proper bank account or access to structured financial records. This creates a gap — they’re transacting digitally, but without the tools to track, analyze, or build creditworthiness.
>
> So, with BharatLedger, we wanted to create a digital-first, intelligent ledger system that can automatically:
>
> * Ingest messy financial data like SMS transaction logs or UPI messages.
> * Clean and structure it into proper double-entry accounting using Beancount.
> * Analyze it with ML models to generate risk scores and repayment insights.
> * And finally, present it in a simple dashboard, while also automating reminders through workflow tools.
>
> As this is our final year project, our main motivation was to not just pick one technology but to combine everything we’ve learned so far — data engineering, machine learning, system design, and full-stack development. That’s why we deliberately chose a mix of niche but powerful tools like Polars, DuckDB, Ray, HuggingFace models, and a modern Next.js dashboard.
>
> In short, BharatLedger is both a socially relevant solution for informal credit management and a technically rich project that demonstrates our ability to design an end-to-end system — right from data collection to intelligence to user experience.”

---

## ✨ Key Features

* **Decoupled, Full-Stack Architecture:** A lightning-fast **Next.js** frontend that communicates with a powerful **FastAPI** Python backend.
* **AI-Powered Ingestion:** Uses **HuggingFace** NLP models to parse and extract structured data from raw, messy SMS and text logs.
* **Double-Entry Accounting:** Leverages **Beancount** as the core data structure, providing an immutable, text-based, "source of truth" ledger for all transactions.
* **High-Speed Analytics:** Uses **Polars** and **DuckDB** to run complex, real-time analytical queries directly on the structured data, powering the dashboard.
* **Scalable & Asynchronous:** Implements **Celery** and **Ray** to manage heavy data processing (like NLP) as background tasks, ensuring the UI is always fast and responsive.
* **Secure Authentication:** End-to-end user authentication and profile management using **NextAuth.js** (frontend) and **JWT tokens** (backend).

---

## 🛠️ Technology Stack Showcase

This project is built with two distinct, high-performance stacks that communicate via a REST API.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (React)** | Modern, server-rendered React framework for the UI. |
|  | **TypeScript** | For a type-safe, robust, and maintainable frontend codebase. |
|  | **TailwindCSS** | Utility-first CSS framework for rapid UI development. |
|  | **NextAuth.js** | Client-side session and authentication management. |
| **Backend API** | **FastAPI (Python)** | High-performance API server to manage all logic and data. |
|  | **PostgreSQL** | Primary database for storing user data, profiles, and auth. |
|  | **Celery & Redis** | Asynchronous task queue for running background jobs. |
| **Data Engineering**| **HuggingFace** | NLP models for parsing raw SMS/UPI text logs. |
|  | **Beancount** | Text-based, double-entry accounting ledger format. |
|  | **Polars** | High-performance DataFrame library for data transformation. |
|  | **DuckDB** | In-process analytical database for "OLAP" queries. |
|  | **Ray** | Distributed computing framework to scale ML/data tasks. |
| **Deployment** | **Vercel** | Hosting the **Next.js** frontend. |
|  | **Railway / Render** | Hosting the **FastAPI** app, **PostgreSQL**, and **Redis**. |

---

## 🏗️ System Architecture & Data Flow

This decoupled architecture separates user-facing concerns from heavy data processing, allowing each part to scale independently.

1.  **User (Frontend):** The user interacts with the **Next.js App** (on Vercel). They sign in via **NextAuth.js**.
2.  **Authentication:** Next.js sends login credentials to the **FastAPI Backend** (on Render). FastAPI validates them against the **PostgreSQL DB**, creates a **JWT token**, and sends it back. All future requests use this token.
3.  **Data Ingestion (The "Heavy Lift"):**
  * The user uploads a raw SMS log.
  * Next.js sends the file to a `/upload` endpoint on FastAPI.
  * FastAPI creates a job with **Celery**, which immediately returns a "Processing" status to the user.
  * A Celery worker, powered by **Ray**, picks up the job. It uses a **HuggingFace** model to parse the text, `Polars` to clean it, and `Beancount` to format it into a text-based ledger file. This file is then saved to storage.
4.  **Data Analysis (The "Fast" Part):**
  * The user opens their dashboard.
  * Next.js calls the `/api/dashboard` endpoint on FastAPI.
  * FastAPI loads the user's `.beancount` file, uses **Polars** to load it into a DataFrame, and then uses **DuckDB** to run fast, complex SQL queries (e.g., "summarize spending by category per month").
  * FastAPI returns the aggregated JSON data, which Next.js displays in the dashboard.

---

## 📈 8-Phase Project Development Lifecycle

This project was built by separating the frontend, backend, and data pipeline into a logical, multi-phase workflow.

### Phase 1: Backend Foundation & User Auth
* **Goal:** Create a secure, stateful backend API.
* **Actions:**
  * Initialized a **FastAPI** project.
  * Set up a **PostgreSQL** database.
  * Implemented JWT token-based authentication with `/register` and `/login` endpoints.
  * Built user profile management routes (`GET /users/me`, `PUT /users/me`).

### Phase 2: Frontend Scaffolding & API Integration
* **Goal:** Connect the Next.js frontend to the live backend.
* **Actions:**
  * Initialized a **Next.js (TypeScript)** project.
  * Installed **NextAuth.js** and configured its `CredentialsProvider` to talk to the FastAPI backend.
  * Wired up the "Login," "Register," and "Profile" pages.
  * Successfully established a secure, authenticated connection between the two services.

### Phase 3: Core Data Structure (Beancount)
* **Goal:** Define the "source of truth" for all financial data.
* **Actions:**
  * Designed the `beancount` data schema (e.g., `Assets:Bank:UPI`, `Expenses:Food`).
  * Wrote Python scripts to convert sample *clean* JSON data into valid `.beancount` text files.
  * This validated the core accounting logic before adding complex data.

### Phase 4: Analytical Engine (DuckDB + Polars)
* **Goal:** Build the API that powers the dashboard.
* **Actions:**
  * Created a `GET /api/dashboard` endpoint in FastAPI.
  * This endpoint reads the sample `.beancount` files from Phase 3.
  * Used **Polars** to parse the data into a DataFrame.
  * Used **DuckDB** to run complex SQL (OLAP) queries on the Polars DataFrame to aggregate data (e.g., `GROUP BY category`).
  * Connected the Next.js dashboard to this endpoint to display the insights.

### Phase 5: AI-Powered Ingestion (HuggingFace)
* **Goal:** Process raw, messy SMS data into a structured format.
* **Actions:**
  * Researched and selected a pre-trained **HuggingFace** NER (Named Entity Recognition) model capable of finding `[AMOUNT]`, `[VENDOR]`, and `[DATE]` in text.
  * Built a Python script that takes raw SMS logs and uses this model to output structured JSON, ready for the Beancount converter from Phase 3.

### Phase 6: Asynchronous Processing (Celery + Ray)
* **Goal:** Move the heavy NLP processing into a background task.
* **Actions:**
  * Integrated **Celery** and **Redis** into the FastAPI application.
  * Created a `POST /upload` endpoint that *only* creates a Celery task and returns a `task_id`.
  * Created a Celery worker that runs the Phase 5 HuggingFace pipeline.
  * Integrated **Ray** with the Celery worker to parallelize the processing of thousands of SMS messages at once, dramatically speeding up ingestion.

### Phase 7: Risk Scoring & Final Insights
* **Goal:** Generate the predictive risk score.
* **Actions:**
  * Used the `Polars` DataFrame from Phase 4 to build a feature engineering pipeline (e.g., `savings_rate`, `income_stability`).
  * Used these features (either with a simple heuristic model or another ML model) to generate a "BharatLedger Risk Score".
  * Added this score to the `GET /api/dashboard` endpoint.
  * Built the "Risk Simulator" API to re-calculate this score with hypothetical inputs.

### Phase 8: Containerization & Deployment
* **Goal:** Deploy the entire decoupled application to the web.
* **Actions:**
  * **Frontend:** Deployed the **Next.js** app to **Vercel**.
  * **Backend:**
    * Created a `Dockerfile` for the FastAPI application (including Celery and Ray workers).
    * Deployed the container, a **PostgreSQL** database, and a **Redis** instance on **Render.com** (or Railway).
    * Configured CORS and environment variables (`DATABASE_URL`, `FRONTEND_URL`) to allow the two services to communicate securely.

---

## 🚀 Getting Started Locally

To run this project, you will need to run two separate services: the `frontend` and the `backend`.

### Prerequisites

* Node.js (v18+) and npm
* Python (v3.10+) and pip
* PostgreSQL (local or on Railway/Render)
* Redis (local or on Railway/Render)

### 1. Backend Setup (FastAPI)

```bash
# Navigate to the backend folder
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up your .env file with DATABASE_URL, REDIS_URL, etc.
cp .env.example .env
nano .env

# Run the database migrations (if using a migration tool like Alembic)
# ...

# Run the FastAPI server
uvicorn main:app --reload

# In a separate terminal, run the Celery worker
celery -A main.celery_app worker --loglevel=info
```

### 2. Frontend Setup (Next.js)

```bash
# From the repository root
cd frontend
npm install
npm run dev
```

Open the frontend at `http://localhost:3000` and sign in.

---

If you'd like, I can also update this README with exact paths from this repository (the current repo has the Next frontend under `app/` and Python processors under `api/python/`) and add commands to run the FastAPI dev wrapper that exposes the Python processing endpoints for local testing.

*** End Patch
++ file mode 100644
++ title : README.md
<!--
  Updated README: consolidated project description and phased development notes.
  Date: 2025-11-10
-->

# BharatLedger (Next.js Edition)

An experimental/full-stack credit-scoring demo app built with Next.js (App Router), TypeScript, Prisma/Postgres, NextAuth, and a small set of Python serverless utilities for CSV ingestion and ML scoring.

This repository tracks an iterative, phased build: from migration and authentication through CSV ingest, transaction processing, an offline ML model (LightGBM) and a live scoring/simulation API.

---

## High-level summary

- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- Backend (Node): Next API routes + Prisma for application workflows and auth.
- Auth: NextAuth for session management and protected routes.
- Data & DB: PostgreSQL accessed via Prisma (Node) and psycopg2 (Python).
- Data processing & ML: lightweight Python scripts using Polars for CSV ETL and LightGBM for model inference/training.

The app demonstrates an end-to-end flow: users upload bank CSVs -> server stores raw CSV -> Python processor cleans & inserts transactions -> ML scoring endpoint computes a credit score -> dashboard and a Risk Simulator visualize current and simulated scores.

---

## Phased Development (what each phase delivered)

- Phase 1 — Migration & infra
  - Migrated React/Vite app to Next.js App Router.
  - Set up PostgreSQL and Prisma; created base schema and DB client.

- Phase 2 — Authentication
  - Implemented secure registration/login with NextAuth, password hashing, and protected dashboard routes.

- Phase 3 — Account & profile flows
  - Per-user Account records and profile/dashboard pages; OAuth/email workflows scaffolding.

- Phase 4 — Credit score foundation
  - Built UI components (gauge, metric cards) and introduced a scoring contract & feature pipeline design.

- Phase 5 — CSV upload UX + backend route
  - Client-side uploader on Profile/Data Sources pages.
  - `app/api/upload/route.ts` accepts multipart/form-data, saves uploads to a safe temp path (/tmp/<userId>), and marks account `connected`/`lastUploaded` in Prisma.

- Phase 6 — CSV processing (Python)
  - `api/python/process_csv.py`: polars-based CSV cleaning, categorization rules, date parsing, and bulk-insert into `Transaction` table via psycopg2.
  - Upload route triggers the processor by POSTing JSON with { path, userId, accountId }.

- Phase 7 — ML scoring
  - `ml/train.ipynb` (offline): feature engineering and LightGBM training to produce `ml/model.lgb`.
  - `api/python/get_score.py`: loads model (if available), computes per-user features from DB, and returns a score JSON (falls back to a simple heuristic when model is missing).
  - Dashboard calls the scoring API and displays the returned score in `CreditScoreGauge`.

- Phase 8 — Simulator & deployment prep
  - `api/python/simulate.py`: applies scenario adjustments to features (missed payments, income change, spending changes) then predicts a simulated score.
  - Risk Simulator UI calls `/api/python/simulate` and displays simulated results and recommendations.

---

## Contract & key files

- Next API Upload route: `app/api/upload/route.ts` — accepts CSV multipart/form-data, saves to `/tmp/<userId>`, updates the Prisma `Account`, and POSTs a JSON trigger to `api/python/process_csv`.
- Python processor: `api/python/process_csv.py` — polars ETL + psycopg2 bulk insert.
- Scoring endpoint: `api/python/get_score.py` — computes features and returns a score.
- Simulation endpoint: `api/python/simulate.py` — returns a simulated score for scenario inputs.
- Model training notebook: `ml/train.ipynb` — offline training and `ml/model.lgb` artifact creation.

See the `app/` and `api/python/` folders for implementation details.

---

## How to run & test (local development)

Prerequisites
- Node 18+ (the repo uses Next 15)
- PostgreSQL available and `DATABASE_URL` configured
- Python 3.10+ for running the Python scripts/notebook

1) Prepare environment

  - Create a `.env` in the repo root and set at minimum:

    DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="<secure-random>"

2) Install Node deps and prepare DB

  npm install
  npx prisma db push
  npx prisma generate

3) Start the Next dev server

  npm run dev

Open http://localhost:3000 and sign up to test the dashboard and upload UI.

4) Python dependencies & model (for scoring/processing)

The Python scripts use polars, psycopg2 (or psycopg2-binary), and LightGBM for the model. Install in a venv:

  python -m venv .venv
  source .venv/bin/activate
  pip install -r ml/requirements.txt

Train the model (optional for dev):

  # open and run ml/train.ipynb (or convert to script)
  # this will connect to your DATABASE_URL, build features, and save ml/model.lgb

If you don't run the trainer or don't place `ml/model.lgb` in the repo, the scoring/simulate endpoints will use a simple fallback heuristic instead of the real model.

5) Local testing of Python endpoints

Note: Next's built-in dev server does not execute Python files under `api/python/` automatically. There are two local testing options:

- Option A — Run the Python scripts directly (CLI/handler provided)
  - `api/python/process_csv.py` and `api/python/get_score.py` include `__main__` support for direct runs against a path or user id. Use that to test insertion and scoring against your DB.

- Option B — Run a tiny HTTP wrapper (recommended for end-to-end testing)
  - Create a small FastAPI wrapper that imports the functions from `api/python/*.py` and exposes them at `http://localhost:8000/api/python/*`. Example (quick):

    ```python
    # dev_wrapper.py (FastAPI)
    from fastapi import FastAPI, Request
    from api.python import process_csv, get_score, simulate

    app = FastAPI()

    @app.post('/api/python/process_csv')
    async def process(req: Request):
        payload = await req.json()
        return process_csv.handler(payload)
    # similarly expose get_score and simulate
    ```

    Run: `uvicorn dev_wrapper:app --reload --port 8000` and then either change the client to call `http://localhost:8000` or temporarily patch Next API upload trigger URL to that host for local integration testing.

6) Upload CSV flow

  - Use the Profile / Data Sources page in the app to upload a CSV.
  - The Next upload route saves the file to `/tmp/<userId>/...` and sends a JSON trigger to the processor endpoint with { path, userId, accountId }.
  - The Python processor reads that CSV path, cleans it, and inserts rows into the `Transaction` table.

---

## Deployment notes (Vercel)

- Vercel can host Next.js pages and will run Node API routes automatically. To host Python serverless functions alongside, you have two choices:
  1. Convert Python code into serverless-friendly endpoints supported by your chosen host (e.g., Vercel's serverless Python runtimes where available) or deploy the Python services separately (AWS Lambda, Google Cloud Run, Render, Railway) and point the Next API triggers to those URLs.
  2. Package the model and dependencies into a serverless function image or host the model file on S3/Blob storage and let the runtime download it at cold start.

Environment variables to set in production:

- DATABASE_URL
- NEXTAUTH_URL
- NEXTAUTH_SECRET

Production recommendations
- Use durable object storage (S3) for uploaded CSVs instead of writing to the ephemeral filesystem.
- Use a background worker or queue (RabbitMQ, Redis queues, or a serverless queue + worker) to process uploads asynchronously and retry on failure.
- Add logging/observability for the Python ingestion and scoring services.

---

## Development notes & next steps

- Finish end-to-end local testing by either running the FastAPI dev wrapper or running the Python scripts against the DB.
- Resolve remaining TypeScript lint/warnings in the dashboard (hook deps and prop typings).
- Train and commit `ml/model.lgb` to a safe artifact store (or create a model artifact pipeline) so scoring endpoints use the trained model instead of heuristics.
- Harden the ingestion (idempotency, dedup keys, validation) before production use.

---

## Where to look in the codebase

- Frontend pages: `app/` (dashboard, simulator, profile, upload)
- Upload API: `app/api/upload/route.ts`
- Python processing & ML endpoints: `api/python/` (process_csv.py, get_score.py, simulate.py)
- Model training: `ml/train.ipynb` and `ml/requirements.txt`
- Prisma schema: `prisma/schema.prisma`

---

If you'd like, I can:

- add a small FastAPI wrapper and a short script to run it locally so Next dev can call the Python endpoints;
- convert the `ml/train.ipynb` to a runnable training script and run it to produce `ml/model.lgb` (requires DB credentials and Python deps);
- clean up and run the TypeScript linter and fix remaining issues in `app/dashboard` components.

Pick one and I'll continue.

---

License: Educational / internal demo. Not for production use without security & privacy reviews.
# BharatLedger - Next.js Edition

> **Status**: Phase 2 Complete - Full Authentication System Live!

A comprehensive credit scoring platform for India's informal borrowers, powered by Next.js 15, PostgreSQL, Prisma, and NextAuth.js.

## Quick Start

```bash
cd /Users/dipantabhattacharyya/Downloads/bharatledger-nextjs

# If first time:
# 1. Add DATABASE_URL to .env (see QUICKSTART.md)
# 2. Run: npx prisma db push && npx prisma generate

# Start the app
npm run dev
```

Visit: **http://localhost:3000**

## What's New in Phase 2

### Complete Authentication System
- User registration with password hashing
- Secure login/logout with NextAuth.js
- Protected dashboard routes
- JWT session management
- Professional login & registration pages

### Try It Now:
1. Visit http://localhost:3000/register
2. Create an account
3. Sign in and access your dashboard
4. Protected routes automatically redirect to login

## Features

### Authentication & Security
- **NextAuth.js** - Industry-standard authentication
- **Password Hashing** - bcryptjs with 12 rounds
- **JWT Sessions** - Stateless authentication tokens
- **Protected Routes** - Middleware-based route protection
- **Form Validation** - Client & server-side validation

### Frontend (Next.js 15)
- Landing page with all sections
- Dashboard with 6 routes (Overview, Transactions, Financial Health, Risk Simulator, Reports, Profile)
- Responsive navigation with auth state
- Tailwind CSS configured
- TypeScript throughout

### Backend (Prisma + PostgreSQL)
- Prisma ORM configured
- User model with authentication
- API routes for registration
- Database client singleton

## Project Structure

```
bharatledger-nextjs/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoint
│   │   └── register/              # User registration
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   ├── dashboard/                 # Protected dashboard
│   ├── page.tsx                   # Landing page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── landing/                   # Landing sections
│   ├── dashboard/                 # Dashboard widgets
│   └── shared/                    # Navigation, modals
├── lib/
│   ├── auth.ts                    # NextAuth config
│   └── prisma.ts                  # Database client
├── prisma/
│   └── schema.prisma              # Database schema
└── middleware.ts                  # Route protection
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcryptjs
  name      String?
  createdAt DateTime @default(now())
}
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Password**: bcryptjs
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utils**: date-fns

## Documentation

- **README.md** (this file) - Project overview
- **QUICKSTART.md** - 3-minute setup for Phase 1
- **PHASE2_COMPLETE.md** - Authentication guide & testing
- **MIGRATION_GUIDE.md** - Detailed migration from Vite to Next.js

## Usage

### Development
```bash
npm run dev        # Start dev server (localhost:3000)
```

### Database
```bash
npx prisma studio  # Open database GUI
npx prisma db push # Sync schema to database
npx prisma generate # Generate Prisma Client
```

### Build
```bash
npm run build      # Build for production
npm start          # Run production server
```

## Testing Authentication

### Create Account
1. Go to http://localhost:3000/register
2. Fill in name, email, password
3. Click "Create Account"
4. Redirected to login page

### Sign In
1. Go to http://localhost:3000/login
2. Enter your credentials
3. Click "Sign In"
4. Redirected to dashboard

### Test Protection
- Try accessing `/dashboard` while logged out
- Should redirect to `/login`
- After login, can access all dashboard routes

See **PHASE2_COMPLETE.md** for detailed testing guide.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

## Phase Completion Status

- **Phase 1**: Next.js migration + Prisma setup
- **Phase 2**: NextAuth.js authentication system
- **Phase 3**: Email verification, password reset, OAuth
- **Phase 4**: Real credit score calculation
- **Phase 5**: Transaction import & analysis

## What You've Built

### Phase 1 (Completed)
- Migrated React/Vite app to Next.js 15
- Set up PostgreSQL database
- Configured Prisma ORM
- Created User model

### Phase 2 (Just Completed)
- Installed & configured NextAuth.js
- Created registration API with password hashing
- Built login & registration pages
- Protected dashboard routes with middleware
- Updated navigation with auth state
- Implemented session management

## Troubleshooting

**Can't log in?**
- Check DATABASE_URL is correct
- Run `npx prisma generate`
- Clear browser cookies

**"NEXTAUTH_SECRET not set"?**
- Add to `.env` file
- Generate: `openssl rand -base64 32`

**TypeScript errors?**
- Restart TypeScript server in VS Code
- Run `npm install`

See documentation files for more help.

## License

Educational project for financial inclusion.

---

## You Now Have:

- Full-stack Next.js app
- PostgreSQL database
- Secure authentication
- Protected routes
- Professional UI/UX
- Password hashing
- Session management

**Ready to test?**
```bash
npm run dev
# Visit: http://localhost:3000
# Click "Get Started" to create your account!
```

**Happy coding!**

## Quick Start

```bash
cd /Users/dipantabhattacharyya/Downloads/bharatledger-nextjs

# If first time:
# 1. Add DATABASE_URL to .env (see QUICKSTART.md)
# 2. Run: npx prisma db push && npx prisma generate

# Start the app
npm run dev
```

Visit: **http://localhost:3000**

## What's New in Phase 2

### Complete Authentication System
- User registration with password hashing
- Secure login/logout with NextAuth.js
- Protected dashboard routes
- JWT session management
- Professional login & registration pages

### Try It Now:
1. Visit http://localhost:3000/register
2. Create an account
3. Sign in and access your dashboard
4. Protected routes automatically redirect to login

## Features

### Authentication & Security
- **NextAuth.js** - Industry-standard authentication
- **Password Hashing** - bcryptjs with 12 rounds
- **JWT Sessions** - Stateless authentication tokens
- **Protected Routes** - Middleware-based route protection
- **Form Validation** - Client & server-side validation

### Frontend (Next.js 15)
- Landing page with all sections
- Dashboard with 6 routes (Overview, Transactions, Financial Health, Risk Simulator, Reports, Profile)
- Responsive navigation with auth state
- Tailwind CSS configured
- TypeScript throughout

### Backend (Prisma + PostgreSQL)
- Prisma ORM configured
- User model with authentication
- API routes for registration
- Database client singleton

## Project Structure

```
bharatledger-nextjs/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoint
│   │   └── register/              # User registration
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   ├── dashboard/                 # Protected dashboard
│   ├── page.tsx                   # Landing page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── landing/                   # Landing sections
│   ├── dashboard/                 # Dashboard widgets
│   └── shared/                    # Navigation, modals
├── lib/
│   ├── auth.ts                    # NextAuth config
│   └── prisma.ts                  # Database client
├── prisma/
│   └── schema.prisma              # Database schema
└── middleware.ts                  # Route protection
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcryptjs
  name      String?
  createdAt DateTime @default(now())
}
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Password**: bcryptjs
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utils**: date-fns

## Documentation

# BharatLedger - Next.js Edition

> **Status**: Phase 2 Complete - Full Authentication System Live!

A comprehensive credit scoring platform for India's informal borrowers, powered by Next.js 15, PostgreSQL, Prisma, and NextAuth.js.

## Quick Start

```bash
cd /Users/dipantabhattacharyya/Downloads/bharatledger-nextjs

# If first time:
# 1. Add DATABASE_URL to .env (see QUICKSTART.md)
# 2. Run: npx prisma db push && npx prisma generate

# Start the app
npm run dev
```

Visit: **http://localhost:3000**

## What's New in Phase 2

### Complete Authentication System
- User registration with password hashing
- Secure login/logout with NextAuth.js
- Protected dashboard routes
- JWT session management
- Professional login & registration pages

### Try It Now:
1. Visit http://localhost:3000/register
2. Create an account
3. Sign in and access your dashboard
4. Protected routes automatically redirect to login

## Features

### Authentication & Security
- **NextAuth.js** - Industry-standard authentication
- **Password Hashing** - bcryptjs with 12 rounds
- **JWT Sessions** - Stateless authentication tokens
- **Protected Routes** - Middleware-based route protection
- **Form Validation** - Client & server-side validation

### Frontend (Next.js 15)
- Landing page with all sections
- Dashboard with 6 routes (Overview, Transactions, Financial Health, Risk Simulator, Reports, Profile)
- Responsive navigation with auth state
- Tailwind CSS configured
- TypeScript throughout

### Backend (Prisma + PostgreSQL)
- Prisma ORM configured
- User model with authentication
- API routes for registration
- Database client singleton

## Project Structure

```
bharatledger-nextjs/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoint
│   │   └── register/              # User registration
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   ├── dashboard/                 # Protected dashboard
│   ├── page.tsx                   # Landing page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── landing/                   # Landing sections
│   ├── dashboard/                 # Dashboard widgets
│   └── shared/                    # Navigation, modals
├── lib/
│   ├── auth.ts                    # NextAuth config
│   └── prisma.ts                  # Database client
├── prisma/
│   └── schema.prisma              # Database schema
└── middleware.ts                  # Route protection
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcryptjs
  name      String?
  createdAt DateTime @default(now())
}
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Password**: bcryptjs
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utils**: date-fns

## Documentation

- **README.md** (this file) - Project overview
- **QUICKSTART.md** - 3-minute setup for Phase 1
- **PHASE2_COMPLETE.md** - Authentication guide & testing
- **MIGRATION_GUIDE.md** - Detailed migration from Vite to Next.js

## Usage

### Development
```bash
npm run dev        # Start dev server (localhost:3000)
```

### Database
```bash
npx prisma studio  # Open database GUI
npx prisma db push # Sync schema to database
npx prisma generate # Generate Prisma Client
```

### Build
```bash
npm run build      # Build for production
npm start          # Run production server
```

## Testing Authentication

### Create Account
1. Go to http://localhost:3000/register
2. Fill in name, email, password
3. Click "Create Account"
4. Redirected to login page

### Sign In
1. Go to http://localhost:3000/login
2. Enter your credentials
3. Click "Sign In"
4. Redirected to dashboard

### Test Protection
- Try accessing `/dashboard` while logged out
- Should redirect to `/login`
- After login, can access all dashboard routes

See **PHASE2_COMPLETE.md** for detailed testing guide.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

## Phase Completion Status

- **Phase 1**: Next.js migration + Prisma setup
- **Phase 2**: NextAuth.js authentication system
- **Phase 3**: Email verification, password reset, OAuth
- **Phase 4**: Real credit score calculation
- **Phase 5**: Transaction import & analysis

## What You've Built

### Phase 1 (Completed)
- Migrated React/Vite app to Next.js 15
- Set up PostgreSQL database
- Configured Prisma ORM
- Created User model

### Phase 2 (Just Completed)
- Installed & configured NextAuth.js
- Created registration API with password hashing
- Built login & registration pages
- Protected dashboard routes with middleware
- Updated navigation with auth state
- Implemented session management

## Troubleshooting

**Can't log in?**
- Check DATABASE_URL is correct
- Run `npx prisma generate`
- Clear browser cookies

**"NEXTAUTH_SECRET not set"?**
- Add to `.env` file
- Generate: `openssl rand -base64 32`

**TypeScript errors?**
- Restart TypeScript server in VS Code
- Run `npm install`

See documentation files for more help.

## License

Educational project for financial inclusion.

---

## You Now Have:

- Full-stack Next.js app
- PostgreSQL database
- Secure authentication
- Protected routes
- Professional UI/UX
- Password hashing
- Session management

**Ready to test?**
```bash
npm run dev
# Visit: http://localhost:3000
# Click "Get Started" to create your account!
```

**Happy coding!**

