import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FileText, BarChart2, TrendingUp, Award, LogOut,
  Printer, Loader2, ChevronDown, LayoutDashboard, Settings,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Save, Menu, X
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://orm-backend-cziu.onrender.com/api';
const SCHOOL_NAME = 'Best Foundation Secondary School';
const SCHOOL_SHORT = 'BFSS';
const SCHOOL_ADDRESS = 'Excellence Avenue, Knowledge City, Nigeria';
const SCHOOL_MOTTO = 'Excellence Through Knowledge';

const gradeChipClass = (grade) => {
  if (grade === 'A1') return 'bg-emerald-100 text-emerald-700 font-bold';
  if (['B2','B3'].includes(grade)) return 'bg-blue-100 text-blue-700 font-bold';
  if (['C4','C5','C6'].includes(grade)) return 'bg-yellow-100 text-yellow-700 font-bold';
  if (['D7','E8'].includes(grade)) return 'bg-orange-100 text-orange-700 font-bold';
  return 'bg-red-100 text-red-700 font-bold';
};

const gradeBgClass = (grade) => {
  if (grade === 'A1') return 'from-emerald-500 to-teal-600';
  if (['B2','B3'].includes(grade)) return 'from-blue-500 to-sky-600';
  if (['C4','C5','C6'].includes(grade)) return 'from-yellow-500 to-amber-600';
  return 'from-red-500 to-rose-600';
};

