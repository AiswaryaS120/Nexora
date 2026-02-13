import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Dashboard from './components/Dashboard';
import ProgressTracker from './components/ProgressTracker';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import Analytics from './components/Analytics';
import Auth from './components/Auth';
import CodingEnvironment from './components/CodingEnvironment';
import AptitudeTest from './components/AptitudeTest';
import VersantTest from './components/VersantTest';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Login */}
        <Route 
          path="/login" 
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Auth onLogin={() => setIsLoggedIn(true)} />
          } 
        />

        {/* All protected pages – no navbar, just content */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/progress" element={isLoggedIn ? <ProgressTracker /> : <Navigate to="/login" replace />} />
        <Route path="/resume" element={isLoggedIn ? <ResumeAnalyzer /> : <Navigate to="/login" replace />} />
        <Route path="/interview" element={isLoggedIn ? <InterviewPrep /> : <Navigate to="/login" replace />} />
        <Route path="/analytics" element={isLoggedIn ? <Analytics /> : <Navigate to="/login" replace />} />
        <Route path="/coding" element={isLoggedIn ? <CodingEnvironment /> : <Navigate to="/login" replace />} />
        <Route path="/aptitude" element={isLoggedIn ? <AptitudeTest /> : <Navigate to="/login" replace />} />
        <Route path="/versant" element={isLoggedIn ? <VersantTest /> : <Navigate to="/login" replace />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;