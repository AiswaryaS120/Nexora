import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        toast.success('Resume uploaded successfully!');
      } else {
        toast.error('Only PDF or TXT files are allowed');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume first');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to analyze your resume');
      navigate('/login');
      return;
    }

    setAnalyzing(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/api/resume/analyze', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setAnalysis(response.data.analysis);
      toast.success('Resume analysis complete!');
    } catch (error) {
      console.error('Resume analysis error:', error);
      const errMsg = error.response?.data?.error || 'Failed to analyze resume. Please try again.';
      toast.error(errMsg, { duration: 5000 });
    } finally {
      setAnalyzing(false);
    }
  };

  const ScoreCircle = ({ score }) => {
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#e8c441' : '#ef4444';

    return (
      <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto' }}>
        <svg width="140" height="140">
          <circle cx="70" cy="70" r="50" fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle
            cx="70"
            cy="70"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2.8rem',
          fontWeight: 'bold',
          color
        }}>
          {score}
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Fixed blue top bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: '#011024',
        color: '#e8c441',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        zIndex: 1000,
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        fontWeight: 600,
        fontSize: '1.15rem'
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#e8c441',
            fontSize: '1.15rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Spacer */}
      <div style={{ height: '70px' }} />

      <div style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            color: '#011024',
            fontSize: '2.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            AI Resume Analyzer
          </h1>
          <p style={{
            color: '#4b5563',
            fontSize: '1.25rem'
          }}>
            Upload your resume and get professional AI-powered feedback
          </p>
        </div>

        {/* Split Layout: 2-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5rem',
          '@media (max-width: 1024px)': { gridTemplateColumns: '1fr' }
        }}>
          {/* Left: Upload & Analyze */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            border: '2px solid #011024'
          }}>
            <h2 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: '#011024',
              fontSize: '1.8rem',
              fontWeight: 600,
              marginBottom: '2rem'
            }}>
              <Upload size={28} color="#011024" />
              Upload Your Resume
            </h2>

            <div
              onClick={() => document.getElementById('resume-upload').click()}
              style={{
                border: '2px dashed #011024',
                borderRadius: '12px',
                padding: '4rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: file ? 'rgba(1,16,36,0.05)' : 'transparent'
              }}
            >
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {file ? (
                <div>
                  <FileText size={64} color="#011024" style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{
                    color: '#011024',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem'
                  }}>
                    {file.name}
                  </h3>
                  <p style={{ color: '#011024', fontSize: '1rem' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
              ) : (
                <div>
                  <Upload size={64} color="#011024" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                  <h3 style={{
                    color: '#011024',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem'
                  }}>
                    Drag & drop or click to upload
                  </h3>
                  <p style={{ color: '#011024', fontSize: '1.1rem' }}>
                    PDF or TXT format (Max 5MB recommended)
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              style={{
                width: '100%',
                marginTop: '2.5rem',
                padding: '1.25rem',
                background: '#011024',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.15rem',
                fontWeight: 600,
                cursor: !file || analyzing ? 'not-allowed' : 'pointer',
                opacity: !file || analyzing ? 0.65 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(1,16,36,0.2)'
              }}
            >
              {analyzing ? (
                <>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={22} color="#e8c441" />
                  Analyze with AI
                </>
              )}
            </button>

            <div style={{
              marginTop: '2.5rem',
              padding: '1.5rem',
              background: 'rgba(1,16,36,0.03)',
              borderRadius: '10px',
              border: '1px solid #011024'
            }}>
              <h4 style={{
                color: '#011024',
                fontWeight: 600,
                marginBottom: '1rem',
                fontSize: '1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <Sparkles size={20} color="#e8c441" />
                What Our AI Analyzes:
              </h4>
              <ul style={{
                marginLeft: '1.8rem',
                color: '#4b5563',
                lineHeight: 1.7,
                fontSize: '1.05rem',
                listStyleType: 'disc'
              }}>
                <li>ATS compatibility & keyword optimization</li>
                <li>Missing technical skills & gaps</li>
                <li>Strengths & standout achievements</li>
                <li>Actionable section-by-section improvements</li>
                <li>Overall professional impact (0–100 score)</li>
              </ul>
            </div>
          </div>

          {/* Right: Analysis Results */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            border: '2px solid #011024'
          }}>
            <h2 style={{
              color: '#011024',
              fontSize: '1.8rem',
              fontWeight: 600,
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <TrendingUp size={28} color="#e8c441" />
              Your Resume Analysis
            </h2>

            {analysis ? (
              <div>
                {/* Score */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <ScoreCircle score={analysis.score} />
                  <h3 style={{
                    color: '#011024',
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    marginTop: '1.2rem'
                  }}>
                    Overall Resume Score
                  </h3>
                  <p style={{
                    color: '#011024',
                    fontSize: '1.15rem',
                    marginTop: '0.5rem'
                  }}>
                    {analysis.score >= 80 ? 'Excellent – Ready for top-tier applications' :
                     analysis.score >= 60 ? 'Strong foundation – Minor refinements needed' :
                     'Needs work – Significant improvements recommended'}
                  </p>
                </div>

                {/* Missing Skills */}
                {analysis.missingSkills?.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{
                      color: '#011024',
                      fontWeight: 600,
                      marginBottom: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '1.25rem'
                    }}>
                      <AlertCircle size={24} color="#e8c441" />
                      Missing / Weak Skills
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {analysis.missingSkills.map((skill, i) => (
                        <span key={i} style={{
                          padding: '0.6rem 1.3rem',
                          background: 'rgba(1,16,36,0.05)',
                          color: '#011024',
                          borderRadius: '999px',
                          fontWeight: 500,
                          border: '1px solid #e8c441',
                          fontSize: '1rem'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {analysis.strengths?.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{
                      color: '#011024',
                      fontWeight: 600,
                      marginBottom: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '1.25rem'
                    }}>
                      <CheckCircle size={24} color="#e8c441" />
                      Standout Strengths
                    </h4>
                    <ul style={{
                      marginLeft: '1.8rem',
                      color: '#011024',
                      lineHeight: 1.7,
                      fontSize: '1.05rem'
                    }}>
                      {analysis.strengths.map((strength, i) => (
                        <li key={i} style={{ marginBottom: '0.8rem' }}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {analysis.improvements?.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{
                      color: '#011024',
                      fontWeight: 600,
                      marginBottom: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '1.25rem'
                    }}>
                      <TrendingUp size={24} color="#e8c441" />
                      Recommended Improvements
                    </h4>
                    <ul style={{
                      marginLeft: '1.8rem',
                      color: '#011024',
                      lineHeight: 1.7,
                      fontSize: '1.05rem'
                    }}>
                      {analysis.improvements.map((imp, i) => (
                        <li key={i} style={{ marginBottom: '0.8rem' }}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions?.length > 0 && (
                  <div>
                    <h4 style={{
                      color: '#011024',
                      fontWeight: 600,
                      marginBottom: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '1.25rem'
                    }}>
                      <Sparkles size={24} color="#e8c441" />
                      AI-Powered Suggestions
                    </h4>
                    <ul style={{
                      marginLeft: '1.8rem',
                      color: '#011024',
                      lineHeight: 1.7,
                      fontSize: '1.05rem'
                    }}>
                      {analysis.suggestions.map((sug, i) => (
                        <li key={i} style={{ marginBottom: '0.8rem' }}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '6rem 2rem',
                color: '#011024'
              }}>
                <FileText size={80} color="#011024" style={{ marginBottom: '1.5rem', opacity: 0.6 }} />
                <h3 style={{
                  color: '#011024',
                  fontSize: '1.6rem',
                  marginBottom: '1rem'
                }}>
                  Ready to Get Feedback?
                </h3>
                <p style={{ fontSize: '1.1rem' }}>
                  Upload your resume (PDF or TXT) and let our AI provide detailed insights
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ResumeAnalyzer;