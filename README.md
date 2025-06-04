# IMSC Hackathon 2025 Website

A comprehensive, multi-track website for the IMSC Hackathon 2025 event. Built with vanilla HTML, CSS, and JavaScript for optimal performance and easy deployment on GitHub Pages.

## 🎯 Features

- **Multi-Track Competition**: Separate tracks for High School, Undergraduate, and Graduate+ participants
- **Modern Design**: Clean, professional interface with smooth animations
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth scrolling, hover effects, and dynamic leaderboards
- **Comprehensive Content**: Complete information for each track including datasets, timelines, and criteria
- **Optimized Performance**: Fast loading with minimal dependencies
- **SEO Friendly**: Proper semantic HTML structure
- **GitHub Pages Ready**: Direct deployment without build process

## 📱 Website Structure

### Main Pages
- **Home**: Event overview with track selection and key information
- **Organizers**: Complete team information and contact details

### Consolidated Competition Tracks
Each track is now presented as a single comprehensive page with smooth section navigation:

#### High School Track (Consolidated)
- **Overview**: Track introduction and requirements
- **Dataset**: Simplified machine learning challenge
- **Timeline**: 2-week competition schedule
- **Criteria**: Evaluation based on accuracy and presentation
- **Leaderboard**: Live rankings and submission tracking

#### Undergraduate Track (Consolidated)
- **Overview**: Intermediate-level competition details
- **Dataset**: Advanced machine learning problem
- **Timeline**: 4-week development period
- **Criteria**: Technical excellence and innovation focus
- **Leaderboard**: Comprehensive evaluation metrics

#### Graduate+ Track (Consolidated)
- **Overview**: Research-level competition
- **Dataset**: Complex, research-grade challenge
- **Timeline**: 8-week development with peer review
- **Criteria**: Research innovation and technical contribution
- **Leaderboard**: Multi-phase evaluation with expert judging

## 📁 File Structure

```
imsc-hackathon-2025/
├── index.html                           # Homepage
├── README.md                            # Main documentation
├── GOOGLE-SHEETS-INTEGRATION.md         # Google Sheets setup guide
├── IMPLEMENTATION-COMPLETE.md           # Implementation summary
├── LEADERBOARD-SETUP.md                 # Leaderboard configuration guide
├── assets/
│   ├── css/
│   │   └── styles.css                  # Main stylesheet with modern design
│   └── js/
│       ├── script.js                   # Core JavaScript functionality
│       └── leaderboard.js              # Live leaderboard functionality
└── pages/
    ├── organizers.html                 # Organizers and team info
    ├── high-school-consolidated.html   # Complete high school track
    ├── undergraduate-consolidated.html # Complete undergraduate track
    └── graduate-plus-consolidated.html # Complete graduate+ track
```

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/imsc-hackathon-2025.git
cd imsc-hackathon-2025
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have live-server installed)
npx live-server

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000` to view the website

### GitHub Pages Deployment

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch" as source
4. Choose `main` branch and `/ (root)` folder
5. Your site will be available at `https://yourusername.github.io/imsc-hackathon-2025`

## 🎨 Customization

### Colors
The website uses a purple gradient theme. To change colors, update the CSS variables in `styles.css`:

```css
/* Main gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Update these hex codes to your preferred colors */
```

### Content
Update the following files to customize content:

- **Event Details**: Edit hero section in `index.html`
- **Schedule**: Modify timeline events in the schedule section
- **Prizes**: Update prize amounts and categories
- **Sponsors**: Replace sponsor placeholders with actual logos
- **Contact Info**: Update email, phone, and address

### Images
Add your images to an `images/` folder and update the references in:
- Sponsor logos
- Team photos
- Event photos
- Favicon

## 📝 Content Updates

### Event Information
Update these key details in `index.html`:

```html
<!-- Hero section -->
<h1 class="hero-title">IMSC Hackathon 2025</h1>
<span>TBD</span>
<span>USC Campus, Los Angeles</span>

<!-- Contact information -->
<p>info@imsc-hackathon.com</p>
<p>+1 (555) 123-4567</p>
```

### Registration Link
Update the registration button URL:

```html
<a href="https://forms.google.com/your-registration-form" class="btn btn-primary btn-large">Register Now</a>
```

## 🛠️ Technical Details

### Dependencies
- **Fonts**: Google Fonts (Inter)
- **Icons**: Font Awesome 6.0
- **Framework**: Vanilla HTML/CSS/JS (no build process required)

### Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

### Performance
- Optimized images and assets
- Minimal JavaScript for fast loading
- CSS animations with hardware acceleration
- Responsive images for different screen sizes

## 📱 Mobile Optimization

The website is fully responsive with:
- Mobile-first design approach
- Touch-friendly navigation
- Optimized font sizes and spacing
- Hamburger menu for mobile devices
- Fast loading on slower connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions about the website or event:
- Email: info@imsc-hackathon.com
- Phone: +1 (555) 123-4567
- GitHub Issues: [Create an issue](https://github.com/yourusername/imsc-hackathon-2025/issues)

## 🎉 Acknowledgments

- Design inspired by modern tech conference websites
- Icons provided by Font Awesome
- Fonts by Google Fonts
- Built with ❤️ for the developer community

---

**Ready to hack? Visit [imsc-hackathon-2025.github.io](https://imsc-hackathon-2025.github.io) to learn more!**

## 🏆 Live Leaderboards

Each track features a fully functional leaderboard system with:

### Features
- **Real-time Updates**: Automatic refresh every 30 seconds during competition
- **Interactive Controls**: Filter by team categories and sort by different metrics
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Demo Mode**: Preview functionality before competition starts
- **Multiple Data Sources**: Supports Google Sheets, Firebase, Airtable, and JSON files

### Current Status
The leaderboards are implemented and ready to go live. Currently in demo mode showing sample data.

### Setup Options
Choose from 5 free implementation options:

1. **Google Sheets + SheetDB** (Recommended)
   - Free tier: 200 requests/month
   - Easy setup in 5 minutes
   - Real-time collaboration

2. **Firebase Realtime Database**
   - 1GB storage, 10GB bandwidth/month free
   - True real-time updates
   - Best for live competitions

3. **JSON Files + GitHub**
   - Completely free
   - Simple file-based updates
   - Perfect for smaller events

4. **Airtable API**
   - 1,000 requests/month free
   - Database-like interface
   - Good for data management

5. **Supabase**
   - 500MB database, 2GB bandwidth/month free
   - PostgreSQL with real-time features
   - Modern alternative to Firebase

### Quick Setup
1. Follow instructions in `LEADERBOARD-SETUP.md`
2. Choose your preferred data source
3. Update API configuration in `assets/js/leaderboard.js`
4. Set `isLive = true` to enable live mode
