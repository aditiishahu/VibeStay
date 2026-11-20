from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Listing, ContactRequest, Role
from schemas import UserOut, ListingOut, RequestOut
from auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    return {
        "users": db.query(User).count(),
        "listings": db.query(Listing).count(),
        "active_listings": db.query(Listing).filter(Listing.is_active.is_(True)).count(),
        "requests": db.query(ContactRequest).count(),
    }


@router.get("/users", response_model=List[UserOut])
def users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}/toggle", response_model=UserOut)
def toggle_user(user_id: int, db: Session = Depends(get_db)):
    u = db.get(User, user_id)
    if not u:
        raise HTTPException(404, "User not found.")
    if u.role == Role.admin:
        raise HTTPException(400, "Admin accounts cannot be disabled.")
    u.is_active = not u.is_active
    db.commit()
    db.refresh(u)
    return u


@router.get("/listings", response_model=List[ListingOut])
def listings(db: Session = Depends(get_db)):
    rows = db.query(Listing).order_by(Listing.created_at.desc()).all()
    out = []
    for l in rows:
        o = ListingOut.model_validate(l)
        o.owner_name = l.owner.name
        out.append(o)
    return out


@router.patch("/listings/{listing_id}/toggle", response_model=ListingOut)
def toggle_listing(listing_id: int, db: Session = Depends(get_db)):
    l = db.get(Listing, listing_id)
    if not l:
        raise HTTPException(404, "Listing not found.")
    l.is_active = not l.is_active
    db.commit()
    db.refresh(l)
    o = ListingOut.model_validate(l)
    o.owner_name = l.owner.name
    return o


@router.get("/requests", response_model=List[RequestOut])
def all_requests(db: Session = Depends(get_db)):
    rows = db.query(ContactRequest).order_by(ContactRequest.created_at.desc()).all()
    return [
        RequestOut(
            id=r.id, listing_id=r.listing_id, listing_title=r.listing.title,
            requester_id=r.requester_id, requester_name=r.requester.name,
            message=r.message or "", status=r.status.value, created_at=r.created_at,
        ) for r in rows
    ]
