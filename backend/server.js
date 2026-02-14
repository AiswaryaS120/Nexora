const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// CORS Configuration for Production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
// Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Allow only your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow token header
  credentials: true  // If using cookies/sessions later
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────
//           Authentication Middleware
// ────────────────────────────────────────────────

const authMiddleware = (req, res, next) => {
  // Get token from header (format: "Bearer eyJhbGciOi..." )
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided – please login' });
  }

  try {
    // Verify token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Save userId so later routes can use it
    req.userId = decoded.userId;
    next(); // Allow the request to continue
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token – please login again' });
  }
};

// ────────────────────────────────────────────────
//         PASTE ENDS HERE
// ────────────────────────────────────────────────

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hirehub', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  codingProblems: { type: Number, default: 0 },
  aptitudeScore: { type: Number, default: 0 },
  topicsCovered: [String],
  weakTopics: [String],
  interviewQuestions: { type: Number, default: 0 },
  notes: String
});

const ResumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeText: String,
  analysis: {
    missingSkills: [String],
    suggestions: [String],
    score: Number,
    strengths: [String],
    improvements: [String]
  },
  analyzedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Progress = mongoose.model('Progress', ProgressSchema);
const ResumeAnalysis = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);

// AI Resume Analysis Function (using Anthropic Claude API)
async function analyzeResumeWithAI(resumeText) {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Analyze this resume and provide:
1. Missing technical skills for software engineering roles
2. Improvement suggestions
3. Overall score (0-100)
4. Key strengths
5. Areas to improve

Resume:
${resumeText}

Respond ONLY in this JSON format:
{
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "score": 75,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const analysisText = response.data.content[0].text;
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback analysis if API fails
    return generateFallbackAnalysis(resumeText);
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    return generateFallbackAnalysis(resumeText);
  }
}

// Fallback analysis when AI is not available
function generateFallbackAnalysis(resumeText) {
  const text = resumeText.toLowerCase();
  const skills = ['react', 'node', 'python', 'java', 'sql', 'aws', 'docker', 'git'];
  const foundSkills = skills.filter(skill => text.includes(skill));
  const missingSkills = skills.filter(skill => !text.includes(skill));

  return {
    missingSkills: missingSkills.slice(0, 5),
    suggestions: [
      'Add quantifiable achievements (e.g., "Improved performance by 40%")',
      'Include relevant technical projects with GitHub links',
      'Add certifications or courses completed',
      'Use action verbs (Built, Developed, Implemented)',
      'Ensure consistent formatting throughout'
    ],
    score: Math.min(85, foundSkills.length * 12 + 20),
    strengths: foundSkills.length > 0 ? 
      [`Good technical foundation with ${foundSkills.join(', ')}`] : 
      ['Shows initiative in learning'],
    improvements: [
      'Add more industry-relevant skills',
      'Include measurable project impacts',
      'Enhance technical depth in descriptions'
    ]
  };
}

// Routes

// Health check (public - no auth needed)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HireHub API is running' });
});

// ────────────────────────────────────────────────
//     Add these two new routes for Auth
// ────────────────────────────────────────────────

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      userId: user._id.toString(),
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      userId: user._id.toString(),
      message: 'Logged in successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ────────────────────────────────────────────────
//  PROTECTED ROUTES BELOW
// ────────────────────────────────────────────────

// Upload and analyze resume
app.post('/api/resume/analyze', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let resumeText = '';

    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } else {
      resumeText = req.file.buffer.toString('utf-8');
    }

    const analysis = await analyzeResumeWithAI(resumeText);

    // Save analysis using authenticated userId
    const resumeAnalysis = new ResumeAnalysis({
      userId: req.userId,
      resumeText: resumeText.substring(0, 1000),
      analysis
    });
    await resumeAnalysis.save();

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Save daily progress
app.post('/api/progress', authMiddleware, async (req, res) => {
  try {
    const progress = new Progress({
      ...req.body,
      userId: req.userId   // ← now uses the logged-in user
    });
    await progress.save();
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get progress data (only own data allowed)
// New: allow fetching progress using the JWT (no :userId param) for convenience from the frontend
app.get('/api/progress', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(30);
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Backwards-compatible route that takes userId in the path (keeps existing security checks)
app.get('/api/progress/:userId', authMiddleware, async (req, res) => {
  try {
    // Security: only allow fetching own data
    if (req.params.userId !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this user data' });
    }

    const progress = await Progress.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(30);
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get analytics (only own data allowed)
// Allow fetching analytics without a path param using authenticated user (convenience endpoint)
app.get('/api/analytics', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.userId });
    const analytics = {
      totalProblems: progress.reduce((sum, p) => sum + p.codingProblems, 0),
      avgAptitudeScore: progress.length > 0
        ? progress.reduce((sum, p) => sum + p.aptitudeScore, 0) / progress.length
        : 0,
      totalInterviewQuestions: progress.reduce((sum, p) => sum + p.interviewQuestions, 0),
      weakTopics: [...new Set(progress.flatMap(p => p.weakTopics))],
      streakDays: calculateStreak(progress)
    };
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Backwards-compatible analytics route that accepts a userId path param
app.get('/api/analytics/:userId', authMiddleware, async (req, res) => {
  try {
    // Security: only allow fetching own data
    if (req.params.userId !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const progress = await Progress.find({ userId: req.params.userId });
    
    const analytics = {
      totalProblems: progress.reduce((sum, p) => sum + p.codingProblems, 0),
      avgAptitudeScore: progress.length > 0 
        ? progress.reduce((sum, p) => sum + p.aptitudeScore, 0) / progress.length 
        : 0,
      totalInterviewQuestions: progress.reduce((sum, p) => sum + p.interviewQuestions, 0),
      weakTopics: [...new Set(progress.flatMap(p => p.weakTopics))],
      streakDays: calculateStreak(progress)
    };

    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

function calculateStreak(progress) {
  if (progress.length === 0) return 0;
  
  const sortedDates = progress
    .map(p => new Date(p.date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (new Date(sortedDates[i-1]) - new Date(sortedDates[i])) / (1000 * 60 * 60 * 24);
    if (diff <= 1) streak++;
    else break;
  }
  return streak;
}

// Get interview questions by topic (public - no auth needed for now)
app.get('/api/questions/:topic', (req, res) => {
  const questions = getQuestionsByTopic(req.params.topic);
  res.json({ success: true, questions });
});

function getQuestionsByTopic(topic) {
  const questionBank = {
    javascript: [
      'Explain closures in JavaScript',
      'What is event delegation?',
      'Difference between let, const, and var',
      'Explain promises and async/await',
      'What is the event loop?'
    ],
    react: [
      'Explain React hooks',
      'What is virtual DOM?',
      'Difference between state and props',
      'Explain useEffect lifecycle',
      'What are Higher Order Components?'
    ],
    python: [
      'Explain list comprehensions',
      'What are decorators?',
      'Difference between list and tuple',
      'Explain generators',
      'What is GIL?'
    ],
    dsa: [
      'Implement binary search',
      'Reverse a linked list',
      'Find cycle in a linked list',
      'Implement merge sort',
      'Longest common subsequence'
    ],
    aptitude: [
      'Time and work problems',
      'Probability basics',
      'Permutations and combinations',
      'Profit and loss',
      'Speed, distance, time'
    ]
  };

  return questionBank[topic.toLowerCase()] || [];
}

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});