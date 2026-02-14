<img width="1280" height="640" alt="image" src="https://github.com/user-attachments/assets/98e91fe5-b074-4e77-a074-cb54a4f0f24b" />



# Nexora 🎯

## Basic Details
### Team Name: ScriptForge

### Team Members
- **Member 1:** Akhila P S - NSS College of Engineering
- **Member 2:** Aiswarya S - NSS College of Engineering

### Hosted Project Link
[Add your hosted project link here]

---

## Project Description
Nexora is an all-in-one placement preparation platform featuring AI-powered resume analysis, live coding tests, aptitude assessments, Versant testing, and real-time confidence analysis using camera and voice recognition.

---

## The Problem Statement
Students face scattered resources for placement preparation, lacking an integrated platform that combines coding practice, aptitude tests, interview preparation, confidence building, and progress tracking in one place.

---

## The Solution
Nexora provides a comprehensive web application with:
- **AI Resume Analyzer** using Claude API for instant feedback
- **Live Coding Environment** with JavaScript/Python execution
- **Aptitude & Versant Tests** with speech recognition
- **Confidence Analyzer** using camera/microphone for real-time analysis
- **Mistake Book** for tracking and learning from errors
- **Analytics Dashboard** for progress visualization

---

## Technical Details

### Technologies/Components Used

**Languages:**
- JavaScript
- Python (in-browser via Pyodide)
- HTML/CSS

**Frameworks:**
- React 18
- Node.js
- Express.js

**Libraries:**
- React Router 6
- Framer Motion (animations)
- Recharts (data visualization)
- Monaco Editor (code editor)
- React Webcam (camera access)
- Axios (HTTP client)
- Mongoose (MongoDB ODM)
- Multer (file uploads)
- PDF-Parse (PDF processing)

**Tools:**
- MongoDB Atlas (database)
- Anthropic Claude API (AI analysis)
- Web Speech API (speech recognition)
- VS Code
- Git

---

## Features

1. **Dashboard**
   - Real-time progress tracking with charts
   - Daily goals visualization
   - Streak tracking for consistency

2. **Aptitude Test**
   - 50+ unique questions across 5 test sets
   - 20-minute timed tests
   - Detailed solutions with step-by-step explanations

3. **Coding Environment**
   - LeetCode-style split interface
   - JavaScript & Python support (in-browser execution)
   - Real-time test case validation
   - Monaco Editor with syntax highlighting

4. **Versant Test**
   - 7 comprehensive sections (Reading, Listening, Speaking, Typing)
   - Text-to-speech & speech recognition
   - 15-minute timed assessment

5. **Confidence Analyzer**
   - Live camera and microphone analysis
   - Real-time confidence scoring (0-100%)
   - Tracks: Eye contact, voice clarity, posture, speech pace, filler words, gestures
   - Speech-to-text transcription

6. **Mistake Book**
   - Automatic mistake tracking from all tests
   - Search and filter by category
   - Detailed explanations for each mistake
   - Review tracking system

7. **Resume Analyzer**
   - AI-powered analysis using Claude API
   - Score breakdown and improvement suggestions
   - ATS compatibility check

8. **Interview Prep**
   - 100+ curated questions across 6 categories
   - Show/hide answers
   - Completion tracking

9. **Analytics**
   - Interactive charts for performance trends
   - Weak area identification
   - Weekly/monthly overview

10. **Progress Tracker**
    - Daily activity logging
    - Topics covered tracking
    - Notes and reflections

---

## Implementation

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd nexora

# Backend setup
cd backend
npm install
# Create .env file with MongoDB URI and Anthropic API key
npm start

# Frontend setup (in new terminal)
cd ../frontend
npm install
npm install react-webcam --legacy-peer-deps
npm start
```

### Run
```bash
# Backend (Terminal 1)
cd backend
npm install
npm run dev
# Runs on http://localhost:5000

# Frontend (Terminal 2)
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## Project Documentation

### Screenshots

**Dashboard**
![Dashboard Screenshot](screenshots/dashboard.png)
*Main dashboard showing progress overview, daily goals, and quick action buttons*

