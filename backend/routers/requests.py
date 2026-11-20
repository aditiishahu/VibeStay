from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import ContactRequest, Listing, User, Status
from schemas import RequestIn, RequestStatusIn, RequestOut
from auth import get_current_user

router = APIRouter(prefix="/requests", tags=["Requests"])


def to_out(r: ContactRequest, viewer_is_requester: bool) -> RequestOut:
    contact = None
    if r.status == Status.accepted:
        # requester sees owner's email; owner sees requester's email
        contact = r.listing.owner.email if viewer_is_requester else r.requester.email
    return RequestOut(
        id=r.id, listing_id=r.listing_id, listing_title=r.listing.title,
        requester_id=r.requester_id, requester_name=r.requester.name,
        message=r.message or "", status=r.status.value,
        created_at=r.created_at, contact_email=contact,
    )


@router.post("", response_model=RequestOut, status_code=201)
def send(body: RequestIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    l = db.get(Listing, body.listing_id)
    if not l or not l.is_active:
        raise HTTPException(404, "Listing not found.")
    if l.owner_id == user.id:
        raise HTTPException(400, "You cannot request your own listing.")
    exists = db.query(ContactRequest).filter_by(listing_id=l.id, requester_id=user.id).first()
    if exists:
        raise HTTPException(409, "You already sent a request for this listing.")
    r = ContactRequest(listing_id=l.id, requester_id=user.id, message=body.message.strip())
    db.add(r)
    db.commit()
    db.refresh(r)
    return to_out(r, True)


@router.get("/sent", response_model=List[RequestOut])
def sent(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(ContactRequest).filter_by(requester_id=user.id).order_by(ContactRequest.created_at.desc()).all()
    return [to_out(r, True) for r in rows]


@router.get("/received", response_model=List[RequestOut])
def received(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(ContactRequest).join(Listing)
        .filter(Listing.owner_id == user.id)
        .order_by(ContactRequest.created_at.desc()).all()
    )
    return [to_out(r, False) for r in rows]


@router.patch("/{request_id}", response_model=RequestOut)
def decide(request_id: int, body: RequestStatusIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = db.get(ContactRequest, request_id)
    if not r or r.listing.owner_id != user.id:
        raise HTTPException(404, "Request not found.")
    r.status = Status(body.status)
    db.commit()
    db.refresh(r)
    return to_out(r, False)
