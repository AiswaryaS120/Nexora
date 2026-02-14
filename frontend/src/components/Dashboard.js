import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Code, Brain, MessageSquare,
  Calendar, Award, Target, Zap, Menu, X,
  FileText, Bell, LogOut
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalProblems: 0,
    aptitudeScore: 0,
    interviewQuestions: 0,
    streakDays: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/progress/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const progress = response.data.progress || [];

        if (progress.length > 0) {
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

          const last7 = progress.slice(-7).map(p => ({
            date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            problems: p.codingProblems || 0,
            score: p.aptitudeScore || 0
          }));
          setRecentActivity(last7);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        let errMsg = 'Could not load your dashboard data.';
        if (error.response?.status === 401) {
          errMsg = 'Session expired. Please login again.';
        } else if (error.message.includes('Network')) {
          errMsg = 'Backend not reachable. Is server running on port 5000?';
        }
        toast.error(errMsg);
        setStats({ totalProblems: 0, aptitudeScore: 0, interviewQuestions: 0, streakDays: 0 });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const calculateStreak = (progress) => {
    if (progress.length === 0) return 0;
    const sortedDates = progress
      .map(p => new Date(p.date).toDateString())
      .sort((a, b) => new Date(b) - new Date(a));
    let streak = 1;
    const today = new Date().toDateString();
    if (sortedDates[0] !== today &&
        new Date(sortedDates[0]).getTime() !== new Date(today).getTime() - 86400000) {
      return 0;
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
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Top fixed bar with hamburger */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: '#011024',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        zIndex: 1000,
        boxShadow: '0 3px 12px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#e8c441',
            cursor: 'pointer',
            padding: '12px',
            marginRight: '1rem'
          }}
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
        <h1 style={{
          margin: 0,
          fontSize: '1.8rem',
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}>
          Nexora
        </h1>
      </div>

      {/* Invisible spacer */}
      <div style={{ height: '80px' }} />

      {/* Slide-in sidebar menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: menuOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          background: '#011024',
          color: 'white',
          zIndex: 999,
          paddingTop: '100px',
          padding: '1.5rem',
          boxShadow: '4px 0 25px rgba(0,0,0,0.35)'
        }}
      >
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '1rem 0' }}>
              <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} style={menuItemStyle}>
                <TrendingUp size={22} /> Dashboard
              </button>
            </li>
            

            
            <li style={{ margin: '1rem 0' }}>
              <button onClick={() => { navigate('/mistakebook'); setMenuOpen(false); }} style={menuItemStyle}>
                <Target size={22} /> MistakeBook
              </button>
            </li>

            <li style={{ margin: '1rem 0' }}>
              <button onClick={() => { navigate('/progress'); setMenuOpen(false); }} style={menuItemStyle}>
                <Target size={22} /> ProgressTracker
              </button>
            </li>

            <li style={{ margin: '1rem 0' }}>
              <button onClick={() => { navigate('/resume'); setMenuOpen(false); }} style={menuItemStyle}>
                <FileText size={22} /> Resume AI
              </button>
            </li>

            <li style={{ margin: '1rem 0' }}>
              <button onClick={() => { navigate('/mock-interview'); setMenuOpen(false); }} style={menuItemStyle}>
                <MessageSquare size={22} /> Mock Interviews
              </button>
            </li>

            <li style={{ margin: '1rem 0' }}>
              <button onClick={() => { navigate('/study-materials'); setMenuOpen(false); }} style={menuItemStyle}>
                <FileText size={22} /> Study Materials
              </button>
            </li>

            <li style={{ margin: '1rem 0' }}>
              <button onClick={() => { navigate('/notifications'); setMenuOpen(false); }} style={menuItemStyle}>
                <Bell size={22} /> Notifications
              </button>
            </li>
            <li style={{ marginTop: '2.5rem' }}>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate('/login', { replace: true });
                }}
                style={{
                  ...menuItemStyle,
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  paddingTop: '1.2rem'
                }}
              >
                <LogOut size={22} /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 998
          }}
        />
      )}

      {/* Main content */}
      <div style={{ paddingTop: '20px', padding: '0 1.5rem 1.5rem' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="dashboard"
          style={{
            background: '#ffffff',
            minHeight: 'calc(100vh - 80px)'
          }}
        >
          {loading && (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
              <p className="mt-4" style={{ color: '#6b7280' }}>Loading your dashboard...</p>
            </div>
          )}

          {!loading && (
            <>
              <motion.div
                variants={itemVariants}
                className="page-header"
                style={{
                  marginTop: '1.5rem',
                  marginBottom: '2.5rem',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <h1
                  className="page-title"
                  style={{
                    color: '#011024',
                    fontSize: '2.8rem',
                    margin: '0 0 0.5rem 0',
                    paddingTop: '0.5rem',
                    lineHeight: 1.1
                  }}
                >
                  Dashboard
                </h1>
                <p
                  className="page-subtitle"
                  style={{
                    color: '#4b5563',
                    margin: 0,
                    fontSize: '1.25rem'
                  }}
                >
                  Track your placement preparation journey
                </p>
              </motion.div>

              {/* Stats Grid */}
              <motion.div variants={itemVariants} className="grid grid-4 section-spacing">
                <div className="stat-card" style={{
                  background: '#011024',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 6px 20px rgba(1,16,36,0.18)'
                }}>
                  <div className="flex-between">
                    <div>
                      <div className="stat-label" style={{ color: '#e8c441' }}>Coding Problems</div>
                      <div className="stat-value">{stats.totalProblems}</div>
                      <div className="stat-trend">
                        <TrendingUp size={16} color="#e8c441" /> {stats.totalProblems > 0 ? '+this week' : 'Start solving!'}
                      </div>
                    </div>
                    <Code size={48} color="#e8c441" style={{ opacity: 0.25 }} />
                  </div>
                </div>

                <div className="stat-card" style={{
                  background: '#011024',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 6px 20px rgba(1,16,36,0.18)'
                }}>
                  <div className="flex-between">
                    <div>
                      <div className="stat-label" style={{ color: '#e8c441' }}>Aptitude Score</div>
                      <div className="stat-value">{stats.aptitudeScore}%</div>
                      <div className="stat-trend">
                        <TrendingUp size={16} color="#e8c441" /> {stats.aptitudeScore > 0 ? 'Keep improving!' : 'Start practicing'}
                      </div>
                    </div>
                    <Brain size={48} color="#e8c441" style={{ opacity: 0.25 }} />
                  </div>
                </div>

                <div className="stat-card" style={{
                  background: '#011024',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 6px 20px rgba(1,16,36,0.18)'
                }}>
                  <div className="flex-between">
                    <div>
                      <div className="stat-label" style={{ color: '#e8c441' }}>Interview Questions</div>
                      <div className="stat-value">{stats.interviewQuestions}</div>
                      <div className="stat-trend">
                        <TrendingUp size={16} color="#e8c441" /> {stats.interviewQuestions > 0 ? 'Great job!' : 'Start practicing'}
                      </div>
                    </div>
                    <MessageSquare size={48} color="#e8c441" style={{ opacity: 0.25 }} />
                  </div>
                </div>

                <div className="stat-card" style={{
                  background: '#011024',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 6px 20px rgba(1,16,36,0.18)'
                }}>
                  <div className="flex-between">
                    <div>
                      <div className="stat-label" style={{ color: '#e8c441' }}>Streak</div>
                      <div className="stat-value">{stats.streakDays}</div>
                      <div className="stat-trend">
                        <Zap size={16} color="#e8c441" /> {stats.streakDays > 0 ? 'Keep it up!' : 'Start your streak today!'}
                      </div>
                    </div>
                    <Award size={48} color="#e8c441" style={{ opacity: 0.25 }} />
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-2 section-spacing">
                <motion.div variants={itemVariants} className="card" style={{
                  background: 'white',
                  border: '1px solid #e8c441',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}>
                  <div className="card-header">
                    <h2 className="card-title" style={{ color: '#011024' }}>
                      <TrendingUp size={24} color="#011024" />
                      Weekly Progress
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={recentActivity.length > 0 ? recentActivity : [{ date: 'No data', problems: 0, score: 0 }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="problems" stroke="#011024" strokeWidth={3} name="Problems Solved" />
                      <Line type="monotone" dataKey="score" stroke="#e8c441" strokeWidth={3} name="Aptitude Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div variants={itemVariants} className="card" style={{
                  background: 'white',
                  border: '1px solid #e8c441',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}>
                  <div className="card-header">
                    <h2 className="card-title" style={{ color: '#011024' }}>
                      <Target size={24} color="#011024" />
                      Quick Actions
                    </h2>
                  </div>
                  <div className="grid gap-2 section-spacing">
                    <button
                      onClick={() => navigate('/coding')}
                      style={{
                        background: '#011024',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Code size={20} />
                      Start Coding Session
                    </button>

                    <button
                      onClick={() => navigate('/aptitude')}
                      style={{
                        background: '#011024',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Brain size={20} />
                      Take Aptitude Test
                    </button>

                    {/* Versant Test button – placed below Aptitude Test */}
                    <button
                      onClick={() => navigate('/versant')}
                      style={{
                        background: '#011024',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Take Versant Test
                    </button>

                     {/* code Test button – placed below versant Test */}
                    <button
                      onClick={() => navigate('/code')}
                      style={{
                        background: '#011024',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Take coding Test
                    </button>


                    <button
                      onClick={() => navigate('/interview')}
                      style={{
                        background: '#011024',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <MessageSquare size={20} />
                      Practice Interview Questions
                    </button>

                   
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="card section-spacing" style={{
                background: 'white',
                border: '1px solid #e8c441',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
              }}>
                <div className="card-header">
                  <h2 className="card-title" style={{ color: '#011024' }}>
                    <Target size={24} color="#011024" />
                    Today's Goals
                  </h2>
                </div>
                <div className="grid grid-3">
                  <div>
                    <div className="flex-between mb-1">
                      <span>Coding Problems</span>
                      <span className="badge" style={{ background: '#e8c441', color: '#011024' }}>6/10</span>
                    </div>
                    <div className="progress-bar" style={{ background: '#e5e7eb', borderRadius: '4px' }}>
                      <div className="progress-fill" style={{ width: '60%', background: '#e8c441', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex-between mb-1">
                      <span>Aptitude Practice</span>
                      <span className="badge" style={{ background: '#e8c441', color: '#011024' }}>3/5</span>
                    </div>
                    <div className="progress-bar" style={{ background: '#e5e7eb', borderRadius: '4px' }}>
                      <div className="progress-fill" style={{ width: '60%', background: '#e8c441', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex-between mb-1">
                      <span>Interview Questions</span>
                      <span className="badge" style={{ background: '#e8c441', color: '#011024' }}>5/5</span>
                    </div>
                    <div className="progress-bar" style={{ background: '#e5e7eb', borderRadius: '4px' }}>
                      <div className="progress-fill" style={{ width: '100%', background: '#e8c441', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

const menuItemStyle = {
  width: '100%',
  padding: '1rem 1.2rem',
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '1.1rem',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

export default Dashboard;