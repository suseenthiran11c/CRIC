/* ====================================================
   DYNAMIC SVG CHARTS & ANALYTICS RENDERER
   ==================================================== */

class ChartRenderer {
  static renderRunRateWorm(containerId, dataTeamA, dataTeamB) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = 220;
    const padding = 30;

    // Sample default curve data
    const teamAPoints = dataTeamA || [0, 8, 18, 26, 38, 45, 56, 68, 80, 92, 105, 118, 128, 142];
    const teamBPoints = dataTeamB || [0, 6, 12, 22, 30, 42, 50, 60, 72, 85, 96, 110, 122, 136];

    const maxRuns = Math.max(...teamAPoints, ...teamBPoints, 150);
    const totalOvers = Math.max(teamAPoints.length, teamBPoints.length, 14);

    const getX = (over) => padding + (over / totalOvers) * (width - 2 * padding);
    const getY = (runs) => height - padding - (runs / maxRuns) * (height - 2 * padding);

    let pathA = `M ${getX(0)} ${getY(teamAPoints[0])}`;
    teamAPoints.forEach((r, idx) => {
      pathA += ` L ${getX(idx)} ${getY(r)}`;
    });

    let pathB = `M ${getX(0)} ${getY(teamBPoints[0])}`;
    teamBPoints.forEach((r, idx) => {
      pathB += ` L ${getX(idx)} ${getY(r)}`;
    });

    const svg = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        <!-- Grid lines -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        
        <!-- Paths -->
        <path d="${pathA}" fill="none" stroke="#00E5FF" stroke-width="3" filter="drop-shadow(0 0 6px rgba(0,229,255,0.5))" />
        <path d="${pathB}" fill="none" stroke="#7C4DFF" stroke-width="3" stroke-dasharray="4" filter="drop-shadow(0 0 6px rgba(124,77,255,0.5))" />

        <!-- Legend -->
        <circle cx="${padding + 10}" cy="${padding}" r="5" fill="#00E5FF" />
        <text x="${padding + 22}" y="${padding + 4}" fill="#A8B2D1" font-size="12">Team A</text>

        <circle cx="${padding + 100}" cy="${padding}" r="5" fill="#7C4DFF" />
        <text x="${padding + 112}" y="${padding + 4}" fill="#A8B2D1" font-size="12">Team B</text>
      </svg>
    `;

    container.innerHTML = svg;
  }
}
