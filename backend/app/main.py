import sys
import os

# Add directory paths to sys.path so app can be launched from any directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    # pyrefly: ignore [missing-import]
    from app.database import engine, Base, SessionLocal
    # pyrefly: ignore [missing-import]
    from app.routers import auth_router, team_router, player_router, match_router, tournament_router, stats_router, admin_router
    # pyrefly: ignore [missing-import]
    from app.models import User, Team, Player, Match, Innings, Tournament, Fixture
    # pyrefly: ignore [missing-import]
    from app.auth import hash_password
except ImportError:
    # pyrefly: ignore [missing-import]
    from database import engine, Base, SessionLocal
    # pyrefly: ignore [missing-import]
    from routers import auth_router, team_router, player_router, match_router, tournament_router, stats_router, admin_router
    # pyrefly: ignore [missing-import]
    from models import User, Team, Player, Match, Innings, Tournament, Fixture
    # pyrefly: ignore [missing-import]
    from auth import hash_password

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cricket ScoreHub - Cyber Sports AI API",
    description="Production-grade Cricket Scoring & Tournament Management Platform",
    version="1.0.0"
)

# Enable CORS for frontend integration
# In production, Vercel serves the frontend on the same domain so wildcard is fine.
# To lock it down, set ALLOWED_ORIGINS env var: "https://your-app.vercel.app"
import os as _os
_raw_origins = _os.getenv("ALLOWED_ORIGINS", "*")
_allowed_origins = [o.strip() for o in _raw_origins.split(",")] if _raw_origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router.router)
app.include_router(team_router.router)
app.include_router(player_router.router)
app.include_router(match_router.router)
app.include_router(tournament_router.router)
app.include_router(stats_router.router)
app.include_router(admin_router.router)

