import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Code, Brain, MessageSquare, 
  Calendar, Award, Target, Zap 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProblems: 0,
    aptitudeScore: 0,
    interviewQuestions: 0,
    streakDays: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('Please login to see your dashboard');
        setLoading(false);
        return;
      }

      try {
        // Fetch progress data from backend
        const response = await axios.get(`http://localhost:5000/api/progress/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const progress = response.data.progress || [];

        if (progress.length > 0) {
          // Calculate real stats
          const totalProblems = progress.reduce((sum, p) => sum + (p.codingProblems || 0), 0);
          const avgScore = progress.length > 0 
            ? progress.reduce((sum, p) => sum + (p.aptitudeScore || 0), 0) / progress.length 
            : 0;
          const totalQuestions = progress.reduce((sum, p) => sum + (p.interviewQuestions || 0), 0);
          const streak = calculateStreak(progress);

          setStats({
            totalProblems,
            aptitudeScore: Math.round(avgScore),
            interviewQuestions: totalQuestions,
            streakDays: streak
          });

          // Last 7 days for chart
          const last7 = progress.slice(-7).map(p => ({
            date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            problems: p.codingProblems || 0,
            score: p.aptitudeScore || 0
          }));
          setRecentActivity(last7);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error('Could not load your dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateStreak = (progress) => {
    if (progress.length === 0) return 0;
    
    const sortedDates = progress
      .map(p => new Date(p.date).toDateString())
      .sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 1;
    const today = new Date().toDateString();
    
    if (sortedDates[0] !== today && 
        new Date(sortedDates[0]).getTime() !== new Date(today).getTime() - 86400000) {
      return 0; // Streak broken
    }
    
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (new Date(sortedDates[i-1]) - new Date(sortedDates[i])) / (1000 * 60 * 60 * 24);
      if (diff <= 1) streak++;
      else break;
    }
    return streak;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dashboard"
    >
      {loading && (
        <div className="flex-center" style={{ minHeight: '60vh' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p className="mt-4 text-gray-400">Loading your dashboard...</p>
        </div>
      )}

      {!loading && (
        <>
          <motion.div variants={itemVariants} className="page-header">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Track your placement preparation journey</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-4 mb-3">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="flex-between">
                <div>
                  <div className="stat-label">Coding Problems</div>
                  <div className="stat-value">{stats.totalProblems}</div>
                  <div className="stat-trend">
                    <TrendingUp size={16} /> {stats.totalProblems > 0 ? '+this week' : 'Start solving!'}
                  </div>
                </div>
                <Code size={48} style={{ opacity: 0.3 }} />
              </div>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div className="flex-between">
                <div>
                  <div className="stat-label">Aptitude Score</div>
                  <div className="stat-value">{stats.aptitudeScore}%</div>
                  <div className="stat-trend">
                    <TrendingUp size={16} /> {stats.aptitudeScore > 0 ? 'Keep improving!' : 'Start practicing'}
                  </div>
                </div>
                <Brain size={48} style={{ opacity: 0.3 }} />
              </div>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <div className="flex-between">
                <div>
                  <div className="stat-label">Interview Questions</div>
                  <div className="stat-value">{stats.interviewQuestions}</div>
                  <div className="stat-trend">
                    <TrendingUp size={16} /> {stats.interviewQuestions > 0 ? 'Great job!' : 'Start practicing'}
                  </div>
                </div>
                <MessageSquare size={48} style={{ opacity: 0.3 }} />
              </div>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <div className="flex-between">
                <div>
                  <div className="stat-label">Streak</div>
                  <div className="stat-value">{stats.streakDays}</div>
                  <div className="stat-trend">
                    <Zap size={16} /> {stats.streakDays > 0 ? 'Keep it up!' : 'Start your streak today!'}
                  </div>
                </div>
                <Award size={48} style={{ opacity: 0.3 }} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-2">
            {/* Progress Chart */}
            <motion.div variants={itemVariants} className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <TrendingUp size={24} />
                  Weekly Progress
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recentActivity.length > 0 ? recentActivity : [{ date: 'No data', problems: 0, score: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="problems" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    name="Problems Solved"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#f5576c" 
                    strokeWidth={3}
                    name="Aptitude Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Target size={24} />
                  Quick Actions
                </h2>
              </div>
              <div className="grid gap-2">
                <button 
                  onClick={() => navigate('/coding')}
                  className="btn btn-primary"
                >
                  <Code size={20} />
                  Start Coding Session
                </button>
                <button 
                  onClick={() => navigate('/aptitude')}
                  className="btn btn-secondary"
                >
                  <Brain size={20} />
                  Take Aptitude Test
                </button>
                <button 
                  onClick={() => navigate('/interview')}
                  className="btn btn-secondary"
                >
                  <MessageSquare size={20} />
                  Practice Interview Questions
                </button>
                <button 
                  onClick={() => navigate('/progress')}
                  className="btn btn-secondary"
                >
                  <Calendar size={20} />
                  Set Daily Goal
                </button>
              </div>
            </motion.div>
          </div>

          {/* Today's Goals - kept as is (hardcoded) */}
          <motion.div variants={itemVariants} className="card mt-3">
            <div className="card-header">
              <h2 className="card-title">
                <Target size={24} />
                Today's Goals
              </h2>
            </div>
            <div className="grid grid-3">
              <div>
                <div className="flex-between mb-1">
                  <span>Coding Problems</span>
                  <span className="badge badge-success">6/10</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex-between mb-1">
                  <span>Aptitude Practice</span>
                  <span className="badge badge-warning">3/5</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex-between mb-1">
                  <span>Interview Questions</span>
                  <span className="badge badge-success">5/5</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

export default Dashboard;