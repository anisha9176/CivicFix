import React from 'react';
import { ShieldAlert, Bell, MapPin, LogIn, LogOut, UserPlus, Shield, User, Wrench } from 'lucide-react';

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  unreadCount,
  toggleNotifications,
  onLogout,
  authView,
  onNavigate
}) {
  // Compute initials for user avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleIcon = (role) => {
    if (role === 'admin') return <Shield size={14} />;
    if (role === 'worker') return <Wrench size={14} />;
    return <User size={14} />;
  };

  return (
    <header className="app-header">
      {/* Brand Logo */}
      <div
        className="logo-container"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          if (currentUser) {
            setActiveTab('dashboard');
          } else if (onNavigate) {
            onNavigate('register');
          }
        }}
      >
        <div className="logo-icon">
          <ShieldAlert size={20} />
        </div>
        <span>CivicFix</span>
        <span style={{ fontSize: '0.65rem', background: 'rgba(99, 102, 241, 0.2)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Gov Portal
        </span>
      </div>

      {/* Navigation Tabs - Only show when logged in */}
      {currentUser ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            Dashboard
          </button>

          <button
            className={`btn ${activeTab === 'map' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('map')}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <MapPin size={16} /> Map Overview
          </button>
        </div>
      ) : (
        /* Auth Navigation when not logged in */
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            className={`btn ${authView === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onNavigate && onNavigate('register')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', border: 'none' }}
          >
            <UserPlus size={15} /> 1. Register
          </button>
          <button
            className={`btn ${authView === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onNavigate && onNavigate('login')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', border: 'none' }}
          >
            <LogIn size={15} /> 2. Login
          </button>
        </div>
      )}

      {/* User Info & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {currentUser ? (
          <>
            {/* Notifications Icon Button */}
            <button
              onClick={toggleNotifications}
              style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-main)',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#f43f5e',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Currently Logged-in User Profile Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', background: 'rgba(0,0,0,0.35)', padding: '5px 10px 5px 8px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {/* User Avatar Circle */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: currentUser.role === 'admin'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : currentUser.role === 'worker'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.04em'
              }}>
                {getInitials(currentUser.name)}
              </div>

              {/* User details */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem', lineHeight: 1.2 }}>
                  {currentUser.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                  <span className={`badge badge-${currentUser.role}`} style={{ fontSize: '0.62rem', padding: '1px 6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    {getRoleIcon(currentUser.role)} {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                className="btn btn-secondary"
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  background: 'rgba(244, 63, 94, 0.15)',
                  color: '#fda4af',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  marginLeft: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onClick={onLogout}
                title="Logout and switch account"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={14} color="#6366f1" /> Secure Access
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
