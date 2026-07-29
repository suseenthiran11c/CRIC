from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import TournamentCreate, TournamentResponse
from app.crud import get_tournaments, create_tournament

router = APIRouter(prefix="/api/tournaments", tags=["Tournaments"])

@router.get("", response_model=List[TournamentResponse])
def read_tournaments(db: Session = Depends(get_db)):
    return get_tournaments(db)

@router.post("", response_model=TournamentResponse)
def add_tournament(t_in: TournamentCreate, db: Session = Depends(get_db)):
    return create_tournament(db, t_in)
