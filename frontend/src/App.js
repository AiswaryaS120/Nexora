import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { 
  Home, BarChart3, Upload, BookOpen, Target, 
  TrendingUp, Award, Menu, X, Code 
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import ProgressTracker from './components/ProgressTracker';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import Analytics from './components/Analytics';
import Auth from './components/Auth';
import CodingEnvironment from './components/CodingEnvironment';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Listen for logout/storage changes from other tabs/windows
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
        {/* Login page - redirect to dashboard if already logged in */}
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Auth onLogin={() => setIsLoggedIn(true)} />
            )
          } 
        />

        {/* Protected routes - show layout + component if logged in */}
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/progress" 
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <ProgressTracker />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/resume" 
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <ResumeAnalyzer />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/interview" 
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <InterviewPrep />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/analytics" 
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <Analytics />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/coding" 
          element={
            isLoggedIn ? (
              <ProtectedLayout>
                <CodingEnvironment />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Root path - smart redirect */}
        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} 
        />

        {/* Catch-all - go to dashboard if logged in, else login */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

// Layout wrapper with Navbar (used for all protected pages)
function ProtectedLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/progress', icon: Target, label: 'Track Progress' },
    { path: '/resume', icon: Upload, label: 'Resume AI' },
    { path: '/interview', icon: BookOpen, label: 'Interview Prep' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/coding', icon: Code, label: 'Coding' }
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <a href="/dashboard" className="logo">
            <Award className="logo-icon" />
            <span className="logo-text">HireHub</span>
          </a>

          {/* Desktop Navigation */}
          <div className="nav-links desktop">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            ))}

            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/login';
              }}
              className="nav-link logout-btn"
              style={{ 
                color: '#ef4444', 
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
                <a
                  key={item.path}
                  href={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </a>
              ))}

              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userId');
                  setMobileMenuOpen(false);
                  window.location.href = '/login';
                }}
                className="nav-link logout-btn"
                style={{ 
                  color: '#ef4444', 
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

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default App;