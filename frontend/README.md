# 🎯 HireHub - Smart Placement Prep Tracker

**AI-Powered Dashboard to Track Your Placement Preparation Journey**

![HireHub](https://img.shields.io/badge/Made%20with-React-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)
![AI](https://img.shields.io/badge/Powered%20by-AI-8b5cf6?style=for-the-badge)

## ✨ Features

### 📊 Core Features
- **Daily Progress Tracking**: Log coding problems, aptitude scores, and interview prep
- **AI Resume Analyzer**: Upload resume and get AI-powered improvement suggestions
- **Interview Question Bank**: 100+ curated questions across multiple topics
- **Analytics Dashboard**: Beautiful charts and insights on your progress
- **Weak Topic Detection**: AI identifies areas needing improvement
- **Streak Tracking**: Maintain daily prep consistency

### 🤖 AI-Powered Features
- **Resume Analysis**: AI identifies missing skills and suggests improvements
- **Smart Recommendations**: Get personalized study suggestions based on weak areas
- **Score Prediction**: AI estimates your readiness score

### 🎨 UI Features
- **Modern Gradient Design**: Beautiful purple-gradient theme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Charts**: Recharts visualizations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (optional, for data persistence)
- Anthropic API Key (for AI features)

### Installation

#### 1. Clone & Navigate
```bash
# Your folder structure should be:
# HireHub/
#   ├── backend/
#   └── frontend/
```

#### 2. Backend Setup
```bash
cd HireHub/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your keys:
# ANTHROPIC_API_KEY=your_key_here
# MONGODB_URI=mongodb://localhost:27017/hirehub

# Start backend server
npm start
# OR for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd HireHub/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## 📦 Dependencies

### Backend
- **express**: Web server framework
- **mongoose**: MongoDB object modeling
- **multer**: File upload handling
- **pdf-parse**: Resume PDF parsing
- **axios**: HTTP client for AI API calls
- **cors**: Enable CORS
- **dotenv**: Environment variables

### Frontend
- **react**: UI library
- **react-router-dom**: Routing
- **framer-motion**: Animations
- **recharts**: Charts and graphs
- **axios**: API calls
- **lucide-react**: Beautiful icons
- **react-hot-toast**: Notifications

## 🎯 Project Structure

```
HireHub/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies
│   └── .env.example       # Environment template
│
└── frontend/
    ├── public/
    │   └── index.html     # HTML template
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.js        # Main dashboard
    │   │   ├── ProgressTracker.js  # Daily progress logging
    │   │   ├── ResumeAnalyzer.js   # AI resume analysis
    │   │   ├── InterviewPrep.js    # Interview questions
    │   │   └── Analytics.js        # Charts & insights
    │   ├── App.js         # Main app component
    │   ├── App.css        # Styling
    │   ├── index.js       # Entry point
    │   └── index.css      # Global styles
    └── package.json       # Dependencies
```

## 🔑 Getting API Keys

### Anthropic API Key (for AI Resume Analysis)
1. Visit https://console.anthropic.com/
2. Sign up / Log in
3. Go to API Keys section
4. Create new API key
5. Copy and paste in `.env` file

**Note**: Without API key, the app will use fallback analysis (still functional)

### MongoDB (Optional)
- **Cloud (Recommended)**: Use MongoDB Atlas (free tier available)
  - Visit https://www.mongodb.com/cloud/atlas
  - Create cluster and get connection string
  
- **Local**: Install MongoDB Community Edition
  - Connection string: `mongodb://localhost:27017/hirehub`

## 🎨 Customization

### Change Theme Colors
Edit `frontend/src/App.css`:
```css
:root {
  --primary: #6366f1;      /* Main purple */
  --secondary: #8b5cf6;    /* Secondary purple */
  --accent: #ec4899;       /* Pink accent */
  /* ... */
}
```

### Add New Topics
Edit `frontend/src/components/InterviewPrep.js`:
```javascript
const questionBank = {
  // Add your topic here
  newtopic: [
    {
      question: 'Your question',
      difficulty: 'Medium',
      answer: 'Your answer'
    }
  ]
};
```

## 📱 Features Showcase

### 1. Dashboard
- Real-time stats overview
- Weekly progress charts
- Quick action buttons
- Daily goals tracker

### 2. Progress Tracker
- Log daily activities
- Track coding problems solved
- Record aptitude scores
- Note weak topics
- Add learning notes

### 3. AI Resume Analyzer
- Upload resume (PDF/TXT)
- Get AI-powered analysis
- See missing skills
- Get improvement suggestions
- Receive resume score (0-100)

### 4. Interview Prep
- 100+ questions across 6 topics
- JavaScript, React, Python, DSA, Aptitude, Behavioral
- Mark questions as completed
- Show/hide answers
- Difficulty levels

### 5. Analytics
- Weekly activity charts
- Aptitude progress trends
- Topic distribution pie chart
- Weak areas identification
- Monthly overview

## 🌟 Unique Features

1. **AI-Powered Resume Analysis**: Unlike basic trackers, HireHub uses Claude AI to analyze resumes
2. **Comprehensive Question Bank**: 100+ curated interview questions
3. **Beautiful UI**: Modern gradient design with smooth animations
4. **Weak Topic Detection**: Smart algorithm identifies areas needing focus
5. **Streak Tracking**: Gamification to maintain consistency

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 5000 (backend)
npx kill-port 5000
```

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check connection string in `.env`
- For cloud: Whitelist your IP in MongoDB Atlas

### API Key Issues
- Verify API key in `.env` file
- Check if key has proper permissions
- App works without key (uses fallback)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy 'build' folder
```

### Backend (Render/Railway)
```bash
cd backend
# Set environment variables in platform
# Deploy repository
```

## 📈 Future Enhancements

- [ ] User authentication (JWT)
- [ ] Social features (compare with peers)
- [ ] Email reminders
- [ ] Mobile app (React Native)
- [ ] Chrome extension
- [ ] PDF report generation
- [ ] LinkedIn integration
- [ ] Company-wise question filters

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use for learning and personal projects!

## 👨‍💻 Author

Created with ❤️ for students preparing for placements

---

## 🎓 Usage Tips

1. **Daily Logging**: Log your progress every evening
2. **Resume Updates**: Upload resume monthly to track improvement
3. **Weak Topics**: Focus on red-flagged topics each week
4. **Consistency**: Maintain your streak for better results
5. **Question Practice**: Complete at least 5 questions daily

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check documentation
- Review troubleshooting section

---

**Happy Coding! 🚀 Good luck with your placements! 🎯**