const ordinalSuffix = (n) => {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const NAV = [
  { id: 'overview',    Icon: LayoutDashboard, label: 'Overview' },
  { id: 'results',     Icon: FileText,        label: 'Result Card' },
  { id: 'performance', Icon: BarChart2,       label: 'Performance' },
  { id: 'settings',    Icon: Settings,        label: 'Settings' },
];

/* ─── Report Card Component (printable) ─────────────────────── */
function ReportCard({ student, results, term, session, profile }) {
  const termResults = term === 'All' ? results : results.filter(r => r.term === term);

  // Compute aggregate stats
  const totalScore = termResults.reduce((s, r) => s + (parseFloat(r.total_score || r.total) || 0), 0);
  const average = termResults.length > 0 ? (totalScore / termResults.length).toFixed(1) : '—';
  const overallGrade = termResults.length > 0 ? (() => {
    const avg = parseFloat(average);
    if (avg >= 75) return 'A1';
    if (avg >= 70) return 'B2';
    if (avg >= 65) return 'B3';
    if (avg >= 60) return 'C4';
    if (avg >= 55) return 'C5';
    if (avg >= 50) return 'C6';
    if (avg >= 45) return 'D7';
    if (avg >= 40) return 'E8';
    return 'F9';
  })() : '—';

  // Determine overall position from backend if available
  const overallPosition = termResults[0]?.overall_class_position && termResults[0]?.overall_class_position !== 'N/A'
    ? termResults[0].overall_class_position
    : null;
  const classSize = termResults[0]?.class_size || null;

  const studentName = profile?.studentInfo?.name || profile?.parentInfo?.name || student?.name || 'N/A';
  const studentClass = profile?.studentInfo?.class || termResults[0]?.class || 'N/A';

  // Split session_id to extract academic year
  const sessionId = termResults[0]?.session_id || '';
  const academicYear = sessionId.split('-')[0] || session || '2025/2026';
  const displayTerm = term === 'All' ? 'All Terms' : `${term} Term`;

  return (
    <div className="overflow-x-auto">
    <div id="report-card-print" className="bg-white font-serif" style={{ maxWidth: 760, margin: '0 auto', padding: '32px', border: '2px solid #001F54', borderRadius: 8, minWidth: 600 }}>

      {/* School Header */}
      <div style={{ borderBottom: '3px double #001F54', paddingBottom: 16, marginBottom: 16, textAlign: 'center' }}>
        {/* Crest placeholder */}
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #001F54, #007BFF)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 28, fontFamily: 'sans-serif' }}>B</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#001F54', margin: 0, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'sans-serif' }}>{SCHOOL_NAME}</h1>
        <p style={{ fontSize: 12, color: '#555', margin: '4px 0 2px', fontFamily: 'sans-serif' }}>{SCHOOL_ADDRESS}</p>
        <p style={{ fontSize: 11, color: '#007BFF', margin: 0, fontStyle: 'italic', fontFamily: 'sans-serif' }}>"{SCHOOL_MOTTO}"</p>
        <div style={{ marginTop: 10, background: '#001F54', color: '#fff', padding: '4px 0', fontSize: 13, fontWeight: 700, letterSpacing: 2, fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
          Student Academic Report Card
        </div>
      </div>

      {/* Student Info + Position Block */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, marginBottom: 16 }}>
        {/* Left: student details */}
        <table style={{ fontSize: 13, width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Student Name', studentName],
              ['Class', studentClass],
              ['Academic Session', academicYear],
              ['Term', displayTerm],
              ['No. of Subjects', termResults.length],
            ].map(([label, val]) => (
              <tr key={label}>
                <td style={{ padding: '3px 0', color: '#444', width: 150, fontFamily: 'sans-serif' }}><strong>{label}:</strong></td>
                <td style={{ padding: '3px 0', borderBottom: '1px dotted #ccc', fontFamily: 'sans-serif', color: '#111' }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Right: Position Box */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #001F54, #003399)', color: '#fff', borderRadius: 12, padding: '16px 24px', minWidth: 120 }}>
          <p style={{ fontSize: 11, margin: '0 0 4px', letterSpacing: 1, opacity: 0.8, fontFamily: 'sans-serif' }}>POSITION</p>
          <p style={{ fontSize: 34, fontWeight: 900, margin: 0, fontFamily: 'sans-serif' }}>
            {overallPosition ? ordinalSuffix(overallPosition) : '—'}
          </p>
          <p style={{ fontSize: 10, margin: '4px 0 8px', opacity: 0.7, fontFamily: 'sans-serif' }}>{classSize ? `out of ${classSize}` : 'in class'}</p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: 8 }}>
            <p style={{ fontSize: 11, margin: '0 0 2px', opacity: 0.8, fontFamily: 'sans-serif' }}>AVERAGE</p>
            <p style={{ fontSize: 20, fontWeight: 800, margin: 0, fontFamily: 'sans-serif' }}>{average}%</p>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: 8, marginTop: 8 }}>
            <p style={{ fontSize: 11, margin: '0 0 2px', opacity: 0.8, fontFamily: 'sans-serif' }}>TOTAL MARKS</p>
            <p style={{ fontSize: 18, fontWeight: 800, margin: 0, fontFamily: 'sans-serif' }}>{totalScore.toFixed(0)}/{termResults.length * 100}</p>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      {termResults.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa', padding: 24, fontFamily: 'sans-serif' }}>No approved results found for this term.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 20 }}>
          <thead>
            <tr style={{ background: '#001F54', color: '#fff' }}>
              {['S/N', 'Subject', 'CA Score (/40)', 'Exam Score (/60)', 'Total (/100)', 'Grade', 'Remark'].map((h, i) => (
                <th key={h} style={{ padding: '8px 10px', textAlign: i === 0 ? 'center' : 'left', fontWeight: 700, fontSize: 11, letterSpacing: 0.5, fontFamily: 'sans-serif' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {termResults.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#f8faff' : '#fff', borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '7px 10px', textAlign: 'center', color: '#888', fontFamily: 'sans-serif' }}>{i + 1}</td>
                <td style={{ padding: '7px 10px', fontWeight: 600, color: '#1e293b', fontFamily: 'sans-serif' }}>{r.subject_name}</td>
                <td style={{ padding: '7px 10px', textAlign: 'center', color: '#374151', fontFamily: 'sans-serif' }}>{r.ca_score ?? '—'}</td>
                <td style={{ padding: '7px 10px', textAlign: 'center', color: '#374151', fontFamily: 'sans-serif' }}>{r.exam_score ?? '—'}</td>
                <td style={{ padding: '7px 10px', textAlign: 'center', fontWeight: 700, color: '#001F54', fontFamily: 'sans-serif' }}>{r.total_score ?? r.total ?? '—'}</td>
                <td style={{ padding: '7px 10px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 20, fontWeight: 700, fontSize: 12,
                    background: r.grade === 'A1' ? '#d1fae5' : ['B2','B3'].includes(r.grade) ? '#dbeafe' : ['C4','C5','C6'].includes(r.grade) ? '#fef3c7' : '#fee2e2',
                    color: r.grade === 'A1' ? '#065f46' : ['B2','B3'].includes(r.grade) ? '#1e40af' : ['C4','C5','C6'].includes(r.grade) ? '#92400e' : '#991b1b',
                  }}>{r.grade || '—'}</span>
                </td>
                <td style={{ padding: '7px 10px', color: '#6b7280', fontStyle: 'italic', fontFamily: 'sans-serif' }}>{r.remark || '—'}</td>
              </tr>
            ))}
          </tbody>
          {/* Summary Row */}
          <tfoot>
            <tr style={{ background: '#001F54', color: '#fff' }}>
              <td colSpan={4} style={{ padding: '8px 10px', fontWeight: 700, fontFamily: 'sans-serif' }}>TOTAL / AVERAGE</td>
              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 800, fontSize: 15, fontFamily: 'sans-serif' }}>{totalScore.toFixed(0)}</td>
              <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 800, fontFamily: 'sans-serif' }}>—</td>
              <td style={{ padding: '8px 10px', fontFamily: 'sans-serif' }}>Avg: {average}%</td>
            </tr>
          </tfoot>
        </table>
      )}

      {/* Grade Key */}
      <div style={{ marginBottom: 20, padding: '10px 12px', background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: 6 }}>
        <p style={{ fontWeight: 700, fontSize: 11, margin: '0 0 6px', color: '#001F54', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'sans-serif' }}>Grade Key</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, fontFamily: 'sans-serif' }}>
          {[['A1','75–100','Excellent'],['B2','70–74','Very Good'],['B3','65–69','Good'],['C4–C6','50–64','Credit'],['D7–E8','40–49','Pass'],['F9','0–39','Fail']].map(([g, range, rem]) => (
            <span key={g} style={{ color: '#374151' }}><strong>{g}</strong> ({range}) — {rem}</span>
          ))}
        </div>
      </div>

      {/* Signature Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        {["Class Teacher's Remark", "Principal's Comment", "Parent/Guardian Signature"].map((label) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #001F54', marginBottom: 4, height: 36 }} />
            <p style={{ fontSize: 11, color: '#666', margin: 0, fontFamily: 'sans-serif' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Next Term / Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #001F54', paddingTop: 10, fontSize: 11, color: '#555', fontFamily: 'sans-serif' }}>
        <span><strong>Next Term Begins:</strong> ___________________________</span>
        <span style={{ color: '#001F54', fontWeight: 700 }}>{SCHOOL_NAME} — Official Academic Report</span>
      </div>
    </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */
export default function StudentDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('All');
  const [activePanel, setActivePanel] = useState('overview');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const user = currentUser;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const isParent = user.role === 'Parent';

  // For parents with multiple children
  const [selectedChildID, setSelectedChildID] = useState(null);

  // Settings states
  const [adminEmail, setAdminEmail] = useState(user?.username || '');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');
  const [updatingCreds, setUpdatingCreds] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadResultsAndProfile = async () => {
      setLoading(true);
      try {
        const profileRes = await axios.get(`${API}/auth/profile`, { headers });
        setProfile(profileRes.data);
        if (profileRes.data?.username) {
          setAdminEmail(profileRes.data.username);
        }

        // For parents: initialize selectedChildID from their children list
        let childID = selectedChildID;
        if (isParent && !childID) {
          const children = profileRes.data?.children || [];
          if (children.length > 0) {
            childID = children[0].studentID;
            setSelectedChildID(childID);
          }
        }

        // Build endpoint
        let endpoint = isParent ? `${API}/results/child` : `${API}/results/my`;
        if (isParent && childID) {
          endpoint = `${API}/results/child?studentID=${childID}`;
        }

        const resultsRes = await axios.get(endpoint, { headers });
        setResults(resultsRes.data.data || resultsRes.data || []);
      } catch (err) {
        console.error("Error loading student portal data", err);
      }
      setLoading(false);
    };
    loadResultsAndProfile();
  }, []);

  // Reload results when parent switches child
  useEffect(() => {
    if (!isParent || !selectedChildID) return;
    const fetchChildResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/results/child?studentID=${selectedChildID}`, { headers });
        setResults(res.data.data || res.data || []);
      } catch (err) {
        console.error('Error loading child results', err);
      }
      setLoading(false);
    };
    fetchChildResults();
  }, [selectedChildID]);

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (!adminEmail) { setCredError('Email is required.'); return; }
    if (adminPassword && adminPassword !== confirmPassword) { setCredError('Passwords do not match.'); return; }

    setUpdatingCreds(true);
    try {
      const payload = { username: adminEmail };
      if (adminPassword) payload.password = adminPassword;
      await axios.put(`${API}/users/${user.userID}`, payload, { headers });
      const updatedUser = { ...user, username: adminEmail };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCredSuccess('Credentials updated successfully.');
      setAdminPassword('');
      setConfirmPassword('');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setCredError(err.response?.data?.error || err.response?.data?.message || 'Failed to update credentials.');
    } finally {
      setUpdatingCreds(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('report-card-print');
    if (!printContent) return;
    const originalBody = document.body.innerHTML;
    document.body.innerHTML = printContent.outerHTML;
    window.print();
    document.body.innerHTML = originalBody;
    window.location.reload();
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const terms = [...new Set(results.map(r => r.term).filter(Boolean))];
  const filtered = selectedTerm === 'All' ? results : results.filter(r => r.term === selectedTerm);

  const avg = filtered.length > 0
    ? (filtered.reduce((s, r) => s + (r.total_score || r.total || 0), 0) / filtered.length).toFixed(1)
    : null;

  const bestResult = filtered.reduce((best, r) => (!best || (r.total_score || r.total) > (best.total_score || best.total)) ? r : best, null);

  const displayName = profile?.studentInfo?.name || profile?.parentInfo?.name || 'Loading...';

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: isMobile ? (sidebarOpen ? 260 : 0) : (sidebarOpen ? 240 : 68) }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full flex flex-col z-40 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #001F54 0%, #003399 60%, #007BFF 100%)' }}
      >
        <div className="flex items-center px-4 py-5 border-b border-white/10 min-h-[72px]">
          {!sidebarOpen && !isMobile ? (
            <button onClick={() => setSidebarOpen(p => !p)} className="w-full flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
                <span className="text-white font-black text-xl">B</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-[11px] leading-tight truncate">{SCHOOL_NAME}</p>
                <p className="text-blue-300 text-[10px] tracking-widest">{isParent ? 'Parent' : 'Student'} Portal</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
                {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setActivePanel(item.id); if (isMobile) setSidebarOpen(false); }} title={!sidebarOpen && !isMobile ? item.label : ''}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                activePanel === item.id
                  ? 'bg-white text-[#001F54] font-bold shadow-lg'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}>
              <item.Icon size={18} className="flex-shrink-0" />
              {(sidebarOpen || isMobile) && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold truncate">{item.label}</motion.span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <div className="flex items-center gap-3">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" alt="Avatar" />
            ) : (
              <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center font-black text-white text-sm">
                {(profile?.studentInfo?.name || profile?.parentInfo?.name || currentUser?.username)?.[0]?.toUpperCase() || 'S'}
              </div>
            )}
            {(sidebarOpen || isMobile) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                <p className="text-blue-300 text-[10px]">{user.role}</p>
              </motion.div>
            )}
            {(sidebarOpen || isMobile) && (
              <button onClick={handleLogout} className="text-blue-300 hover:text-red-400 transition-colors flex-shrink-0">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <motion.main
        animate={{ marginLeft: isMobile ? 0 : (sidebarOpen ? 240 : 68) }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-1 min-h-screen flex flex-col"
      >
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
                >
                  <Menu size={20} />
                </button>
              )}
              <div>
                <p className="text-[#001F54] font-bold text-base md:text-lg">{NAV.find(n => n.id === activePanel)?.label}</p>
                <p className="text-slate-400 text-xs hidden sm:block">{SCHOOL_NAME} — {isParent ? 'Parent' : 'Student'} Dashboard</p>
              </div>
              {/* Child selector for parents with multiple children */}
              {isParent && profile?.children && profile.children.length > 1 && (
                <div className="ml-3">
                  <select
                    value={selectedChildID || ''}
                    onChange={e => setSelectedChildID(parseInt(e.target.value))}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white font-semibold text-[#001F54]"
                  >
                    {profile.children.map(child => (
                      <option key={child.studentID} value={child.studentID}>
                        {child.name} ({child.class})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} className="w-8 h-8 rounded-xl object-cover" alt="Avatar" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                  {(profile?.studentInfo?.name || profile?.parentInfo?.name || currentUser?.username)?.[0]?.toUpperCase() || 'S'}
                </div>
              )}
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{displayName}</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={activePanel} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              
              {/* Overview Panel */}
              {activePanel === 'overview' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-black text-[#001F54]">
                      {isParent ? `${profile?.parentInfo?.name}'s Portal` : `Welcome, ${profile?.studentInfo?.name?.split(' ')[0] || 'Student'}`}
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm">
                      {isParent
                        ? `Monitor your child's academic performance at ${SCHOOL_NAME}.`
                        : `Track your academic performance at ${SCHOOL_NAME}.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { Icon: FileText,  label: 'Total Results',   value: filtered.length || '0',             color: 'bg-blue-50',   iconColor: 'text-blue-600' },
                      { Icon: TrendingUp, label: 'Average Score',  value: avg ? `${avg}%` : '—',              color: 'bg-purple-50', iconColor: 'text-purple-600' },
                      { Icon: BarChart2, label: 'Best Subject',     value: bestResult?.subject_name || '—',    color: 'bg-amber-50',  iconColor: 'text-amber-600', small: true },
                      { Icon: Award,     label: 'Best Grade',       value: bestResult?.grade || '—',           color: 'bg-emerald-50',iconColor: 'text-emerald-600' },
                    ].map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                          <s.Icon size={18} className={s.iconColor} />
                        </div>
                        <p className={`font-black text-[#001F54] ${s.small ? 'text-sm leading-tight' : 'text-3xl'} mb-1`}>{s.value}</p>
                        <p className="text-slate-400 text-xs font-medium">{s.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-[#001F54] to-[#007BFF] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/30">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <div className="relative z-10 max-w-xl">
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">{SCHOOL_NAME}</p>
                      <h3 className="text-xl font-bold mb-2">Need a printed copy of your results?</h3>
                      <p className="text-blue-100 text-sm mb-6 leading-relaxed">You can download or print your official termly report card directly. Navigate to the "Result Card" tab, filter by term, and click "Print Report Card".</p>
                      <button onClick={() => setActivePanel('results')} className="bg-white text-[#001F54] font-bold px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm">
                        View Result Card
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Card Panel */}
              {activePanel === 'results' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#001F54]">Result Card</h2>
                      <p className="text-slate-400 text-sm mt-1">Official {SCHOOL_NAME} academic report card</p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <div className="relative">
                        <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)}
                          className="appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white font-medium text-slate-600">
                          <option value="All">All Terms</option>
                          {terms.map(t => <option key={t} value={t}>{t} Term</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      <button onClick={handlePrint}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all text-sm">
                        <Printer size={14} /> Print Report Card
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-24 text-slate-400">
                      <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" /> Loading results…
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-24 text-slate-400">
                      <FileText size={44} className="mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-lg text-slate-600">No approved results available</p>
                      <p className="text-sm mt-1">Results will appear here once they are approved by the Admin</p>
                    </div>
                  ) : (
                    <ReportCard
                      student={isParent
                        ? (profile?.children?.find(c => c.studentID === selectedChildID) || profile?.children?.[0])
                        : profile?.studentInfo}
                      results={filtered}
                      term={selectedTerm}
                      session="2025/2026"
                      profile={profile}
                    />
                  )}
                </div>
              )}

              {/* Performance Panel */}
              {activePanel === 'performance' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-[#001F54]">Performance</h2>
                    <p className="text-slate-400 text-sm mt-1">Visual breakdown of your academic progress by subject</p>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
                      <BarChart2 size={44} className="mx-auto mb-4 opacity-20" />
                      <p className="font-semibold text-slate-600">No approved results to display</p>
                      <p className="text-sm mt-1">Performance cards will appear once results are approved</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map((r, i) => {
                        const scoreVal = r.total_score || r.total || 0;
                        return (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-bold text-slate-800 text-sm">{r.subject_name}</p>
                              {r.grade && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${gradeBgClass(r.grade)} text-white`}>
                                  {r.grade}
                                </span>
                              )}
                            </div>
                            <p className="text-4xl font-black text-[#001F54] mb-4">{scoreVal}</p>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                              <motion.div
                                className={`h-full rounded-full bg-gradient-to-r ${gradeBgClass(r.grade)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${scoreVal}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                              />
                            </div>
                            <p className="text-xs text-slate-400">{r.remark || '—'} &middot; {r.term} Term</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Panel */}
              {activePanel === 'settings' && (
                <div className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-5">
                      <div className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        {currentUser?.avatar ? (
                          <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-400 to-teal-400 text-white text-2xl font-black">
                            {(profile?.studentInfo?.name || profile?.parentInfo?.name || currentUser?.username)?.[0]?.toUpperCase() || 'S'}
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity">
                          Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) {
                                alert("Image must be smaller than 2MB");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const base64String = reader.result;
                                try {
                                  const token = localStorage.getItem('token');
                                  const headers = { Authorization: `Bearer ${token}` };
                                  await axios.put(`${API}/users/${currentUser.userID}`, { avatar: base64String }, { headers });
                                  const updated = { ...currentUser, avatar: base64String };
                                  localStorage.setItem('user', JSON.stringify(updated));
                                  setCurrentUser(updated);
                                  alert("Profile picture updated successfully!");
                                } catch (err) {
                                  alert("Failed to update profile picture.");
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#001F54] text-base">Profile Photo</h3>
                        <p className="text-slate-400 text-xs mt-0.5">JPG or PNG. Max size 2MB.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-bold text-[#001F54] text-base">Account Credentials</h3>
                        <p className="text-slate-400 text-xs mt-0.5">Update your email address and login password</p>
                      </div>
                      {credSuccess && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                          <CheckCircle size={13} /> {credSuccess}
                        </motion.div>
                      )}
                    </div>

                    {credError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle size={14} /> {credError}
                      </div>
                    )}

                    <form onSubmit={handleUpdateCredentials} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                          <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">New Password</label>
                          <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Confirm New Password</label>
                          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button type="submit" disabled={updatingCreds}
                          className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all disabled:opacity-60">
                          {updatingCreds ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Credentials
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="mb-5">
                      <h3 className="font-bold text-[#001F54] text-base">Portal Session</h3>
                      <p className="text-slate-400 text-xs mt-0.5">Your portal account details and session management</p>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" alt="Avatar" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#001F54] to-[#007BFF] flex items-center justify-center text-white font-black text-xl">
                          {(profile?.studentInfo?.name || profile?.parentInfo?.name || currentUser?.username)?.[0]?.toUpperCase() || 'S'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-[#001F54] text-base">{displayName}</p>
                        <p className="text-slate-500 text-sm">{user?.username}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#007BFF] text-white text-xs font-bold rounded-full">{user.role}</span>
                      </div>
                    </div>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 border border-red-200 text-red-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
