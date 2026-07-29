from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.models import User, Team, Player, Match, Innings, BallEvent, BattingScorecard, BowlingScorecard, Tournament, Fixture
from app.schemas import UserCreate, TeamCreate, PlayerCreate, MatchCreate, TossRequest, BallScoreRequest, TournamentCreate
from app.auth import hash_password

# --- USER CRUD ---
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, role: str = "user"):
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        avatar_url=user.avatar_url,
        phone=user.phone,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- TEAM CRUD ---
def get_teams(db: Session):
    return db.query(Team).all()

def get_team_by_id(db: Session, team_id: int):
    return db.query(Team).filter(Team.id == team_id).first()

def create_team(db: Session, team: TeamCreate):
    db_team = Team(
        name=team.name,
        short_name=team.short_name,
        logo_url=team.logo_url,
        captain_name=team.captain_name,
        coach=team.coach,
        home_ground=team.home_ground
    )
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

# --- PLAYER CRUD ---
def get_players(db: Session, team_id: int = None):
    query = db.query(Player)
    if team_id:
        query = query.filter(Player.team_id == team_id)
    return query.all()

def get_player_by_id(db: Session, player_id: int):
    return db.query(Player).filter(Player.id == player_id).first()

def create_player(db: Session, player: PlayerCreate):
    db_player = Player(
        name=player.name,
        team_id=player.team_id,
        role=player.role,
        batting_style=player.batting_style,
        bowling_style=player.bowling_style,
        avatar_url=player.avatar_url
    )
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

# --- MATCH & SCORING CRUD ---
def get_matches(db: Session, status: str = None):
    query = db.query(Match)
    if status:
        query = query.filter(Match.status == status)
    return query.order_by(desc(Match.id)).all()

def get_match_by_id(db: Session, match_id: int):
    return db.query(Match).filter(Match.id == match_id).first()

