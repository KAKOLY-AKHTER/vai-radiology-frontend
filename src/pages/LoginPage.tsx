import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/tasks');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.2"/>
              <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M16 12V16L19 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="22" r="2" fill="white"/>
            </svg>
          </div>
          <span style={styles.brandName}>VAI Radiology</span>
        </div>
        <div style={styles.heroText}>
          <h1 style={styles.heroH1}>Medical Imaging<br />Management Platform</h1>
          <p style={styles.heroSub}>Streamline your radiology workflow with AI-powered task management and precision image annotation tools.</p>
        </div>
        <div style={styles.features}>
          {['Kanban Task Board', 'Image Annotation', 'Real-time Collaboration'].map((f, i) => (
            <div key={i} style={styles.featureItem}>
              <div style={styles.featureDot} />
              <span style={styles.featureText}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Welcome back</h2>
            <p style={styles.cardSub}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#ef4444">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="#94a3b8">
                  <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v.5l-6 3.75L2 4.5V4zm0 1.5V12a2 2 0 002 2h8a2 2 0 002-2V5.5l-6 3.75L2 5.5z"/>
                </svg>
                <input
                  style={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="#94a3b8">
                  <path d="M8 1a4 4 0 00-4 4v1H3a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm2.5 5H5.5V5a2.5 2.5 0 015 0v1zM8 9a1 1 0 110 2 1 1 0 010-2z"/>
                </svg>
                <input
                  style={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={styles.demoHint}>
            <span style={styles.demoLabel}>Demo credentials</span>
            <code style={styles.demoCode}>demo@vai.com / demo1234</code>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    display: 'flex',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px',
    position: 'relative',
    overflow: 'hidden',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 64,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  heroText: {
    marginBottom: 40,
  },
  heroH1: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: 20,
    letterSpacing: '-1px',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 400,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.6)',
  },
  featureText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: 500,
  },
  right: {
    width: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    padding: 40,
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '40px 36px',
    width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  },
  cardHeader: {
    marginBottom: 28,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: '-0.5px',
  },
  cardSub: {
    color: '#64748b',
    fontSize: 14,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 10,
    padding: '12px 16px',
    marginBottom: 20,
    color: '#ef4444',
    fontSize: 13,
    fontWeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    letterSpacing: '0.2px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
    letterSpacing: '0.2px',
    boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
  },
  demoHint: {
    marginTop: 24,
    padding: '14px 16px',
    background: '#f1f5f9',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  demoLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  demoCode: {
    fontSize: 13,
    color: '#475569',
    fontFamily: 'monospace',
  },
};

export default LoginPage;
