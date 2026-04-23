from pydantic import BaseModel


class TournamentCreate(BaseModel):
    name: str
    sport: str
    organizer_id: str
    max_teams: int = 8
