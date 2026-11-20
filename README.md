# 🏠 VibeStay — Student Accommodation & Roommate Finder

VibeStay is a full-stack web application designed to help students find rooms and compatible roommates in one unified platform. Instead of sifting through scattered listings and guessing house rules, students can filter accommodations by location, budget, and lifestyle preferences (such as diet and sleep schedule) and send structured contact requests directly to listing owners.

> **Note:** VibeStay uses deterministic preference-based filtering rather than an AI recommendation or compatibility scoring algorithm. The current build runs as a local demonstration pre-populated with sample data.

---

## ✨ Key Features

- **Smart Search & Preference Filtering:** Filter rooms by city, locality, minimum/maximum rent, availability preference, dietary habits, and daily sleep routine.
- **Listing Management:** Authenticated users can post new room listings, view their posted properties, and toggle listing availability (`Active` / `Inactive`).
- **Privacy-First Contact Requests:** Seekers can send inquiry messages to owners; an owner's contact email is revealed **only after** they accept the request. Built-in constraints prevent duplicate requests or self-requests.
- **Role-Based Moderation (Admin):** Administrators can monitor platform statistics, review all users, listings, and requests, and deactivate accounts or listings.
- **Secure Authentication:** Passwords are salted and hashed with `bcrypt`, and protected API routes are secured via `HS256` JSON Web Tokens (JWT).

---

## 🏗️ System Architecture

VibeStay follows a decoupled client-server architecture:

| Layer | Local URL | Responsibility |
| :--- | :--- | :--- |
| **Frontend (React + Vite)** | `http://localhost:5173` | Single-page user interface, client-side routing, and state management |
| **Backend (FastAPI)** | `http://localhost:8000` | RESTful API endpoints, request validation, authentication, and business logic |
| **Interactive API Docs** | `http://localhost:8000/docs` | Auto-generated Swagger UI for testing endpoints |
| **Database (SQLite / MySQL)** | `vibestay.db` (local) | Relational persistence via SQLAlchemy ORM |

---

## 🛠️ Tech Stack

### Frontend (`frontend/`)
- **Core:** React, React DOM, JavaScript (JSX), Vite
- **Routing & State:** React Router (`App.jsx`), React Context API (`AuthContext.jsx`)
- **HTTP Client:** Axios (`api.js`) with automatic JWT bearer token injection
- **Styling & Typography:** Tailwind CSS, PostCSS, Autoprefixer, Google Fonts (*Bricolage Grotesque* & *DM Sans*)

### Backend (`backend/`)
- **Framework & Server:** Python, FastAPI, Uvicorn (ASGI)
- **ORM & Database Drivers:** SQLAlchemy, SQLite (default local), PyMySQL (optional MySQL support)
- **Validation & Config:** Pydantic (`schemas.py`), `python-dotenv`
- **Security:** `bcrypt` (password hashing), `PyJWT` (24-hour signed tokens in `auth.py`)

---

## 🗄️ Database Schema (`models.py`)

The relational data model consists of three core tables connected via foreign keys:

1. **`User`**: Stores `id`, `name`, `email`, `password_hash`, `role` (`user` or `admin`), `is_active`, and `created_at`.
2. **`Listing`**: Stores `id`, `owner_id` (FK → `User`), `title`, `description`, `city`, `locality`, `rent`, `amenities`, and roommate lifestyle preferences.
3. **`ContactRequest`**: Links `listing_id` (FK → `Listing`) and `requester_id` (FK → `User`) with a `message`, `status` (`pending`, `accepted`, `rejected`), and `created_at`. Enforces a unique constraint so a user cannot submit multiple requests for the same listing.

---

## 📁 Project Structure

```text
VibeStay/
├── backend/
│   ├── routers/          # Modular API route handlers (auth, listings, requests, admin)
│   ├── auth.py           # JWT generation/verification & password hashing
│   ├── database.py       # SQLAlchemy engine & session setup
│   ├── main.py           # FastAPI entry point & CORS configuration
│   ├── models.py         # SQLAlchemy ORM models
│   ├── schemas.py        # Pydantic request/response validation schemas
│   ├── seed_demo.py      # Script to populate demo users and sample listings
│   └── requirements.txt  # Python dependencies
└── frontend/
    ├── src/
    │   ├── api.js        # Axios instance & API helpers
    │   ├── App.jsx       # Application routes
    │   ├── AuthContext.jsx # Global authentication state
    │   └── index.css     # Tailwind CSS imports
    ├── index.html        # HTML entry point & Google Fonts
    └── package.json      # Node dependencies & Vite scripts

```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

* **Python 3.10+**
* **Node.js 18+ & npm**

### 1. Start the Backend Server

```bash
cd backend
python -m venv venv

# Activate virtual environment:
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python seed_demo.py
uvicorn main:app --reload

```

The backend will be live at `http://localhost:8000` (API docs at `http://localhost:8000/docs`).

### 2. Start the Frontend Server

Open a second terminal window:

```bash
cd frontend
npm install
npm run dev

```

Open `http://localhost:5173` in your browser.

---

## 🧪 Demo Walkthrough & Test Accounts

Running `python seed_demo.py` generates sample listings and three test accounts (all sharing the password **`VibeStay123!`**):

1. **Search & Request (Seeker):** Log in with the demo seeker account, filter listings by city/rent/preferences, open a room, and submit a contact request.
2. **Review & Approve (Owner):** Log in with the demo owner account, open incoming requests, and click **Accept**.
3. **Unlock Contact Info:** Log back in as the seeker to view the owner's newly unlocked contact email.
4. **Platform Moderation (Admin):** Log in with the admin account to inspect user/listing/request metrics and test disabling content.

---

## ⚠️ Current Limitations & Future Roadmap

This project was built as an academic MVP/demonstration and includes the following known limitations before production deployment:

* **Token Storage:** JWTs are currently stored in `localStorage`; production deployment should migrate to `HttpOnly`, `Secure` cookies to mitigate XSS risks.
* **Database Scaling:** Uses file-based SQLite locally; production requires a hosted relational database (e.g., managed MySQL or PostgreSQL) with automated backups.
* **Secrets & Transport:** Must replace development fallback secrets with strong environment variables over HTTPS.
* **Planned Enhancements:** Property photo uploads, landlord/student ID verification, and real-time in-app messaging.

```

### How to add this to your GitHub repo:
1. Create a file named **`README.md`** in your main `VibeStay` root folder (outside `frontend` and `backend`).
2. Paste the Markdown above and save (**Ctrl + S**).
3. Run `git add README.md`, `git commit -m "Add project README"`, and `git push`.

```
