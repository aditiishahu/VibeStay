"""Loads demo accounts and sample listings. Safe to run more than once."""
from database import SessionLocal, Base, engine
from models import User, Listing, ContactRequest, Role, Gender
from auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()
PW = "VibeStay123!"


def get_or_create_user(name, email, role=Role.user):
    u = db.query(User).filter_by(email=email).first()
    if not u:
        u = User(name=name, email=email, role=role, password_hash=hash_password(PW))
        db.add(u)
        db.commit()
        db.refresh(u)
    return u


owner = get_or_create_user("Rohan Mehta", "owner@vibestay.demo")
seeker = get_or_create_user("Sneha Iyer", "seeker@vibestay.demo")
get_or_create_user("Admin", "admin@vibestay.demo", Role.admin)

if db.query(Listing).count() == 0:
    samples = [
        ("Sunny 2BHK, 1 bed free near Andheri station", "Mumbai", "Andheri East", 12000, "WiFi, Washing machine, Fridge", Gender.female, "veg", "early bird",
         "Calm flat with two working students. Quiet hours after 10 pm."),
        ("Budget PG bed near Powai campus", "Mumbai", "Powai", 8500, "WiFi, Meals, Laundry", Gender.male, "any", "any",
         "Twin sharing, 5 min walk to IIT gate. Meals included."),
        ("Studio share in Thane West", "Mumbai", "Thane West", 9500, "AC, WiFi, Balcony", Gender.any, "non-veg", "night owl",
         "Night-owl friendly. Cooking allowed, shared fridge."),
        ("Single room in Kothrud flat", "Pune", "Kothrud", 7000, "WiFi, Study desk, Geyser", Gender.any, "veg", "early bird",
         "Near MIT-WPU and Cummins College. Study-focused household."),
        ("Room in Viman Nagar 3BHK", "Pune", "Viman Nagar", 10500, "AC, WiFi, Parking", Gender.male, "any", "night owl",
         "Two flatmates, interns at nearby IT parks."),
    ]
    for t, city, loc, rent, am, g, diet, sleep, desc in samples:
        db.add(Listing(owner_id=owner.id, title=t, city=city, location=loc, rent=rent,
                       amenities=am, available_for=g, diet_preference=diet,
                       sleep_schedule=sleep, description=desc))
    db.commit()

first = db.query(Listing).first()
if first and not db.query(ContactRequest).first():
    db.add(ContactRequest(listing_id=first.id, requester_id=seeker.id,
                          message="Hi! I'm an MCA student, early riser, vegetarian. Is the room still open?"))
    db.commit()

db.close()
print("Demo data ready. Password for all demo accounts:", PW)
