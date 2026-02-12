import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        toast.success('File uploaded! Click Analyze to continue.');
      } else {
        toast.error('Please upload a PDF or TXT file');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload a resume first');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    setAnalyzing(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      console.log('Sending resume analysis request...'); // Debug log

      const response = await axios.post('http://localhost:5000/api/resume/analyze', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
          // Browser auto-sets Content-Type: multipart/form-data for FormData
        }
      });

      setAnalysis(response.data.analysis);
      toast.success('Analysis complete! 🎉');
    } catch (error) {
      console.error('Resume analysis error:', error);
      const errMsg = error.response?.data?.error 
        || error.message 
        || 'Failed to analyze resume. Check if backend is running on port 5000.';
      toast.error(errMsg, { duration: 6000 });
    } finally {
      setAnalyzing(false);
    }
  };

  const ScoreCircle = ({ score }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

    return (
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: color
        }}>
          {score}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="resume-analyzer"
    >
      <div className="page-header">
        <h1 className="page-title">
          <Sparkles size={32} />
          AI Resume Analyzer
        </h1>
        <p className="page-subtitle">Get AI-powered insights to improve your resume</p>
      </div>

      <div className="grid grid-2">
        {/* Upload Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Upload size={24} />
              Upload Your Resume
            </h2>
          </div>

          <div 
            className="upload-area"
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '1rem',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: file ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
            }}
            onClick={() => document.getElementById('resume-upload').click()}
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
                <FileText size={48} style={{ margin: '0 auto', color: 'var(--primary)' }} />
                <h3 style={{ marginTop: '1rem', fontWeight: 600 }}>{file.name}</h3>
                <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <Upload size={48} style={{ margin: '0 auto', color: 'var(--gray)' }} />
                <h3 style={{ marginTop: '1rem', fontWeight: 600 }}>
                  Click to upload or drag and drop
                </h3>
                <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
                  PDF or TXT (Max 5MB)
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className="btn btn-primary mt-3"
            style={{ width: '100%' }}
          >
            {analyzing ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Analyze with AI
              </>
            )}
          </button>

          <div className="mt-3" style={{ 
            padding: '1rem', 
            background: 'rgba(99, 102, 241, 0.1)', 
            borderRadius: '0.75rem' 
          }}>
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} />
              AI Features:
            </h4>
            <ul style={{ marginLeft: '1.5rem', color: 'var(--gray)' }}>
              <li>Identifies missing technical skills</li>
              <li>Suggests improvements for each section</li>
              <li>Scores your resume (0-100)</li>
              <li>Highlights strengths and weaknesses</li>
              <li>ATS (Applicant Tracking System) optimization tips</li>
            </ul>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <TrendingUp size={24} />
              Analysis Results
            </h2>
          </div>

          {analysis ? (
            <div className="analysis-results">
              {/* Score */}
              <div className="flex-center mb-3">
                <div style={{ textAlign: 'center' }}>
                  <ScoreCircle score={analysis.score} />
                  <h3 style={{ marginTop: '1rem', fontWeight: 600 }}>Resume Score</h3>
                  <p style={{ color: 'var(--gray)' }}>
                    {analysis.score >= 80 ? 'Excellent!' : analysis.score >= 60 ? 'Good Progress' : 'Needs Improvement'}
                  </p>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="mb-3">
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} color="#f59e0b" />
                  Missing Skills
                </h4>
                <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                  {analysis.missingSkills.map((skill, index) => (
                    <span key={index} className="badge badge-warning">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-3">
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} color="#10b981" />
                  Strengths
                </h4>
                <ul style={{ marginLeft: '1.5rem', color: 'var(--dark)' }}>
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{strength}</li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="mb-3">
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="#6366f1" />
                  Areas to Improve
                </h4>
                <ul style={{ marginLeft: '1.5rem', color: 'var(--dark)' }}>
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{improvement}</li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#8b5cf6" />
                  AI Suggestions
                </h4>
                <ul style={{ marginLeft: '1.5rem', color: 'var(--dark)' }}>
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex-center" style={{ padding: '4rem 2rem', color: 'var(--gray)' }}>
              <div style={{ textAlign: 'center' }}>
                <FileText size={64} style={{ margin: '0 auto', opacity: 0.3 }} />
                <p style={{ marginTop: '1rem' }}>
                  Upload your resume and click "Analyze with AI" to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ResumeAnalyzer;