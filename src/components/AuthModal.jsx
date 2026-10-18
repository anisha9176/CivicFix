import React, { useState } from 'react';
import { LogIn, UserPlus, Shield, User, Wrench, Lock, Mail, Phone, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('citizen');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [workerCategory, setWorkerCategory] = useState('Roads & Infrastructure');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setSuccess('');
  };

  const fillDemo = (demoRole) => {
    setError(''); setSuccess('');
    if (demoRole === 'citizen')  { setEmail('ananya@citizen.in');        setPassword('password123'); }
    if (demoRole === 'admin')    { setEmail('admin@civicfix.gov.in');    setPassword('password123'); }
    if (demoRole === 'worker')   { setEmail('ramesh@worker.in');         setPassword('password123'); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setSuccess(`Welcome back, ${data.user.name}!`);
      setTimeout(() => { onLoginSuccess(data.user); onClose(); }, 600);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, role, phone, category: workerCategory }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('Account created! Logging you in…');
      setTimeout(() => { onLoginSuccess(data.user); onClose(); }, 700);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const roles = [
    { value: 'citizen', label: 'Citizen',       sub: 'Report & track issues',    icon: User,    color: '#6366f1' },
    { value: 'worker',  label: 'Field Worker',   sub: 'Resolve assigned tasks',   icon: Wrench,  color: '#f59e0b' },
    { value: 'admin',   label: 'Administrator',  sub: 'Manage & oversee all',     icon: Shield,  color: '#10b981' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px', padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={15} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem' }}>CivicFix</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
              {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', padding: '3px', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          {[['login','Login'],['register','Register']].map(([m, label]) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1, padding: '0.5rem', fontSize: '0.85rem', fontWeight: 600,
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: mode === m ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'transparent',
                color: mode === m ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.9rem', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#fda4af', borderRadius: '8px', marginBottom: '1.1rem', fontSize: '0.83rem' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}
        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.9rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', borderRadius: '8px', marginBottom: '1.1rem', fontSize: '0.83rem' }}>
            <CheckCircle2 size={15} /> {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field label="Email Address" icon={<Mail size={15} />}>
              <input type="email" required placeholder="you@example.com" className="form-input" style={{ paddingLeft: '2.4rem' }}
                value={email} onChange={e => setEmail(e.target.value)} />
            </Field>

            <Field label="Password" icon={<Lock size={15} />}>
              <input type="password" required placeholder="••••••••" className="form-input" style={{ paddingLeft: '2.4rem' }}
                value={password} onChange={e => setPassword(e.target.value)} />
            </Field>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.7rem', marginTop: '0.25rem' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', marginBottom: '0.6rem' }}>Quick demo fill</p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[['citizen','👤 Citizen'],['admin','🛡️ Admin'],['worker','🛠️ Worker']].map(([r, label]) => (
                  <button key={r} type="button" onClick={() => fillDemo(r)}
                    style={{ flex: 1, padding: '0.35rem 0.2rem', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', borderRadius: '7px', cursor: 'pointer' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
              No account?{' '}
              <span style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }} onClick={() => switchMode('register')}>Register here</span>
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Role picker cards */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                I am a…
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {roles.map(({ value, label, sub, icon: Icon, color }) => (
                  <button
                    key={value} type="button"
                    onClick={() => setRole(value)}
                    style={{
                      flex: 1, padding: '0.7rem 0.4rem', borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                      border: `1.5px solid ${role === value ? color : 'var(--border-color)'}`,
                      background: role === value ? `${color}18` : 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem'
                    }}
                  >
                    <Icon size={18} color={role === value ? color : 'var(--text-muted)'} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: role === value ? color : 'var(--text-main)' }}>{label}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <Field label="Full Name">
              <input type="text" required placeholder="e.g. Anisha G" className="form-input"
                value={name} onChange={e => setName(e.target.value)} />
            </Field>

            <Field label="Email Address" icon={<Mail size={15} />}>
              <input type="email" required placeholder="you@example.com" className="form-input" style={{ paddingLeft: '2.4rem' }}
                value={email} onChange={e => setEmail(e.target.value)} />
            </Field>

            <Field label="Phone Number" icon={<Phone size={15} />}>
              <input type="tel" placeholder="+91 98765 43210" className="form-input" style={{ paddingLeft: '2.4rem' }}
                value={phone} onChange={e => setPhone(e.target.value)} />
            </Field>

            {role === 'worker' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Specialization</label>
                <select className="form-select" value={workerCategory} onChange={e => setWorkerCategory(e.target.value)}>
                  <option value="Roads & Infrastructure">Roads &amp; Infrastructure</option>
                  <option value="Streetlights & Electrical">Streetlights &amp; Electrical</option>
                  <option value="Sanitation & Garbage">Sanitation &amp; Garbage</option>
                  <option value="Water Supply & Drainage">Water Supply &amp; Drainage</option>
                </select>
              </div>
            )}

            <Field label="Password" icon={<Lock size={15} />}>
              <input type="password" required placeholder="Min. 6 characters" className="form-input" style={{ paddingLeft: '2.4rem' }}
                value={password} onChange={e => setPassword(e.target.value)} />
            </Field>

            <Field label="Confirm Password" icon={<Lock size={15} />}>
              <input type="password" required placeholder="Re-enter password" className="form-input" style={{ paddingLeft: '2.4rem' }}
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </Field>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.7rem', marginTop: '0.25rem' }} disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
              Already have an account?{' '}
              <span style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }} onClick={() => switchMode('login')}>Sign in</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>
      {icon ? (
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>{icon}</span>
          {children}
        </div>
      ) : children}
    </div>
  );
}
