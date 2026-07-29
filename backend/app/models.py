from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user") # "admin" or "user"
    avatar_url = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    short_name = Column(String(10), nullable=False)
    logo_url = Column(String, nullable=True)
    captain_name = Column(String, nullable=True)
    coach = Column(String, nullable=True)
    home_ground = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    players = relationship("Player", back_populates="team", cascade="all, delete-orphan")

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    role = Column(String, default="All-Rounder") # Batsman, Bowler, All-Rounder, Wicketkeeper
    batting_style = Column(String, default="Right-hand Bat")
    bowling_style = Column(String, default="Right-arm Medium")
    avatar_url = Column(String, nullable=True)
    
    # Career summary
    matches_played = Column(Integer, default=0)
    total_runs = Column(Integer, default=0)
    total_wickets = Column(Integer, default=0)
    highest_score = Column(Integer, default=0)
    best_bowling = Column(String, default="0/0")
    fours_count = Column(Integer, default=0)
    sixes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="players")

class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    format = Column(String, default="T20") # T20, ODI, Test, Custom
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    banner_url = Column(String, nullable=True)
    status = Column(String, default="Upcoming") # Upcoming, Live, Completed
    winner_team_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    fixtures = relationship("Fixture", back_populates="tournament", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="tournament")

class Fixture(Base):
    __tablename__ = "fixtures"

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)
    team_a_name = Column(String, nullable=False)
    team_b_name = Column(String, nullable=False)
    stage = Column(String, default="Group Stage") # Group Stage, Semi-Final, Final
    scheduled_at = Column(String, nullable=True)
    match_id = Column(Integer, nullable=True)

    tournament = relationship("Tournament", back_populates="fixtures")

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    team_a_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    team_b_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=True)
    venue = Column(String, default="Cyber Sports Stadium")
    total_overs = Column(Integer, default=20)
    match_date = Column(String, nullable=True)
    status = Column(String, default="Scheduled") # Scheduled, Toss, Live, Innings_Break, Completed
    toss_winner_id = Column(Integer, nullable=True)
    toss_decision = Column(String, nullable=True) # Bat, Bowl
    current_innings_num = Column(Integer, default=1)
    winner_team_id = Column(Integer, nullable=True)
    player_of_match_id = Column(Integer, nullable=True)
    summary_result = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    team_a = relationship("Team", foreign_keys=[team_a_id])
    team_b = relationship("Team", foreign_keys=[team_b_id])
    tournament = relationship("Tournament", back_populates="matches")
    innings = relationship("Innings", back_populates="match", cascade="all, delete-orphan")
    ball_events = relationship("BallEvent", back_populates="match", cascade="all, delete-orphan")

class Innings(Base):
    __tablename__ = "innings"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    innings_number = Column(Integer, nullable=False) # 1 or 2
    batting_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    bowling_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    total_runs = Column(Integer, default=0)
    total_wickets = Column(Integer, default=0)
    total_overs = Column(Float, default=0.0) # e.g. 4.2
    total_legal_balls = Column(Integer, default=0)
    extras = Column(Integer, default=0)
    wides = Column(Integer, default=0)
    no_balls = Column(Integer, default=0)
    leg_byes = Column(Integer, default=0)
    byes = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)

    match = relationship("Match", back_populates="innings")
    batting_team = relationship("Team", foreign_keys=[batting_team_id])
    bowling_team = relationship("Team", foreign_keys=[bowling_team_id])

class BallEvent(Base):
    __tablename__ = "ball_events"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    innings_id = Column(Integer, ForeignKey("innings.id", ondelete="CASCADE"), nullable=False)
    over_num = Column(Integer, nullable=False) # 0-indexed over number
    ball_num = Column(Integer, nullable=False) # 1..6 legal ball number in over
    batter_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    bowler_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    runs_scored = Column(Integer, default=0)
    is_extra = Column(Boolean, default=False)
    extra_type = Column(String, default="NONE") # NONE, WD, NB, LB, B
    extra_runs = Column(Integer, default=0)
    is_wicket = Column(Boolean, default=False)
    wicket_type = Column(String, default="NONE") # NONE, Bowled, Caught, LBW, Run Out, Stumped, Hit Wicket
    dismissed_player_id = Column(Integer, nullable=True)
    commentary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    match = relationship("Match", back_populates="ball_events")
    batter = relationship("Player", foreign_keys=[batter_id])
    bowler = relationship("Player", foreign_keys=[bowler_id])

class BattingScorecard(Base):
    __tablename__ = "batting_scorecards"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    innings_id = Column(Integer, ForeignKey("innings.id", ondelete="CASCADE"), nullable=False)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    runs = Column(Integer, default=0)
    balls_faced = Column(Integer, default=0)
    fours = Column(Integer, default=0)
    sixes = Column(Integer, default=0)
    strike_rate = Column(Float, default=0.0)
    dismissal_info = Column(String, default="not out")
    is_out = Column(Boolean, default=False)
    batting_position = Column(Integer, default=1)

    player = relationship("Player")

class BowlingScorecard(Base):
    __tablename__ = "bowling_scorecards"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    innings_id = Column(Integer, ForeignKey("innings.id", ondelete="CASCADE"), nullable=False)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    overs = Column(Float, default=0.0)
    legal_balls = Column(Integer, default=0)
    maidens = Column(Integer, default=0)
    runs_conceded = Column(Integer, default=0)
    wickets = Column(Integer, default=0)
    economy = Column(Float, default=0.0)
    no_balls = Column(Integer, default=0)
    wides = Column(Integer, default=0)

    player = relationship("Player")
