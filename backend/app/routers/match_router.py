from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas import MatchCreate, TossRequest, BallScoreRequest, ScorecardFullResponse
from app.crud import get_matches, get_match_by_id, create_match, process_toss, record_ball, get_full_scorecard
from app.models import Match, Innings, BallEvent, BattingScorecard, BowlingScorecard

router = APIRouter(prefix="/api/matches", tags=["Matches & Scoring"])

@router.get("")
def read_matches(status: Optional[str] = None, db: Session = Depends(get_db)):
    matches = get_matches(db, status=status)
    result = []
    for m in matches:
        scorecard = get_full_scorecard(db, m.id)
        result.append(scorecard)
    return result

@router.get("/{match_id}")
def read_match_detail(match_id: int, db: Session = Depends(get_db)):
    sc = get_full_scorecard(db, match_id)
    if not sc:
        raise HTTPException(status_code=404, detail="Match not found")
    return sc

@router.post("")
def add_match(match_in: MatchCreate, db: Session = Depends(get_db)):
    match = create_match(db, match_in)
    return get_full_scorecard(db, match.id)

@router.post("/{match_id}/toss")
def submit_toss(match_id: int, toss_req: TossRequest, db: Session = Depends(get_db)):
    match = process_toss(db, match_id, toss_req)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found or invalid status")
    return get_full_scorecard(db, match_id)

@router.post("/{match_id}/score-ball")
def score_ball(match_id: int, ball_req: BallScoreRequest, db: Session = Depends(get_db)):
    ball_evt = record_ball(db, match_id, ball_req)
    if not ball_evt:
        raise HTTPException(status_code=400, detail="Cannot score ball. Innings completed or match not live.")
    return {
        "status": "success",
        "ball_event_id": ball_evt.id,
        "scorecard": get_full_scorecard(db, match_id)
    }

@router.post("/{match_id}/undo-ball")
def undo_ball(match_id: int, db: Session = Depends(get_db)):
    match = get_match_by_id(db, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    curr_inn = db.query(Innings).filter(Innings.match_id == match_id, Innings.innings_number == match.current_innings_num).first()
    if not curr_inn:
        raise HTTPException(status_code=400, detail="No active innings")

    last_ball = db.query(BallEvent).filter(
        BallEvent.match_id == match_id,
        BallEvent.innings_id == curr_inn.id
    ).order_by(BallEvent.id.desc()).first()

    if not last_ball:
        raise HTTPException(status_code=400, detail="No balls to undo in current innings")

    # Revert innings runs, wickets, extras, balls
    is_legal = (not last_ball.is_extra) or (last_ball.extra_type not in ["WD", "NB"])
    total_runs = last_ball.runs_scored + last_ball.extra_runs

    curr_inn.total_runs = max(0, curr_inn.total_runs - total_runs)
    if last_ball.is_extra:
        curr_inn.extras = max(0, curr_inn.extras - last_ball.extra_runs)
    if last_ball.is_wicket:
        curr_inn.total_wickets = max(0, curr_inn.total_wickets - 1)
    if is_legal:
        curr_inn.total_legal_balls = max(0, curr_inn.total_legal_balls - 1)

    completed_overs = curr_inn.total_legal_balls // 6
    remaining_balls = curr_inn.total_legal_balls % 6
    curr_inn.total_overs = round(completed_overs + (remaining_balls * 0.1), 1)

    # Revert Batting Scorecard
    bat_sc = db.query(BattingScorecard).filter(
        BattingScorecard.match_id == match_id,
        BattingScorecard.innings_id == curr_inn.id,
        BattingScorecard.player_id == last_ball.batter_id
    ).first()

    if bat_sc:
        bat_sc.runs = max(0, bat_sc.runs - last_ball.runs_scored)
        if last_ball.extra_type not in ["WD"]:
            bat_sc.balls_faced = max(0, bat_sc.balls_faced - 1)
        if last_ball.runs_scored == 4 and not last_ball.is_extra:
            bat_sc.fours = max(0, bat_sc.fours - 1)
        elif last_ball.runs_scored == 6 and not last_ball.is_extra:
            bat_sc.sixes = max(0, bat_sc.sixes - 1)
        if last_ball.is_wicket and last_ball.dismissed_player_id == bat_sc.player_id:
            bat_sc.is_out = False
            bat_sc.dismissal_info = "not out"
        if bat_sc.balls_faced > 0:
            bat_sc.strike_rate = round((bat_sc.runs / bat_sc.balls_faced) * 100, 2)
        else:
            bat_sc.strike_rate = 0.0

    # Revert Bowling Scorecard
    bowl_sc = db.query(BowlingScorecard).filter(
        BowlingScorecard.match_id == match_id,
        BowlingScorecard.innings_id == curr_inn.id,
        BowlingScorecard.player_id == last_ball.bowler_id
    ).first()

    if bowl_sc:
        if is_legal:
            bowl_sc.legal_balls = max(0, bowl_sc.legal_balls - 1)
        bw_overs = bowl_sc.legal_balls // 6
        bw_rem = bowl_sc.legal_balls % 6
        bowl_sc.overs = round(bw_overs + (bw_rem * 0.1), 1)
        if last_ball.extra_type not in ["LB", "B"]:
            bowl_sc.runs_conceded = max(0, bowl_sc.runs_conceded - total_runs)
        if last_ball.is_wicket and last_ball.wicket_type not in ["Run Out"]:
            bowl_sc.wickets = max(0, bowl_sc.wickets - 1)
        t_overs = bowl_sc.legal_balls / 6.0
        bowl_sc.economy = round(bowl_sc.runs_conceded / t_overs, 2) if t_overs > 0 else 0.0

    # Delete ball event
    db.delete(last_ball)
    db.commit()

    return {
        "status": "success",
        "message": "Last ball undone successfully",
        "scorecard": get_full_scorecard(db, match_id)
    }

@router.get("/{match_id}/scorecard")
def get_scorecard(match_id: int, db: Session = Depends(get_db)):
    sc = get_full_scorecard(db, match_id)
    if not sc:
        raise HTTPException(status_code=404, detail="Match not found")
    return sc
