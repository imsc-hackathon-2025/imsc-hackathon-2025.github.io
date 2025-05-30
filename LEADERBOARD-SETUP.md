# Live Leaderboard Setup Guide

## Implementation Complete! ✅

The live leaderboard functionality has been successfully implemented with the following features:

### What's Implemented:
- ✅ **Interactive Leaderboard Interface** with modern design
- ✅ **Real-time-ready JavaScript** class (`LeaderboardManager`)
- ✅ **Responsive table layout** with mobile optimization
- ✅ **Filter and sort controls** (All Teams, My School, Top 10)
- ✅ **Live statistics display** (team count, submissions, accuracy)
- ✅ **Demo mode** for testing before competition starts
- ✅ **Loading states and error handling**
- ✅ **Professional styling** matching site theme

### Current State:
The leaderboard is currently in **demo mode** and shows a pre-competition message. When ready for live data, follow the setup instructions below.

## Option 1: Google Sheets + SheetDB (Recommended - FREE)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new sheet called "IMSC Hackathon 2025 Leaderboard"
3. Set up columns:
   ```
   | Name        | Team      | School         | Score | Accuracy | Submissions | Track        | Last Updated |
   |-------------|-----------|----------------|-------|----------|-------------|--------------|--------------|
   | Team Alpha  | Alpha     | Central High   | 95.2  | 94.8     | 5           | high-school  | 2025-01-15   |
   ```

### Step 2: Connect to SheetDB
1. Sign up at [SheetDB.io](https://sheetdb.io) (FREE tier: 200 requests/month)
2. Connect your Google Sheet
3. Get your API URL (looks like: `https://sheetdb.io/api/v1/YOUR_SHEET_ID`)

### Step 3: Update JavaScript
In `/assets/js/leaderboard.js`, replace line 8:
```javascript
// Change this line:
this.apiUrl = 'https://sheetdb.io/api/v1/demo'; // Demo URL for development

// To your actual API:
this.apiUrl = 'https://sheetdb.io/api/v1/YOUR_SHEET_ID';
```

### Step 4: Enable Live Mode
In `/assets/js/leaderboard.js`, change line 11:
```javascript
// Change this line:
this.isLive = false; // Set to true when competition starts

// To:
this.isLive = true; // Competition is live!
```

### Step 5: Test with Real Data
1. Add some test data to your Google Sheet
2. Refresh any track page
3. Click "View Demo Leaderboard" to see live data

## Option 2: JSON File + GitHub (Simplest - FREE)

### Step 1: Create Data Files
Create these files in your project:
```
/data/
  ├── high-school-leaderboard.json
  ├── undergraduate-leaderboard.json
  └── graduate-plus-leaderboard.json
```

### Step 2: JSON Structure
```json
{
  "lastUpdated": "2025-01-15T10:30:00Z",
  "participants": [
    {
      "id": "team_1",
      "name": "Team Alpha",
      "school": "Central High",
      "score": 95.2,
      "accuracy": 94.8,
      "submissions": 5,
      "rank": 1,
      "lastSubmission": "2025-01-15T09:45:00Z"
    }
  ]
}
```

### Step 3: Update JavaScript
Replace the `fetchLeaderboardData()` method in `/assets/js/leaderboard.js`:
```javascript
async fetchLeaderboardData() {
    const response = await fetch(`../data/${this.track}-leaderboard.json`);
    if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
    }
    const data = await response.json();
    return data.participants.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
}
```

## Option 3: Firebase Realtime Database (Most Advanced - FREE)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Realtime Database
4. Set rules for public read access

### Step 2: Install Firebase
Add to your HTML head section:
```html
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"></script>
```

### Step 3: Update JavaScript
Replace the leaderboard manager with Firebase integration (detailed code in implementation guide).

## Testing Your Implementation

### Pre-Launch Checklist:
- [ ] Data source is configured and accessible
- [ ] API keys are properly set (if using external service)
- [ ] Test data is populated
- [ ] `isLive` is set to `true`
- [ ] Auto-refresh is working (every 30 seconds)
- [ ] Filters and sorting work correctly
- [ ] Mobile responsiveness is tested
- [ ] Error handling works for network issues

### Demo Mode Testing:
1. Visit any track page (high-school-consolidated.html, etc.)
2. Scroll to Leaderboard section
3. Click "View Demo Leaderboard"
4. Verify table displays with sample data
5. Test filter buttons (All Teams, My School, Top 10)
6. Test sort dropdown (Score, Accuracy, Submission Time)

## Security Considerations

### For Production:
- Use environment variables for API keys
- Implement rate limiting
- Add data validation
- Consider authentication for updates
- Monitor API usage

### Cost Monitoring:
- **SheetDB**: 200 requests/month free
- **Firebase**: 1GB storage, 10GB bandwidth/month free
- **Airtable**: 1,000 requests/month free

## Support

If you need help implementing any of these options:
1. Review the JavaScript code: `/assets/js/leaderboard.js`
2. Check the Google Sheets integration guide: `/GOOGLE-SHEETS-INTEGRATION.md`
3. Test with demo mode first before going live

The leaderboard is ready to go live - just choose your data source and update the configuration! 🚀
