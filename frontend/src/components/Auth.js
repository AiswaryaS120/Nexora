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

      // ────────────────────────────────────────────────
      //     Added: Debug logging to see exactly what is sent
      // ────────────────────────────────────────────────
      console.log('Attempting to send request to:', `http://localhost:5000${url}`);
      console.log('Payload being sent:', payload);

      const response = await axios.post(`http://localhost:5000${url}`, payload);

      if (response.data.success) {
        // Save token and userId — this is the critical part
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
        }

        toast.success(isSignup ? 'Account created! Logging in...' : 'Logged in successfully!');
        onLogin(); // Tells App.js to switch to the main app
      } else {
        toast.error(response.data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Auth error details:', error);

      // ────────────────────────────────────────────────
      //     Improved: More helpful error message
      // ────────────────────────────────────────────────
      const errorMsg = error.response?.data?.error 
        || error.message 
        || 'Failed to connect. Check console (F12) for details. Is backend running on port 5000?';

      toast.error(errorMsg, { duration: 6000 }); // longer duration so you can read it
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '420px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--dark)' }}>
          {isSignup ? 'Create Your Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div style={{ marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={isSignup}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          style={{
            width: '100%',
            marginTop: '1.25rem',
            padding: '0.9rem',
            background: 'transparent',
            border: '1px solid var(--primary)',
            color: 'var(--primary)',
            borderRadius: '0.5rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default Auth;