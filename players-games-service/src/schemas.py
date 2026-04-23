from pydantic import BaseModel


class GameCreate(BaseModel):
    title: str
    sport: str
    turf_id: str
    area: str
    type: str
    organizer_id: str
    max_players: int
    weekend: bool = False
