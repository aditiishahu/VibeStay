from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models  # noqa: F401  (registers tables)
from routers import auth_routes, listings, requests, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VibeStay API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(listings.router)
app.include_router(requests.router)
app.include_router(admin.router)


@app.get("/", tags=["Health"])
def root():
    return {"app": "VibeStay API", "docs": "/docs"}