def create_match(db: Session, match_in: MatchCreate):
    db_match = Match(
        title=match_in.title,
        team_a_id=match_in.team_a_id,
        team_b_id=match_in.team_b_id,
        tournament_id=match_in.tournament_id,
        venue=match_in.venue,
        total_overs=match_in.total_overs,
        match_date=match_in.match_date or "Today",
        status="Toss" # Proceeds to Toss screen
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

def process_toss(db: Session, match_id: int, toss_req: TossRequest):
    match = get_match_by_id(db, match_id)
    if not match:
        return None
    match.toss_winner_id = toss_req.toss_winner_id
    match.toss_decision = toss_req.toss_decision
    match.status = "Live"
    
    # Determine who bats first
    if toss_req.toss_decision == "Bat":
        batting_team_id = toss_req.toss_winner_id
        bowling_team_id = match.team_b_id if toss_req.toss_winner_id == match.team_a_id else match.team_a_id
    else:
        bowling_team_id = toss_req.toss_winner_id
        batting_team_id = match.team_b_id if toss_req.toss_winner_id == match.team_a_id else match.team_a_id

    # Create 1st Innings if not exists
    existing_innings = db.query(Innings).filter(Innings.match_id == match_id, Innings.innings_number == 1).first()
    if not existing_innings:
        innings_1 = Innings(
            match_id=match_id,
            innings_number=1,
            batting_team_id=batting_team_id,
            bowling_team_id=bowling_team_id,
            total_runs=0,
            total_wickets=0,
            total_overs=0.0,
            total_legal_balls=0,
            is_completed=False
        )
        db.add(innings_1)
    
    match.current_innings_num = 1
    db.commit()
    db.refresh(match)
    return match

def record_ball(db: Session, match_id: int, ball_req: BallScoreRequest):
    match = get_match_by_id(db, match_id)
    if not match or match.status != "Live":
        return None

    # Get active innings
    curr_innings = db.query(Innings).filter(
        Innings.match_id == match_id,
        Innings.innings_number == match.current_innings_num
    ).first()

    if not curr_innings or curr_innings.is_completed:
        return None

    # Determine legal ball
    is_legal = True
    extra_runs = ball_req.extra_runs
    if ball_req.is_extra:
        if ball_req.extra_type in ["WD", "NB"]:
            is_legal = False
            if extra_runs == 0:
                extra_runs = 1

    if is_legal:
        curr_innings.total_legal_balls += 1
    
    # Calculate ball and over number
    legal_balls = curr_innings.total_legal_balls
    over_num = (legal_balls - 1) // 6 if legal_balls > 0 else 0
    ball_in_over = ((legal_balls - 1) % 6) + 1 if is_legal else (legal_balls % 6)

    # Total runs for this ball = runs_scored by batter + extra_runs
    runs_this_ball = ball_req.runs_scored + extra_runs
    curr_innings.total_runs += runs_this_ball

    if ball_req.is_extra:
        curr_innings.extras += extra_runs
        if ball_req.extra_type == "WD":
            curr_innings.wides += extra_runs
        elif ball_req.extra_type == "NB":
            curr_innings.no_balls += extra_runs
        elif ball_req.extra_type == "LB":
            curr_innings.leg_byes += extra_runs
        elif ball_req.extra_type == "B":
            curr_innings.byes += extra_runs

    if ball_req.is_wicket:
        curr_innings.total_wickets += 1

    # Over string e.g. 4.2
    completed_overs = curr_innings.total_legal_balls // 6
    remaining_balls = curr_innings.total_legal_balls % 6
    curr_innings.total_overs = round(completed_overs + (remaining_balls * 0.1), 1)

    # Create Ball Event
    ball_event = BallEvent(
        match_id=match_id,
        innings_id=curr_innings.id,
        over_num=over_num,
        ball_num=ball_in_over,
        batter_id=ball_req.batter_id,
        bowler_id=ball_req.bowler_id,
        runs_scored=ball_req.runs_scored,
        is_extra=ball_req.is_extra,
        extra_type=ball_req.extra_type,
        extra_runs=extra_runs,
        is_wicket=ball_req.is_wicket,
        wicket_type=ball_req.wicket_type,
        dismissed_player_id=ball_req.dismissed_player_id or (ball_req.batter_id if ball_req.is_wicket else None),
        commentary=ball_req.commentary or f"Over {completed_overs}.{remaining_balls}: {ball_req.runs_scored} runs"
    )
    db.add(ball_event)

    # Update Batting Scorecard for Batter
    bat_sc = db.query(BattingScorecard).filter(
        BattingScorecard.match_id == match_id,
        BattingScorecard.innings_id == curr_innings.id,
        BattingScorecard.player_id == ball_req.batter_id
    ).first()

    if not bat_sc:
        bat_sc = BattingScorecard(
            match_id=match_id,
            innings_id=curr_innings.id,
            player_id=ball_req.batter_id,
            runs=0,
            balls_faced=0,
            fours=0,
            sixes=0,
            strike_rate=0.0
        )
        db.add(bat_sc)

    if ball_req.extra_type not in ["WD"]:
        bat_sc.balls_faced += 1
    bat_sc.runs += ball_req.runs_scored
    if ball_req.runs_scored == 4 and not ball_req.is_extra:
        bat_sc.fours += 1
    elif ball_req.runs_scored == 6 and not ball_req.is_extra:
        bat_sc.sixes += 1
    if bat_sc.balls_faced > 0:
        bat_sc.strike_rate = round((bat_sc.runs / bat_sc.balls_faced) * 100, 2)
    
    if ball_req.is_wicket and (ball_req.dismissed_player_id == ball_req.batter_id or not ball_req.dismissed_player_id):
        bat_sc.is_out = True
        bat_sc.dismissal_info = f"{ball_req.wicket_type}"

    # Update Bowling Scorecard for Bowler
    bowl_sc = db.query(BowlingScorecard).filter(
        BowlingScorecard.match_id == match_id,
        BowlingScorecard.innings_id == curr_innings.id,
        BowlingScorecard.player_id == ball_req.bowler_id
    ).first()

    if not bowl_sc:
        bowl_sc = BowlingScorecard(
            match_id=match_id,
            innings_id=curr_innings.id,
            player_id=ball_req.bowler_id,
            overs=0.0,
            legal_balls=0,
            maidens=0,
            runs_conceded=0,
            wickets=0,
            economy=0.0
        )
        db.add(bowl_sc)

    if is_legal:
        bowl_sc.legal_balls += 1
    
    bowler_overs_comp = bowl_sc.legal_balls // 6
    bowler_balls_rem = bowl_sc.legal_balls % 6
    bowl_sc.overs = round(bowler_overs_comp + (bowler_balls_rem * 0.1), 1)

    # Runs conceded by bowler (excludes BYE and LEG BYE)
    if ball_req.extra_type not in ["LB", "B"]:
        bowl_sc.runs_conceded += (ball_req.runs_scored + extra_runs)

    if ball_req.is_wicket and ball_req.wicket_type not in ["Run Out"]:
        bowl_sc.wickets += 1

    total_bowler_overs = bowl_sc.legal_balls / 6.0
    if total_bowler_overs > 0:
        bowl_sc.economy = round(bowl_sc.runs_conceded / total_bowler_overs, 2)

    # Update player stats in career DB
    player_bat = db.query(Player).filter(Player.id == ball_req.batter_id).first()
    if player_bat:
        player_bat.total_runs += ball_req.runs_scored
        if ball_req.runs_scored == 4 and not ball_req.is_extra:
            player_bat.fours_count += 1
        elif ball_req.runs_scored == 6 and not ball_req.is_extra:
            player_bat.sixes_count += 1
        if bat_sc.runs > player_bat.highest_score:
            player_bat.highest_score = bat_sc.runs

    player_bowl = db.query(Player).filter(Player.id == ball_req.bowler_id).first()
    if player_bowl and ball_req.is_wicket and ball_req.wicket_type not in ["Run Out"]:
        player_bowl.total_wickets += 1

    # Check Innings Completion Condition (Target reached, 10 wickets lost, or overs completed)
    overs_limit = match.total_overs
    innings_over = (curr_innings.total_legal_balls >= overs_limit * 6) or (curr_innings.total_wickets >= 10)

    # If Innings 2, check if target is chased
    if match.current_innings_num == 2:
        inn1 = db.query(Innings).filter(Innings.match_id == match_id, Innings.innings_number == 1).first()
        if inn1 and curr_innings.total_runs > inn1.total_runs:
            innings_over = True

    if innings_over:
        curr_innings.is_completed = True
        if match.current_innings_num == 1:
            # Transition to Innings 2
            match.current_innings_num = 2
            match.status = "Innings_Break"
            
            # Setup 2nd Innings
            inn2 = Innings(
                match_id=match_id,
                innings_number=2,
                batting_team_id=curr_innings.bowling_team_id,
                bowling_team_id=curr_innings.batting_team_id,
                total_runs=0,
                total_wickets=0,
                total_overs=0.0,
                total_legal_balls=0,
                is_completed=False
            )
            db.add(inn2)
        else:
            # Match Complete!
            match.status = "Completed"
            inn1 = db.query(Innings).filter(Innings.match_id == match_id, Innings.innings_number == 1).first()
            team_bat_1 = db.query(Team).filter(Team.id == inn1.batting_team_id).first()
            team_bat_2 = db.query(Team).filter(Team.id == curr_innings.batting_team_id).first()
            
            if curr_innings.total_runs > inn1.total_runs:
                wickets_left = 10 - curr_innings.total_wickets
                match.winner_team_id = curr_innings.batting_team_id
                match.summary_result = f"{team_bat_2.name if team_bat_2 else 'Team B'} won by {wickets_left} wickets"
            elif inn1.total_runs > curr_innings.total_runs:
                margin = inn1.total_runs - curr_innings.total_runs
                match.winner_team_id = inn1.batting_team_id
                match.summary_result = f"{team_bat_1.name if team_bat_1 else 'Team A'} won by {margin} runs"
            else:
                match.summary_result = "Match Tied!"

    db.commit()
    db.refresh(match)
    return ball_event

def get_full_scorecard(db: Session, match_id: int):
    match = get_match_by_id(db, match_id)
    if not match:
        return None

    inn1 = db.query(Innings).filter(Innings.match_id == match_id, Innings.innings_number == 1).first()
    inn2 = db.query(Innings).filter(Innings.match_id == match_id, Innings.innings_number == 2).first()

    def build_inn_resp(inn: Innings):
        if not inn:
            return None
        bat_scs = db.query(BattingScorecard).filter(BattingScorecard.innings_id == inn.id).all()
        bowl_scs = db.query(BowlingScorecard).filter(BowlingScorecard.innings_id == inn.id).all()
        
        bat_list = []
        for b in bat_scs:
            p = get_player_by_id(db, b.player_id)
            bat_list.append({
                "id": b.id,
                "player_id": b.player_id,
                "player_name": p.name if p else f"Player #{b.player_id}",
                "runs": b.runs,
                "balls_faced": b.balls_faced,
                "fours": b.fours,
                "sixes": b.sixes,
                "strike_rate": b.strike_rate,
                "dismissal_info": b.dismissal_info,
                "is_out": b.is_out
            })

        bowl_list = []
        for bw in bowl_scs:
            p = get_player_by_id(db, bw.player_id)
            bowl_list.append({
                "id": bw.id,
                "player_id": bw.player_id,
                "player_name": p.name if p else f"Player #{bw.player_id}",
                "overs": bw.overs,
                "maidens": bw.maidens,
                "runs_conceded": bw.runs_conceded,
                "wickets": bw.wickets,
                "economy": bw.economy
            })

        bat_team = get_team_by_id(db, inn.batting_team_id)
        bowl_team = get_team_by_id(db, inn.bowling_team_id)

        return {
            "id": inn.id,
            "innings_number": inn.innings_number,
            "batting_team_name": bat_team.name if bat_team else "Team A",
            "bowling_team_name": bowl_team.name if bowl_team else "Team B",
            "total_runs": inn.total_runs,
            "total_wickets": inn.total_wickets,
            "total_overs": inn.total_overs,
            "extras": inn.extras,
            "is_completed": inn.is_completed,
            "batting": bat_list,
            "bowling": bowl_list
        }

    team_a = get_team_by_id(db, match.team_a_id)
    team_b = get_team_by_id(db, match.team_b_id)
    toss_winner = get_team_by_id(db, match.toss_winner_id) if match.toss_winner_id else None

    return {
        "match_id": match.id,
        "title": match.title,
        "status": match.status,
        "summary_result": match.summary_result,
        "toss_winner_name": toss_winner.name if toss_winner else None,
        "toss_decision": match.toss_decision,
        "team_a_name": team_a.name if team_a else "Team A",
        "team_b_name": team_b.name if team_b else "Team B",
        "total_overs": match.total_overs,
        "current_innings_num": match.current_innings_num,
        "innings_1": build_inn_resp(inn1),
        "innings_2": build_inn_resp(inn2)
    }

# --- STATS CRUD ---
def get_leaderboards(db: Session):
    orange_cap = db.query(Player).order_by(desc(Player.total_runs)).limit(5).all()
    purple_cap = db.query(Player).order_by(desc(Player.total_wickets)).limit(5).all()
    most_sixes = db.query(Player).order_by(desc(Player.sixes_count)).limit(5).all()
    most_fours = db.query(Player).order_by(desc(Player.fours_count)).limit(5).all()

    return {
        "orange_cap": orange_cap,
        "purple_cap": purple_cap,
        "most_sixes": most_sixes,
        "most_fours": most_fours
    }

# --- TOURNAMENT CRUD ---
def get_tournaments(db: Session):
    return db.query(Tournament).all()

def create_tournament(db: Session, t_in: TournamentCreate):
    db_t = Tournament(
        name=t_in.name,
        format=t_in.format,
        start_date=t_in.start_date,
        end_date=t_in.end_date,
        banner_url=t_in.banner_url,
        status="Upcoming"
    )
    db.add(db_t)
    db.commit()
    db.refresh(db_t)
    return db_t
