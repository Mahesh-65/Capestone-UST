from pydantic import BaseModel


class VenueCreate(BaseModel):
    name: str
    sport: str
    area: str
    price_per_hour: float
    amenities: list[str] = []


class BookingCreate(BaseModel):
    venue_id: str
    user_id: str
    slot: str
    hours: int = 1
