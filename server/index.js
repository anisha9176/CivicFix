import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'db.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Initial Seed Data if db.json doesn't exist
const initialSeed = {
  users: [
    { id: 'usr_c1', name: 'Aarav Patel', email: 'aarav@citizen.in', password: 'password123', role: 'citizen', phone: '+91 98765 43210' },
    { id: 'usr_c2', name: 'Vikram Mehta', email: 'vikram@citizen.in', password: 'password123', role: 'citizen', phone: '+91 98123 45678' },
    { id: 'usr_a1', name: 'Rajesh Verma (Officer)', email: 'admin@civicfix.gov.in', password: 'password123', role: 'admin', department: 'Municipal Administration' },
    { id: 'usr_w1', name: 'Ramesh Kumar', email: 'ramesh@worker.in', password: 'password123', role: 'worker', area: 'Zone 4 - Roads', phone: '+91 99887 76655' },
    { id: 'usr_w2', name: 'Suresh Patel', email: 'suresh@worker.in', password: 'password123', role: 'worker', area: 'Zone 2 - Electrical', phone: '+91 98777 66554' },
    { id: 'usr_w3', name: 'Priya Sundaram', email: 'priya@worker.in', password: 'password123', role: 'worker', area: 'Zone 1 - Sanitation', phone: '+91 97654 32109' },
  ],
  workers: [
    { id: 'usr_w1', name: 'Ramesh Kumar', category: 'Roads & Infrastructure', phone: '+91 99887 76655', activeTasks: 2, completedTasks: 45, rating: 4.8 },
    { id: 'usr_w2', name: 'Suresh Patel', category: 'Streetlights & Electrical', phone: '+91 98777 66554', activeTasks: 1, completedTasks: 38, rating: 4.9 },
    { id: 'usr_w3', name: 'Priya Sundaram', category: 'Sanitation & Garbage', phone: '+91 97654 32109', activeTasks: 1, completedTasks: 52, rating: 4.7 },
  ],
  categories: [
    'Pothole',
    'Broken Streetlight',
    'Garbage Accumulation',
    'Water Leakage',
    'Open Drainage',
    'Fallen Tree',
    'Damaged Road'
  ],
  complaints: [
    {
      id: 'CF-2026-8941',
      citizenId: 'usr_c1',
      citizenName: 'Aarav Patel',
      category: 'Pothole',
      title: 'Large Pothole near MG Road Metro Junction',
      description: 'Severe pothole created after heavy rains causing dangerous traffic congestion and accidents for two-wheelers.',
      locationName: 'MG Road Metro Station, Gate 2, Bengaluru',
      lat: 12.9756,
      lng: 77.6066,
      priority: 'High',
      status: 'In Progress',
      createdAt: '2026-09-08T09:30:00.000Z',
      photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      assignedWorkerId: 'usr_w1',
      assignedWorkerName: 'Ramesh Kumar',
      verifiedAt: '2026-09-08T11:00:00.000Z',
      assignedAt: '2026-09-08T11:15:00.000Z',
      inProgressAt: '2026-09-09T08:00:00.000Z',
      resolutionPhotoUrl: null,
      resolvedAt: null,
      feedback: null,
      history: [
        { status: 'Reported', timestamp: '2026-09-08T09:30:00.000Z', note: 'Complaint logged by Citizen' },
        { status: 'Verified', timestamp: '2026-09-08T11:00:00.000Z', note: 'Verified by Admin Rajesh Verma' },
        { status: 'Assigned', timestamp: '2026-09-08T11:15:00.000Z', note: 'Assigned to Worker Ramesh Kumar' },
        { status: 'In Progress', timestamp: '2026-09-09T08:00:00.000Z', note: 'Worker dispatched to site with tar mixture' }
      ]
    },
    {
      id: 'CF-2026-8940',
      citizenId: 'usr_c2',
      citizenName: 'Vikram Mehta',
      category: 'Broken Streetlight',
      title: 'Dark Stretch - 3 Non-functional Streetlights on 4th Main',
      description: 'The streetlights have been flickering and completely off for 4 days. Safety concern for pedestrians at night.',
      locationName: '4th Main Road, Indiranagar, Bengaluru',
      lat: 12.9784,
      lng: 77.6408,
      priority: 'Medium',
      status: 'Resolved',
      createdAt: '2026-09-06T14:20:00.000Z',
      photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
      assignedWorkerId: 'usr_w2',
      assignedWorkerName: 'Suresh Patel',
      verifiedAt: '2026-09-06T15:00:00.000Z',
      assignedAt: '2026-09-06T15:30:00.000Z',
      inProgressAt: '2026-09-07T09:00:00.000Z',
      resolutionPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
      resolvedAt: '2026-09-07T12:30:00.000Z',
      feedback: {
        rating: 5,
        comment: 'Prompt response! Replaced LED bulbs and wiring within 24 hours. Great work by Suresh!',
        submittedAt: '2026-09-07T14:00:00.000Z'
      },
      history: [
        { status: 'Reported', timestamp: '2026-09-06T14:20:00.000Z', note: 'Complaint logged by Citizen' },
        { status: 'Verified', timestamp: '2026-09-06T15:00:00.000Z', note: 'Verified by Admin Rajesh Verma' },
        { status: 'Assigned', timestamp: '2026-09-06T15:30:00.000Z', note: 'Assigned to Worker Suresh Patel' },
        { status: 'In Progress', timestamp: '2026-09-07T09:00:00.000Z', note: 'Electrical line inspection underway' },
        { status: 'Resolved', timestamp: '2026-09-07T12:30:00.000Z', note: 'Replaced LED luminaire and restored power line' }
      ]
    },
    {
      id: 'CF-2026-8939',
      citizenId: 'usr_c1',
      citizenName: 'Aarav Patel',
      category: 'Garbage Accumulation',
      title: 'Overflowing Waste Dump behind Residential Complex',
      description: 'Garbage has accumulated for over 3 days without collection, spreading foul odor and attracting stray animals.',
      locationName: '12th Cross, Koramangala 4th Block, Bengaluru',
      lat: 12.9345,
      lng: 77.6245,
      priority: 'Urgent',
      status: 'Reported',
      createdAt: '2026-09-09T18:10:00.000Z',
      photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      assignedWorkerId: null,
      assignedWorkerName: null,
      verifiedAt: null,
      assignedAt: null,
      inProgressAt: null,
      resolutionPhotoUrl: null,
      resolvedAt: null,
      feedback: null,
      history: [
        { status: 'Reported', timestamp: '2026-09-09T18:10:00.000Z', note: 'Complaint logged by Citizen' }
      ]
    },
    {
      id: 'CF-2026-8938',
      citizenId: 'usr_c2',
      citizenName: 'Vikram Mehta',
      category: 'Water Leakage',
      title: 'Pipeline Burst leaking clean water on public road',
      description: 'Water main pipe rupture leaking thousands of liters per hour. Submerging nearby footpaths.',
      locationName: 'Near Jayanagar Shopping Complex, Bengaluru',
      lat: 12.9250,
      lng: 77.5938,
      priority: 'Urgent',
      status: 'Verified',
      createdAt: '2026-09-09T14:00:00.000Z',
      photoUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
      assignedWorkerId: null,
      assignedWorkerName: null,
      verifiedAt: '2026-09-09T15:00:00.000Z',
      assignedAt: null,
      inProgressAt: null,
      resolutionPhotoUrl: null,
      resolvedAt: null,
      feedback: null,
      history: [
        { status: 'Reported', timestamp: '2026-09-09T14:00:00.000Z', note: 'Complaint logged by Citizen' },
        { status: 'Verified', timestamp: '2026-09-09T15:00:00.000Z', note: 'Marked Verified by Admin' }
      ]
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      recipientRole: 'citizen',
      recipientId: 'usr_c1',
      title: 'Status Update',
      message: 'Your complaint CF-2026-8941 is now In Progress by Ramesh Kumar.',
      timestamp: '2026-09-09T08:00:00.000Z',
      read: false
    },
    {
      id: 'notif_2',
      recipientRole: 'worker',
      recipientId: 'usr_w1',
      title: 'New Task Assigned',
      message: 'Admin assigned you Complaint CF-2026-8941: Large Pothole near MG Road.',
      timestamp: '2026-09-08T11:15:00.000Z',
      read: false
    }
  ]
};

