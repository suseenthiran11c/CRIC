from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import TeamCreate, TeamResponse
from app.crud import get_teams, get_team_by_id, create_team

router = APIRouter(prefix="/api/teams", tags=["Teams"])

@router.get("", response_model=List[TeamResponse])
def read_teams(db: Session = Depends(get_db)):
    return get_teams(db)

@router.get("/{team_id}", response_model=TeamResponse)
def read_team(team_id: int, db: Session = Depends(get_db)):
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.post("", response_model=TeamResponse)
def add_team(team_in: TeamCreate, db: Session = Depends(get_db)):
    return create_team(db, team_in)
