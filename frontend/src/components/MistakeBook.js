import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Brain, Code, Mic,
  AlertCircle, CheckCircle, Trash2,
  Search, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function MistakeBook() {
  const navigate = useNavigate();
  const [mistakes, setMistakes] = useState([]);
  const [filteredMistakes, setFilteredMistakes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    aptitude: 0,
    coding: 0,
    versant: 0,
    reviewed: 0
  });

  useEffect(() => {
    loadMistakes();
  }, []);

  useEffect(() => {
    filterMistakes();
  }, [selectedType, searchQuery, mistakes]);

  const loadMistakes = () => {
    const saved = localStorage.getItem('hirehub_mistakes');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMistakes(parsed);
      calculateStats(parsed);
    }
  };

  const calculateStats = (list) => {
    setStats({
      total: list.length,
      aptitude: list.filter(m => m.type === 'aptitude').length,
      coding: list.filter(m => m.type === 'coding').length,
      versant: list.filter(m => m.type === 'versant').length,
      reviewed: list.filter(m => m.reviewed).length
    });
  };

  const filterMistakes = () => {
    let filtered = [...mistakes];

    if (selectedType !== 'all') {
      filtered = filtered.filter(m => m.type === selectedType);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(m =>
        m.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topic?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredMistakes(filtered);
  };

  const markAsReviewed = (id) => {
    const updated = mistakes.map(m =>
      m.id === id ? { ...m, reviewed: true, reviewedAt: new Date().toISOString() } : m
    );
    setMistakes(updated);
    localStorage.setItem('hirehub_mistakes', JSON.stringify(updated));
    calculateStats(updated);
    toast.success('Marked as reviewed!');
  };

  const deleteMistake = (id) => {
    if (window.confirm('Delete this mistake?')) {
      const updated = mistakes.filter(m => m.id !== id);
      setMistakes(updated);
      localStorage.setItem('hirehub_mistakes', JSON.stringify(updated));
      calculateStats(updated);
      setSelectedMistake(null);
      toast.success('Deleted');
    }
  };

  const clearAllMistakes = () => {
    if (window.confirm('Clear all mistakes?')) {
      localStorage.removeItem('hirehub_mistakes');
      setMistakes([]);
      setFilteredMistakes([]);
      calculateStats([]);
      setSelectedMistake(null);
      toast.success('All cleared');
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'aptitude': return Brain;
      case 'coding': return Code;
      case 'versant': return Mic;
      default: return AlertCircle;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'aptitude': return '#e8c441';
      case 'coding': return '#10b981';
      case 'versant': return '#ec4899';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ background: '#011024', minHeight: '100vh', color: 'white' }}>

      {/* TOP BAR */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: '#011024',
        borderBottom: '2px solid #e8c441',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        zIndex: 1000
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#e8c441',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <BookOpen size={24} color="#e8c441" />
          <span style={{ fontWeight: 700 }}>Mistake Book</span>
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={clearAllMistakes}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div style={{ height: '70px' }} />

      {/* STATS SECTION */}
      <div style={{ padding: '2rem', background: '#fffff' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} style={{
              background: '#011024',
              border: '2px solid #e8c441',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'capitalize' }}>
                {key}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#e8c441' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN BODY */}
      <div style={{ display: 'flex', height: 'calc(100vh - 220px)' }}>

        {/* LEFT PANEL */}
        <div style={{
          width: '40%',
          background: '#012040',
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          <input
            type="text"
            placeholder="Search mistakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #e8c441',
              background: '#011024',
              color: 'white'
            }}
          />

          {filteredMistakes.map((mistake) => {
            const Icon = getTypeIcon(mistake.type);
            const color = getTypeColor(mistake.type);

            return (
              <div
                key={mistake.id}
                onClick={() => setSelectedMistake(mistake)}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: selectedMistake?.id === mistake.id ? '#e8c44120' : '#011024',
                  border: `2px solid ${selectedMistake?.id === mistake.id ? '#e8c441' : '#1f2937'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={18} color={color} />
                  <span>{mistake.question}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          width: '60%',
          padding: '2rem',
          overflowY: 'auto',
          background: '#fffff'
        }}>
          {selectedMistake ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <h2 style={{ color: '#e8c441' }}>{selectedMistake.question}</h2>

              {selectedMistake.explanation && (
                <p style={{ marginTop: '1rem', color: '#e5e7eb' }}>
                  {selectedMistake.explanation}
                </p>
              )}

              {selectedMistake.code && (
                <pre style={{
                  background: '#000',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginTop: '1rem',
                  overflowX: 'auto'
                }}>
                  <code style={{ color: '#d4d4d4' }}>
                    {selectedMistake.code}
                  </code>
                </pre>
              )}

              {!selectedMistake.reviewed && (
                <button
                  onClick={() => markAsReviewed(selectedMistake.id)}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.7rem 1.2rem',
                    background: '#e8c441',
                    color: '#011024',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Mark as Reviewed
                </button>
              )}

              <button
                onClick={() => deleteMistake(selectedMistake.id)}
                style={{
                  marginTop: '1.5rem',
                  marginLeft: '1rem',
                  padding: '0.7rem 1.2rem',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>

            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '5rem', color: '#9ca3af' }}>
              Select a mistake to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* SAVE FUNCTION */
export const saveMistake = (mistakeData) => {
  const mistakes = JSON.parse(localStorage.getItem('hirehub_mistakes') || '[]');

  const newMistake = {
    id: Date.now() + Math.random(),
    date: new Date().toISOString(),
    reviewed: false,
    ...mistakeData
  };

  mistakes.push(newMistake);
  localStorage.setItem('hirehub_mistakes', JSON.stringify(mistakes));
};
