from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Listing, User, Gender
from schemas import ListingIn, ListingOut
from auth import get_current_user

router = APIRouter(prefix="/listings", tags=["Listings"])


def to_out(l: Listing) -> ListingOut:
    out = ListingOut.model_validate(l)
    out.owner_name = l.owner.name if l.owner else ""
    return out


@router.get("", response_model=List[ListingOut])
def search(
    city: Optional[str] = None,
    locality: Optional[str] = None,
    min_rent: Optional[int] = Query(None, ge=0),
    max_rent: Optional[int] = Query(None, ge=0),
    available_for: Optional[str] = None,
    diet: Optional[str] = None,
    sleep: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Listing).filter(Listing.is_active.is_(True))
    if city:
        q = q.filter(Listing.city.ilike(f"%{city.strip()}%"))
    if locality:
        q = q.filter(Listing.location.ilike(f"%{locality.strip()}%"))
    if min_rent is not None:
        q = q.filter(Listing.rent >= min_rent)
    if max_rent is not None:
        q = q.filter(Listing.rent <= max_rent)
    if available_for in ("male", "female"):
        # "any" listings suit everyone
        q = q.filter(Listing.available_for.in_([Gender(available_for), Gender.any]))
    if diet in ("veg", "non-veg"):
        q = q.filter(Listing.diet_preference.in_([diet, "any"]))
    if sleep in ("early bird", "night owl"):
        q = q.filter(Listing.sleep_schedule.in_([sleep, "any"]))
    return [to_out(l) for l in q.order_by(Listing.created_at.desc()).all()]


@router.get("/mine", response_model=List[ListingOut])
def mine(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Listing).filter(Listing.owner_id == user.id).order_by(Listing.created_at.desc()).all()
    return [to_out(l) for l in rows]


@router.get("/{listing_id}", response_model=ListingOut)
def detail(listing_id: int, db: Session = Depends(get_db)):
    l = db.get(Listing, listing_id)
    if not l or not l.is_active:
        raise HTTPException(404, "Listing not found.")
    return to_out(l)


@router.post("", response_model=ListingOut, status_code=201)
def create(body: ListingIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    l = Listing(**body.model_dump(), owner_id=user.id)
    db.add(l)
    db.commit()
    db.refresh(l)
    return to_out(l)


@router.patch("/{listing_id}/toggle", response_model=ListingOut)
def toggle(listing_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    l = db.get(Listing, listing_id)
    if not l or l.owner_id != user.id:
        raise HTTPException(404, "Listing not found.")
    l.is_active = not l.is_active
    db.commit()
    db.refresh(l)
    return to_out(l)
