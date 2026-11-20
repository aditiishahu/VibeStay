from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ListingIn(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = ""
    city: str = Field(min_length=2, max_length=100)
    location: str = Field(min_length=2, max_length=200)
    rent: int = Field(gt=0)
    amenities: str = ""
    available_for: Literal["male", "female", "any"] = "any"
    diet_preference: Literal["veg", "non-veg", "any"] = "any"
    sleep_schedule: Literal["early bird", "night owl", "any"] = "any"


class ListingOut(ListingIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    owner_id: int
    owner_name: str = ""
    is_active: bool
    created_at: Optional[datetime] = None


class RequestIn(BaseModel):
    listing_id: int
    message: str = Field(default="", max_length=1000)


class RequestStatusIn(BaseModel):
    status: Literal["accepted", "rejected"]


class RequestOut(BaseModel):
    id: int
    listing_id: int
    listing_title: str
    requester_id: int
    requester_name: str
    message: str
    status: str
    created_at: Optional[datetime] = None
    # Contact details are revealed only after the owner accepts.
    contact_email: Optional[str] = None
