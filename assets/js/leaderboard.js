/**
 * Live Leaderboard Implementation
 * Using Google Sheets + SheetDB for real-time data
 */

class LeaderboardManager {
  constructor(track) {
    this.track = track;
    this.refreshInterval = 30000; // 30 seconds
    this.currentFilter = "all";
    this.currentSort = "score";
    this.isLive = false; // Set to true when competition starts

    // Google Sheets Configuration - Choose ONE method:
    this.dataSource = "demo"; // Options: 'demo', 'sheetdb', 'csv', 'apps-script'

    // Method 1: SheetDB (Recommended)
    this.sheetdb = new SheetDBIntegration(
      "https://sheetdb.io/api/v1/your_sheet_id"
    );

    // Method 2: Direct CSV (Simple)
    this.googleCSV = new GoogleSheetCSV(
      "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      0
    );

    // Method 3: Apps Script Web App
    this.appsScript = new GoogleAppsScript(
      "https://script.google.com/macros/s/your_script_id/exec"
    );

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupAutoRefresh();
    this.loadLeaderboard();
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.textContent
          .toLowerCase()
          .replace(" ", "");
        this.applyFilters();
      });
    });

    // Sort dropdown
    const sortSelect = document.getElementById("sort-by");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.applySort();
      });
    }

    // Refresh button (if exists)
    const refreshBtn = document.querySelector(".refresh-btn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.loadLeaderboard();
      });
    }
  }

  setupAutoRefresh() {
    if (this.isLive) {
      setInterval(() => {
        this.loadLeaderboard();
      }, this.refreshInterval);
    }
  }

  async loadLeaderboard() {
    try {
      this.showLoading();

      if (!this.isLive) {
        this.showPreCompetitionMessage();
        return;
      }

      const data = await this.fetchLeaderboardData();
      this.displayLeaderboard(data);
      this.updateStats(data);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      this.showError();
    }
  }

  async fetchLeaderboardData() {
    try {
      let rawData = [];

      switch (this.dataSource) {
        case "sheetdb":
          rawData = await this.sheetdb.fetchData(this.track);
          return this.sheetdb.normalizeData(rawData);

        case "csv":
          rawData = await this.googleCSV.fetchData();
          return this.normalizeGoogleSheetsData(rawData);

        case "apps-script":
          rawData = await this.appsScript.fetchData();
          return this.normalizeGoogleSheetsData(rawData);

        case "demo":
        default:
          // Return mock data for demo
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.getMockData());
            }, 500);
          });
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      return this.getMockData(); // Fallback to demo data
    }
  }

  normalizeGoogleSheetsData(rawData) {
    return rawData
      .filter((row) => row.team_name || row.name) // Filter out empty rows
      .map((row, index) => ({
        id: row.id || `team_${index + 1}`,
        name: row.team_name || row.name || `Team ${index + 1}`,
        team: row.team_name || row.name || `Team ${index + 1}`,
        school: row.school || row.organization || "Unknown School",
        score: parseFloat(row.score || 0),
        accuracy: parseFloat(row.accuracy || 0),
        submissions: parseInt(row.submissions || 1),
        lastSubmission:
          row.timestamp || row.last_update || new Date().toISOString(),
        rank: index + 1,
      }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .map((team, index) => ({ ...team, rank: index + 1 })); // Update ranks
  }

  getMockData() {
    // Mock data for demonstration
    const mockData = [
      {
        name: "Team Alpha",
        school: "Central High",
        score: 95.2,
        accuracy: 94.8,
        submissions: 5,
        lastSubmission: "2025-01-15T14:30:00Z",
      },
      {
        name: "Code Warriors",
        school: "Tech Academy",
        score: 92.7,
        accuracy: 91.5,
        submissions: 3,
        lastSubmission: "2025-01-15T13:45:00Z",
      },
      {
        name: "Data Miners",
        school: "Science High",
        score: 89.3,
        accuracy: 88.7,
        submissions: 4,
        lastSubmission: "2025-01-15T15:20:00Z",
      },
      {
        name: "Neural Network",
        school: "Central High",
        score: 87.1,
        accuracy: 85.9,
        submissions: 6,
        lastSubmission: "2025-01-15T12:15:00Z",
      },
      {
        name: "Binary Beasts",
        school: "Innovation School",
        score: 84.6,
        accuracy: 83.2,
        submissions: 2,
        lastSubmission: "2025-01-15T16:00:00Z",
      },
    ];

    return mockData.map((team, index) => ({
      ...team,
      rank: index + 1,
      id: `team_${index + 1}`,
    }));
  }

  showLoading() {
    const container = document.querySelector(".leaderboard-container");
    if (container) {
      container.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading leaderboard...</p>
                </div>
            `;
    }
  }

  showPreCompetitionMessage() {
    const container = document.querySelector(".leaderboard-container");
    if (container) {
      container.innerHTML = `
                <div class="no-data">
                    <div class="no-data-message">
                        <div class="no-data-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h3>Competition Not Started</h3>
                        <p>The leaderboard will be updated in real-time once the competition begins (TBD).</p>
                        
                        <div class="timeline-preview">
                            <h4>What to expect:</h4>
                            <div class="timeline-item">
                                <strong>Real-time updates</strong> - See your ranking change as you submit
                            </div>
                            <div class="timeline-item">
                                <strong>Anonymous rankings</strong> - Teams shown by ID during competition
                            </div>
                            <div class="timeline-item">
                                <strong>Final reveal</strong> - Team names revealed at closing ceremony
                            </div>
                        </div>
                        
                        <button class="btn btn-primary demo-btn" onclick="leaderboard.enableDemo()">
                            <i class="fas fa-play"></i> View Demo Leaderboard
                        </button>
                    </div>
                </div>
            `;
    }
  }

  enableDemo() {
    this.isLive = true;
    this.loadLeaderboard();
  }

  displayLeaderboard(data) {
    const container = document.querySelector(".leaderboard-container");
    if (!container || !data.length) return;

    const leaderboardHTML = `
            <div class="leaderboard-table">
                <div class="table-header">
                    <div class="rank-col">Rank</div>
                    <div class="team-col">Team</div>
                    <div class="school-col">School</div>
                    <div class="score-col">Score</div>
                    <div class="accuracy-col">Accuracy</div>
                    <div class="submissions-col">Submissions</div>
                    <div class="time-col">Last Submission</div>
                </div>
                <div class="table-body">
                    ${data.map((team) => this.renderTeamRow(team)).join("")}
                </div>
            </div>
        `;

    container.innerHTML = leaderboardHTML;
  }

  renderTeamRow(team) {
    const medalIcon = this.getMedalIcon(team.rank);
    const lastSubmissionTime = this.formatTime(team.lastSubmission);

    return `
            <div class="table-row ${
              team.rank <= 3 ? "top-rank" : ""
            }" data-team-id="${team.id}">
                <div class="rank-col">
                    <span class="rank-number">${team.rank}</span>
                    ${medalIcon}
                </div>
                <div class="team-col">
                    <div class="team-info">
                        <span class="team-name">${team.name}</span>
                        <span class="team-id">${team.id}</span>
                    </div>
                </div>
                <div class="school-col">${team.school}</div>
                <div class="score-col">
                    <span class="score-value">${team.score}</span>
                </div>
                <div class="accuracy-col">${team.accuracy}%</div>
                <div class="submissions-col">
                    <span class="submission-count">${team.submissions}</span>
                </div>
                <div class="time-col">
                    <span class="submission-time">${lastSubmissionTime}</span>
                </div>
            </div>
        `;
  }

  getMedalIcon(rank) {
    const medals = {
      1: '<i class="fas fa-trophy" style="color: #FFD700;"></i>',
      2: '<i class="fas fa-medal" style="color: #C0C0C0;"></i>',
      3: '<i class="fas fa-medal" style="color: #CD7F32;"></i>',
    };
    return medals[rank] || "";
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  updateStats(data) {
    const stats = {
      totalTeams: data.length,
      activeSubmissions: data.reduce((sum, team) => sum + team.submissions, 0),
      bestAccuracy: Math.max(...data.map((team) => team.accuracy)),
      averageScore: (
        data.reduce((sum, team) => sum + team.score, 0) / data.length
      ).toFixed(1),
    };

    this.updateStatElement("Registered Teams", stats.totalTeams);
    this.updateStatElement("Active Submissions", stats.activeSubmissions);
    this.updateStatElement("Best Accuracy", `${stats.bestAccuracy}%`);
    this.updateStatElement("Average Score", stats.averageScore);
  }

  updateStatElement(label, value) {
    const statItems = document.querySelectorAll(".stat-item");
    statItems.forEach((item) => {
      const h3 = item.querySelector("h3");
      if (h3 && h3.textContent === label) {
        const numberSpan = item.querySelector(".stat-number");
        if (numberSpan) {
          numberSpan.textContent = value;
        }
      }
    });
  }

  applyFilters() {
    const rows = document.querySelectorAll(".table-row");
    rows.forEach((row) => {
      // Filter logic based on this.currentFilter
      // For now, show all rows
      row.style.display = "flex";
    });
  }

  applySort() {
    // Re-fetch and re-sort data based on this.currentSort
    this.loadLeaderboard();
  }

  showError() {
    const container = document.querySelector(".leaderboard-container");
    if (container) {
      container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Unable to Load Leaderboard</h3>
                    <p>Please check your connection and try again.</p>
                    <button class="btn btn-primary retry-btn" onclick="leaderboard.loadLeaderboard()">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
    }
  }
}

/**
 * Google Sheets Integration Methods
 * Choose one of these methods to connect to your Google Sheet
 */

// Method 1: Direct CSV Export (Simplest)
class GoogleSheetCSV {
  constructor(sheetId, gid = 0) {
    this.csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  }

  async fetchData() {
    try {
      // Note: This may have CORS issues. Use a proxy if needed.
      const response = await fetch(this.csvUrl);
      const csvText = await response.text();
      return this.parseCSV(csvText);
    } catch (error) {
      console.error("CSV fetch error:", error);
      // Fallback to JSONP or proxy
      return this.fetchViaProxy();
    }
  }

  async fetchViaProxy() {
    // Using a CORS proxy for demo purposes
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      this.csvUrl
    )}`;
    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();
      return this.parseCSV(data.contents);
    } catch (error) {
      console.error("Proxy fetch error:", error);
      return [];
    }
  }

  parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());

    return lines
      .slice(1)
      .map((line, index) => {
        const values = line.split(",").map((v) => v.replace(/"/g, "").trim());
        const row = { id: `team_${index + 1}` };
        headers.forEach((header, idx) => {
          row[header.toLowerCase().replace(/\s+/g, "_")] = values[idx] || "";
        });
        return row;
      })
      .filter((row) => row.team_name || row.name); // Filter out empty rows
  }
}

