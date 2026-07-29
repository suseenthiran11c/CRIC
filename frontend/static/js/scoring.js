/* ====================================================
   BALL-BY-BALL INTERACTIVE SCORING ENGINE
   ==================================================== */

class ScoringEngine {
  constructor(matchData) {
    this.match = matchData;
    this.recentBalls = [];
    this.commentaryLog = [];
  }

  static calculateRunRate(runs, oversFloat) {
    if (!oversFloat || oversFloat <= 0) return "0.00";
    const completedOvers = Math.floor(oversFloat);
    const balls = Math.round((oversFloat - completedOvers) * 10);
    const totalOversFraction = completedOvers + (balls / 6.0);
    if (totalOversFraction <= 0) return "0.00";
    return (runs / totalOversFraction).toFixed(2);
  }

  static calculateRequiredRunRate(targetRuns, currentRuns, totalOvers, oversFloat) {
    const runsNeeded = targetRuns - currentRuns;
    if (runsNeeded <= 0) return "0.00";
    
    const completedOvers = Math.floor(oversFloat);
    const balls = Math.round((oversFloat - completedOvers) * 10);
    const oversBowledFraction = completedOvers + (balls / 6.0);
    const oversRemaining = totalOvers - oversBowledFraction;
    
    if (oversRemaining <= 0) return "99.9";
    return (runsNeeded / oversRemaining).toFixed(2);
  }

  async submitBall(matchId, ballReq) {
    try {
      const res = await ApiClient.request(`/matches/${matchId}/score-ball`, {
        method: 'POST',
        body: JSON.stringify(ballReq)
      });
      return res;
    } catch (e) {
      console.error("Ball scoring failed:", e);
      throw e;
    }
  }

  async undoLastBall(matchId) {
    try {
      const res = await ApiClient.request(`/matches/${matchId}/undo-ball`, {
        method: 'POST'
      });
      return res;
    } catch (e) {
      console.error("Undo failed:", e);
      throw e;
    }
  }
}
