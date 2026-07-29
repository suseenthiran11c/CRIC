/* ====================================================
   API CLIENT & FALLBACK DATA MANAGER
   ==================================================== */

const API_BASE_URL = window.location.origin.includes('http') 
  ? window.location.origin + '/api' 
  : 'http://127.0.0.1:8000/api';

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
  static handleFallback(endpoint, options) {
    if (endpoint.includes('/matches')) {
      return [
        {
          match_id: 1,
          title: "Grand Finals: Cyber Strikers vs Quantum Titans",
          status: "Live",
          summary_result: "Cyber Strikers lead by 86 runs",
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
            total_runs: 142,
            total_wickets: 3,
            total_overs: 15.2,
            extras: 8,
            is_completed: false,
            batting: [
              { id: 1, player_id: 1, player_name: "Virat Ray", runs: 68, balls_faced: 42, fours: 7, sixes: 3, strike_rate: 161.9, dismissal_info: "c Jasprit b Hardik", is_out: true },
              { id: 2, player_id: 2, player_name: "Karan Cyber", runs: 45, balls_faced: 31, fours: 5, sixes: 1, strike_rate: 145.16, dismissal_info: "not out", is_out: false },
              { id: 3, player_id: 3, player_name: "Rohan Pulse", runs: 21, balls_faced: 18, fours: 2, sixes: 1, strike_rate: 116.6, dismissal_info: "not out", is_out: false }
            ],
            bowling: [
              { id: 1, player_id: 9, player_name: "Jasprit Matrix", overs: 4.0, maidens: 0, runs_conceded: 28, wickets: 2, economy: 7.0 },
              { id: 2, player_id: 8, player_name: "Hardik Quantum", overs: 3.2, maidens: 0, runs_conceded: 34, wickets: 1, economy: 10.2 }
            ]
          }
        },
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
    
    if (endpoint.includes('/teams')) {
      return [
        { id: 1, name: "Cyber Strikers", short_name: "CST", logo_url: "⚡", captain_name: "Virat Ray", coach: "Rick Cyber", home_ground: "Neon Dome", players: [] },
        { id: 2, name: "Quantum Titans", short_name: "QTI", logo_url: "🔮", captain_name: "Rohit Tech", coach: "Alex Matrix", home_ground: "Quantum Arena", players: [] },
        { id: 3, name: "Solar Knights", short_name: "SKN", logo_url: "☀️", captain_name: "Steve Flare", coach: "Marcus Sol", home_ground: "Solar Park", players: [] }
      ];
    }

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
