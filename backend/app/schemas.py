from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    avatar_url: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Player Schemas
class PlayerBase(BaseModel):
    name: str
    team_id: Optional[int] = None
    role: str = "All-Rounder"
    batting_style: str = "Right-hand Bat"
    bowling_style: str = "Right-arm Medium"
    avatar_url: Optional[str] = None

class PlayerCreate(PlayerBase):
    pass

class PlayerResponse(PlayerBase):
    id: int
    matches_played: int
    total_runs: int
    total_wickets: int
    highest_score: int
    best_bowling: str
    fours_count: int
    sixes_count: int

    class Config:
        from_attributes = True

# Team Schemas
class TeamBase(BaseModel):
    name: str
    short_name: str
    logo_url: Optional[str] = None
    captain_name: Optional[str] = None
    coach: Optional[str] = None
    home_ground: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamResponse(TeamBase):
    id: int
    players: List[PlayerResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Match & Scoring Schemas
class MatchCreate(BaseModel):
    title: str
    team_a_id: int
    team_b_id: int
    tournament_id: Optional[int] = None
    venue: str = "Cyber Sports Stadium"
    total_overs: int = 20
    match_date: Optional[str] = None

class TossRequest(BaseModel):
    toss_winner_id: int
    toss_decision: str # "Bat" or "Bowl"

class BallScoreRequest(BaseModel):
    batter_id: int
    bowler_id: int
    runs_scored: int = 0
    is_extra: bool = False
    extra_type: str = "NONE" # NONE, WD, NB, LB, B
    extra_runs: int = 0
    is_wicket: bool = False
    wicket_type: str = "NONE" # NONE, Bowled, Caught, LBW, Run Out, Stumped, Hit Wicket
    dismissed_player_id: Optional[int] = None
    commentary: Optional[str] = None

class BallEventResponse(BaseModel):
    id: int
    match_id: int
    innings_id: int
    over_num: int
    ball_num: int
    batter_id: int
    bowler_id: int
    runs_scored: int
    is_extra: bool
    extra_type: str
    extra_runs: int
    is_wicket: bool
    wicket_type: str
    dismissed_player_id: Optional[int]
    commentary: Optional[str]

    class Config:
        from_attributes = True

class BattingScorecardResponse(BaseModel):
    id: int
    player_id: int
    player_name: Optional[str] = None
    runs: int
    balls_faced: int
    fours: int
    sixes: int
    strike_rate: float
    dismissal_info: str
    is_out: bool

    class Config:
        from_attributes = True

class BowlingScorecardResponse(BaseModel):
    id: int
    player_id: int
    player_name: Optional[str] = None
    overs: float
    maidens: int
    runs_conceded: int
    wickets: int
    economy: float

    class Config:
        from_attributes = True

class InningsScorecardResponse(BaseModel):
    id: int
    innings_number: int
    batting_team_name: str
    bowling_team_name: str
    total_runs: int
    total_wickets: int
    total_overs: float
    extras: int
    is_completed: bool
    batting: List[BattingScorecardResponse] = []
    bowling: List[BowlingScorecardResponse] = []

class ScorecardFullResponse(BaseModel):
    match_id: int
    title: str
    status: str
    summary_result: Optional[str] = None
    toss_winner_name: Optional[str] = None
    toss_decision: Optional[str] = None
    team_a_name: str
    team_b_name: str
    total_overs: int
    current_innings_num: int
    innings_1: Optional[InningsScorecardResponse] = None
    innings_2: Optional[InningsScorecardResponse] = None

# Tournament Schemas
class TournamentCreate(BaseModel):
    name: str
    format: str = "T20"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    banner_url: Optional[str] = None

class FixtureCreate(BaseModel):
    tournament_id: int
    team_a_name: str
    team_b_name: str
    stage: str = "Group Stage"
    scheduled_at: Optional[str] = None

class TournamentResponse(BaseModel):
    id: int
    name: str
    format: str
    start_date: Optional[str]
    end_date: Optional[str]
    banner_url: Optional[str]
    status: str
    winner_team_name: Optional[str]

    class Config:
        from_attributes = True
