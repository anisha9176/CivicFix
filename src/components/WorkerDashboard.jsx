import React, { useState, useRef } from 'react';
import { Wrench, CheckCircle, Clock, MapPin, Camera, Play, CheckSquare, AlertCircle, Phone, Shield } from 'lucide-react';
import MapView from './MapView';

export default function WorkerDashboard({ currentUser, complaints, onUpdateStatus }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(null);
  const [taskView, setTaskView] = useState('assigned'); // 'assigned' | 'available'
  const [resolutionInputMode, setResolutionInputMode] = useState('file'); // 'file' | 'url'
  const [resolutionPhotoUrl, setResolutionPhotoUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80');
  const [resolutionFileName, setResolutionFileName] = useState('');
  const [workNotes, setWorkNotes] = useState('Completed on-site repairing and safety inspection.');
  const resolutionFileInputRef = useRef(null);

  const handleResolutionFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('Selected image exceeds 15MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setResolutionPhotoUrl(event.target.result);
      setResolutionFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Filter complaints assigned to logged-in worker
  const myTasks = complaints.filter(c => c.assignedWorkerId === currentUser.id);

  // Available / Unassigned tasks in worker's specialization category or unassigned
  const availableTasks = complaints.filter(c => !c.assignedWorkerId && c.status !== 'Resolved');

  const handleStartWork = (complaintId) => {
    onUpdateStatus(complaintId, 'In Progress', `Field worker ${currentUser.name} arrived at site and commenced repair work.`, null);
  };

  const handleConfirmResolution = (e) => {
    e.preventDefault();
    if (!showResolveModal) return;
    onUpdateStatus(showResolveModal.id, 'Resolved', `${workNotes} (Verified by ${currentUser.name})`, resolutionPhotoUrl);
    setShowResolveModal(null);
  };

  const getInitials = (name) => {
    if (!name) return 'W';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const currentDisplayTasks = taskView === 'assigned' ? myTasks : availableTasks;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Personalized Header Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.85), rgba(15, 23, 42, 0.95))', borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
              flexShrink: 0
            }}>
              {getInitials(currentUser.name)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-worker" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  Field Specialist
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ID: <strong style={{ color: '#fde047' }}>{currentUser.id}</strong>
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Worker Workstation — {currentUser.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.35rem', flexWrap: 'wrap', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Wrench size={14} color="#f59e0b" /> {currentUser.category || 'Roads & Infrastructure'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="#10b981" /> {currentUser.area || 'Zone 4 - Roads'}
                </span>
                {currentUser.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} color="#60a5fa" /> {currentUser.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Tasks</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fde047', fontFamily: 'var(--font-heading)' }}>
                {myTasks.filter(t => t.status !== 'Resolved').length}
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Completed</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6ee7b7', fontFamily: 'var(--font-heading)' }}>
                {myTasks.filter(t => t.status === 'Resolved').length}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Task Queue Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`role-btn ${taskView === 'assigned' ? 'active' : ''}`}
            onClick={() => setTaskView('assigned')}
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', fontWeight: 700 }}
          >
            📌 My Assigned Tasks ({myTasks.length})
          </button>
          <button
            type="button"
            className={`role-btn ${taskView === 'available' ? 'active' : ''}`}
            onClick={() => setTaskView('available')}
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', fontWeight: 700 }}
          >
            📋 Unassigned City Tasks ({availableTasks.length})
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {currentDisplayTasks.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle size={52} style={{ marginBottom: '1rem', color: '#10b981' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#fff', marginBottom: '0.4rem' }}>
              {taskView === 'assigned' ? `Queue Clear for ${currentUser.name}!` : 'No Unassigned Tasks'}
            </h3>
            <p style={{ marginTop: '0.5rem', maxWidth: '440px', margin: '0 auto' }}>
              {taskView === 'assigned'
                ? `You have 0 pending tasks assigned in your queue right now. You can check the Unassigned City Tasks tab.`
                : 'All reported city complaints have been assigned to workers.'}
            </p>
          </div>
        ) : (
          currentDisplayTasks.map((task) => (
            <div key={task.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', color: '#a5b4fc' }}>{task.id}</span>
                  <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                    {task.status}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                  {task.title}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  {task.description}
                </p>

                {/* Citizen Photo */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                  <img src={task.photoUrl} alt="Citizen Photo" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-color)' }} />
                  <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>
                    📷 Citizen Photo (Reported by {task.citizenName})
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#a5b4fc" /> <span>{task.locationName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Category: <strong style={{ color: '#fff' }}>{task.category}</strong></span>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority} Priority</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                {task.status === 'Assigned' && (
                  <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => handleStartWork(task.id)}>
                    <Play size={14} /> Start On-Site Work
                  </button>
                )}

                {task.status === 'In Progress' && (
                  <button className="btn btn-success" style={{ flex: 1, padding: '0.5rem' }} onClick={() => setShowResolveModal(task)}>
                    <CheckSquare size={14} /> Submit Resolution Proof
                  </button>
                )}

                {task.status === 'Resolved' && (
                  <div style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', color: '#10b981', fontWeight: 600, padding: '0.3rem' }}>
                    ✓ Work Completed &amp; Verified
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* RESOLUTION PROOF MODAL */}
      {showResolveModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              📸 Submit Resolution Proof
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Provide visual proof and notes of the completed fix for <strong>{showResolveModal.id}</strong>.
            </p>

            <form onSubmit={handleConfirmResolution}>
              <div className="form-group">
                <label className="form-label">Completion Notes</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  required
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                />
              </div>

              {/* Photo Evidence with Direct File Upload and URL */}
              <div className="form-group" style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>After-Fix Proof Photo *</label>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-color)' }}>
                    <button
                      type="button"
                      onClick={() => setResolutionInputMode('file')}
                      style={{
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: resolutionInputMode === 'file' ? 'var(--primary)' : 'transparent',
                        color: resolutionInputMode === 'file' ? '#fff' : 'var(--text-muted)'
                      }}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolutionInputMode('url')}
                      style={{
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: resolutionInputMode === 'url' ? 'var(--primary)' : 'transparent',
                        color: resolutionInputMode === 'url' ? '#fff' : 'var(--text-muted)'
                      }}
                    >
                      🔗 URL
                    </button>
                  </div>
                </div>

                {resolutionInputMode === 'file' ? (
                  <div>
                    <input
                      ref={resolutionFileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleResolutionFileUpload}
                    />

                    {!resolutionFileName ? (
                      <div
                        className="photo-upload-zone"
                        onClick={() => resolutionFileInputRef.current?.click()}
                        style={{ padding: '1.25rem 0.5rem', cursor: 'pointer', textAlign: 'center' }}
                      >
                        <Camera size={24} color="#10b981" style={{ margin: '0 auto 0.35rem auto', display: 'block' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', display: 'block' }}>Click to upload completion photo from device</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>JPG, PNG, WEBP</span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.75rem', color: '#6ee7b7' }}>
                          <span>✓ Selected: {resolutionFileName}</span>
                          <button
                            type="button"
                            onClick={() => { setResolutionPhotoUrl(''); setResolutionFileName(''); }}
                            style={{ background: 'none', border: 'none', color: '#fda4af', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            Remove
                          </button>
                        </div>
                        <img src={resolutionPhotoUrl} alt="Resolution Preview" className="photo-preview" style={{ maxHeight: '130px', width: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      className="form-input"
                      required
                      value={resolutionPhotoUrl}
                      onChange={(e) => {
                        setResolutionPhotoUrl(e.target.value);
                        setResolutionFileName('');
                      }}
                      placeholder="https://..."
                    />
                    {resolutionPhotoUrl && (
                      <img src={resolutionPhotoUrl} alt="Resolution Preview" className="photo-preview" style={{ marginTop: '0.5rem', maxHeight: '130px', width: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowResolveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-success">Mark as Resolved</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