# Automatic Seed Data Function on Startup
@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    try:
        # Check if users exist
        if db.query(User).count() == 0:
            print("[INFO] Seeding initial demo data for Cricket ScoreHub...")
            # Admin User & Demo User
            admin = User(
                username="admin",
                email="admin@scorehub.ai",
                hashed_password=hash_password("admin123"),
                role="admin",
                phone="+1 800 555 0199",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            )
            demo = User(
                username="demouser",
                email="demo@scorehub.ai",
                hashed_password=hash_password("demo123"),
                role="user",
                phone="+1 800 555 0122",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
            )
            db.add_all([admin, demo])
            db.commit()

            # Seed Teams
            t1 = Team(name="Cyber Strikers", short_name="CST", captain_name="Virat Ray", coach="Rick Cyber", home_ground="Neon Dome Stadium", logo_url="CST")
            t2 = Team(name="Quantum Titans", short_name="QTI", captain_name="Rohit Tech", coach="Alex Matrix", home_ground="Quantum Arena", logo_url="QTI")
            t3 = Team(name="Solar Knights", short_name="SKN", captain_name="Steve Flare", coach="Marcus Sol", home_ground="Solar Park", logo_url="SKN")
            t4 = Team(name="Aero Velocity", short_name="AVE", captain_name="David Jet", coach="Chris Wind", home_ground="Aero Circuit", logo_url="AVE")
            db.add_all([t1, t2, t3, t4])
            db.commit()

            # Seed Players for Team 1 & Team 2
            cst_players = [
                Player(name="Virat Ray", team_id=t1.id, role="Batsman", batting_style="Right-hand Bat", bowling_style="Right-arm Medium", matches_played=18, total_runs=842, total_wickets=2, highest_score=114, fours_count=82, sixes_count=36),
                Player(name="Karan Cyber", team_id=t1.id, role="Wicketkeeper", batting_style="Right-hand Bat", bowling_style="None", matches_played=15, total_runs=520, total_wickets=0, highest_score=89, fours_count=48, sixes_count=18),
                Player(name="Rohan Pulse", team_id=t1.id, role="All-Rounder", batting_style="Left-hand Bat", bowling_style="Right-arm Off-Spin", matches_played=20, total_runs=410, total_wickets=24, highest_score=67, fours_count=34, sixes_count=14),
                Player(name="Bhuvi Laser", team_id=t1.id, role="Bowler", batting_style="Right-hand Bat", bowling_style="Right-arm Fast", matches_played=22, total_runs=95, total_wickets=38, highest_score=24, fours_count=6, sixes_count=2, best_bowling="4/18"),
                Player(name="Zack Neon", team_id=t1.id, role="Bowler", batting_style="Left-hand Bat", bowling_style="Left-arm Leg-Spin", matches_played=14, total_runs=42, total_wickets=21, highest_score=15, fours_count=3, sixes_count=1, best_bowling="3/12")
            ]
            qti_players = [
                Player(name="Rohit Tech", team_id=t2.id, role="Batsman", batting_style="Right-hand Bat", bowling_style="Right-arm Off-Spin", matches_played=25, total_runs=1050, total_wickets=5, highest_score=142, fours_count=104, sixes_count=48),
                Player(name="Dev Volt", team_id=t2.id, role="Batsman", batting_style="Left-hand Bat", bowling_style="None", matches_played=12, total_runs=410, total_wickets=0, highest_score=78, fours_count=40, sixes_count=15),
                Player(name="Hardik Quantum", team_id=t2.id, role="All-Rounder", batting_style="Right-hand Bat", bowling_style="Right-arm Fast-Medium", matches_played=19, total_runs=610, total_wickets=28, highest_score=84, fours_count=52, sixes_count=29),
                Player(name="Jasprit Matrix", team_id=t2.id, role="Bowler", batting_style="Right-hand Bat", bowling_style="Right-arm Fast", matches_played=24, total_runs=60, total_wickets=46, highest_score=18, fours_count=4, sixes_count=1, best_bowling="5/14"),
                Player(name="Yuzi Glitch", team_id=t2.id, role="Bowler", batting_style="Right-hand Bat", bowling_style="Right-arm Leg-Spin", matches_played=16, total_runs=30, total_wickets=27, highest_score=10, fours_count=1, sixes_count=0, best_bowling="4/22")
            ]
            db.add_all(cst_players + qti_players)
            db.commit()

            # Seed Tournament
            tourn = Tournament(name="Cyber Premier League 2026", format="T20", start_date="2026-07-01", end_date="2026-08-15", status="Live")
            db.add(tourn)
            db.commit()

            # Seed Matches
            m1 = Match(
                title="Grand Finals: Cyber Strikers vs Quantum Titans",
                team_a_id=t1.id,
                team_b_id=t2.id,
                tournament_id=tourn.id,
                venue="Neon Dome Stadium, Cyber City",
                total_overs=20,
                status="Live",
                toss_winner_id=t1.id,
                toss_decision="Bat",
                current_innings_num=1
            )
            m2 = Match(
                title="Match #14: Solar Knights vs Aero Velocity",
                team_a_id=t3.id,
                team_b_id=t4.id,
                tournament_id=tourn.id,
                venue="Solar Park Arena",
                total_overs=20,
                status="Completed",
                toss_winner_id=t3.id,
                toss_decision="Bowl",
                winner_team_id=t3.id,
                summary_result="Solar Knights won by 6 wickets"
            )
            db.add_all([m1, m2])
            db.commit()

            # Seed 1st Innings for m1
            inn1 = Innings(
                match_id=m1.id,
                innings_number=1,
                batting_team_id=t1.id,
                bowling_team_id=t2.id,
                total_runs=86,
                total_wickets=2,
                total_overs=9.4,
                total_legal_balls=58,
                extras=6,
                wides=4,
                no_balls=2,
                is_completed=False
            )
            db.add(inn1)
            db.commit()

            print("[INFO] Database seeding completed successfully!")
    except Exception as e:
        print(f"[WARNING] Error during startup database seed: {e}")
    finally:
        db.close()

# NOTE: Static files (frontend) are served by Vercel CDN directly.
# FastAPI only handles /api/* routes in the serverless function.

@app.get("/api/health")
def health_check():
    db_type = "postgresql" if os.getenv("DATABASE_URL") else "sqlite (local dev)"
    return {
        "status": "online",
        "system": "Cricket ScoreHub Cyber-Sports Engine v1.0",
        "database": db_type
    }
