import os
from datetime import datetime
from bson import ObjectId
import httpx
from fastapi import APIRouter, HTTPException
from src.database import tournaments_collection
from src.schemas import TournamentCreate

USERS_SERVICE_URL = os.getenv("USERS_SERVICE_URL", "http://users-service:8001")
GAMES_SERVICE_URL = os.getenv("GAMES_SERVICE_URL", "http://players-games-service:8002")

router = APIRouter(prefix="/tournaments", tags=["Tournaments"])


@router.post("")
async def create_tournament(payload: TournamentCreate):
    async with httpx.AsyncClient(timeout=8.0) as client:
        user_res = await client.get(f"{USERS_SERVICE_URL}/users/{payload.organizer_id}")
        if user_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Organizer not found")
    data = payload.model_dump()
    data.update({"teams": [], "fixtures": [], "points_table": [], "created_at": datetime.utcnow()})
    result = await tournaments_collection().insert_one(data)
    data["id"] = str(result.inserted_id)
    return data


@router.post("/{tournament_id}/register-team")
async def register_team(tournament_id: str, team_name: str, captain_user_id: str):
    tournament = await tournaments_collection().find_one({"_id": ObjectId(tournament_id)})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    if len(tournament["teams"]) >= tournament["max_teams"]:
        raise HTTPException(status_code=400, detail="Team slots full")
    team = {"team_name": team_name, "captain_user_id": captain_user_id, "points": 0, "mvp": None}
    await tournaments_collection().update_one({"_id": ObjectId(tournament_id)}, {"$push": {"teams": team}})
    return {"message": "Team registered"}


@router.post("/{tournament_id}/generate-fixtures")
async def generate_fixtures(tournament_id: str):
    tournament = await tournaments_collection().find_one({"_id": ObjectId(tournament_id)})
    teams = tournament.get("teams", [])
    fixtures = []
    for i in range(0, len(teams), 2):
        if i + 1 < len(teams):
            fixtures.append({"home": teams[i]["team_name"], "away": teams[i + 1]["team_name"], "status": "scheduled"})
    await tournaments_collection().update_one({"_id": ObjectId(tournament_id)}, {"$set": {"fixtures": fixtures}})
    return {"fixtures": fixtures}


@router.get("")
async def list_tournaments():
    docs = await tournaments_collection().find({}).to_list(200)
    for doc in docs:
        doc["id"] = str(doc["_id"])
    return docs
