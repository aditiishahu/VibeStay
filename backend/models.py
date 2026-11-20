import enum
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Enum, ForeignKey,
    UniqueConstraint, func,
)
from sqlalchemy.orm import relationship
from database import Base


class Role(str, enum.Enum):
    user = "user"
    admin = "admin"


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    any = "any"


class Status(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(Role), default=Role.user, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    listings = relationship("Listing", back_populates="owner")
    requests = relationship("ContactRequest", back_populates="requester")


class Listing(Base):
    __tablename__ = "listings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    city = Column(String(100), nullable=False, index=True)
    location = Column(String(200), nullable=False)
    rent = Column(Integer, nullable=False)
    amenities = Column(String(500), default="")
    available_for = Column(Enum(Gender), default=Gender.any, nullable=False)
    diet_preference = Column(String(30), default="any")      # veg / non-veg / any
    sleep_schedule = Column(String(30), default="any")       # early bird / night owl / any
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    owner = relationship("User", back_populates="listings")
    requests = relationship("ContactRequest", back_populates="listing")


class ContactRequest(Base):
    __tablename__ = "contact_requests"
    __table_args__ = (UniqueConstraint("listing_id", "requester_id", name="uq_listing_requester"),)
    id = Column(Integer, primary_key=True, autoincrement=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, default="")
    status = Column(Enum(Status), default=Status.pending, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    listing = relationship("Listing", back_populates="requests")
    requester = relationship("User", back_populates="requests")