// Database helper functions
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    saveData(initialSeed);
    return initialSeed;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return initialSeed;
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// REST Endpoints

// 1. Get all complaints with query filters
app.get('/api/complaints', (req, res) => {
  const db = loadData();
  let { role, userId, status, category, priority, search } = req.query;
  let results = db.complaints;

  if (role === 'citizen' && userId) {
    results = results.filter(c => c.citizenId === userId);
  } else if (role === 'worker' && userId) {
    results = results.filter(c => c.assignedWorkerId === userId);
  }

  if (status && status !== 'All') {
    results = results.filter(c => c.status === status);
  }
  if (category && category !== 'All') {
    results = results.filter(c => c.category === category);
  }
  if (priority && priority !== 'All') {
    results = results.filter(c => c.priority === priority);
  }
  if (search) {
    const query = search.toLowerCase();
    results = results.filter(c =>
      c.id.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.locationName.toLowerCase().includes(query)
    );
  }

  res.json(results);
});

// 2. Get single complaint detail
app.get('/api/complaints/:id', (req, res) => {
  const db = loadData();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  res.json(complaint);
});

// 2b. Upvote complaint (Citizen community engagement)
app.post('/api/complaints/:id/upvote', (req, res) => {
  const db = loadData();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  complaint.upvotes = (complaint.upvotes || 0) + 1;
  saveData(db);
  res.json({ success: true, upvotes: complaint.upvotes });
});

