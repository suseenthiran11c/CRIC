from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Team, Player, Match, Tournament

router = APIRouter(prefix="/api/admin", tags=["Admin Panel"])

@router.get("/summary")
def get_admin_summary(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_teams = db.query(Team).count()
    total_players = db.query(Player).count()
    total_matches = db.query(Match).count()
    live_matches = db.query(Match).filter(Match.status == "Live").count()
    completed_matches = db.query(Match).filter(Match.status == "Completed").count()
    total_tournaments = db.query(Tournament).count()

    return {
        "total_users": total_users,
        "total_teams": total_teams,
        "total_players": total_players,
        "total_matches": total_matches,
        "live_matches": live_matches,
        "completed_matches": completed_matches,
        "total_tournaments": total_tournaments
    }
