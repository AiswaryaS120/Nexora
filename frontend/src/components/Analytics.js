import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    avgAptitudeScore: 0,
    totalInterviewQuestions: 0,
    streakDays: 0,
    weeklyGrowth: '+0%',
    topicsCovered: 0
  });

  useEffect(() => {
    // Load REAL data from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('hirehub_progress') || '[]');
    
    if (savedProgress.length > 0) {
      // Calculate real stats
      const totalProblems = savedProgress.reduce((sum, p) => sum + (p.codingProblems || 0), 0);
      const avgScore = savedProgress.reduce((sum, p) => sum + (p.aptitudeScore || 0), 0) / savedProgress.length;
      const totalQuestions = savedProgress.reduce((sum, p) => sum + (p.interviewQuestions || 0), 0);
      
      // Get unique topics
      const allTopics = savedProgress.flatMap(p => [...(p.topicsCovered || []), ...(p.weakTopics || [])]);
      const uniqueTopics = new Set(allTopics.filter(t => t));

      // Calculate last 7 days
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const chartData = last7Days.map(date => {
        const dayData = savedProgress.filter(p => p.date?.startsWith(date));
        return {
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          problems: dayData.reduce((sum, p) => sum + (p.codingProblems || 0), 0),
          aptitude: dayData.length > 0 
            ? Math.round(dayData.reduce((sum, p) => sum + (p.aptitudeScore || 0), 0) / dayData.length)
            : 0,
          interviews: dayData.reduce((sum, p) => sum + (p.interviewQuestions || 0), 0)
        };
      });

      setWeeklyData(chartData);
      setStats({
        totalProblems,
        avgAptitudeScore: Math.round(avgScore),
        totalInterviewQuestions: totalQuestions,
        streakDays: calculateStreak(savedProgress),
        weeklyGrowth: chartData.length > 1 ? '+' + Math.round(((chartData[6].problems - chartData[0].problems) / (chartData[0].problems || 1)) * 100) + '%' : '+0%',
        topicsCovered: uniqueTopics.size
      });
    } else {
      // Empty state
      setWeeklyData([
        { day: 'Mon', problems: 0, aptitude: 0, interviews: 0 },
        { day: 'Tue', problems: 0, aptitude: 0, interviews: 0 },
        { day: 'Wed', problems: 0, aptitude: 0, interviews: 0 },
        { day: 'Thu', problems: 0, aptitude: 0, interviews: 0 },
        { day: 'Fri', problems: 0, aptitude: 0, interviews: 0 },
        { day: 'Sat', problems: 0, aptitude: 0, interviews: 0 },
        { day: 'Sun', problems: 0, aptitude: 0, interviews: 0 }
      ]);
    }
  }, []);

  const calculateStreak = (progress) => {
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
  };

  const topicDistribution = [
    { name: 'Arrays', value: 25, color: '#667eea' },
    { name: 'Linked Lists', value: 18, color: '#764ba2' },
    { name: 'Trees', value: 20, color: '#f093fb' },
    { name: 'Graphs', value: 15, color: '#4facfe' },
    { name: 'DP', value: 12, color: '#fa709a' },
    { name: 'Others', value: 10, color: '#fee140' }
  ];

  const weakTopics = [
    { topic: 'Dynamic Programming', count: 8 },
    { topic: 'Graph Algorithms', count: 6 },
    { topic: 'System Design', count: 5 },
    { topic: 'Backtracking', count: 4 },
    { topic: 'Bit Manipulation', count: 3 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="analytics"
    >
      <div className="page-header">
        <h1 className="page-title">
          <BarChart3 size={32} />
          Analytics Dashboard
        </h1>
        <p className="page-subtitle">Detailed insights into your preparation journey</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4 mb-3">
        <motion.div 
          className="card"
          whileHover={{ scale: 1.02 }}
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <div className="flex-between">
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Problems</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>
                {stats.totalProblems}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                {stats.weeklyGrowth} this week
              </div>
            </div>
            <Target size={48} style={{ opacity: 0.3 }} />
          </div>
        </motion.div>

        <motion.div 
          className="card"
          whileHover={{ scale: 1.02 }}
          style={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}
        >
          <div className="flex-between">
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Avg Aptitude</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>
                {stats.avgAptitudeScore}%
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                +5% improvement
              </div>
            </div>
            <TrendingUp size={48} style={{ opacity: 0.3 }} />
          </div>
        </motion.div>

        <motion.div 
          className="card"
          whileHover={{ scale: 1.02 }}
          style={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}
        >
          <div className="flex-between">
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Interview Qs</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>
                {stats.totalInterviewQuestions}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                24 topics covered
              </div>
            </div>
            <Award size={48} style={{ opacity: 0.3 }} />
          </div>
        </motion.div>

        <motion.div 
          className="card"
          whileHover={{ scale: 1.02 }}
          style={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}
        >
          <div className="flex-between">
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Current Streak</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>
                {stats.streakDays} days
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Keep going! 🔥
              </div>
            </div>
            <Calendar size={48} style={{ opacity: 0.3 }} />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-2">
        {/* Weekly Activity Chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <BarChart3 size={24} />
              Weekly Activity
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="problems" fill="#667eea" name="Problems Solved" />
              <Bar dataKey="interviews" fill="#f5576c" name="Interview Qs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Aptitude Progress */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <TrendingUp size={24} />
              Aptitude Progress
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="aptitude" 
                stroke="#4facfe" 
                strokeWidth={3}
                name="Score (%)"
                dot={{ fill: '#4facfe', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Topic Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Target size={24} />
              Topic Distribution
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topicDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {topicDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weak Topics */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Award size={24} />
              Focus Areas
            </h2>
          </div>
          <div className="grid gap-2">
            {weakTopics.map((topic, index) => (
              <div key={index}>
                <div className="flex-between mb-1">
                  <span style={{ fontWeight: 500 }}>{topic.topic}</span>
                  <span className="badge badge-warning">{topic.count} attempts</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${(topic.count / 10) * 100}%`,
                      background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3" style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '0.75rem'
          }}>
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--danger)' }}>
              💡 Recommendation
            </h4>
            <p style={{ color: 'var(--gray)' }}>
              Focus on Dynamic Programming this week. Try solving 2-3 DP problems daily 
              to improve your weak areas.
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="card mt-3">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar size={24} />
            Monthly Overview
          </h2>
        </div>
        <div className="grid grid-3">
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>
              {stats.totalProblems}
            </div>
            <div style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
              Total Problems This Month
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--success)' }}>
              {stats.avgAptitudeScore}%
            </div>
            <div style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
              Average Aptitude Score
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)' }}>
              {stats.topicsCovered}
            </div>
            <div style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
              Topics Covered
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Analytics;