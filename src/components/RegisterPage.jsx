import React, { useState } from 'react';
import {
  UserPlus,
  Shield,
  User,
  Wrench,
  Lock,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Check
} from 'lucide-react';

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin }) {
  const [role, setRole] = useState('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [workerCategory, setWorkerCategory] = useState('Roads & Infrastructure');
  const [area, setArea] = useState('Zone 1 - Central Ward');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      value: 'citizen',
      label: 'Citizen',
      tagline: 'Public Reporter',
      desc: 'Report issues, track progress live & give feedback',
      icon: User,
      color: '#6366f1'
    },
    {
      value: 'worker',
      label: 'Field Worker',
      tagline: 'Municipal Crew',
      desc: 'Get assigned tasks, inspect & upload fix proof',
      icon: Wrench,
      color: '#f59e0b'
    },
    {
      value: 'admin',
      label: 'Administrator',
      tagline: 'City Officer',
      desc: 'Verify complaints, assign staff & view analytics',
      icon: Shield,
      color: '#10b981'
    }
  ];

  const handleQuickFill = (targetRole) => {
    setError('');
    setSuccess('');
    setRole(targetRole);
    const rand = Math.floor(100 + Math.random() * 900);

    if (targetRole === 'citizen') {
      setName(`Priya Sharma ${rand}`);
      setEmail(`priya${rand}@citizen.in`);
      setPhone('+91 98765 12345');
      setPassword('password123');
      setConfirmPassword('password123');
    } else if (targetRole === 'worker') {
      setName(`Kiran Rao ${rand}`);
      setEmail(`kiran${rand}@worker.in`);
      setPhone('+91 98888 22334');
      setWorkerCategory('Roads & Infrastructure');
      setArea('Zone 4 - Roads');
      setPassword('password123');
      setConfirmPassword('password123');
    } else if (targetRole === 'admin') {
      setName(`Officer Verma ${rand}`);
      setEmail(`admin${rand}@civicfix.gov.in`);
      setPhone('+91 99000 55667');
      setArea('Municipal Administration');
      setPassword('password123');
      setConfirmPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the civic verification declaration.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          phone: phone.trim(),
          category: role === 'worker' ? workerCategory : undefined,
          area: area
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      setSuccess(`Account created for ${data.user.name || name}! Redirecting to Login...`);

      // Lead from register to login, passing the registered email
      setTimeout(() => {
        onRegisterSuccess(email.trim().toLowerCase());
      }, 1200);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto 3rem auto', padding: '0 1rem' }}>
      
      {/* 3-Step Flow Progress Indicator */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#6366f1', fontWeight: 700, fontSize: '0.85rem' }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
            1
          </span>
          <span>Step 1: Register</span>
        </div>
        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, #6366f1 0%, rgba(255,255,255,0.1) 100%)', margin: '0 0.5rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem' }}>
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

      {/* Main Registration Card */}
      <div className="glass-panel" style={{ padding: '2.25rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle top ambient glow */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '3px', background: 'linear-gradient(90deg, transparent, #6366f1, #a855f7, transparent)' }} />

        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#a5b4fc" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c7d2fe', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              First Step — Create Account
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem', color: '#fff' }}>
            Register for CivicFix
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
            Join our city-wide civic issue reporting and municipal resolution platform.
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

        {/* Quick Fill Demo Helper */}
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ⚡ 1-Click Demo Quick Fill:
            </span>
            <span style={{ fontSize: '0.7rem', color: '#818cf8' }}>For quick testing</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('citizen')}
              style={{ flex: 1, minWidth: '120px', padding: '0.45rem 0.6rem', fontSize: '0.76rem', fontWeight: 600, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
            >
              <User size={13} /> Citizen Form
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('worker')}
              style={{ flex: 1, minWidth: '120px', padding: '0.45rem 0.6rem', fontSize: '0.76rem', fontWeight: 600, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fde047', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
            >
              <Wrench size={13} /> Worker Form
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              style={{ flex: 1, minWidth: '120px', padding: '0.45rem 0.6rem', fontSize: '0.76rem', fontWeight: 600, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
            >
              <Shield size={13} /> Admin Form
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Role Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Portal Account Type <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              {roles.map(({ value, label, tagline, icon: Icon, color }) => {
                const isSelected = role === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    style={{
                      padding: '0.85rem 0.5rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      border: `1.5px solid ${isSelected ? color : 'var(--border-color)'}`,
                      background: isSelected ? `${color}16` : 'rgba(255,255,255,0.02)',
                      boxShadow: isSelected ? `0 0 15px ${color}25` : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? color : 'rgba(255,255,255,0.06)',
                      color: isSelected ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      <Icon size={17} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? color : 'var(--text-main)' }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                      {tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
            <div>
              <label className="form-label">Full Name <span style={{ color: '#f43f5e' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

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

          {/* Role-Specific Fields */}
          {role === 'worker' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', background: 'rgba(245, 158, 11, 0.05)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div>
                <label className="form-label">Specialization Dept</label>
                <select
                  className="form-select"
                  value={workerCategory}
                  onChange={(e) => setWorkerCategory(e.target.value)}
                >
                  <option value="Roads & Infrastructure">Roads &amp; Infrastructure</option>
                  <option value="Streetlights & Electrical">Streetlights &amp; Electrical</option>
                  <option value="Sanitation & Garbage">Sanitation &amp; Garbage</option>
                  <option value="Water Supply & Drainage">Water Supply &amp; Drainage</option>
                </select>
              </div>
              <div>
                <label className="form-label">Assigned Zone</label>
                <select
                  className="form-select"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <option value="Zone 1 - Central Ward">Zone 1 - Central Ward</option>
                  <option value="Zone 2 - North Indiranagar">Zone 2 - North Indiranagar</option>
                  <option value="Zone 3 - South Koramangala">Zone 3 - South Koramangala</option>
                  <option value="Zone 4 - Roads & Highways">Zone 4 - Roads &amp; Highways</option>
                </select>
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <label className="form-label">Municipal Department</label>
              <select
                className="form-select"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="Municipal Administration">Municipal Administration Head Office</option>
                <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                <option value="Urban Development Authority">Urban Development Authority</option>
              </select>
            </div>
          )}

          {/* Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label className="form-label">Password (Min. 6) <span style={{ color: '#f43f5e' }}>*</span></label>
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

            <div>
              <label className="form-label">Confirm Password <span style={{ color: '#f43f5e' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Lock size={16} />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.2rem' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Declaration Checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ marginTop: '2px', accentColor: '#6366f1', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span>
              I agree to the CivicFix Terms of Public Governance and declare my civic reports are factual and genuine.
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus size={18} /> Register &amp; Continue to Login <ArrowRight size={17} />
              </>
            )}
          </button>

          {/* Link to Login */}
          <div style={{ textAlign: 'center', marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Already registered an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', textDecoration: 'underline' }}
              >
                Go to Login →
              </button>
            </p>
          </div>

        </form>
      </div>

    </div>
  );
}