// 3. Create new complaint (Citizen)
app.post('/api/complaints', (req, res) => {
  const db = loadData();
  const { citizenId, citizenName, category, title, description, locationName, lat, lng, priority, photoUrl } = req.body;

  const count = db.complaints.length + 1001;
  const newId = `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newComplaint = {
    id: newId,
    citizenId: citizenId || 'usr_citizen',
    citizenName: citizenName || 'Citizen Reporter',
    category: category || 'Pothole',
    title: title || `${category} Issue reported`,
    description: description || 'No detailed description provided.',
    locationName: locationName || 'Central Municipal Zone',
    lat: parseFloat(lat) || 12.9716,
    lng: parseFloat(lng) || 77.5946,
    priority: priority || 'Medium',
    status: 'Reported',
    createdAt: new Date().toISOString(),
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    assignedWorkerId: null,
    assignedWorkerName: null,
    verifiedAt: null,
    assignedAt: null,
    inProgressAt: null,
    resolutionPhotoUrl: null,
    resolvedAt: null,
    feedback: null,
    history: [
      { status: 'Reported', timestamp: new Date().toISOString(), note: 'Complaint submitted by citizen.' }
    ]
  };

  db.complaints.unshift(newComplaint);

  // Add system notification for admin
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    recipientRole: 'admin',
    title: 'New Complaint Logged',
    message: `New ${priority} priority complaint (${newId}) submitted in ${category}.`,
    timestamp: new Date().toISOString(),
    read: false
  });

  saveData(db);
  res.status(201).json(newComplaint);
});

// 4. Update complaint status / priority / verification (Admin & Worker)
app.put('/api/complaints/:id/status', (req, res) => {
  const db = loadData();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const { status, note, resolutionPhotoUrl, priority, actionBy } = req.body;
  const now = new Date().toISOString();

  if (priority) {
    complaint.priority = priority;
  }

  if (status) {
    complaint.status = status;
    if (status === 'Verified') complaint.verifiedAt = now;
    if (status === 'In Progress') complaint.inProgressAt = now;
    if (status === 'Resolved') {
      complaint.resolvedAt = now;
      if (resolutionPhotoUrl) complaint.resolutionPhotoUrl = resolutionPhotoUrl;
    }

    complaint.history.push({
      status,
      timestamp: now,
      note: note || `Status updated to ${status} by ${actionBy || 'User'}`
    });

    // Notify Citizen
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      recipientRole: 'citizen',
      recipientId: complaint.citizenId,
      title: `Status: ${status}`,
      message: `Your complaint ${complaint.id} status changed to "${status}".`,
      timestamp: now,
      read: false
    });
  }

  saveData(db);
  res.json(complaint);
});

// 5. Assign Worker to Complaint (Admin)
app.put('/api/complaints/:id/assign', (req, res) => {
  const db = loadData();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const { workerId, workerName } = req.body;
  const now = new Date().toISOString();

  complaint.assignedWorkerId = workerId;
  complaint.assignedWorkerName = workerName;
  complaint.status = 'Assigned';
  complaint.assignedAt = now;

  complaint.history.push({
    status: 'Assigned',
    timestamp: now,
    note: `Assigned to worker ${workerName} by Admin.`
  });

  // Notify Worker
  db.notifications.unshift({
    id: `notif_w_${Date.now()}`,
    recipientRole: 'worker',
    recipientId: workerId,
    title: 'Task Assigned',
    message: `You have been assigned complaint ${complaint.id}: ${complaint.title}`,
    timestamp: now,
    read: false
  });

  // Notify Citizen
  db.notifications.unshift({
    id: `notif_c_${Date.now()}`,
    recipientRole: 'citizen',
    recipientId: complaint.citizenId,
    title: 'Worker Assigned',
    message: `Worker ${workerName} has been assigned to resolve ${complaint.id}.`,
    timestamp: now,
    read: false
  });

  saveData(db);
  res.json(complaint);
});

// 6. Citizen Feedback Submittal
app.post('/api/complaints/:id/feedback', (req, res) => {
  const db = loadData();
  const complaint = db.complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const { rating, comment } = req.body;
  complaint.feedback = {
    rating: parseInt(rating) || 5,
    comment: comment || 'Thank you for resolving this issue!',
    submittedAt: new Date().toISOString()
  };

  saveData(db);
  res.json(complaint);
});

// 7. Get Workers list
app.get('/api/workers', (req, res) => {
  const db = loadData();
  res.json(db.workers);
});

// 8. Analytics Dashboard Statistics (Admin)
app.get('/api/analytics/stats', (req, res) => {
  const db = loadData();
  const total = db.complaints.length;
  const pending = db.complaints.filter(c => c.status === 'Reported' || c.status === 'Verified').length;
  const inProgress = db.complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolved = db.complaints.filter(c => c.status === 'Resolved').length;
  const highPriority = db.complaints.filter(c => c.priority === 'High' || c.priority === 'Urgent').length;

  const byCategory = {};
  const byStatus = {};

  db.complaints.forEach(c => {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
  });

  res.json({
    total,
    pending,
    inProgress,
    resolved,
    highPriority,
    byCategory,
    byStatus
  });
});

// 9. Notifications Endpoint
app.get('/api/notifications', (req, res) => {
  const db = loadData();
  const { role, userId } = req.query;
  let notifs = db.notifications;

  if (role) {
    notifs = notifs.filter(n => n.recipientRole === role || !n.recipientRole);
  }
  res.json(notifs);
});

// 10. AUTHENTICATION ENDPOINTS

// Register Endpoint
app.post('/api/auth/register', (req, res) => {
  const db = loadData();
  const { name, email, password, role, phone, category, area } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const userRole = role || 'citizen';
  const prefix = userRole === 'admin' ? 'usr_a' : userRole === 'worker' ? 'usr_w' : 'usr_c';
  const newUserId = `${prefix}_${Date.now()}`;

  const newUser = {
    id: newUserId,
    name,
    email: email.toLowerCase(),
    password,
    role: userRole,
    phone: phone || '+91 90000 00000',
    area: area || 'Central Zone'
  };

  db.users.push(newUser);

  // If worker, add to workers list
  if (userRole === 'worker') {
    db.workers.push({
      id: newUserId,
      name,
      category: category || 'General Infrastructure',
      phone: phone || '+91 90000 00000',
      activeTasks: 0,
      completedTasks: 0,
      rating: 5.0
    });
  }

  saveData(db);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ success: true, user: userWithoutPassword });
});

// Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const db = loadData();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check password (allow default seed match if password not set)
  if (user.password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});

// Get registered users list (Admin)
app.get('/api/auth/users', (req, res) => {
  const db = loadData();
  const safeUsers = db.users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`CivicFix Backend REST API listening on http://localhost:${PORT}`);
});