// Method 2: SheetDB Integration (Recommended)
class SheetDBIntegration {
  constructor(sheetdbUrl) {
    this.apiUrl = sheetdbUrl;
    this.cache = null;
    this.lastFetch = 0;
    this.cacheTimeout = 30000; // 30 seconds
  }

  async fetchData(track = null) {
    // Use cache if recent
    if (this.cache && Date.now() - this.lastFetch < this.cacheTimeout) {
      return this.filterData(this.cache, track);
    }

    try {
      let url = this.apiUrl;
      if (track) {
        url += `/search?track=${track}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      this.cache = Array.isArray(data) ? data : [];
      this.lastFetch = Date.now();

      return this.filterData(this.cache, track);
    } catch (error) {
      console.error("SheetDB fetch error:", error);
      return this.cache || [];
    }
  }

  filterData(data, track) {
    if (!track || !Array.isArray(data)) return data;
    return data.filter((row) => {
      const rowTrack = row.track || row.Track || "";
      return rowTrack.toLowerCase().includes(track.toLowerCase());
    });
  }

  normalizeData(rawData) {
    return rawData.map((row, index) => ({
      id: row.id || `team_${index + 1}`,
      name: row.team_name || row.name || row.Team || `Team ${index + 1}`,
      team: row.team_name || row.name || row.Team || `Team ${index + 1}`,
      school: row.school || row.School || row.organization || "Unknown",
      score: parseFloat(row.score || row.Score || 0),
      accuracy: parseFloat(row.accuracy || row.Accuracy || 0),
      submissions: parseInt(row.submissions || row.Submissions || 1),
      lastSubmission:
        row.timestamp || row.last_update || new Date().toISOString(),
      track: row.track || row.Track || "",
    }));
  }
}

// Method 3: Google Apps Script Web App
class GoogleAppsScript {
  constructor(webAppUrl) {
    this.apiUrl = webAppUrl;
  }

  async fetchData() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Apps Script fetch error:", error);
      return [];
    }
  }
}

// Initialize leaderboard when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get track from current page URL or data attribute
  const track =
    document.body.dataset.track ||
    window.location.pathname.includes("high-school")
      ? "high-school"
      : window.location.pathname.includes("undergraduate")
      ? "undergraduate"
      : window.location.pathname.includes("graduate")
      ? "graduate-plus"
      : "unknown";

  window.leaderboard = new LeaderboardManager(track);
});
