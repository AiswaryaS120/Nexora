# 🚀 HireHub - Complete Setup Guide

## Step-by-Step Installation Guide

### 📋 What You Need Before Starting

1. **Node.js** - Download from https://nodejs.org/ (choose LTS version)
2. **Code Editor** - VS Code recommended (https://code.visualstudio.com/)
3. **Terminal/Command Prompt** - Built into your OS
4. **MongoDB** (Optional) - For data persistence
5. **Anthropic API Key** (Optional) - For AI features

---

## 🔧 Installation Steps

### Step 1: Verify Node.js Installation

Open terminal/command prompt and run:
```bash
node --version
npm --version
```

You should see version numbers. If not, install Node.js first.

---

### Step 2: Navigate to Your Project

```bash
# Open terminal in your HireHub folder
cd path/to/HireHub

# Verify structure
ls
# Should show: backend/ frontend/ README.md
```

---

### Step 3: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install all dependencies (this may take 2-3 minutes)
npm install

# You should see a node_modules folder created
```

**Create Environment File:**
```bash
# Copy the example file
cp .env.example .env

# For Windows:
copy .env.example .env
```

**Edit .env file** (open in any text editor):
```env
MONGODB_URI=mongodb://localhost:27017/hirehub
ANTHROPIC_API_KEY=your_api_key_here
PORT=5000
JWT_SECRET=your_random_secret_key
```

**To get Anthropic API Key:**
1. Go to https://console.anthropic.com/
2. Sign up for free account
3. Navigate to API Keys
4. Create new key
5. Copy and paste in .env

**Note:** App works WITHOUT API key (uses demo data)

---

### Step 4: Setup Frontend

Open a **NEW terminal window** (keep backend terminal open):

```bash
# Navigate to frontend folder
cd HireHub/frontend

# Install dependencies (2-3 minutes)
npm install
```

---

### Step 5: Install MongoDB (Optional)

#### Option A: Cloud MongoDB (Recommended - Free)
1. Visit https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create free cluster (M0 tier)
4. Get connection string
5. Replace in backend/.env:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hirehub
   ```

#### Option B: Local MongoDB
**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Install and run MongoDB Compass
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

---

### Step 6: Start the Application

#### Terminal 1 - Backend:
```bash
cd HireHub/backend
npm start

# You should see:
# ✅ MongoDB Connected
# 🚀 Server running on port 5000
```

#### Terminal 2 - Frontend:
```bash
cd HireHub/frontend
npm start

# Browser should open automatically at http://localhost:3000
```

---

## 🎯 What You Should See

### Backend Terminal:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Frontend Browser:
Beautiful purple gradient dashboard with navigation:
- Dashboard
- Track Progress
- Resume AI
- Interview Prep
- Analytics

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 5000 already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

---

### Issue 2: "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Windows
rmdir /s node_modules
del package-lock.json
npm install
```

---

### Issue 3: MongoDB Connection Failed

**Solution 1 - Use without MongoDB:**
Comment out MongoDB code in `backend/server.js`:
```javascript
// const connectDB = async () => { ... }
// connectDB().then(() => { ... })

// Replace with:
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

**Solution 2 - Check MongoDB:**
```bash
# Verify MongoDB is running
# Windows: Check Services
# Mac/Linux:
sudo systemctl status mongodb
```

---

### Issue 4: Blank White Screen

**Solutions:**
```bash
# Clear cache
# In browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Or restart dev server
# Stop server: Ctrl+C
npm start
```

---

### Issue 5: API Calls Failing

**Check:**
1. Backend is running (http://localhost:5000)
2. CORS is enabled in backend
3. API endpoint URLs are correct
4. Check browser console for errors (F12)

---

## 📱 Testing the Features

### 1. Test Dashboard
- Visit http://localhost:3000
- Should see stats cards and charts

### 2. Test Progress Tracker
- Click "Track Progress"
- Fill form and submit
- Check if data appears in "Recent Activity"

### 3. Test Resume Analyzer
- Click "Resume AI"
- Upload a PDF/TXT resume
- Click "Analyze with AI"
- Should see analysis results (or demo data if no API key)

### 4. Test Interview Prep
- Click "Interview Prep"
- Select a topic (JavaScript, React, etc.)
- Questions should load
- Click checkmarks to mark complete

### 5. Test Analytics
- Click "Analytics"
- Should see charts and statistics

---

## 🎨 Customization Guide

### Change Colors
Edit `frontend/src/App.css`:
```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
}
```

### Add More Questions
Edit `frontend/src/components/InterviewPrep.js`:
```javascript
const questionBank = {
  javascript: [
    {
      question: 'Your new question?',
      difficulty: 'Medium',
      answer: 'Your answer here'
    }
  ]
}
```

### Modify Dashboard Stats
Edit `frontend/src/components/Dashboard.js`:
```javascript
const [stats, setStats] = useState({
  totalProblems: 200, // Change values
  aptitudeScore: 90,
  // ...
});
```

---

## 🚀 Production Deployment

### Frontend (Vercel - Free)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render - Free)

1. Create account at https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set environment variables
5. Deploy!

### Environment Variables for Production:
```env
MONGODB_URI=your_production_mongodb_uri
ANTHROPIC_API_KEY=your_api_key
PORT=10000
NODE_ENV=production
```

---

## 📊 Monitoring & Logs

### View Backend Logs:
```bash
cd backend
npm start
# Logs appear in terminal
```

### View Frontend Logs:
- Open browser console (F12)
- Check Network tab for API calls
- Check Console tab for errors

---

## 🔒 Security Best Practices

1. **Never commit .env file**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use environment variables**
   - Never hardcode API keys
   - Use process.env.VARIABLE_NAME

3. **Enable CORS properly**
   ```javascript
   // In production, specify allowed origins
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }));
   ```

---

## 📈 Performance Tips

1. **Optimize Images**: Use compressed images
2. **Code Splitting**: Already done with React
3. **Caching**: Enable browser caching
4. **CDN**: Use CDN for static files in production
5. **MongoDB Indexes**: Add indexes for faster queries

---

## 🎓 Learning Resources

- **React**: https://react.dev/
- **Node.js**: https://nodejs.org/docs
- **MongoDB**: https://www.mongodb.com/docs/
- **Framer Motion**: https://www.framer.com/motion/
- **Recharts**: https://recharts.org/

---

## 🆘 Getting Help

### Check Logs
1. Backend terminal - server logs
2. Browser console (F12) - frontend logs
3. Network tab - API call status

### Debug Steps
1. Verify all dependencies installed
2. Check if ports are available
3. Verify environment variables
4. Check MongoDB connection
5. Test API endpoints in Postman

### Common Commands
```bash
# Restart everything
Ctrl+C (in both terminals)
npm start (in both folders)

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check running processes
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :3000
lsof -i :5000
```

---

## ✅ Success Checklist

- [ ] Node.js installed and verified
- [ ] Both frontend and backend dependencies installed
- [ ] .env file created and configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Dashboard visible in browser
- [ ] Can navigate between pages
- [ ] All features working (or demo data showing)

---

**🎉 Congratulations! Your HireHub is now running!**

Start tracking your placement preparation journey! 🚀