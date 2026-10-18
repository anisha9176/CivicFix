import React, { useState, useEffect } from 'react';
import {
  LogIn,
  Shield,
  User,
  Wrench,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Check
} from 'lucide-react';

export default function LoginPage({ initialEmail, justRegistered, onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(
    justRegistered
      ? `Registration successful! Enter your password to sign in.`
      : ''
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const fillDemo = (role) => {
    setError('');
    setSuccess('');
    if (role === 'citizen') {
      setEmail('vikram@citizen.in');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@civicfix.gov.in');
      setPassword('password123');
    } else if (role === 'worker') {
      setEmail('ramesh@worker.in');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password. Please try again.');
      }

      setSuccess(`Welcome back, ${data.user.name}! Redirecting to Dashboard...`);

      // Lead to dashboard
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 700);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2.5rem auto 3.5rem auto', padding: '0 1rem' }}>
      
      {/* 3-Step Flow Progress Indicator */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={onNavigateToRegister}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}
          title="Click to go back to Registration"
        >
          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem' }}>
            <Check size={13} />
          </span>
          <span>Step 1: Register</span>
        </button>
        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, #10b981 0%, #6366f1 100%)', margin: '0 0.5rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#6366f1', fontWeight: 700, fontSize: '0.85rem' }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
            2
          </span>
          <span>Step 2: Login</span>
        </div>
        <div style={{ height: '2px', width: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem' }}>
            3
          </span>
          <span>Step 3: Dashboard</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="glass-panel" style={{ padding: '2.25rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient Top Glow */}
        <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '3px', background: 'linear-gradient(90deg, transparent, #6366f1, #10b981, transparent)' }} />

        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#6ee7b7" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a7f3d0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Step 2 — Authentication
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem', color: '#fff' }}>
            Sign In to CivicFix
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
            Enter your credentials to access your personalized municipal dashboard.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#fda4af', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6ee7b7', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Email Address */}
          <div>
            <label className="form-label">Email Address <span style={{ color: '#f43f5e' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="you@citizen.in or you@domain.gov.in"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Password <span style={{ color: '#f43f5e' }}>*</span></label>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.2rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              'Signing in…'
            ) : (
              <>
                <LogIn size={18} /> Sign In &amp; Enter Dashboard <ArrowRight size={17} />
              </>
            )}
          </button>

          {/* 1-Click Demo Logins */}
          <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Or sign in with sample accounts:
            </p>
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => fillDemo('citizen')}
                style={{ flex: 1, padding: '0.45rem 0.3rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
              >
                <User size={13} /> Citizen
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                style={{ flex: 1, padding: '0.45rem 0.3rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
              >
                <Shield size={13} /> Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo('worker')}
                style={{ flex: 1, padding: '0.45rem 0.3rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fde047', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
              >
                <Wrench size={13} /> Worker
              </button>
            </div>
          </div>

          {/* Links back to Register */}
          <div style={{ textAlign: 'center', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Register here →
              </button>
            </p>
            <button
              type="button"
              onClick={onNavigateToRegister}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
            >
              <ArrowLeft size={13} /> Back to Step 1: Register
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
