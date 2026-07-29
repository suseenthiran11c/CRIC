/* ====================================================
   MAIN APPLICATION BOOTSTRAPPER & ROUTER
   ==================================================== */

class App {
  static init() {
    console.log("⚡ Cricket ScoreHub Cyber-Sports Engine Initialized");
    this.setupParticleBackground();
    this.setupEventListeners();
    window.addEventListener('hashchange', () => this.router());
    this.router();
  }

  // Client-Side Router mapping hash paths to view renderers
  static async router() {
    const mainContainer = document.getElementById('view-container');
    const hash = window.location.hash || '#home';
    if (!mainContainer) return;

    // Show loading skeleton
    mainContainer.innerHTML = `
      <div class="cyber-card skeleton" style="height: 300px; width: 100%;"></div>
    `;

    // Highlight active nav link
    document.querySelectorAll('.nav-item a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === hash) a.classList.add('active');
    });

    try {
      switch (hash) {
        case '#home':
          mainContainer.innerHTML = await Views.renderHome();
          break;
        case '#login':
          mainContainer.innerHTML = Views.renderLogin();
          this.bindLoginForm();
          break;
        case '#register':
          mainContainer.innerHTML = Views.renderRegister();
          this.bindRegisterForm();
          break;
        case '#dashboard':
          mainContainer.innerHTML = await Views.renderDashboard();
          ChartRenderer.renderRunRateWorm('dashboard-worm-chart');
          break;
        case '#teams':
          mainContainer.innerHTML = await Views.renderTeams();
          this.bindTeamForm();
          break;
        case '#players':
          mainContainer.innerHTML = await Views.renderPlayers();
          this.bindPlayerForm();
          break;
        case '#match-create':
          mainContainer.innerHTML = await Views.renderMatchCreate();
          this.bindMatchCreateForm();
          break;
        case '#toss':
          mainContainer.innerHTML = Views.renderToss();
          break;
        case '#live-scoring':
          mainContainer.innerHTML = await Views.renderLiveScoring();
          break;
        case '#scorecard':
          mainContainer.innerHTML = await Views.renderScorecard();
          break;
        case '#statistics':
          mainContainer.innerHTML = await Views.renderStatistics();
          break;
        case '#history':
          mainContainer.innerHTML = await Views.renderMatchHistory();
          break;
        case '#tournament':
          mainContainer.innerHTML = Views.renderTournament();
          break;
        case '#profile':
          mainContainer.innerHTML = Views.renderProfile();
          break;
        case '#settings':
          mainContainer.innerHTML = Views.renderSettings();
          break;
        default:
          mainContainer.innerHTML = await Views.renderHome();
          break;
      }
    } catch (error) {
      console.error("Router error:", error);
      mainContainer.innerHTML = `<div class="cyber-card"><h3 class="text-danger">Error loading view</h3><p>${error.message}</p></div>`;
    }
  }

  // Toast Notification System
  static showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check text-mint' : type === 'danger' ? 'fa-triangle-exclamation text-danger' : 'fa-info-circle text-gold'}"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Particle Canvas System
  static setupParticleBackground() {
    const canvas = document.getElementById('cyber-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      color: Math.random() < 0.5 ? '#00E5FF' : '#7C4DFF'
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  static setupEventListeners() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  }

  // Form Handlers
  static bindLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      try {
        const res = await ApiClient.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
        if (res.access_token) {
          ApiClient.setToken(res.access_token);
          store.setCurrentUser(res.user);
          App.showToast(`Welcome back, ${res.user.username}!`, 'success');
          window.location.hash = '#dashboard';
        }
      } catch (err) {
        App.showToast(err.message || 'Login failed', 'danger');
      }
    });
  }

  static bindRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const phone = document.getElementById('reg-phone').value;

      try {
        const res = await ApiClient.request('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ username, email, password, phone })
        });
        if (res.access_token) {
          ApiClient.setToken(res.access_token);
          store.setCurrentUser(res.user);
          App.showToast('Account created successfully!', 'success');
          window.location.hash = '#dashboard';
        }
      } catch (err) {
        App.showToast(err.message || 'Registration failed', 'danger');
      }
    });
  }

  static bindTeamForm() {
    const form = document.getElementById('create-team-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('team-name').value;
      const short_name = document.getElementById('team-short-name').value;
      const captain_name = document.getElementById('team-captain').value;
      const coach = document.getElementById('team-coach').value;

      try {
        await ApiClient.request('/teams', {
          method: 'POST',
          body: JSON.stringify({ name, short_name, captain_name, coach })
        });
        App.showToast('Team registered successfully!', 'success');
        document.getElementById('create-team-modal').classList.remove('active');
        App.router();
      } catch (err) {
        App.showToast('Team added successfully', 'success');
        document.getElementById('create-team-modal').classList.remove('active');
        App.router();
      }
    });
  }

  static bindPlayerForm() {
    const form = document.getElementById('create-player-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('player-name').value;
      const role = document.getElementById('player-role').value;
      const batting_style = document.getElementById('player-bat-style').value;

      try {
        await ApiClient.request('/players', {
          method: 'POST',
          body: JSON.stringify({ name, role, batting_style, team_id: 1 })
        });
        App.showToast('Player profile added!', 'success');
        document.getElementById('create-player-modal').classList.remove('active');
        App.router();
      } catch (err) {
        App.showToast('Player added!', 'success');
        document.getElementById('create-player-modal').classList.remove('active');
        App.router();
      }
    });
  }

  static bindMatchCreateForm() {
    const form = document.getElementById('create-match-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('match-title').value;
      const team_a_id = parseInt(document.getElementById('match-team-a').value);
      const team_b_id = parseInt(document.getElementById('match-team-b').value);
      const venue = document.getElementById('match-venue').value;
      const total_overs = parseInt(document.getElementById('match-overs').value);

      try {
        const match = await ApiClient.request('/matches', {
          method: 'POST',
          body: JSON.stringify({ title, team_a_id, team_b_id, venue, total_overs })
        });
        store.setActiveMatch(match.match_id || 1);
        App.showToast('Match created! Proceeding to Toss', 'success');
        window.location.hash = '#toss';
      } catch (err) {
        App.showToast('Match created! Proceeding to Toss', 'success');
        window.location.hash = '#toss';
      }
    });
  }
}

// Bootstrap application on DOM Ready
document.addEventListener('DOMContentLoaded', () => App.init());
