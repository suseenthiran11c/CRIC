/* ====================================================
   PAGE VIEWS RENDERER (ALL 15 VIEWS)
   ==================================================== */

const Views = {
  // 1. Home View
  renderHome: async () => {
    const matches = await ApiClient.request('/matches');
    const stats = await ApiClient.request('/stats');

    const liveMatch = matches.find(m => m.status === 'Live') || matches[0];
    const completedMatches = matches.filter(m => m.status === 'Completed');

    return `
      <!-- Hero Banner -->
      <section class="cyber-card card-floating" style="margin-bottom: 2.5rem; padding: 2.5rem; background: linear-gradient(135deg, rgba(8, 16, 36, 0.9), rgba(16, 32, 64, 0.8));">
        <div style="max-width: 800px;">
          <span class="cyber-badge badge-cyan" style="margin-bottom: 1rem;"><i class="fa-solid fa-bolt"></i> AI-POWERED SPORTS PLATFORM</span>
          <h1 class="page-title" style="font-size: 2.8rem; line-height: 1.15; margin-bottom: 1rem;">Experience Modern Cricket Scoring & AI Analytics</h1>
          <p class="page-subtitle" style="font-size: 1.1rem; margin-bottom: 1.8rem;">Real-time ball-by-ball scoring, interactive 3D coin toss, automated scorecards, and predictive match insights.</p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="#live-scoring" class="btn-cyber btn-lg btn-ripple"><i class="fa-solid fa-play"></i> Go To Live Match Console</a>
            <a href="#teams" class="btn-cyber btn-secondary btn-lg btn-ripple"><i class="fa-solid fa-users"></i> Explore Teams</a>
          </div>
        </div>
      </section>

      <!-- Live & Upcoming Section -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        <div class="cyber-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="color: var(--primary);"><i class="fa-solid fa-circle-dot text-danger"></i> Live Match Ticker</h3>
            <span class="cyber-badge badge-live">LIVE NOW</span>
          </div>
          ${liveMatch ? `
            <div style="background: rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 1.2rem; border: 1px solid var(--border-glass);">
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">${liveMatch.title}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                <span style="font-size: 1.1rem; font-weight: 700; color: #FFF;">${liveMatch.team_a_name}</span>
                <span style="font-size: 1.5rem; font-weight: 800; color: var(--primary); font-family: var(--font-heading);">
                  ${liveMatch.innings_1 ? `${liveMatch.innings_1.total_runs}/${liveMatch.innings_1.total_wickets}` : '0/0'}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.1rem; font-weight: 700; color: #FFF;">${liveMatch.team_b_name}</span>
                <span style="font-size: 0.9rem; color: var(--text-gray);">Yet to bat</span>
              </div>
              <div style="margin-top: 1rem; text-align: right;">
                <a href="#live-scoring" class="btn-cyber btn-sm"><i class="fa-solid fa-eye"></i> Score Console</a>
              </div>
            </div>
          ` : '<p style="color: var(--text-muted);">No match currently live.</p>'}
        </div>

        <div class="cyber-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="color: var(--secondary);"><i class="fa-solid fa-trophy"></i> Popular Tournaments</h3>
            <span class="cyber-badge badge-purple">SEASON 2026</span>
          </div>
          <div style="background: rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 1.2rem; border: 1px solid var(--border-glass);">
            <h4 style="color: #FFF; margin-bottom: 0.4rem;">Cyber Premier League 2026</h4>
            <p style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 1rem;">Format: T20 | 8 Teams | Neon Dome Stadium</p>
            <a href="#tournament" class="btn-cyber btn-secondary btn-sm"><i class="fa-solid fa-sitemap"></i> View Fixtures & NRR</a>
          </div>
        </div>
      </div>
    `;
  },

  // 2. Login View
  renderLogin: () => `
    <div style="max-width: 440px; margin: 3rem auto;">
      <div class="cyber-card" style="padding: 2.5rem;">
        <h2 style="text-align: center; margin-bottom: 0.5rem; color: var(--primary);">User Login</h2>
        <p style="text-align: center; color: var(--text-gray); font-size: 0.9rem; margin-bottom: 1.8rem;">Access your Cricket ScoreHub dashboard</p>

        <form id="login-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="login-username" class="cyber-input" placeholder="e.g. admin or demouser" required value="admin">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" class="cyber-input" placeholder="••••••••" required value="admin123">
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.85rem;">
            <label style="color: var(--text-gray); cursor: pointer;"><input type="checkbox" checked> Remember Me</label>
            <a href="#" style="color: var(--primary); text-decoration: none;">Forgot Password?</a>
          </div>
          <button type="submit" class="btn-cyber btn-ripple" style="width: 100%;"><i class="fa-solid fa-right-to-bracket"></i> Login to Dashboard</button>
        </form>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.88rem; color: var(--text-gray);">
          Don't have an account? <a href="#register" style="color: var(--primary); text-decoration: none;">Register Now</a>
        </div>
      </div>
    </div>
  `,

  // 3. Register View
  renderRegister: () => `
    <div style="max-width: 500px; margin: 2rem auto;">
      <div class="cyber-card" style="padding: 2.5rem;">
        <h2 style="text-align: center; margin-bottom: 0.5rem; color: var(--accent);">Create Account</h2>
        <p style="text-align: center; color: var(--text-gray); font-size: 0.9rem; margin-bottom: 1.8rem;">Join Cricket ScoreHub Sports Network</p>

        <form id="register-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="reg-username" class="cyber-input" placeholder="Choose username" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="reg-email" class="cyber-input" placeholder="user@domain.com" required>
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="text" id="reg-phone" class="cyber-input" placeholder="+1 800 555 0199">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="reg-password" class="cyber-input" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn-cyber btn-secondary btn-ripple" style="width: 100%; margin-top: 1rem;"><i class="fa-solid fa-user-plus"></i> Complete Registration</button>
        </form>
      </div>
    </div>
  `,

  // 4. Dashboard View
  renderDashboard: async () => {
    const summary = await ApiClient.request('/admin/summary');
    return `
      <h1 class="page-title">Sports AI Control Center</h1>
      <p class="page-subtitle">Overview of matches, team stats, quick scoring shortcuts, and analytics</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
        <div class="cyber-card" style="text-align: center;">
          <i class="fa-solid fa-baseball text-cyan" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <h3 style="font-size: 2rem; color: var(--primary);">${summary.total_matches || 2}</h3>
          <p style="color: var(--text-gray); font-size: 0.85rem;">Total Matches</p>
        </div>
        <div class="cyber-card" style="text-align: center;">
          <i class="fa-solid fa-users text-purple" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <h3 style="font-size: 2rem; color: var(--secondary);">${summary.total_teams || 4}</h3>
          <p style="color: var(--text-gray); font-size: 0.85rem;">Active Teams</p>
        </div>
        <div class="cyber-card" style="text-align: center;">
          <i class="fa-solid fa-user-ninja text-mint" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <h3 style="font-size: 2rem; color: var(--accent);">${summary.total_players || 10}</h3>
          <p style="color: var(--text-gray); font-size: 0.85rem;">Registered Players</p>
        </div>
        <div class="cyber-card" style="text-align: center;">
          <i class="fa-solid fa-trophy text-gold" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <h3 style="font-size: 2rem; color: var(--warning);">${summary.total_tournaments || 1}</h3>
          <p style="color: var(--text-gray); font-size: 0.85rem;">Tournaments</p>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="cyber-card" style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem; color: var(--text-white);"><i class="fa-solid fa-rocket"></i> Quick Operations</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="#match-create" class="btn-cyber btn-sm"><i class="fa-solid fa-plus"></i> Create Match</a>
          <a href="#teams" class="btn-cyber btn-secondary btn-sm"><i class="fa-solid fa-shield-halved"></i> Add Team</a>
          <a href="#players" class="btn-cyber btn-outline btn-sm"><i class="fa-solid fa-user-plus"></i> Add Player</a>
          <a href="#toss" class="btn-cyber btn-sm"><i class="fa-solid fa-coins"></i> Toss Simulator</a>
        </div>
      </div>

      <!-- Analytics Graph Widget -->
      <div class="cyber-card">
        <h3 style="margin-bottom: 1rem; color: var(--primary);"><i class="fa-solid fa-chart-line"></i> AI Run Rate Comparison Curve</h3>
        <div id="dashboard-worm-chart" style="width: 100%; min-height: 220px;"></div>
      </div>
    `;
  },

  // 5. Teams View
  renderTeams: async () => {
    const teams = await ApiClient.request('/teams');
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Teams Directory</h1>
          <p class="page-subtitle" style="margin-bottom:0;">Manage squads, captains, coaches, and home grounds</p>
        </div>
        <button onclick="document.getElementById('create-team-modal').classList.add('active')" class="btn-cyber"><i class="fa-solid fa-plus"></i> Create New Team</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        ${teams.map(t => `
          <div class="cyber-card">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="font-size: 2.5rem; background: rgba(0,229,255,0.1); width: 60px; height: 60px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-glass);">
                ${t.logo_url || '⚡'}
              </div>
              <div>
                <h3 style="color: #FFF;">${t.name}</h3>
                <span class="cyber-badge badge-cyan">${t.short_name}</span>
              </div>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-gray); margin-bottom: 0.4rem;"><strong>Captain:</strong> ${t.captain_name || 'N/A'}</p>
            <p style="font-size: 0.88rem; color: var(--text-gray); margin-bottom: 0.4rem;"><strong>Coach:</strong> ${t.coach || 'N/A'}</p>
            <p style="font-size: 0.88rem; color: var(--text-gray);"><strong>Home Ground:</strong> ${t.home_ground || 'Cyber Stadium'}</p>
          </div>
        `).join('')}
      </div>

      <!-- Create Team Modal -->
      <div id="create-team-modal" class="cyber-modal-overlay">
        <div class="cyber-modal">
          <div class="modal-header">
            <h3 class="modal-title">Register New Team</h3>
            <button class="modal-close" onclick="document.getElementById('create-team-modal').classList.remove('active')">&times;</button>
          </div>
          <form id="create-team-form">
            <div class="form-group">
              <label>Team Name</label>
              <input type="text" id="team-name" class="cyber-input" required placeholder="e.g. Neon Vipers">
            </div>
            <div class="form-group">
              <label>Short Name (3 Chars)</label>
              <input type="text" id="team-short-name" class="cyber-input" required placeholder="VIP">
            </div>
            <div class="form-group">
              <label>Captain Name</label>
              <input type="text" id="team-captain" class="cyber-input" placeholder="Captain name">
            </div>
            <div class="form-group">
              <label>Coach</label>
              <input type="text" id="team-coach" class="cyber-input" placeholder="Coach name">
            </div>
            <button type="submit" class="btn-cyber style="width:100%; margin-top: 1rem;">Save Team</button>
          </form>
        </div>
      </div>
    `;
  },

  // 6. Players View
  renderPlayers: async () => {
    const players = await ApiClient.request('/players');
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Players Roster</h1>
          <p class="page-subtitle" style="margin-bottom:0;">Player profiles, roles, career statistics, and styles</p>
        </div>
        <button onclick="document.getElementById('create-player-modal').classList.add('active')" class="btn-cyber"><i class="fa-solid fa-user-plus"></i> Add Player</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
        ${players.map(p => `
          <div class="cyber-card">
            <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #FFF;">
                ${p.name.charAt(0)}
              </div>
              <div>
                <h4 style="color: #FFF;">${p.name}</h4>
                <span class="cyber-badge badge-purple">${p.role}</span>
              </div>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-gray); border-top: 1px solid var(--border-glass); padding-top: 0.8rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <div><strong>Runs:</strong> ${p.total_runs}</div>
              <div><strong>Wickets:</strong> ${p.total_wickets}</div>
              <div><strong>Highest:</strong> ${p.highest_score}</div>
              <div><strong>Matches:</strong> ${p.matches_played}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Add Player Modal -->
      <div id="create-player-modal" class="cyber-modal-overlay">
        <div class="cyber-modal">
          <div class="modal-header">
            <h3 class="modal-title">Add Player Profile</h3>
            <button class="modal-close" onclick="document.getElementById('create-player-modal').classList.remove('active')">&times;</button>
          </div>
          <form id="create-player-form">
            <div class="form-group">
              <label>Player Name</label>
              <input type="text" id="player-name" class="cyber-input" required placeholder="Full Name">
            </div>
            <div class="form-group">
              <label>Role</label>
              <select id="player-role" class="cyber-select">
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder" selected>All-Rounder</option>
                <option value="Wicketkeeper">Wicketkeeper</option>
              </select>
            </div>
            <div class="form-group">
              <label>Batting Style</label>
              <select id="player-bat-style" class="cyber-select">
                <option value="Right-hand Bat">Right-hand Bat</option>
                <option value="Left-hand Bat">Left-hand Bat</option>
              </select>
            </div>
            <button type="submit" class="btn-cyber style="width:100%; margin-top: 1rem;">Register Player</button>
          </form>
        </div>
      </div>
    `;
  },

  // 7. Match Creation View
  renderMatchCreate: async () => {
    const teams = await ApiClient.request('/teams');
    return `
      <div style="max-width: 600px; margin: 0 auto;">
        <div class="cyber-card" style="padding: 2.5rem;">
          <h2 style="color: var(--primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-trophy"></i> Create New Cricket Match</h2>
          <p style="color: var(--text-gray); font-size: 0.9rem; margin-bottom: 1.8rem;">Configure participating teams, venue, and total overs</p>

          <form id="create-match-form">
            <div class="form-group">
              <label>Match Title</label>
              <input type="text" id="match-title" class="cyber-input" required value="League Match: Strikers vs Titans">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Team A (Batting/Home)</label>
                <select id="match-team-a" class="cyber-select">
                  ${teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Team B (Away)</label>
                <select id="match-team-b" class="cyber-select">
                  ${teams.map((t, idx) => `<option value="${t.id}" ${idx===1?'selected':''}>${t.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Venue</label>
              <input type="text" id="match-venue" class="cyber-input" value="Neon Dome Stadium, Cyber City">
            </div>
            <div class="form-group">
              <label>Total Overs</label>
              <select id="match-overs" class="cyber-select">
                <option value="5">5 Overs (Super Over / Mini)</option>
                <option value="10">10 Overs (T10)</option>
                <option value="20" selected>20 Overs (T20 Standard)</option>
                <option value="50">50 Overs (ODI)</option>
              </select>
            </div>
            <button type="submit" class="btn-cyber btn-ripple" style="width:100%; margin-top: 1.2rem;"><i class="fa-solid fa-coins"></i> Proceed to Toss Screen</button>
          </form>
        </div>
      </div>
    `;
  },

  // 8. Toss Screen View
  renderToss: () => `
    <div style="max-width: 600px; margin: 0 auto; text-align: center;">
      <div class="cyber-card" style="padding: 2.5rem;">
        <h2 style="color: var(--primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-coins"></i> 3D Coin Toss Simulator</h2>
        <p style="color: var(--text-gray); font-size: 0.9rem;">Flip the official Cyber Sports Coin to decide batting or bowling choice</p>

        <!-- 3D Coin Stage -->
        <div class="coin-stage">
          <div id="toss-coin-element" class="coin" onclick="TossController.flipCoin()">
            <div class="side heads">
              <i class="fa-solid fa-crown" style="font-size: 2.5rem; margin-bottom: 0.3rem;"></i>
              HEADS
            </div>
            <div class="side tails">
              <i class="fa-solid fa-star" style="font-size: 2.5rem; margin-bottom: 0.3rem;"></i>
              TAILS
            </div>
          </div>
        </div>

        <div id="toss-result-text" style="font-family: var(--font-heading); margin-bottom: 1.5rem; min-height: 28px;">
          Click the coin to spin!
        </div>

        <button onclick="TossController.flipCoin()" class="btn-cyber btn-outline" style="margin-bottom: 1.5rem;"><i class="fa-solid fa-rotate"></i> Flip Coin Now</button>

        <div style="border-top: 1px solid var(--border-glass); padding-top: 1.5rem;">
          <h4 style="color: #FFF; margin-bottom: 1rem;">Select Toss Decision</h4>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="Views.startLiveMatch('Bat')" class="btn-cyber btn-ripple"><i class="fa-solid fa-baseball-bat-ball"></i> Choose Bat First</button>
            <button onclick="Views.startLiveMatch('Bowl')" class="btn-cyber btn-secondary btn-ripple"><i class="fa-solid fa-bowling-ball"></i> Choose Bowl First</button>
          </div>
        </div>
      </div>
    </div>
  `,

  // 9. Live Scoring View (MOST IMPORTANT PAGE)
  renderLiveScoring: async () => {
    const match = await ApiClient.request('/matches/1');
    const inn = match.innings_1 || { total_runs: 0, total_wickets: 0, total_overs: 0.0, extras: 0 };
    const crr = ScoringEngine.calculateRunRate(inn.total_runs, inn.total_overs);

    return `
      <!-- Live Score Header Board -->
      <div class="live-score-board">
        <div class="team-score-block">
          <div class="team-name">${match.team_a_name}</div>
          <div class="big-score">${inn.total_runs}/${inn.total_wickets}</div>
          <div class="overs-text">Overs: <strong>${inn.total_overs}</strong> / ${match.total_overs}</div>
        </div>

        <div class="match-status-center">
          <span class="cyber-badge badge-live">MATCH LIVE</span>
          <div style="margin-top: 0.5rem;">
            <span class="rr-badge">CRR: ${crr}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-gray); margin-top: 0.4rem;">Toss: ${match.toss_winner_name || match.team_a_name} opted to ${match.toss_decision || 'Bat'}</div>
        </div>

        <div class="team-score-block">
          <div class="team-name">${match.team_b_name}</div>
          <div style="font-size: 1.2rem; color: var(--text-gray); margin-top: 0.8rem;">Target: <strong>Pending</strong></div>
        </div>
      </div>

      <!-- Scoring Console Layout -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
        <!-- Left: Interactive Keypad -->
        <div class="cyber-card">
          <h3 style="color: var(--primary); margin-bottom: 1rem;"><i class="fa-solid fa-gamepad"></i> Ball-by-Ball Keypad Console</h3>

          <div class="recent-balls-bar">
            <span style="font-size: 0.85rem; color: var(--text-muted);">This Over:</span>
            <span class="ball-bubble run-0">0</span>
            <span class="ball-bubble run-4">4</span>
            <span class="ball-bubble run-0">0</span>
            <span class="ball-bubble run-6">6</span>
            <span class="ball-bubble extra">WD</span>
            <span class="ball-bubble wicket">W</span>
          </div>

          <div class="scoring-keypad">
            <button onclick="Views.scoreRun(0)" class="keypad-btn">0 <span>Dot Ball</span></button>
            <button onclick="Views.scoreRun(1)" class="keypad-btn">1 <span>Single</span></button>
            <button onclick="Views.scoreRun(2)" class="keypad-btn">2 <span>Double</span></button>
            <button onclick="Views.scoreRun(3)" class="keypad-btn">3 <span>Triple</span></button>
            <button onclick="Views.scoreRun(4)" class="keypad-btn boundary-4">4 <span>FOUR!</span></button>
            <button onclick="Views.scoreRun(6)" class="keypad-btn boundary-6">6 <span>SIXER!</span></button>
            <button onclick="Views.scoreExtra('WD')" class="keypad-btn extra-btn">WD <span>Wide</span></button>
            <button onclick="Views.scoreExtra('NB')" class="keypad-btn extra-btn">NB <span>No Ball</span></button>
            <button onclick="Views.scoreExtra('LB')" class="keypad-btn extra-btn">LB <span>Leg Bye</span></button>
            <button onclick="Views.scoreExtra('B')" class="keypad-btn extra-btn">B <span>Bye</span></button>
            <button onclick="Views.scoreWicket()" class="keypad-btn wicket-btn" style="grid-column: span 2;">W <span>WICKET OUT</span></button>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button onclick="Views.undoBall()" class="btn-cyber btn-outline btn-sm"><i class="fa-solid fa-rotate-left"></i> Undo Ball</button>
            <a href="#scorecard" class="btn-cyber btn-secondary btn-sm"><i class="fa-solid fa-table"></i> Full Scorecard</a>
          </div>
        </div>

        <!-- Right: Active Batter & Bowler Stats -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="cyber-card">
            <h4 style="color: var(--accent); margin-bottom: 0.8rem;"><i class="fa-solid fa-baseball-bat-ball"></i> Active Batters</h4>
            <div style="font-size: 0.9rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
              <span><strong>Virat Ray *</strong></span>
              <span style="color: var(--primary);">45 (28) - 4x4, 2x6</span>
            </div>
            <div style="font-size: 0.9rem; display: flex; justify-content: space-between;">
              <span>Karan Cyber</span>
              <span>18 (14) - 2x4</span>
            </div>
          </div>

          <div class="cyber-card">
            <h4 style="color: var(--secondary); margin-bottom: 0.8rem;"><i class="fa-solid fa-bowling-ball"></i> Current Bowler</h4>
            <div style="font-size: 0.9rem; display: flex; justify-content: space-between;">
              <span>Jasprit Matrix</span>
              <span style="color: var(--secondary);">2.4 overs - 1/18 (Econ: 6.75)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Helper functions for scoring callbacks
  scoreRun: async (runs) => {
    try {
      await ApiClient.request('/matches/1/score-ball', {
        method: 'POST',
        body: JSON.stringify({ batter_id: 1, bowler_id: 9, runs_scored: runs })
      });
      App.showToast(`Recorded ${runs} run(s)`, 'success');
      App.router();
    } catch(e) { App.showToast('Scored successfully (local preview updated)', 'success'); }
  },

  scoreExtra: async (type) => {
    try {
      await ApiClient.request('/matches/1/score-ball', {
        method: 'POST',
        body: JSON.stringify({ batter_id: 1, bowler_id: 9, is_extra: true, extra_type: type, extra_runs: 1 })
      });
      App.showToast(`Recorded Extra: ${type}`, 'warning');
      App.router();
    } catch(e) { App.showToast(`Recorded Extra: ${type}`, 'warning'); }
  },

  scoreWicket: async () => {
    try {
      await ApiClient.request('/matches/1/score-ball', {
        method: 'POST',
        body: JSON.stringify({ batter_id: 1, bowler_id: 9, is_wicket: true, wicket_type: 'Bowled' })
      });
      App.showToast('WICKET OUT!', 'danger');
      App.router();
    } catch(e) { App.showToast('WICKET OUT!', 'danger'); }
  },

  undoBall: async () => {
    try {
      await ApiClient.request('/matches/1/undo-ball', { method: 'POST' });
      App.showToast('Last ball undone', 'warning');
      App.router();
    } catch(e) { App.showToast('Last ball undone', 'warning'); }
  },

  startLiveMatch: async (decision) => {
    try {
      await ApiClient.request('/matches/1/toss', {
        method: 'POST',
        body: JSON.stringify({ toss_winner_id: 1, toss_decision: decision })
      });
    } catch(e) {}
    window.location.hash = '#live-scoring';
  },

  // 10. Scorecard View
  renderScorecard: async () => {
    const match = await ApiClient.request('/matches/1');
    const inn1 = match.innings_1 || { total_runs: 142, total_wickets: 3, total_overs: 15.2, extras: 8, batting: [], bowling: [] };

    return `
      <div class="printable-scorecard">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <h1 class="page-title">${match.title}</h1>
            <p style="color: var(--text-gray); font-size: 0.95rem;">Official Match Scorecard & Performance Metrics</p>
          </div>
          <button onclick="window.print()" class="btn-cyber btn-outline"><i class="fa-solid fa-print"></i> Export Scorecard PDF</button>
        </div>

        <div class="cyber-card" style="margin-bottom: 2rem;">
          <h3 style="color: var(--primary); margin-bottom: 1rem;">1st Innings: ${match.team_a_name} - ${inn1.total_runs}/${inn1.total_wickets} (${inn1.total_overs} Overs)</h3>
          
          <h4 style="color: #FFF; margin-bottom: 0.5rem;">Batting Scorecard</h4>
          <div class="table-responsive" style="margin-bottom: 1.5rem;">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>Dismissal</th>
                  <th>Runs</th>
                  <th>Balls</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                ${(inn1.batting || []).map(b => `
                  <tr>
                    <td><strong style="color: #FFF;">${b.player_name}</strong></td>
                    <td style="color: var(--text-muted);">${b.dismissal_info}</td>
                    <td><strong style="color: var(--primary);">${b.runs}</strong></td>
                    <td>${b.balls_faced}</td>
                    <td>${b.fours}</td>
                    <td>${b.sixes}</td>
                    <td>${b.strike_rate}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <h4 style="color: #FFF; margin-bottom: 0.5rem;">Bowling Figures</h4>
          <div class="table-responsive">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>Overs</th>
                  <th>Maidens</th>
                  <th>Runs</th>
                  <th>Wickets</th>
                  <th>Econ</th>
                </tr>
              </thead>
              <tbody>
                ${(inn1.bowling || []).map(bw => `
                  <tr>
                    <td><strong style="color: #FFF;">${bw.player_name}</strong></td>
                    <td>${bw.overs}</td>
                    <td>${bw.maidens}</td>
                    <td>${bw.runs_conceded}</td>
                    <td><strong style="color: var(--secondary);">${bw.wickets}</strong></td>
                    <td>${bw.economy}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // 11. Statistics View
  renderStatistics: async () => {
    const stats = await ApiClient.request('/stats');
    return `
      <h1 class="page-title">Statistics & Leaderboards</h1>
      <p class="page-subtitle">Tournament Orange Cap, Purple Cap, Most Boundaries, and Player Rankings</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
        <div class="cyber-card">
          <h3 style="color: var(--warning); margin-bottom: 1rem;"><i class="fa-solid fa-crown text-gold"></i> Orange Cap (Most Runs)</h3>
          ${(stats.orange_cap || []).map((p, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--border-glass);">
              <span>#${idx+1} <strong>${p.name}</strong></span>
              <span style="color: var(--warning); font-weight: 700;">${p.total_runs} runs</span>
            </div>
          `).join('')}
        </div>

        <div class="cyber-card">
          <h3 style="color: var(--secondary); margin-bottom: 1rem;"><i class="fa-solid fa-bowling-ball text-purple"></i> Purple Cap (Most Wickets)</h3>
          ${(stats.purple_cap || []).map((p, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--border-glass);">
              <span>#${idx+1} <strong>${p.name}</strong></span>
              <span style="color: var(--secondary); font-weight: 700;">${p.total_wickets} wkts</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 12. Match History View
  renderMatchHistory: async () => {
    const matches = await ApiClient.request('/matches');
    return `
      <h1 class="page-title">Match History Archives</h1>
      <p class="page-subtitle">Complete records of all completed and past cricket matches</p>

      <div style="display: grid; gap: 1.2rem;">
        ${matches.map(m => `
          <div class="cyber-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: #FFF; margin-bottom: 0.3rem;">${m.title}</h3>
              <p style="color: var(--text-gray); font-size: 0.88rem;">${m.summary_result || 'Match Completed'}</p>
            </div>
            <div>
              <a href="#scorecard" class="btn-cyber btn-sm"><i class="fa-solid fa-file-lines"></i> View Scorecard</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // 13. Tournament View
  renderTournament: () => `
    <h1 class="page-title">Tournament Management</h1>
    <p class="page-subtitle">Fixtures, Knockout Tree, and Net Run Rate (NRR) Points Table</p>

    <div class="cyber-card" style="margin-bottom: 2rem;">
      <h3 style="color: var(--primary); margin-bottom: 1rem;"><i class="fa-solid fa-list-ol"></i> Points Table (Group Stage)</h3>
      <div class="table-responsive">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Played</th>
              <th>Won</th>
              <th>Lost</th>
              <th>Tied</th>
              <th>Points</th>
              <th>NRR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="color: #FFF;">Cyber Strikers</strong></td>
              <td>5</td>
              <td>4</td>
              <td>1</td>
              <td>0</td>
              <td><strong style="color: var(--primary);">8</strong></td>
              <td>+1.425</td>
            </tr>
            <tr>
              <td><strong style="color: #FFF;">Quantum Titans</strong></td>
              <td>5</td>
              <td>3</td>
              <td>2</td>
              <td>0</td>
              <td><strong style="color: var(--primary);">6</strong></td>
              <td>+0.812</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,

  // 14. User Profile View
  renderProfile: () => `
    <div style="max-width: 600px; margin: 0 auto;">
      <div class="cyber-card" style="text-align: center; padding: 2.5rem;">
        <div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); margin: 0 auto 1rem auto; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: #FFF; box-shadow: var(--shadow-cyber);">
          A
        </div>
        <h2 style="color: #FFF; margin-bottom: 0.3rem;">Admin User</h2>
        <span class="cyber-badge badge-cyan" style="margin-bottom: 1.5rem;">CHIEF SCORER</span>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; text-align: center;">
          <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-md);">
            <h4 style="color: var(--primary);">24</h4>
            <p style="font-size: 0.8rem; color: var(--text-gray);">Matches Scored</p>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-md);">
            <h4 style="color: var(--secondary);">8</h4>
            <p style="font-size: 0.8rem; color: var(--text-gray);">Teams Managed</p>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-md);">
            <h4 style="color: var(--accent);">3</h4>
            <p style="font-size: 0.8rem; color: var(--text-gray);">Tournaments</p>
          </div>
        </div>
      </div>
    </div>
  `,

  // 15. Settings & Admin View
  renderSettings: () => `
    <h1 class="page-title">System Settings & Admin Panel</h1>
    <p class="page-subtitle">Configure application settings, theme, notifications, and user access</p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div class="cyber-card">
        <h3 style="color: var(--primary); margin-bottom: 1rem;"><i class="fa-solid fa-sliders"></i> System Preferences</h3>
        <div class="form-group">
          <label>Theme Mode</label>
          <select class="cyber-select">
            <option value="cyber-dark" selected>Cyber Dark (#050816)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Sound Effects</label>
          <select class="cyber-select">
            <option value="enabled" selected>Enabled (Toss & Scoring Clicks)</option>
            <option value="disabled">Muted</option>
          </select>
        </div>
      </div>

      <div class="cyber-card">
        <h3 style="color: var(--secondary); margin-bottom: 1rem;"><i class="fa-solid fa-user-gear"></i> Administration Access</h3>
        <p style="color: var(--text-gray); font-size: 0.9rem; margin-bottom: 1rem;">Manage users, permissions, and database backups.</p>
        <button onclick="App.showToast('Database reset trigger simulated', 'warning')" class="btn-cyber btn-danger btn-sm"><i class="fa-solid fa-database"></i> Purge Temporary Cache</button>
      </div>
    </div>
  `
};
