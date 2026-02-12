import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { 
  Home, BarChart3, Upload, BookOpen, Target, 
  TrendingUp, Award, Menu, X 
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import ProgressTracker from './components/ProgressTracker';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import Analytics from './components/Analytics';
import Auth from './components/Auth';   // ← added this import
import CodingEnvironment from './components/CodingEnvironment';

import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // This checks if user has a token → decides if show app or login
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // If not logged in → show only Auth component
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toaster position="top-right" />
        <Auth onLogin={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  // If logged in → show full app with navbar and routes
  return (
    <Router>
      <div className="app">
        <Toaster position="top-right" />
        <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/resume" element={<ResumeAnalyzer />} />
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/coding" element={<CodingEnvironment />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/progress', icon: Target, label: 'Track Progress' },
    { path: '/resume', icon: Upload, label: 'Resume AI' },
    { path: '/interview', icon: BookOpen, label: 'Interview Prep' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <Award className="logo-icon" />
          <span className="logo-text">HireHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Logout button - added here */}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              window.location.reload(); // simple way to refresh and go back to login
            }}
            className="nav-link"
            style={{ 
              color: 'var(--danger)', 
              fontWeight: 600, 
              background: 'rgba(239, 68, 68, 0.1)' 
            }}
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="nav-links mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Logout in mobile menu */}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                setMobileMenuOpen(false);
                window.location.reload();
              }}
              className="nav-link"
              style={{ 
                color: 'var(--danger)', 
                fontWeight: 600, 
                textAlign: 'left',
                background: 'rgba(239, 68, 68, 0.1)'
              }}
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default App;