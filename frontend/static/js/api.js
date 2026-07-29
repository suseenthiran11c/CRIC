/*
====================================================
 API CLIENT & FALLBACK DATA MANAGER
==================================================== */

// Automatically target port 8000 during local development (e.g. static server on port 3000),
// and use same-origin /api on production deployment (Vercel).
const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const API_BASE_URL = isLocalhost
  ? 'http://127.0.0.1:8000/api'
  : window.location.origin + '/api';

// In-Memory Stateful Mock Match for Offline Fallback Mode
let mockMatchState = {
  match_id: 1,
  title: "Grand Finals: Cyber Strikers vs Quantum Titans",
  status: "Live",
  summary_result: "Cyber Strikers batting first",
  toss_winner_name: "Cyber Strikers",
  toss_decision: "Bat",
  team_a_name: "Cyber Strikers",
  team_b_name: "Quantum Titans",
  total_overs: 20,
  current_innings_num: 1,
  innings_1: {
    id: 1,
    innings_number: 1,
    batting_team_name: "Cyber Strikers",
    bowling_team_name: "Quantum Titans",
    total_runs: 86,
    total_wickets: 2,
    total_overs: 9.4,
    total_legal_balls: 58,
    extras: 6,
    is_completed: false,
    batting: [
      { id: 1, player_id: 1, player_name: "Virat Ray", runs: 45, balls_faced: 28, fours: 4, sixes: 2, strike_rate: 160.71, is_out: false },
      { id: 2, player_id: 2, player_name: "Karan Cyber", runs: 18, balls_faced: 14, fours: 2, sixes: 0, strike_rate: 128.57, is_out: false }
    ],
    bowling: [
      { id: 1, player_id: 9, player_name: "Jasprit Matrix", overs: 2.4, maidens: 0, runs_conceded: 18, wickets: 1, economy: 6.75 }
    ]
  }
};

class ApiClient {
  static getToken() {
    return localStorage.getItem('scorehub_token');
  }

  static setToken(token) {
    localStorage.setItem('scorehub_token', token);
  }

  static removeToken() {
    localStorage.removeItem('scorehub_token');
  }

  static async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'API Error' }));
        throw new Error(errData.detail || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.warn(`[API Call Fallback Triggered] ${endpoint}: ${error.message}`);
      return this.handleFallback(endpoint, options);
    }
  }

  /* Client-Side Mock Data Engine if backend offline */
  static handleFallback(endpoint, options = {}) {
    // 1. Score ball fallback (handles 0, 1, 2, 3, 4, 6, WD, NB, Wicket)
    if (endpoint.includes('/score-ball') && options.body) {
      try {
        const payload = JSON.parse(options.body);
        const runs = payload.runs_scored || 0;
        const extraRuns = payload.extra_runs || (payload.is_extra ? 1 : 0);
        const isLegal = !payload.is_extra || !['WD', 'NB'].includes(payload.extra_type);

        const inn = mockMatchState.innings_1;
        inn.total_runs += (runs + extraRuns);

        if (payload.is_extra) {
          inn.extras += extraRuns;
        }

        if (payload.is_wicket) {
          inn.total_wickets += 1;
        }

        if (isLegal) {
          inn.total_legal_balls = (inn.total_legal_balls || 58) + 1;
          const overs = Math.floor(inn.total_legal_balls / 6);
          const balls = inn.total_legal_balls % 6;
          inn.total_overs = parseFloat(`${overs}.${balls}`);
        }

        // Update Recent Balls timeline
        if (!inn.recent_balls) inn.recent_balls = ["0", "4", "0", "6", "WD", "W"];
        let ballText = `${runs}`;
        if (payload.is_wicket) ballText = "W";
        else if (payload.is_extra) ballText = payload.extra_type || "EX";
        inn.recent_balls.push(ballText);
        if (inn.recent_balls.length > 6) inn.recent_balls.shift();

        // Update Active Batter
        if (inn.batting && inn.batting.length > 0) {
          const batter = inn.batting[0];
          batter.runs += runs;
          if (isLegal) batter.balls_faced += 1;
          if (runs === 4 && !payload.is_extra) batter.fours = (batter.fours || 0) + 1;
          if (runs === 6 && !payload.is_extra) batter.sixes = (batter.sixes || 0) + 1;
          if (batter.balls_faced > 0) {
            batter.strike_rate = parseFloat(((batter.runs / batter.balls_faced) * 100).toFixed(2));
          }
        }

        return { status: "success", scorecard: mockMatchState };
      } catch (e) {
        console.error("Error processing fallback score-ball:", e);
      }
    }

    // 2. Undo ball fallback
    if (endpoint.includes('/undo-ball')) {
      const inn = mockMatchState.innings_1;
      if (inn.total_runs > 0) inn.total_runs = Math.max(0, inn.total_runs - 1);
      if (inn.recent_balls && inn.recent_balls.length > 0) inn.recent_balls.pop();
      return { status: "success", scorecard: mockMatchState };
    }

    // 3. Single Match Detail
    if (endpoint.includes('/matches/1')) {
      return mockMatchState;
    }

    // 4. Matches List
    if (endpoint.includes('/matches')) {
      return [
        mockMatchState,
        {
          match_id: 2,
          title: "Semi-Final: Solar Knights vs Aero Velocity",
          status: "Completed",
          summary_result: "Solar Knights won by 6 wickets",
          team_a_name: "Solar Knights",
          team_b_name: "Aero Velocity",
          total_overs: 20,
          current_innings_num: 2
        }
      ];
    }

    // 5. Teams
    if (endpoint.includes('/teams')) {
      return [
        { id: 1, name: "Cyber Strikers", short_name: "CST", logo_url: "⚡", captain_name: "Virat Ray", coach: "Rick Cyber", home_ground: "Neon Dome", players: [] },
        { id: 2, name: "Quantum Titans", short_name: "QTI", logo_url: "🔮", captain_name: "Rohit Tech", coach: "Alex Matrix", home_ground: "Quantum Arena", players: [] },
        { id: 3, name: "Solar Knights", short_name: "SKN", logo_url: "☀️", captain_name: "Steve Flare", coach: "Marcus Sol", home_ground: "Solar Park", players: [] }
      ];
    }

    // 6. Stats
    if (endpoint.includes('/stats')) {
      return {
        orange_cap: [
          { id: 6, name: "Rohit Tech", total_runs: 1050, fours_count: 104, sixes_count: 48 },
          { id: 1, name: "Virat Ray", total_runs: 842, fours_count: 82, sixes_count: 36 }
        ],
        purple_cap: [
          { id: 9, name: "Jasprit Matrix", total_wickets: 46, best_bowling: "5/14" },
          { id: 4, name: "Bhuvi Laser", total_wickets: 38, best_bowling: "4/18" }
        ]
      };
    }

    return { status: "fallback_ok" };
  }
}
