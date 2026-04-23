from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from src.database import bookings_collection, venues_collection
from src.schemas import BookingCreate, VenueCreate

router = APIRouter(tags=["Venues"])


@router.post("/venues")
async def create_venue(payload: VenueCreate):
    data = payload.model_dump()
    data["rating"] = 0.0
    data["created_at"] = datetime.utcnow()
    result = await venues_collection().insert_one(data)
    data["id"] = str(result.inserted_id)
    return data


@router.get("/venues")
async def list_venues(sport: str | None = None, area: str | None = None):
    filters = {}
    if sport:
        filters["sport"] = {"$regex": sport, "$options": "i"}
    if area:
        filters["area"] = {"$regex": area, "$options": "i"}
    docs = await venues_collection().find(filters).to_list(300)
    for doc in docs:
        doc["id"] = str(doc["_id"])
    return docs


@router.get("/venues/{venue_id}")
async def get_venue(venue_id: str):
    doc = await venues_collection().find_one({"_id": ObjectId(venue_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Venue not found")
    doc["id"] = str(doc["_id"])
    return doc


@router.post("/bookings")
async def create_booking(payload: BookingCreate):
    venue = await venues_collection().find_one({"_id": ObjectId(payload.venue_id)})
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    existing = await bookings_collection().find_one({"venue_id": payload.venue_id, "slot": payload.slot})
    if existing:
        raise HTTPException(status_code=409, detail="Slot already booked")
    total_price = payload.hours * venue["price_per_hour"]
    booking = payload.model_dump()
    booking.update({"total_price": total_price, "status": "confirmed", "created_at": datetime.utcnow()})
    result = await bookings_collection().insert_one(booking)
    booking["id"] = str(result.inserted_id)
    return booking


@router.get("/bookings")
async def list_bookings(user_id: str | None = None):
    filters = {"user_id": user_id} if user_id else {}
    docs = await bookings_collection().find(filters).to_list(400)
    for doc in docs:
        doc["id"] = str(doc["_id"])
    return docs
