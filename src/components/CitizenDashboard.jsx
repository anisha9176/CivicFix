import React, { useState, useRef } from 'react';
import {
  PlusCircle,
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  Search,
  User,
  ShieldCheck,
  Phone,
  Mail,
  Sparkles,
  Layers,
  Check,
  Upload,
  Link as LinkIcon,
  X,
  ThumbsUp,
  ExternalLink,
  ChevronRight,
  Eye,
  Copy,
  CheckCheck,
  Calendar,
  Wrench,
  AlertCircle
} from 'lucide-react';
import MapView from './MapView';

export default function CitizenDashboard({ currentUser, complaints, onReportIssue, onSubmitFeedback, onRefreshData }) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(null);
  const [viewMode, setViewMode] = useState('my'); // 'my' | 'all'
  const [copiedId, setCopiedId] = useState(false);

  // Form State
  const [category, setCategory] = useState('Pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('MG Road Metro Junction, Gate 2, Bengaluru');
  const [lat, setLat] = useState(12.9756);
  const [lng, setLng] = useState(77.6066);
  const [priority, setPriority] = useState('High');

  // Photo Upload State: 'file' or 'url'
  const [photoInputMode, setPhotoInputMode] = useState('file'); // 'file' | 'url'
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const fileInputRef = useRef(null);

  // Rating State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Filter & Search
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Sample realistic photos for quick demonstration
  const samplePhotos = {
    Pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'Broken Streetlight': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    'Garbage Accumulation': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    'Water Leakage': 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
    'Open Drainage': 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    'Fallen Tree': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    'Damaged Road': 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    // If user is in URL mode and hasn't uploaded a custom file, update sample
    if (photoInputMode === 'url' && !photoFileName) {
      if (samplePhotos[cat]) setPhotoUrl(samplePhotos[cat]);
    }
  };

  // Direct File Upload Handler (FileReader to Base64)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Selected image exceeds 15MB limit. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUrl(event.target.result);
      setPhotoFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    setPhotoFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Personal complaints for this specific logged-in user
  const myComplaints = complaints.filter(c => c.citizenId === currentUser.id);

  // Compute dynamic stats for this specific user
  const myTotalCount = myComplaints.length;
  const myActiveCount = myComplaints.filter(c => c.status !== 'Resolved').length;
  const myResolvedCount = myComplaints.filter(c => c.status === 'Resolved').length;
  const cityTotalCount = complaints.length;

  const handleSubmitIssue = (e) => {
    e.preventDefault();
    onReportIssue({
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      category,
      title: title || `${category} issue near ${locationName.split(',')[0]}`,
      description,
      locationName,
      lat,
      lng,
      priority,
      photoUrl: photoUrl || samplePhotos[category] || samplePhotos.Pothole
    });
    setShowReportModal(false);
    setViewMode('my');
    // Reset Form
    setTitle('');
    setDescription('');
    setPhotoUrl('');
    setPhotoFileName('');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!showFeedbackModal) return;
    onSubmitFeedback(showFeedbackModal.id, { rating, comment });
    setShowFeedbackModal(null);
    if (selectedComplaint && selectedComplaint.id === showFeedbackModal.id) {
      setSelectedComplaint(prev => ({
        ...prev,
        feedback: { rating, comment, submittedAt: new Date().toISOString() }
      }));
    }
  };

  // Upvote complaint handler
  const handleUpvote = async (complaintId, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/complaints/${complaintId}/upvote`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (onRefreshData) onRefreshData();
        if (selectedComplaint && selectedComplaint.id === complaintId) {
          setSelectedComplaint(prev => ({ ...prev, upvotes: data.upvotes }));
        }
      }
    } catch (err) {
      console.error('Failed to upvote complaint:', err);
    }
  };

  // Copy Complaint ID helper
  const handleCopyId = (id, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Determine base list based on active tab
  const baseList = viewMode === 'my' ? myComplaints : complaints;

  const filteredComplaints = baseList.filter(c => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.locationName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStepProgress = (status) => {
    switch (status) {
      case 'Reported': return 1;
      case 'Verified': return 2;
      case 'Assigned': return 3;
      case 'In Progress': return 4;
      case 'Resolved': return 5;
      default: return 1;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Personalized Welcome Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95))', borderLeft: '4px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          {/* User Profile Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: 'white',
              fontSize: '1.6rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
              flexShrink: 0
            }}>
              {getInitials(currentUser.name)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-citizen" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  Citizen Resident
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ID: <strong style={{ color: '#a5b4fc' }}>{currentUser.id}</strong>
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                Citizen Portal — {currentUser.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.35rem', flexWrap: 'wrap', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} color="#818cf8" /> {currentUser.email}
                </span>
                {currentUser.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} color="#10b981" /> {currentUser.phone}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="#f59e0b" /> {currentUser.area || 'Bengaluru City'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            className="btn btn-primary"
            onClick={() => {
              setPhotoUrl(samplePhotos.Pothole);
              setPhotoFileName('');
              setPhotoInputMode('file');
              setShowReportModal(true);
            }}
            style={{ padding: '0.85rem 1.6rem', fontSize: '1rem', boxShadow: '0 4px 18px rgba(99,102,241,0.45)' }}
          >
            <PlusCircle size={20} /> Report New Issue
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Personalized for this User */}
      <div className="kpi-grid">
        <div className="glass-panel kpi-card" style={{ borderLeft: '3px solid #6366f1' }}>
          <div className="kpi-info">
            <h4>My Filed Reports</h4>
            <div className="kpi-value" style={{ color: '#818cf8' }}>{myTotalCount}</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Logged by {currentUser.name}</span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            📋
          </div>
        </div>

        <div className="glass-panel kpi-card" style={{ borderLeft: '3px solid #f59e0b' }}>
          <div className="kpi-info">
            <h4>In Progress</h4>
            <div className="kpi-value" style={{ color: '#fde047' }}>{myActiveCount}</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Under municipal repair</span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fde047' }}>
            ⏳
          </div>
        </div>

        <div className="glass-panel kpi-card" style={{ borderLeft: '3px solid #10b981' }}>
          <div className="kpi-info">
            <h4>Resolved for Me</h4>
            <div className="kpi-value" style={{ color: '#6ee7b7' }}>{myResolvedCount}</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completed with proof</span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
            ✅
          </div>
        </div>

        <div className="glass-panel kpi-card" style={{ borderLeft: '3px solid #06b6d4' }}>
          <div className="kpi-info">
            <h4>City Community Reports</h4>
            <div className="kpi-value" style={{ color: '#67e8f9' }}>{cityTotalCount}</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Accessible across all wards</span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9' }}>
            🏙️
          </div>
        </div>
      </div>

      {/* View Switcher Tabs & Search Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Tab Toggle: My Complaints vs All Community */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`role-btn ${viewMode === 'my' ? 'active' : ''}`}
            onClick={() => setViewMode('my')}
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem', fontWeight: 700 }}
          >
            📌 My Reported Complaints ({myTotalCount})
          </button>
          <button
            type="button"
            className={`role-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem', fontWeight: 700 }}
          >
            🌐 All City Complaints ({cityTotalCount})
          </button>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search complaints..."
              className="form-input"
              style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ width: '150px', fontSize: '0.85rem' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

      </div>

      {/* Complaints List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Empty state */}
        {filteredComplaints.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
              <Sparkles size={32} />
            </div>
            
            {viewMode === 'my' ? (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#fff', marginBottom: '0.5rem' }}>
                  No complaints filed by {currentUser.name} yet
                </h3>
                <p style={{ maxWidth: '520px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
                  Notice a pothole, broken streetlight, leaking pipe, or garbage accumulation in your neighborhood? Click below to file your first civic report.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setShowReportModal(true)} style={{ padding: '0.65rem 1.35rem' }}>
                    <PlusCircle size={18} /> Report Your First Issue
                  </button>
                  <button className="btn btn-secondary" onClick={() => setViewMode('all')} style={{ padding: '0.65rem 1.35rem' }}>
                    🌐 Browse All {cityTotalCount} City Complaints
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff', marginBottom: '0.4rem' }}>
                  No complaints match your search
                </h3>
                <p style={{ fontSize: '0.9rem' }}>Try clearing the search box or changing the status filter.</p>
              </>
            )}
          </div>
        ) : (
          filteredComplaints.map((item) => {
            const stepNum = getStepProgress(item.status);
            const isMine = item.citizenId === currentUser.id;

            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isMine ? '1.5px solid rgba(99, 102, 241, 0.45)' : '1px solid var(--border-color)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onClick={() => setSelectedComplaint(item)}
              >
                
                {isMine && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(99, 102, 241, 0.5)', color: '#c7d2fe', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                    My Report
                  </span>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', paddingRight: isMine ? '5rem' : 0 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', color: '#a5b4fc', letterSpacing: '0.05em' }}>
                      {item.id}
                    </span>
                    <span className={`badge badge-${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>

                  {/* Photo Preview */}
                  {item.photoUrl && (
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                      <img src={item.photoUrl} alt={item.category} style={{ width: '100%', height: '145px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-color)' }} />
                      <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', borderRadius: '6px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#fff' }}>
                        <Eye size={12} /> Click to Inspect
                      </div>
                    </div>
                  )}

                  {/* Details Meta */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} color="#a5b4fc" /> <span>{item.locationName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'space-between' }}>
                      <span>Category: <strong style={{ color: '#fff' }}>{item.category}</strong></span>
                      <span className={`badge badge-${item.priority.toLowerCase()}`}>{item.priority} Priority</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      <span>Reported by: <strong style={{ color: '#c7d2fe' }}>{item.citizenName}</strong></span>
                      {item.assignedWorkerName && (
                        <span style={{ color: '#fde047' }}>🛠️ {item.assignedWorkerName}</span>
                      )}
                    </div>
                  </div>

                  {/* Real-time Stepper Progress */}
                  <div className="stepper-container" style={{ margin: '1rem 0' }}>
                    <div className="stepper-line">
                      <div className="stepper-line-fill" style={{ width: `${((stepNum - 1) / 4) * 100}%` }}></div>
                    </div>
                    {['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved'].map((st, idx) => {
                      const currIdx = idx + 1;
                      const isDone = currIdx <= stepNum;
                      const isActive = currIdx === stepNum;
                      return (
                        <div key={st} className={`stepper-step ${isDone ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                          <div className="stepper-circle">{isDone ? '✓' : idx + 1}</div>
                          <span className="stepper-label">{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Action - Guaranteed Access for ALL Complaints */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  
                  {/* Upvote Button */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={(e) => handleUpvote(item.id, e)}
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', borderColor: 'rgba(99, 102, 241, 0.25)' }}
                    title="I am affected by this issue too"
                  >
                    <ThumbsUp size={13} /> {item.upvotes || 0}
                  </button>

                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {/* If resolved & is my complaint and needs rating */}
                    {item.status === 'Resolved' && isMine && !item.feedback && (
                      <button
                        className="btn btn-success"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFeedbackModal(item);
                        }}
                      >
                        <Star size={13} /> Rate Fix
                      </button>
                    )}

                    {/* Prominent Access Button to Open Full Complaint Details */}
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComplaint(item);
                      }}
                    >
                      <Eye size={14} /> Access Details <ChevronRight size={14} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FULL COMPLAINT DETAIL ACCESS MODAL */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: '#a5b4fc' }}>
                    {selectedComplaint.id}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyId(selectedComplaint.id, e)}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '2px 7px', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    title="Copy Complaint ID"
                  >
                    {copiedId ? <CheckCheck size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedId ? 'Copied' : 'Copy ID'}
                  </button>
                  <span className={`badge badge-${selectedComplaint.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedComplaint.status}
                  </span>
                  <span className={`badge badge-${selectedComplaint.priority.toLowerCase()}`}>
                    {selectedComplaint.priority} Priority
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {selectedComplaint.title}
                </h2>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedComplaint(null)}
                style={{ width: '32px', height: '32px', padding: 0, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Description & Citizen Info */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                {selectedComplaint.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem' }}>
                <span>Reported by: <strong style={{ color: '#c7d2fe' }}>{selectedComplaint.citizenName}</strong></span>
                <span>Category: <strong style={{ color: '#fff' }}>{selectedComplaint.category}</strong></span>
                <span>Date: <strong>{new Date(selectedComplaint.createdAt).toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Photo Evidence Section */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Camera size={15} color="#818cf8" /> Visual Evidence
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: selectedComplaint.resolutionPhotoUrl ? '1fr 1fr' : '1fr', gap: '0.85rem' }}>
                {/* Before Photo */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    📸 Original Report Photo (by Citizen)
                  </div>
                  {selectedComplaint.photoUrl ? (
                    <img
                      src={selectedComplaint.photoUrl}
                      alt="Reported Issue"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                    />
                  ) : (
                    <div style={{ height: '120px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      No photo attached
                    </div>
                  )}
                </div>

                {/* After Photo (if resolved) */}
                {selectedComplaint.resolutionPhotoUrl && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={13} /> Resolution Proof Photo (by Field Crew)
                    </div>
                    <img
                      src={selectedComplaint.resolutionPhotoUrl}
                      alt="Resolution Proof"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', border: '1.5px solid rgba(16, 185, 129, 0.4)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Location & Map Preview */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} color="#f59e0b" /> Location: {selectedComplaint.locationName}
              </label>
              {selectedComplaint.lat && selectedComplaint.lng && (
                <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <MapView
                    complaints={[selectedComplaint]}
                    height="190px"
                  />
                </div>
              )}
            </div>

            {/* Assigned Worker & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Assigned Field Crew
                </span>
                <strong style={{ fontSize: '0.95rem', color: selectedComplaint.assignedWorkerName ? '#fde047' : 'var(--text-muted)' }}>
                  {selectedComplaint.assignedWorkerName ? `🛠️ ${selectedComplaint.assignedWorkerName}` : '⏳ Pending assignment'}
                </strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Community Support
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8' }}>
                    👍 {selectedComplaint.upvotes || 0} Citizens Affected
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={(e) => handleUpvote(selectedComplaint.id, e)}
                  >
                    +1 Support
                  </button>
                </div>
              </div>
            </div>

            {/* Stepper & Chronological Timeline */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={15} color="#6ee7b7" /> Official Resolution Timeline &amp; Progress
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '2px solid rgba(99, 102, 241, 0.3)', paddingLeft: '1.25rem', marginLeft: '0.6rem', marginTop: '0.5rem' }}>
                {selectedComplaint.history && selectedComplaint.history.map((h, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-1.65rem', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1', border: '2px solid var(--bg-card)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{h.status}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(h.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{h.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback / Rating (if available) */}
            {selectedComplaint.feedback && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                    Citizen Quality Rating: {selectedComplaint.feedback.rating}/5 Stars
                  </strong>
                </div>
                {selectedComplaint.feedback.comment && (
                  <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>
                    "{selectedComplaint.feedback.comment}"
                  </p>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedComplaint(null)}
              >
                Close View
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedComplaint.status === 'Resolved' && selectedComplaint.citizenId === currentUser.id && !selectedComplaint.feedback && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      setShowFeedbackModal(selectedComplaint);
                    }}
                  >
                    <Star size={15} /> Rate Work Quality
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => handleUpvote(selectedComplaint.id, e)}
                >
                  <ThumbsUp size={15} /> Upvote Issue ({selectedComplaint.upvotes || 0})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* REPORT ISSUE MODAL (WITH BOTH FILE UPLOAD & URL SUPPORT) */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  📢 Report Civic Issue
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
                  Logging complaint as: <strong>{currentUser.name}</strong> ({currentUser.email})
                </span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setShowReportModal(false)}
                style={{ width: '32px', height: '32px', padding: 0, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitIssue}>
              
              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category of Issue *</label>
                <select className="form-select" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                  <option value="Pothole">Pothole / Road Damage</option>
                  <option value="Broken Streetlight">Broken Streetlight / Electrical</option>
                  <option value="Garbage Accumulation">Garbage Accumulation / Sanitation</option>
                  <option value="Water Leakage">Water Pipe Leakage / Supply</option>
                  <option value="Open Drainage">Open Drainage / Sewer Overflow</option>
                  <option value="Fallen Tree">Fallen Tree / Debris</option>
                  <option value="Damaged Road">Damaged Footpath / Construction</option>
                </select>
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label">Issue Title / Short Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dangerous crater-like pothole near Indiranagar 100ft road"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the exact condition, severity, and any hazards to traffic or pedestrians..."
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Location Address */}
              <div className="form-group">
                <label className="form-label">Location Address / Landmark *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
              </div>

              {/* Interactive Location Map Picker */}
              <div className="form-group">
                <label className="form-label">Pin Point Location on Map (Click on map to select)</label>
                <MapView
                  isPickerMode={true}
                  selectedLat={lat}
                  selectedLng={lng}
                  onLocationSelect={(newLat, newLng) => {
                    setLat(newLat);
                    setLng(newLng);
                  }}
                  height="180px"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
              </div>

              {/* Priority */}
              <div className="form-group">
                <label className="form-label">Severity Priority</label>
                <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low - Minor nuisance, non-hazardous</option>
                  <option value="Medium">Medium - Requires attention within 48h</option>
                  <option value="High">High - Impeding traffic or safety</option>
                  <option value="Urgent">Urgent - Immediate public hazard</option>
                </select>
              </div>

              {/* PHOTO UPLOAD: BOTH DIRECT FILE UPLOAD AND URL SUPPORT */}
              <div className="form-group" style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700, color: '#fff' }}>
                    📷 Photo Evidence (Required for verification)
                  </label>
                  
                  {/* Mode Switcher Pills */}
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-color)' }}>
                    <button
                      type="button"
                      onClick={() => setPhotoInputMode('file')}
                      style={{
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: photoInputMode === 'file' ? 'var(--primary)' : 'transparent',
                        color: photoInputMode === 'file' ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Upload size={13} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoInputMode('url')}
                      style={{
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: photoInputMode === 'url' ? 'var(--primary)' : 'transparent',
                        color: photoInputMode === 'url' ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <LinkIcon size={13} /> Image URL
                    </button>
                  </div>
                </div>

                {/* Option 1: DIRECT FILE UPLOAD */}
                {photoInputMode === 'file' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />

                    {!photoUrl || !photoFileName ? (
                      <div
                        className="photo-upload-zone"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ padding: '1.75rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                      >
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Upload size={24} />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                          Click to browse image from your device
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Supports JPG, PNG, WEBP, HEIC (up to 15MB)
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <CheckCircle size={14} /> File: <strong>{photoFileName}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            style={{ background: 'none', border: 'none', color: '#fda4af', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <X size={14} /> Remove / Change
                          </button>
                        </div>
                        <img src={photoUrl} alt="Uploaded preview" className="photo-preview" style={{ maxHeight: '160px', width: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Option 2: IMAGE URL & PRESETS */}
                {photoInputMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      className="form-input"
                      value={photoUrl}
                      onChange={(e) => {
                        setPhotoUrl(e.target.value);
                        setPhotoFileName('');
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                    />

                    {/* Presets */}
                    <div style={{ marginTop: '0.6rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Or choose realistic category sample:
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {Object.entries(samplePhotos).map(([catName, url]) => (
                          <button
                            key={catName}
                            type="button"
                            onClick={() => {
                              setPhotoUrl(url);
                              setCategory(catName);
                              setPhotoFileName('');
                            }}
                            style={{
                              padding: '0.25rem 0.55rem',
                              fontSize: '0.72rem',
                              background: photoUrl === url ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.05)',
                              border: `1px solid ${photoUrl === url ? '#818cf8' : 'var(--border-color)'}`,
                              color: photoUrl === url ? '#fff' : 'var(--text-muted)',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            {catName}
                          </button>
                        ))}
                      </div>
                    </div>

                    {photoUrl && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Image Preview:</span>
                        <img src={photoUrl} alt="URL preview" className="photo-preview" style={{ maxHeight: '150px', width: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Complaint
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              ⭐ Rate Work Quality
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {showFeedbackModal.title} has been marked as Resolved by field workers. How satisfied are you with the resolution?
            </p>

            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', transform: rating >= star ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.15s' }}
                    >
                      <Star size={32} color="#f59e0b" fill={rating >= star ? '#f59e0b' : 'none'} />
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>
                  {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent Resolution' : `${rating} out of 5 Stars`}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Feedback Comments</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="e.g. Prompt work, pothole filled and road smoothed nicely."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFeedbackModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-success">Submit Citizen Rating</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
