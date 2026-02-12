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

  // Load real progress from backend when component mounts
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
        console.log('Fetching progress for user:', userId); // Debug log

        const response = await axios.get(`http://localhost:5000/api/progress/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setRecentProgress(response.data.progress || []);
      } catch (error) {
        console.error('Fetch progress error:', error);
        toast.error('Could not load your progress history');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

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

      // Optimistic update (add to list immediately)
      setRecentProgress(prev => [{
        date: new Date().toISOString().split('T')[0],
        ...progressData,
        topicsCovered: progressData.topicsCovered,
        weakTopics: progressData.weakTopics
      }, ...prev]);

      // Reset form
      setFormData({
        codingProblems: 0,
        aptitudeScore: 0,
        topicsCovered: '',
        weakTopics: '',
        interviewQuestions: 0,
        notes: ''
      });

      // Refresh real data from backend (optional but good)
      const res = await axios.get(`http://localhost:5000/api/progress/${localStorage.getItem('userId')}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentProgress(res.data.progress || []);

    } catch (error) {
      console.error('Save progress error:', error);
      toast.error(error.response?.data?.error || 'Failed to save progress');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="progress-tracker"
    >
      <div className="page-header">
        <h1 className="page-title">
          <TrendingUp size={32} />
          Track Your Progress
        </h1>
        <p className="page-subtitle">Log your daily preparation activities</p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p>Loading your progress...</p>
        </div>
      )}

      <div className="grid grid-2">
        {/* Progress Entry Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Plus size={24} />
              Add Today's Progress
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Coding Problems Solved</label>
                <input
                  type="number"
                  name="codingProblems"
                  value={formData.codingProblems}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Aptitude Score (%)</label>
                <input
                  type="number"
                  name="aptitudeScore"
                  value={formData.aptitudeScore}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Topics Covered (comma-separated)</label>
              <input
                type="text"
                name="topicsCovered"
                value={formData.topicsCovered}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Arrays, Linked Lists, Binary Trees"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weak Topics (comma-separated)</label>
              <input
                type="text"
                name="weakTopics"
                value={formData.weakTopics}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Dynamic Programming, Graph Algorithms"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interview Questions Practiced</label>
              <input
                type="number"
                name="interviewQuestions"
                value={formData.interviewQuestions}
                onChange={handleInputChange}
                className="form-input"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Any additional notes or learnings..."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Save size={20} />
              Save Progress
            </button>
          </form>
        </div>

        {/* Recent Progress */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Calendar size={24} />
              Recent Activity
            </h2>
          </div>

          {recentProgress.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: 'var(--gray)', padding: '2rem' }}>
              No progress logged yet. Start adding today!
            </p>
          )}

          <div className="grid gap-2">
            {recentProgress.map((progress, index) => (
              <div key={index} className="card" style={{ padding: '1rem' }}>
                <div className="flex-between mb-2">
                  <h3 style={{ fontWeight: 600 }}>{progress.date}</h3>
                  <span className="badge badge-success">{progress.aptitudeScore}%</span>
                </div>

                <div className="grid grid-2 gap-1">
                  <div>
                    <small style={{ color: 'var(--gray)' }}>Problems Solved</small>
                    <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                      {progress.codingProblems}
                    </div>
                  </div>
                  <div>
                    <small style={{ color: 'var(--gray)' }}>Interview Qs</small>
                    <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                      {progress.interviewQuestions}
                    </div>
                  </div>
                </div>

                {progress.topicsCovered?.length > 0 && (
                  <div className="mt-2">
                    <small style={{ color: 'var(--gray)' }}>Topics Covered:</small>
                    <div className="flex gap-1 mt-1" style={{ flexWrap: 'wrap' }}>
                      {progress.topicsCovered.map((topic, i) => (
                        <span key={i} className="badge badge-success">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}

                {progress.weakTopics?.length > 0 && (
                  <div className="mt-2">
                    <small style={{ color: 'var(--gray)' }}>Weak Areas:</small>
                    <div className="flex gap-1 mt-1" style={{ flexWrap: 'wrap' }}>
                      {progress.weakTopics.map((topic, i) => (
                        <span key={i} className="badge badge-warning">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProgressTracker;