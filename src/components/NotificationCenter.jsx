import React from 'react';
import { Bell, CheckCheck, Clock, ShieldAlert, Wrench, UserCheck } from 'lucide-react';

export default function NotificationCenter({ notifications = [], onClose, onMarkAllRead }) {
  return (
    <div className="notifications-drawer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bell size={18} color="var(--primary)" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Notifications</h3>
        </div>
        <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={onMarkAllRead}>
          <CheckCheck size={14} /> Clear
        </button>
      </div>

      {notifications.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          No new notifications.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: n.read ? 'rgba(0,0,0,0.2)' : 'rgba(99, 102, 241, 0.1)',
                borderLeft: n.read ? '3px solid transparent' : '3px solid var(--primary)',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>{n.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{n.message}</div>
              <small style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: '0.3rem', display: 'block' }}>
                {new Date(n.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
