from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import get_leaderboards

router = APIRouter(prefix="/api/stats", tags=["Statistics & Leaderboards"])

@router.get("")
def read_leaderboards(db: Session = Depends(get_db)):
    return get_leaderboards(db)
