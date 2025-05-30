# 📊 Google Sheets Integration Guide

## Method 1: Direct Google Sheets CSV Export (Simplest)

### Step 1: Make Google Sheet Public
1. Open your Google Sheet
2. Click "Share" → "Change to anyone with the link"
3. Set permissions to "Viewer"
4. Copy the sheet URL (looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0`)

### Step 2: Get CSV Export URL
Replace `SHEET_ID` with your actual sheet ID:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0
```

### Step 3: JavaScript Implementation
```javascript
class GoogleSheetsLeaderboard {
    constructor(sheetId, gid = 0) {
        this.csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }

    async fetchData() {
        try {
            const response = await fetch(this.csvUrl);
            const csvText = await response.text();
            return this.parseCSV(csvText);
        } catch (error) {
            console.error('Error fetching Google Sheets data:', error);
            return [];
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        
        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });
    }

    async displayTable(containerId) {
        const data = await this.fetchData();
        const container = document.getElementById(containerId);
        
        if (!data.length) {
            container.innerHTML = '<p>No data available</p>';
            return;
        }

        const headers = Object.keys(data[0]);
        
        let html = `
            <table class="google-sheets-table">
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${headers.map(header => `<td>${row[header]}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
    }
}

// Usage Example:
// const leaderboard = new GoogleSheetsLeaderboard('YOUR_SHEET_ID');
// leaderboard.displayTable('leaderboard-container');
```

---

## Method 2: Google Sheets JSON API (More Features)

### Step 1: Publish Sheet as Web App
1. In Google Sheets: Extensions → Apps Script
2. Paste this code:
```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```
3. Deploy as Web App → Anyone can access
4. Copy the web app URL

### Step 2: JavaScript Implementation
```javascript
class GoogleSheetsAPI {
    constructor(webAppUrl) {
        this.apiUrl = webAppUrl;
    }

    async fetchData() {
        try {
            const response = await fetch(this.apiUrl);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    async createLeaderboard(containerId) {
        const data = await this.fetchData();
        const container = document.getElementById(containerId);
        
        if (!data.length) {
            container.innerHTML = '<div class="no-data">No data available</div>';
            return;
        }

        // Sort by score (assuming there's a 'score' column)
        data.sort((a, b) => parseFloat(b.score || 0) - parseFloat(a.score || 0));

        let html = `
            <div class="leaderboard-table">
                <div class="table-header">
                    <div>Rank</div>
                    <div>Team</div>
                    <div>Score</div>
                    <div>School</div>
                </div>
                <div class="table-body">
                    ${data.map((team, index) => `
                        <div class="table-row ${index < 3 ? 'top-rank' : ''}">
                            <div class="rank-col">
                                <span class="rank-number">${index + 1}</span>
                                ${this.getMedalIcon(index + 1)}
                            </div>
                            <div class="team-col">${team.team || team.name || 'Team ' + (index + 1)}</div>
                            <div class="score-col">${team.score || '0'}</div>
                            <div class="school-col">${team.school || team.organization || '-'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    getMedalIcon(rank) {
        const medals = {
            1: '<i class="fas fa-trophy" style="color: #FFD700;"></i>',
            2: '<i class="fas fa-medal" style="color: #C0C0C0;"></i>',
            3: '<i class="fas fa-medal" style="color: #CD7F32;"></i>'
        };
        return medals[rank] || '';
    }
}

// Usage:
// const sheets = new GoogleSheetsAPI('YOUR_WEB_APP_URL');
// sheets.createLeaderboard('leaderboard-container');
```

---

## Method 3: SheetDB (Recommended - No Code Required)

### Step 1: Create SheetDB Account
1. Go to [SheetDB.io](https://sheetdb.io)
2. Sign up (free tier: 200 requests/month)
3. Connect your Google Sheet
4. Get your API URL: `https://sheetdb.io/api/v1/YOUR_SHEET_ID`

### Step 2: Ready-to-Use Implementation
```javascript
class SheetDBLeaderboard {
    constructor(sheetdbUrl) {
        this.apiUrl = sheetdbUrl;
        this.cache = null;
        this.lastFetch = 0;
        this.cacheTimeout = 60000; // 1 minute cache
    }

    async fetchData(track = null) {
        // Use cache if recent
        if (this.cache && (Date.now() - this.lastFetch) < this.cacheTimeout) {
            return this.filterByTrack(this.cache, track);
        }

        try {
            let url = this.apiUrl;
            if (track) {
                url += `/search?track=${track}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            this.cache = data;
            this.lastFetch = Date.now();
            
            return data;
        } catch (error) {
            console.error('SheetDB fetch error:', error);
            return [];
        }
    }

    filterByTrack(data, track) {
        if (!track) return data;
        return data.filter(row => 
            row.track && row.track.toLowerCase() === track.toLowerCase()
        );
    }

    async updateLeaderboard(containerId, track = null) {
        const data = await this.fetchData(track);
        const container = document.getElementById(containerId);
        
        if (!data.length) {
            container.innerHTML = `
                <div class="no-data">
                    <p>No submissions yet for ${track || 'this track'}</p>
                </div>
            `;
            return;
        }

        // Sort by score descending
        const sortedData = data.sort((a, b) => 
            parseFloat(b.score || 0) - parseFloat(a.score || 0)
        );

        const html = this.generateLeaderboardHTML(sortedData);
        container.innerHTML = html;
        
        // Update stats
        this.updateStats(sortedData);
    }

    generateLeaderboardHTML(data) {
        return `
            <div class="leaderboard-table">
                <div class="table-header">
                    <div class="rank-col">Rank</div>
                    <div class="team-col">Team</div>
                    <div class="score-col">Score</div>
                    <div class="accuracy-col">Accuracy</div>
                    <div class="submissions-col">Submissions</div>
                    <div class="time-col">Last Update</div>
                </div>
                <div class="table-body">
                    ${data.map((team, index) => this.generateTeamRow(team, index + 1)).join('')}
                </div>
            </div>
        `;
    }

    generateTeamRow(team, rank) {
        const medalIcon = this.getMedalIcon(rank);
        const timeAgo = this.timeAgo(team.timestamp || team.last_update);
        
        return `
            <div class="table-row ${rank <= 3 ? 'top-rank' : ''}">
                <div class="rank-col">
                    <span class="rank-number">${rank}</span>
                    ${medalIcon}
                </div>
                <div class="team-col">
                    <div class="team-name">${team.team_name || team.name || 'Team ' + rank}</div>
                    <div class="team-members">${team.members || ''}</div>
                </div>
                <div class="score-col">
                    <span class="score-value">${parseFloat(team.score || 0).toFixed(1)}</span>
                </div>
                <div class="accuracy-col">${parseFloat(team.accuracy || 0).toFixed(1)}%</div>
                <div class="submissions-col">
                    <span class="submission-count">${team.submissions || 1}</span>
                </div>
                <div class="time-col">
                    <span class="submission-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }

    getMedalIcon(rank) {
        const medals = {
            1: '<i class="fas fa-trophy" style="color: #FFD700; margin-left: 5px;"></i>',
            2: '<i class="fas fa-medal" style="color: #C0C0C0; margin-left: 5px;"></i>',
            3: '<i class="fas fa-medal" style="color: #CD7F32; margin-left: 5px;"></i>'
        };
        return medals[rank] || '';
    }

    timeAgo(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    updateStats(data) {
        // Update statistics in the UI
        const totalTeams = data.length;
        const totalSubmissions = data.reduce((sum, team) => sum + parseInt(team.submissions || 1), 0);
        const bestScore = Math.max(...data.map(team => parseFloat(team.score || 0)));
        const avgScore = (data.reduce((sum, team) => sum + parseFloat(team.score || 0), 0) / totalTeams).toFixed(1);

        this.updateStatDisplay('Registered Teams', totalTeams);
        this.updateStatDisplay('Total Submissions', totalSubmissions);
        this.updateStatDisplay('Best Score', bestScore.toFixed(1));
        this.updateStatDisplay('Average Score', avgScore);
    }

    updateStatDisplay(label, value) {
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            const h3 = item.querySelector('h3');
            if (h3 && h3.textContent.includes(label.split(' ')[0])) {
                const numberSpan = item.querySelector('.stat-number');
                if (numberSpan) {
                    numberSpan.textContent = value;
                }
            }
        });
    }

    // Auto-refresh functionality
    startAutoRefresh(containerId, track = null, intervalMs = 30000) {
        setInterval(() => {
            this.updateLeaderboard(containerId, track);
        }, intervalMs);
    }
}

// Usage Example:
// const leaderboard = new SheetDBLeaderboard('https://sheetdb.io/api/v1/YOUR_SHEET_ID');
// leaderboard.updateLeaderboard('leaderboard-container', 'high-school');
// leaderboard.startAutoRefresh('leaderboard-container', 'high-school', 30000);
```

---

## 📋 Sample Google Sheet Structure

Create a Google Sheet with these columns:

| team_name | score | accuracy | submissions | track | school | members | timestamp |
|-----------|-------|----------|-------------|-------|---------|---------|-----------|
| Team Alpha | 95.2 | 94.8 | 3 | high-school | Central High | John, Jane | 2025-05-29T10:30:00 |
| Code Warriors | 92.7 | 91.5 | 2 | high-school | Tech Academy | Mike, Sarah | 2025-05-29T09:45:00 |
| Data Miners | 89.3 | 88.7 | 4 | undergraduate | State University | Alex, Chris | 2025-05-29T11:20:00 |

---

## 🎯 Quick Integration with Your Current Site

I can integrate any of these methods with your existing leaderboard. Which approach would you prefer?

1. **Method 1 (CSV)**: Simplest, no external services needed
2. **Method 2 (Apps Script)**: More control, JSON format
3. **Method 3 (SheetDB)**: Most features, easiest to manage

Let me know which method you'd like to implement, and I'll integrate it into your current leaderboard system!
