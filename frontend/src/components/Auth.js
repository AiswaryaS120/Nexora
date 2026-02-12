import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignup
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      console.log('Attempting to send request to:', `http://localhost:5000${url}`);
      console.log('Payload being sent:', payload);

      const response = await axios.post(`http://localhost:5000${url}`, payload);

      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
        }
        toast.success(isSignup ? 'Account created! Logging in...' : 'Logged in successfully!');
        onLogin();
      } else {
        toast.error(response.data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Auth error details:', error);
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        'Failed to connect. Check console (F12) for details. Is backend running?';
      toast.error(errorMsg, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #011024 0%, #001835 50%, #011024 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(232,196,65,0.04) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(232,196,65,0.03) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          maxWidth: '1100px',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          background: '#ffffff', // fallback if needed
        }}
      >
        {/* Left branding panel - dark royal blue */}
        <div
          style={{
            flex: 1,
            background: '#011024',
            color: 'white',
            padding: '3.5rem 4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Welcome to
            <br />
            Nexora!
            <span style={{ fontSize: '3rem', marginLeft: '0.5rem' }}>👋</span>
          </div>

          <p style={{ fontSize: '1.4rem', opacity: 0.9, maxWidth: '380px' }}>
            Track coding, aptitude, weak areas & get AI resume feedback — land your dream job faster!
          </p>

          <div style={{ fontSize: '6rem', position: 'absolute', bottom: '2rem', right: '2rem', opacity: 0.15, color: '#e8c441' }}>
            ★
          </div>
        </div>

        {/* Right form panel - WHITE background as requested */}
        <div
          style={{
            flex: 1,
            padding: '3.5rem 3rem',
            background: '#ffffff', // <-- Changed to white here
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#011024', // dark text for white bg
              textAlign: 'center',
            }}
          >
            {isSignup ? 'Create Account' : 'Welcome Back!'}
          </h2>

          <p
            style={{
              textAlign: 'center',
              color: '#4b5563',
              marginBottom: '2rem',
              fontSize: '1.05rem',
            }}
          >
            {isSignup
              ? 'Start your placement journey today'
              : 'Login to continue prepping!'}
          </p>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={isSignup}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '1.1rem',
                    color: '#111827',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e8c441';
                    e.target.style.boxShadow = '0 0 0 3px rgba(232,196,65,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '1.1rem',
                  color: '#111827',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e8c441';
                  e.target.style.boxShadow = '0 0 0 3px rgba(232,196,65,0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '1.1rem',
                  color: '#111827',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e8c441';
                  e.target.style.boxShadow = '0 0 0 3px rgba(232,196,65,0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1.1rem',
                background: '#011024',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1.2rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.25s',
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = '#e8c441')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#011024')}
            >
              {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login Now')}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '1rem',
              background: 'transparent',
              border: '1px solid #e8c441',
              color: '#e8c441',
              borderRadius: '0.75rem',
              fontSize: '1.1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(232,196,65,0.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Create now"}
          </button>

          <button
            style={{
              marginTop: '1.25rem',
              width: '100%',
              padding: '1rem',
              background: '#f9fafb',
              border: '1px solid #d1d5db',
              borderRadius: '0.75rem',
              fontSize: '1.1rem',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#e8c441';
              e.target.style.color = '#011024';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#f9fafb';
              e.target.style.color = '#111827';
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '24px' }} />
            Continue with Google
          </button>

          <p
            style={{
              textAlign: 'center',
              marginTop: '2rem',
              color: '#6b7280',
              fontSize: '0.9rem',
            }}
          >
            © 2026 PlacementPrep. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;