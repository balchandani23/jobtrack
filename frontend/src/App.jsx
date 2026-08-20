import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  MapPin, 
  Banknote, 
  Trash2, 
  Plus, 
  LogOut, 
  Search, 
  Calendar,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Building2,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  LayoutGrid,
  Columns3,
  Award,
  BarChart3,
  ExternalLink,
  Percent
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const CURRENCIES = [
  { symbol: '₹', code: 'INR', label: '₹ INR' },
  { symbol: '$', code: 'USD', label: '$ USD' },
  { symbol: '€', code: 'EUR', label: '€ EUR' },
  { symbol: '£', code: 'GBP', label: '£ GBP' },
  { symbol: 'C$', code: 'CAD', label: 'C$ CAD' },
  { symbol: 'A$', code: 'AUD', label: 'A$ AUD' },
  { symbol: '¥', code: 'JPY', label: '¥ JPY' },
  { symbol: 'AED', code: 'AED', label: 'AED' },
];

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [isRegistering, setIsRegistering] = useState(false);

  // Auth States
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard View State
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'grid'

  // Application States
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, screening: 0, interview: 0, offer: 0, rejected: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Job Creation Inputs
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [location, setLocation] = useState('Remote');
  const [currency, setCurrency] = useState('₹');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [notes, setNotes] = useState('');

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    if (!token) return;
    try {
      const [jobsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/jobs?status=${statusFilter}&search=${search}`, authHeaders),
        axios.get(`${API_BASE}/jobs/stats`, authHeaders)
      ]);
      setJobs(jobsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token, statusFilter, search]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering 
      ? { name: authName, email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword };

    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, payload);
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      setAuthError(err.response?.data?.msg || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const formattedSalary = salaryAmount ? `${currency} ${salaryAmount}` : '';
      await axios.post(`${API_BASE}/jobs`, {
        company,
        position,
        status,
        location,
        salary: formattedSalary,
        notes
      }, authHeaders);

      setCompany('');
      setPosition('');
      setStatus('Applied');
      setLocation('Remote');
      setCurrency('₹');
      setSalaryAmount('');
      setNotes('');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await axios.delete(`${API_BASE}/jobs/${id}`, authHeaders);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE}/jobs/${id}`, { status: newStatus }, authHeaders);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Pipeline Math Calculations
  const interviewRate = stats.total > 0 ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;
  const offerRate = stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0;

  // --- AUTHENTICATION SCREEN ---
  if (!token) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
        <div style={{
          flex: '1 1 50%',
          position: 'relative',
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '4rem',
          backgroundImage: 'linear-gradient(180deg, rgba(6,9,19,0.4) 0%, rgba(6,9,19,0.96) 100%), url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRight: '1px solid var(--border-subtle)'
        }} className="hero-left">
          <style>{`@media (min-width: 900px) { .hero-left { display: flex !important; } }`}</style>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--accent-glow)' }}>
              <Briefcase size={22} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>JobTrack <span style={{ color: '#a855f7' }}>Pro</span></h2>
          </div>

          <div style={{ maxWidth: '520px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', padding: '0.4rem 1rem', borderRadius: 9999, marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Sparkles size={16} color="#facc15" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Accelerate Your Career Pipeline</span>
            </div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              Master your applications with effortless precision.
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              A high-performance workspace designed for modern professionals to organize opportunities, monitor interview stages, and land offers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <ShieldCheck size={20} color="#34d399" /> Private & Encrypted
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <Zap size={20} color="#6366f1" /> Multi-Currency Tracker
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            © 2026 JobTrack Pro. Crafted for peak productivity by Bhavya Balchandani.
          </div>
        </div>

        <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', position: 'relative' }}>
          <div className="glass-panel animate-fade" style={{ width: '100%', maxWidth: '440px', padding: '2.75rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {isRegistering ? 'Create your account' : 'Welcome back'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                {isRegistering ? 'Enter your details below to get started.' : 'Sign in to access your synchronized pipeline.'}
              </p>
            </div>

            {authError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {isRegistering && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Name</label>
                  <input type="text" className="custom-input" placeholder="e.g. Bhavya Balchandani" value={authName} onChange={(e) => setAuthName(e.target.value)} required />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email Address</label>
                <input type="email" className="custom-input" placeholder="name@gmail.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Password</label>
                <input type="password" className="custom-input" placeholder="••••••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
              </div>

              <button type="submit" className="btn-gradient" style={{ width: '100%', marginTop: '0.5rem' }}>
                {isRegistering ? 'Create Workspace' : 'Sign In'} <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {isRegistering ? 'Already have an account?' : "Don't have an account yet?"}{' '}
                <span style={{ color: '#818cf8', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setAuthError(''); setIsRegistering(!isRegistering); }}>
                  {isRegistering ? 'Sign In' : 'Create an Account'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- REUSABLE CARD RENDERER ---
  const renderJobCard = (job) => (
    <div key={job._id} className="glass-panel animate-fade" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(18, 25, 43, 0.7)' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className={`status-pill status-${job.status}`}>{job.status}</span>
          <button onClick={() => handleDeleteJob(job._id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} title="Delete">
            <Trash2 size={15} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{job.position}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <Building2 size={15} color="var(--accent-primary)" /> {job.company}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} color="var(--text-dim)" /> {job.location || 'Remote'}
          </div>
          {job.salary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600 }}>
              <Banknote size={14} /> {job.salary}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} color="var(--text-dim)" /> {new Date(job.appliedDate).toLocaleDateString()}
          </div>
        </div>

        {job.notes && (
          <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', background: 'rgba(10, 14, 26, 0.5)', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
            {job.notes}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Stage:</span>
        <select 
          className="custom-select" 
          style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
          value={job.status}
          onChange={(e) => handleStatusChange(job._id, e.target.value)}
        >
          {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );

  // --- DASHBOARD SCREEN ---
  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Top Navbar */}
      <header className="glass-panel" style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--accent-glow)' }}>
            <Briefcase size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>JobTrack Pro</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Logged in as <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{user?.name || 'Applicant'}</span></p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-gradient" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> New Application
          </button>
          <button className="btn-ghost" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Analytics Banner & Conversion Rates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        {/* KPI Counter Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>TOTAL JOBS</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.25rem' }}>{stats.total}</div>
          </div>
          <div style={{ height: '40px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--status-interview)', fontWeight: 600 }}>INTERVIEWS</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--status-interview)' }}>{stats.interview}</div>
          </div>
          <div style={{ height: '40px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--status-offer)', fontWeight: 600 }}>OFFERS</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--status-offer)' }}>{stats.offer}</div>
          </div>
        </div>

        {/* Live Conversion Rate Metrics */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc' }}><Percent size={14} /> Interview Rate</span>
              <span>{interviewRate}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${interviewRate}%`, background: 'var(--status-screening)', borderRadius: 99, transition: '0.4s ease' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}><Award size={14} /> Offer Conversion</span>
              <span>{offerRate}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${offerRate}%`, background: 'var(--status-offer)', borderRadius: 99, transition: '0.4s ease' }} />
            </div>
          </div>
        </div>

      </div>

      {/* Control Bar: Search, Filters & Kanban / Grid Switcher */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '380px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search company or role..." 
            className="custom-input" 
            style={{ paddingLeft: '2.75rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* View Mode Toggle & Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={() => setViewMode('kanban')} 
              style={{
                background: viewMode === 'kanban' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'kanban' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.45rem 0.8rem',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <Columns3 size={15} /> Board
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              style={{
                background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.45rem 0.8rem',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <LayoutGrid size={15} /> Grid
            </button>
          </div>

          {viewMode === 'grid' && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['All', ...STAGES].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    background: statusFilter === st ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: statusFilter === st ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Render */}
      {jobs.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <Building2 size={54} color="var(--text-dim)" style={{ margin: '0 auto 1.25rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Applications Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Click "New Application" to begin building out your active hiring pipeline.
          </p>
          <button className="btn-gradient" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Track New Job
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="kanban-board">
          {STAGES.map((colStage) => {
            const colJobs = jobs.filter((j) => j.status === colStage);
            return (
              <div key={colStage} className="kanban-col">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className={`status-pill status-${colStage}`}>{colStage}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{colJobs.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {colJobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1px dashed var(--border-subtle)', borderRadius: 10, color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                      No {colStage} jobs
                    </div>
                  ) : (
                    colJobs.map((j) => renderJobCard(j))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* STANDARD GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {jobs.map((j) => renderJobCard(j))}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 15, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 999 }}>
          <div className="glass-panel animate-fade" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Track New Opportunity</h2>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-dim)' }} onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Company *</label>
                <input type="text" className="custom-input" placeholder="e.g. Google, Stripe, Microsoft" value={company} onChange={(e) => setCompany(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Position / Title *</label>
                <input type="text" className="custom-input" placeholder="e.g. Frontend Engineer, Product Lead" value={position} onChange={(e) => setPosition(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Status</label>
                  <select className="custom-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Location</label>
                  <input type="text" className="custom-input" placeholder="e.g. Bengaluru, Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Salary & Compensation</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select className="custom-select" style={{ width: '120px', flexShrink: 0 }} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {CURRENCIES.map((c) => <option key={c.code} value={c.symbol}>{c.label}</option>)}
                  </select>
                  <input type="text" className="custom-input" placeholder="e.g. 18,00,000" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Notes & Links</label>
                <textarea className="custom-textarea" rows="3" placeholder="Recruiter info, portfolio submitted, follow-up date..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-gradient" style={{ flex: 1 }}>Save Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}