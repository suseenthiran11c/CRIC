from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas import PlayerCreate, PlayerResponse
from app.crud import get_players, get_player_by_id, create_player

router = APIRouter(prefix="/api/players", tags=["Players"])

@router.get("", response_model=List[PlayerResponse])
def read_players(team_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_players(db, team_id=team_id)

@router.get("/{player_id}", response_model=PlayerResponse)
def read_player(player_id: int, db: Session = Depends(get_db)):
    player = get_player_by_id(db, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.post("", response_model=PlayerResponse)
def add_player(player_in: PlayerCreate, db: Session = Depends(get_db)):
    return create_player(db, player_in)
