# VibeStay – Student PG & Roommate Matching

**Stack:** Python (FastAPI) · JavaScript (React + Vite) · Tailwind CSS · MySQL · JWT + Bcrypt

## Run it

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
```
By default, `backend/.env` uses SQLite for a zero-setup local database. To use MySQL instead, set `DATABASE_URL` to `mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/vibestay`; the `vibestay` database is created automatically on first start.
```bash
python seed_demo.py            # demo accounts + sample rooms
uvicorn main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Demo accounts (password `VibeStay123!`)
| Role | Email |
|---|---|
| Owner | owner@vibestay.demo |
| Seeker | seeker@vibestay.demo |
| Admin | admin@vibestay.demo |

## Demo flow
1. Log in as **seeker** → filter rooms → open one → send a request.
2. Log in as **owner** → Requests → accept it.
3. Back as **seeker** → Requests → Sent by me → the owner's email is now visible.
4. Log in as **admin** → view users, listings, requests; disable a listing.

## Viva notes
- "Where is your HTML/CSS?" → The UI is JavaScript (React components) styled with Tailwind utility classes. Vite needs one small `index.html` entry file, and Tailwind needs a 3-line `index.css` to load its utilities.
- Passwords: Bcrypt (slow, salted). Tokens: JWT signed with HMAC-SHA256, sent as `Authorization: Bearer`.
- Endpoints use plain `def`, so FastAPI runs them in a threadpool, which suits the synchronous SQLAlchemy + PyMySQL stack.
- Token is kept in `localStorage` for simplicity. Trade-off: exposed to XSS; httpOnly cookies are the hardened alternative.
- Duplicate requests are blocked by a UNIQUE(listing_id, requester_id) constraint; owners cannot request their own listing.
