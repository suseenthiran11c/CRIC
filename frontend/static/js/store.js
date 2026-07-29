/* ====================================================
   STATE STORE MANAGER
   ==================================================== */

class StateStore {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('scorehub_user')) || null;
    this.activeMatchId = localStorage.getItem('scorehub_active_match') || 1;
    this.activeMatchData = null;
    this.theme = localStorage.getItem('scorehub_theme') || 'dark';
    this.listeners = [];
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('scorehub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('scorehub_user');
    }
    this.notify();
  }

  setActiveMatch(matchId) {
    this.activeMatchId = matchId;
    localStorage.setItem('scorehub_active_match', matchId);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }
}

const store = new StateStore();