**Aptitude Test**
![Aptitude Test Screenshot](screenshots/aptitude.png)
*Timed aptitude test with real-time scoring and instant feedback*

**Coding Environment**
![Coding Environment Screenshot](screenshots/coding.png)
*LeetCode-style coding interface with split layout and live test execution*

**Confidence Analyzer**
![Confidence Analyzer Screenshot](screenshots/confidence.png)
*Live confidence analysis with camera feed and real-time metrics*

**Mistake Book**
![Mistake Book Screenshot](screenshots/mistakes.png)
*Organized mistake tracking with detailed explanations and review system*

**Versant Test**
![Versant Test Screenshot](screenshots/versant.png)
*English proficiency test with speech recognition and text-to-speech*

---

### Diagrams

**System Architecture:**
```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   React     │─────▶│  Express.js │─────▶│   MongoDB    │
│  Frontend   │      │   Backend   │      │    Atlas     │
└─────────────┘      └─────────────┘      └──────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│ Web Speech  │      │ Claude API  │
│     API     │      │ (Resume AI) │
└─────────────┘      └─────────────┘
```
*Nexora uses a MERN stack architecture with React frontend, Express backend, MongoDB database, and integrates Web Speech API for voice features and Claude API for AI-powered resume analysis*

**Application Workflow:**
```
User Login → Dashboard → Select Feature
                            ↓
            ┌───────────────┼───────────────┐
            ↓               ↓               ↓
     Aptitude Test    Coding Test    Confidence Test
            ↓               ↓               ↓
    Auto-save mistakes → Mistake Book ← Track progress
            ↓
    View Analytics → Identify weak areas → Improve
```
*User workflow showing how students can practice, track mistakes, and monitor improvement*

---

## API Documentation

### Base URL
`http://localhost:5000/api`

### Endpoints

**GET** `/api/progress/:userId`
- Description: Fetch user's progress data
- Parameters: 
  - `userId` (string): User ID
- Response:
```json
{
  "status": "success",
  "progress": [
    {
      "date": "2024-02-14",
      "codingProblems": 5,
      "aptitudeScore": 85,
      "topics": ["Arrays", "Strings"]
    }
  ]
}
```

**POST** `/api/progress`
- Description: Save daily progress entry
- Request Body:
```json
{
  "userId": "user123",
  "date": "2024-02-14",
  "codingProblems": 5,
  "aptitudeScore": 85,
  "topicsCovered": ["Arrays"],
  "weakTopics": ["DP"],
  "interviewQuestions": 10,
  "notes": "Good progress today"
}
```

**POST** `/api/resume/analyze`
- Description: Analyze uploaded resume using AI
- Content-Type: `multipart/form-data`
- Request Body:
  - `resume` (file): PDF or TXT file
- Response:
```json
{
  "status": "success",
  "analysis": {
    "score": 75,
    "missingSkills": ["Docker", "AWS"],
    "strengths": ["React", "Node.js"],
    "improvements": ["Add certifications", "Quantify achievements"],
    "suggestions": ["Improve formatting", "Add project links"]
  }
}
```

**GET** `/api/analytics/:userId`
- Description: Get analytics data for dashboard
- Parameters:
  - `userId` (string): User ID

**GET** `/api/questions/:topic`
- Description: Get interview questions by topic
- Parameters:
  - `topic` (string): e.g., "javascript", "react", "python"

---

## Project Demo

### Video
[Add your demo video link here - YouTube, Google Drive, etc.]

*Demo showcases: Dashboard overview, taking an aptitude test, solving coding problems, confidence analysis session, and reviewing mistakes in the Mistake Book*

### Additional Demos
- **Live Demo:** [Add hosted project link]
- **GitHub Repository:** [Add GitHub link]

---

## Team Contributions

- **Akhila P S:** Backend development, API design, MongoDB integration, Claude AI integration, server setup
- **Aiswarya S:** Frontend development, UI/UX design, React components, state management, responsive design

---

## License
This project is licensed under the MIT License.

---

Made with ❤️ at TinkerHub
