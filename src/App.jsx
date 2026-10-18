import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import MapView from './components/MapView';
import NotificationCenter from './components/NotificationCenter';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';

export default function App() {
  // Clear any legacy persistent login from localStorage so cold link visits start fresh
  useEffect(() => {
    localStorage.removeItem('civicfix_user');
  }, []);

  // Determine initial auth view from URL hash:
  // '#' or empty -> 'register' (always lead to register page on link click)
  // '#login' -> 'login'
  // '#dashboard' -> only if active session exists, else 'register'
  const getInitialState = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const sessionSaved = sessionStorage.getItem('civicfix_user');
    let sessionUser = null;
    if (sessionSaved) {
      try { sessionUser = JSON.parse(sessionSaved); } catch (e) {}
    }

    if (hash === 'dashboard' && sessionUser) {
      return { user: sessionUser, view: 'dashboard' };
    }
    if (hash === 'login') {
      return { user: null, view: 'login' };
    }
    // Default entrypoint for any link click: Register page first!
    return { user: null, view: 'register' };
  };

  const [currentUser, setCurrentUser] = useState(() => getInitialState().user);
  const [authView, setAuthView] = useState(() => getInitialState().view);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'map'
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [analyticsStats, setAnalyticsStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync hash and view
  const navigateTo = (view) => {
    setAuthView(view);
    window.location.hash = view;
  };

  // Sync initial hash on mount if empty
  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
      window.location.hash = 'register';
      setAuthView('register');
    }
  }, []);

  // Listen for browser navigation (back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'login') {
        setAuthView('login');
      } else if (hash === 'register') {
        setAuthView('register');
      } else if (hash === 'dashboard') {
        if (currentUser) {
          setAuthView('dashboard');
        } else {
          navigateTo('register');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  // Sync user state with sessionStorage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('civicfix_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('civicfix_user');
      localStorage.removeItem('civicfix_user');
    }
  }, [currentUser]);

  // Fetch data from Express REST backend when user is logged in
  const fetchData = async () => {
    if (!currentUser) return;
    try {
      const userRole = currentUser.role || 'citizen';
      const userId = currentUser.id || '';

      const [resComplaints, resWorkers, resStats, resNotifs] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/workers'),
        fetch('/api/analytics/stats'),
        fetch(`/api/notifications?role=${userRole}&userId=${userId}`)
      ]);

      if (resComplaints.ok) setComplaints(await resComplaints.json());
      if (resWorkers.ok) setWorkers(await resWorkers.json());
      if (resStats.ok) setAnalyticsStats(await resStats.json());
      if (resNotifs.ok) setNotifications(await resNotifs.json());
    } catch (err) {
      console.error('API connection error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Step 1 -> Step 2: Register successful, lead to Login
  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setJustRegistered(true);
    navigateTo('login');
  };

  // Step 2 -> Step 3: Login successful, lead to Dashboard
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setJustRegistered(false);
    navigateTo('dashboard');
  };

  // Logout: Clear user and return to Register page
  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('civicfix_user');
    localStorage.removeItem('civicfix_user');
    setJustRegistered(false);
    setRegisteredEmail('');
    navigateTo('register');
  };

  // Handler: Report new issue
  const handleReportIssue = async (issueData) => {
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData)
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to report issue:', err);
    }
  };

  // Handler: Admin Verify
  const handleVerify = async (complaintId) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Verified', actionBy: currentUser ? currentUser.name : 'Admin' })
      });
      if (res.ok) await fetchData();
    } catch (err) {
      console.error('Failed to verify complaint:', err);
    }
  };

  // Handler: Admin Update Priority
  const handleUpdatePriority = async (complaintId, priority) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority, actionBy: currentUser ? currentUser.name : 'Admin' })
      });
      if (res.ok) await fetchData();
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  // Handler: Admin Assign Worker
  const handleAssignWorker = async (complaintId, workerId, workerName) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, workerName })
      });
      if (res.ok) await fetchData();
    } catch (err) {
      console.error('Failed to assign worker:', err);
    }
  };

  // Handler: Worker Update Status (In Progress or Resolved with proof)
  const handleUpdateStatus = async (complaintId, status, note, resolutionPhotoUrl) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, resolutionPhotoUrl, actionBy: currentUser ? currentUser.name : 'Worker' })
      });
      if (res.ok) await fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Handler: Citizen Feedback
  const handleSubmitFeedback = async (complaintId, feedbackData) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      if (res.ok) await fetchData();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Header
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        toggleNotifications={() => setShowNotifications(!showNotifications)}
        onLogout={handleLogout}
        authView={authView}
        onNavigate={navigateTo}
      />

      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={handleMarkAllRead}
        />
      )}

      <main style={{ flex: 1 }}>
        {/* Step 1: Register Page */}
        {authView === 'register' && !currentUser && (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => navigateTo('login')}
          />
        )}

        {/* Step 2: Login Page */}
        {authView === 'login' && !currentUser && (
          <LoginPage
            initialEmail={registeredEmail}
            justRegistered={justRegistered}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => navigateTo('register')}
          />
        )}

        {/* Step 3: Dashboard (Citizen / Admin / Worker) */}
        {currentUser && (
          activeTab === 'map' ? (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  🗺️ City-Wide Civic Issues Live Map
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Color codes: <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>Red</span> = Urgent/High Priority, <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Yellow</span> = In Progress, <span style={{ color: '#10b981', fontWeight: 'bold' }}>Green</span> = Resolved.
                </p>
              </div>
              <MapView complaints={complaints} height="580px" />
            </div>
          ) : currentUser.role === 'citizen' ? (
            <CitizenDashboard
              currentUser={currentUser}
              complaints={complaints}
              onReportIssue={handleReportIssue}
              onSubmitFeedback={handleSubmitFeedback}
              onRefreshData={fetchData}
            />
          ) : currentUser.role === 'admin' ? (
            <AdminDashboard
              currentUser={currentUser}
              complaints={complaints}
              workers={workers}
              onVerify={handleVerify}
              onAssignWorker={handleAssignWorker}
              onUpdatePriority={handleUpdatePriority}
              analyticsStats={analyticsStats}
            />
          ) : (
            <WorkerDashboard
              currentUser={currentUser}
              complaints={complaints}
              onUpdateStatus={handleUpdateStatus}
            />
          )
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2rem' }}>
        <strong>CivicFix</strong> — Centralized Civic Issue Resolution Platform & Transparency Portal &copy; 2026
      </footer>
    </div>
  );
}
