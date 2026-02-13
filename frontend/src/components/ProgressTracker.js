import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

function ProgressTracker() {
  const [formData, setFormData] = useState({
    codingProblems: 0,
    aptitudeScore: 0,
    topicsCovered: '',
    weakTopics: '',
    interviewQuestions: 0,
    notes: ''
  });

  const [recentProgress, setRecentProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/progress/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRecentProgress(response.data.progress || []);
      } catch (error) {
        toast.error('Could not load your progress history');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Please login first');

    try {
      const progressData = {
        ...formData,
        topicsCovered: formData.topicsCovered.split(',').map(t => t.trim()).filter(Boolean),
        weakTopics: formData.weakTopics.split(',').map(t => t.trim()).filter(Boolean),
      };

      await axios.post('http://localhost:5000/api/progress', progressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Progress saved successfully! 🎉');

      setRecentProgress(prev => [{
        date: new Date().toISOString().split('T')[0],
        ...progressData
      }, ...prev]);

      setFormData({
        codingProblems: 0,
        aptitudeScore: 0,
        topicsCovered: '',
        weakTopics: '',
        interviewQuestions: 0,
        notes: ''
      });

    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save progress');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#ffffff',
        minHeight: '100vh',
        padding: '2rem'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '2.2rem',
          fontWeight: 700,
          color: '#011024'
        }}>
          <TrendingUp size={32} color="#e8c441" />
          Track Your Progress
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Log your daily preparation activities
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#011024' }}>Loading your progress...</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>

        {/* Form Card */}
        <div style={cardStyle}>
          <h2 style={cardTitle}>
            <Plus size={22} color="#e8c441" />
            Add Today's Progress
          </h2>

          <form onSubmit={handleSubmit}>

            <div style={gridTwo}>
              <Input label="Coding Problems Solved" name="codingProblems" value={formData.codingProblems} onChange={handleInputChange} type="number" required />
              <Input label="Aptitude Score (%)" name="aptitudeScore" value={formData.aptitudeScore} onChange={handleInputChange} type="number" required />
            </div>

            <Input label="Topics Covered (comma-separated)" name="topicsCovered" value={formData.topicsCovered} onChange={handleInputChange} />
            <Input label="Weak Topics (comma-separated)" name="weakTopics" value={formData.weakTopics} onChange={handleInputChange} />
            <Input label="Interview Questions Practiced" name="interviewQuestions" value={formData.interviewQuestions} onChange={handleInputChange} type="number" />

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                style={textareaStyle}
                placeholder="Any additional notes..."
              />
            </div>

            <button type="submit" style={primaryButton}>
              <Save size={18} />
              Save Progress
            </button>
          </form>
        </div>

        {/* Recent Activity */}
        <div style={cardStyle}>
          <h2 style={cardTitle}>
            <Calendar size={22} color="#e8c441" />
            Recent Activity
          </h2>

          {recentProgress.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              No progress logged yet.
            </p>
          )}

          {recentProgress.map((progress, index) => (
            <div key={index} style={activityCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#011024' }}>{progress.date}</strong>
                <span style={badge}>{progress.aptitudeScore}%</span>
              </div>

              <p style={activityText}>
                Problems: <strong>{progress.codingProblems}</strong> | Interview Qs: <strong>{progress.interviewQuestions}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Reusable Styles ---------- */

const cardStyle = {
  background: '#ffffff',
  padding: '2rem',
  borderRadius: '14px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  border: '1px solid #e8c441'
};

const cardTitle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.5rem',
  fontSize: '1.4rem',
  fontWeight: 600,
  color: '#011024'
};

const gridTwo = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
  color: '#011024'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '2px solid #011024',
  marginBottom: '1.5rem',
  outline: 'none'
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical'
};

const primaryButton = {
  width: '100%',
  padding: '0.9rem',
  background: '#011024',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  cursor: 'pointer'
};

const activityCard = {
  padding: '1rem',
  border: '1px solid #e8c441',
  borderRadius: '10px',
  marginBottom: '1rem'
};

const activityText = {
  marginTop: '0.5rem',
  color: '#374151'
};

const badge = {
  background: '#e8c441',
  color: '#011024',
  padding: '0.3rem 0.8rem',
  borderRadius: '999px',
  fontWeight: 600
};

const Input = ({ label, ...props }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input {...props} style={inputStyle} />
  </div>
);

export default ProgressTracker;
