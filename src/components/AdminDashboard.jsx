import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, AlertCircle, Clock, CheckCircle, BarChart3, Filter, Search, UserPlus, Star, ArrowUpRight, Flame, MapPin } from 'lucide-react';
import MapView from './MapView';

export default function AdminDashboard({ currentUser, complaints, workers, onVerify, onAssignWorker, onUpdatePriority, analyticsStats }) {
  const [adminTab, setAdminTab] = useState('complaints'); // 'complaints' | 'workers' | 'analytics' | 'feedback'
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Assign Worker Modal
  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  // Priority Change Modal
  const [priorityComplaint, setPriorityComplaint] = useState(null);
  const [newPriority, setNewPriority] = useState('High');

  useEffect(() => {
    if (workers.length > 0 && !selectedWorkerId) {
      setSelectedWorkerId(workers[0].id);
    }
  }, [workers]);

  const filteredComplaints = complaints.filter((c) => {
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchesSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      c.locationName.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assigningComplaint || !selectedWorkerId) return;
    const worker = workers.find(w => w.id === selectedWorkerId);
    onAssignWorker(assigningComplaint.id, selectedWorkerId, worker ? worker.name : 'Assigned Worker');
    setAssigningComplaint(null);
  };

  const handlePrioritySubmit = (e) => {
    e.preventDefault();
    if (!priorityComplaint) return;
    onUpdatePriority(priorityComplaint.id, newPriority);
    setPriorityComplaint(null);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.8))', borderLeft: '4px solid #a855f7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c4b5fd', fontWeight: 'bold' }}>
                Municipal Administrator Command Center
              </span>
              <span className="badge badge-admin" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                {currentUser?.area || currentUser?.department || 'Municipal Administration'}
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Civic Oversight &amp; Dispatch — {currentUser?.name || 'Admin Officer'}
            </h1>
          </div>

          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button className={`role-btn ${adminTab === 'complaints' ? 'active' : ''}`} onClick={() => setAdminTab('complaints')}>
              Complaints ({complaints.length})
            </button>
            <button className={`role-btn ${adminTab === 'workers' ? 'active' : ''}`} onClick={() => setAdminTab('workers')}>
              Workers Roster ({workers.length})
            </button>
            <button className={`role-btn ${adminTab === 'analytics' ? 'active' : ''}`} onClick={() => setAdminTab('analytics')}>
              <BarChart3 size={14} /> Analytics
            </button>
            <button className={`role-btn ${adminTab === 'feedback' ? 'active' : ''}`} onClick={() => setAdminTab('feedback')}>
              Citizen Feedback
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="kpi-grid">
        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h4>Total Complaints</h4>
            <div className="kpi-value" style={{ color: '#fff' }}>{analyticsStats.total || complaints.length}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <ShieldCheck />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h4>Pending Verification</h4>
            <div className="kpi-value" style={{ color: '#93c5fd' }}>{analyticsStats.pending || 0}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Clock />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h4>In Progress</h4>
            <div className="kpi-value" style={{ color: '#fde047' }}>{analyticsStats.inProgress || 0}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Users />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h4>Resolved</h4>
            <div className="kpi-value" style={{ color: '#6ee7b7' }}>{analyticsStats.resolved || 0}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h4>High & Urgent Priority</h4>
            <div className="kpi-value" style={{ color: '#fda4af' }}>{analyticsStats.highPriority || 0}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <Flame />
          </div>
        </div>
      </div>

      {/* TAB 1: COMPLAINTS MANAGEMENT */}
      {adminTab === 'complaints' && (
        <>
          {/* Advanced Filter Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Search Complaint</label>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search ID, title, citizen..."
                    className="form-input"
                    style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Category</label>
                <select className="form-select" style={{ fontSize: '0.85rem' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="Pothole">Pothole</option>
                  <option value="Broken Streetlight">Broken Streetlight</option>
                  <option value="Garbage Accumulation">Garbage Accumulation</option>
                  <option value="Water Leakage">Water Leakage</option>
                  <option value="Open Drainage">Open Drainage</option>
                  <option value="Fallen Tree">Fallen Tree</option>
                  <option value="Damaged Road">Damaged Road</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Status</label>
                <select className="form-select" style={{ fontSize: '0.85rem' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Reported">Reported</option>
                  <option value="Verified">Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Priority</label>
                <select className="form-select" style={{ fontSize: '0.85rem' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="All">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaints Data Table */}
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Complaint ID</th>
                  <th style={{ padding: '0.75rem' }}>Issue Details</th>
                  <th style={{ padding: '0.75rem' }}>Location</th>
                  <th style={{ padding: '0.75rem' }}>Category</th>
                  <th style={{ padding: '0.75rem' }}>Priority</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Assigned Worker</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No complaints match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 'bold', color: '#a5b4fc' }}>
                        {item.id}
                      </td>
                      <td style={{ padding: '0.75rem', maxWidth: '240px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By: {item.citizenName}</div>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', maxWidth: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="#a5b4fc" />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.locationName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge badge-${item.priority.toLowerCase()}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge badge-${item.status.toLowerCase().replace(' ', '-')}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: item.assignedWorkerName ? '#fff' : 'var(--text-dim)' }}>
                        {item.assignedWorkerName || 'Unassigned'}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          {item.status === 'Reported' && (
                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }} onClick={() => onVerify(item.id)}>
                              Verify
                            </button>
                          )}

                          <button className="btn btn-primary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setAssigningComplaint(item)}>
                            {item.assignedWorkerId ? 'Reassign' : 'Assign Worker'}
                          </button>

                          <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => { setPriorityComplaint(item); setNewPriority(item.priority); }}>
                            Priority
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 2: WORKERS ROSTER */}
      {adminTab === 'workers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {workers.map((w) => (
            <div key={w.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                    {w.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>{w.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', padding: '4px 10px', borderRadius: '12px', color: '#f59e0b', fontWeight: 'bold' }}>
                  <Star size={14} fill="#f59e0b" /> {w.rating}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Active Assigned Tasks</span>
                  <strong style={{ color: '#fde047', fontSize: '1.1rem' }}>{w.activeTasks || 0}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Completed Resolutions</span>
                  <strong style={{ color: '#6ee7b7', fontSize: '1.1rem' }}>{w.completedTasks || 0}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                📱 Phone: <strong style={{ color: '#fff' }}>{w.phone}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ANALYTICS & CHARTS */}
      {adminTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              📊 Complaints by Category
            </h3>
            {Object.entries(analyticsStats.byCategory || {}).map(([cat, count]) => {
              const pct = analyticsStats.total ? Math.round((count / analyticsStats.total) * 100) : 0;
              return (
                <div key={cat} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>{cat}</span>
                    <span style={{ fontWeight: 'bold' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              📈 Complaints by Status
            </h3>
            {Object.entries(analyticsStats.byStatus || {}).map(([st, count]) => {
              const pct = analyticsStats.total ? Math.round((count / analyticsStats.total) * 100) : 0;
              return (
                <div key={st} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>{st}</span>
                    <span style={{ fontWeight: 'bold' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CITIZEN FEEDBACK */}
      {adminTab === 'feedback' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {complaints.filter(c => c.feedback).length === 0 ? (
            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No feedback submitted yet by citizens.
            </div>
          ) : (
            complaints.filter(c => c.feedback).map(c => (
              <div key={c.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', color: '#a5b4fc' }}>{c.id}</span>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[...Array(c.feedback.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" />
                    ))}
                  </div>
                </div>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{c.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.5rem 0', fontStyle: 'italic' }}>
                  "{c.feedback.comment}"
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Citizen: {c.citizenName}</span>
                  <span>Worker: {c.assignedWorkerName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ASSIGN WORKER MODAL */}
      {assigningComplaint && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
              👷 Assign Field Worker
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Select an available municipal worker to handle complaint <strong>{assigningComplaint.id}</strong> ({assigningComplaint.category}).
            </p>

            <form onSubmit={handleAssignSubmit}>
              <div className="form-group">
                <label className="form-label">Select Worker</label>
                <select className="form-select" value={selectedWorkerId} onChange={(e) => setSelectedWorkerId(e.target.value)}>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} — {w.category} (Active: {w.activeTasks})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setAssigningComplaint(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Worker Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRIORITY MODAL */}
      {priorityComplaint && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
              ⚠️ Update Priority Level
            </h3>

            <form onSubmit={handlePrioritySubmit}>
              <div className="form-group">
                <label className="form-label">Priority Level for {priorityComplaint.id}</label>
                <select className="form-select" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent Priority (Public Hazard)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setPriorityComplaint(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Priority</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
