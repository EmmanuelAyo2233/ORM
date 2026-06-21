import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FileText, BarChart2, User, LogOut, ChevronLeft, ChevronRight,
  Loader2, CheckCircle, Save, BookOpen, GraduationCap, Users, AlertCircle, LayoutDashboard, Lock, Menu, X
} from 'lucide-react';
import { calculateGrade, calculateRemark } from '../utils/gradingEngine';

const API = import.meta.env.VITE_API_URL || 'https://orm-backend-cziu.onrender.com/api';
const SCHOOL_NAME = 'Best Foundation Secondary School';
const SCHOOL_SHORT = 'BFSS';

const gradeChipClass = (grade) => {
  if (grade === 'A1') return 'bg-emerald-100 text-emerald-700 font-bold';
  if (['B2','B3'].includes(grade)) return 'bg-blue-100 text-blue-700 font-bold';
  if (['C4','C5','C6'].includes(grade)) return 'bg-yellow-100 text-yellow-700 font-bold';
  if (['D7','E8'].includes(grade)) return 'bg-orange-100 text-orange-700 font-bold';
  return 'bg-red-100 text-red-700 font-bold';
};

const NAV = [
  { id: 'overview', Icon: LayoutDashboard, label: 'Overview' },
  { id: 'scores',   Icon: FileText,        label: 'Enter Scores' },
  { id: 'history',  Icon: BarChart2,       label: 'Submissions' },
  { id: 'profile',  Icon: User,            label: 'Profile' },
];

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [scores, setScores] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('First');
  const [selectedSession, setSelectedSession] = useState('2025/2026');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [activePanel, setActivePanel] = useState('overview');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null); // null | 'pending' | 'approved'
  const [submitMessage, setSubmitMessage] = useState('');
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const user = currentUser;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [profile, setProfile] = useState(null);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState(user?.username || '');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');
  const [updatingCreds, setUpdatingCreds] = useState(false);
  
  const [stats, setStats] = useState({ classesCount: 0, subjectsCount: 0, studentsCount: 0, resultsCount: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [historyResults, setHistoryResults] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredHistory = historyResults.filter(r => {
    const matchesSearch = (r.student_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'All' || r.class === filterClass;
    const matchesSubject = filterSubject === 'All' || r.subject_name === filterSubject;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesClass && matchesSubject && matchesStatus;
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/auth/profile`, { headers });
      setProfile(res.data);
      setTeacherEmail(res.data.username || '');
      setTeacherName(res.data.teacherInfo?.name || '');
    } catch (err) {
      console.error("Failed to fetch teacher profile", err);
    }
  };

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
    fetchProfile();
    const loadAssignments = async () => {
      try {
        const res = await axios.get(`${API}/teacher/classes`, { headers });
        const data = res.data.data || res.data || [];
        setAssignments(data);
        if (data.length > 0) {
          setSelectedAssignment(`${data[0].subjectID}:${data[0].class}`);
        }
      } catch (err) {
        console.error("Failed to load teacher classes", err);
      }
    };
    loadAssignments();
  }, []);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get(`${API}/teacher/stats`, { headers });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load teacher stats", err);
    }
    setLoadingStats(false);
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${API}/teacher/results`, { headers });
      setHistoryResults(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to load teacher results history", err);
    }
    setLoadingHistory(false);
  };

  useEffect(() => {
    if (activePanel === 'overview') {
      loadStats();
    } else if (activePanel === 'history') {
      loadHistory();
    }
  }, [activePanel]);

  useEffect(() => {
    if (!selectedAssignment) {
      setStudents([]);
      setScores({});
      setApprovalStatus(null);
      return;
    }
    const [subID, clsName] = selectedAssignment.split(':');
    
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await axios.get(`${API}/teacher/students/${clsName}?subjectID=${subID}&session_id=${selectedSession}-${selectedTerm}`, { headers });
        const data = res.data.data || res.data || [];
        setStudents(data);
        
        // Check approval status based on existing results
        if (data.length > 0 && data[0].grade) {
          // If results exist, check if any are approved
          const hasApproved = data.some(s => s.status === 'approved');
          const hasPending = data.some(s => s.status === 'pending' && s.grade);
          if (hasApproved) setApprovalStatus('approved');
          else if (hasPending) setApprovalStatus('pending');
          else setApprovalStatus(null);
        } else {
          setApprovalStatus(null);
        }
        
        const initialScores = {};
        data.forEach(s => {
          initialScores[s.studentID] = {
            ca_score: s.ca_score || 0,
            exam_score: s.exam_score || 0,
            total: s.total || 0,
            grade: s.grade || '',
            remark: s.remark || ''
          };
        });
        setScores(initialScores);
      } catch (err) {
        console.error("Failed to load students scorecard", err);
        setStudents([]);
        setScores({});
        setApprovalStatus(null);
      }
      setLoadingStudents(false);
    };
    loadStudents();
  }, [selectedAssignment, selectedSession, selectedTerm]);

  const handleScoreChange = (studentId, field, value) => {
    setScores(prev => {
      const current = prev[studentId] || { ca_score: 0, exam_score: 0, total: 0, grade: '', remark: '' };
      const updated = { ...current, [field]: value };
      
      if (field === 'ca_score' || field === 'exam_score') {
        const ca   = parseFloat(updated.ca_score || 0);
        const exam = parseFloat(updated.exam_score || 0);
        if (!isNaN(ca) && !isNaN(exam)) {
          const total = ca + exam;
          const grade = calculateGrade(total);
          const remark = calculateRemark(grade);
          updated.total = total;
          updated.grade = grade;
          updated.remark = remark;
        }
      }
      return { ...prev, [studentId]: updated };
    });
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return alert('Please select an assignment before submitting.');
    if (approvalStatus === 'approved') return alert('Results are approved. Contact admin to allow reupload.');
    const [subID, clsName] = selectedAssignment.split(':');

    setSaving(true);
    setSubmitMessage('');
    try {
      const entries = students
        .map(s => ({
          student_id: s.studentID,
          subject_id: parseInt(subID),
          ca_score:   parseFloat(scores[s.studentID]?.ca_score || 0),
          exam_score: parseFloat(scores[s.studentID]?.exam_score || 0),
          remark:     scores[s.studentID]?.remark || '',
          term: selectedTerm,
          session: selectedSession,
        }))
        .filter(e => e.ca_score > 0 || e.exam_score > 0);

      await axios.post(`${API}/results/bulk`, { results: entries }, { headers });
      setSaved(true);
      setApprovalStatus('pending');
      setSubmitMessage('✓ Scores submitted and awaiting Admin approval.');
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.approved) {
        setApprovalStatus('approved');
        alert('Results have been approved by Admin. Contact admin to allow reupload.');
      } else {
        alert(errData?.message || errData?.error || 'Error saving scores. Please try again.');
      }
    }
    setSaving(false);
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (!teacherName) {
      setCredError('Full Name is required.');
      return;
    }
    if (!teacherEmail) {
      setCredError('Email/Username is required.');
      return;
    }

    if (teacherPassword && teacherPassword !== confirmPassword) {
      setCredError('Passwords do not match.');
      return;
    }

    setUpdatingCreds(true);
    try {
      const payload = { 
        name: teacherName,
        username: teacherEmail 
      };
      if (teacherPassword) {
        payload.password = teacherPassword;
      }

      await axios.put(`${API}/users/${user.userID}`, payload, { headers });
      
      const updatedUser = { ...user, name: teacherName, username: teacherEmail };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setCredSuccess('Profile and credentials updated successfully.');
      setTeacherPassword('');
      setConfirmPassword('');
      fetchProfile();
    } catch (err) {
      setCredError(err.response?.data?.error || err.response?.data?.message || 'Failed to update credentials.');
    } finally {
      setUpdatingCreds(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const displayName = profile?.teacherInfo?.name || user?.name || 'Teacher';

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
                <p className="text-white font-black text-xs leading-tight">{SCHOOL_NAME}</p>
                <p className="text-blue-300 text-[10px] tracking-widest">Teacher Portal</p>
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
              <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center font-black text-white text-sm">
                {displayName[0]?.toUpperCase() || 'T'}
              </div>
            )}
            {(sidebarOpen || isMobile) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                <p className="text-blue-300 text-[10px]">Teacher</p>
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

      {/* ── Main ─────────────────────────────────────────── */}
      <motion.main
        animate={{ marginLeft: isMobile ? 0 : (sidebarOpen ? 240 : 68) }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-1 min-h-screen"
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
                <p className="text-slate-400 text-xs hidden sm:block">{SCHOOL_NAME} — Teacher Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
                  <CheckCircle size={14} /> Scores saved
                </motion.div>
              )}
              <div className="flex items-center gap-2.5">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} className="w-8 h-8 rounded-xl object-cover" alt="Avatar" />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {displayName[0]?.toUpperCase() || 'T'}
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{displayName}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activePanel} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>

              {/* Overview Panel */}
              {activePanel === 'overview' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-black text-[#001F54]">Welcome back, {displayName}!</h2>
                    <p className="text-slate-400 mt-1 text-sm">Here is a summary of your assigned classes and academic records.</p>
                  </div>

                  {loadingStats ? (
                    <div className="flex items-center justify-center py-20 text-slate-400">
                      <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" />
                      Loading dashboard stats...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                      {[
                        { Icon: Users, label: 'Assigned Classes', value: stats.classesCount, color: 'bg-blue-50', iconColor: 'text-blue-600', sub: 'Unique class levels' },
                        { Icon: BookOpen, label: 'Subjects Taught', value: stats.subjectsCount, color: 'bg-violet-50', iconColor: 'text-violet-600', sub: 'Active subjects' },
                        { Icon: GraduationCap, label: 'My Students', value: stats.studentsCount, color: 'bg-amber-50', iconColor: 'text-amber-600', sub: 'Total class count' },
                        { Icon: FileText, label: 'Results Submitted', value: stats.resultsCount, color: 'bg-emerald-50', iconColor: 'text-emerald-600', sub: 'Graded score sheets' }
                      ].map((card, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -4 }}
                          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/40 transition-all"
                        >
                          <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                            <card.Icon size={20} className={card.iconColor} />
                          </div>
                          <p className="text-3xl font-black text-[#001F54]">{card.value}</p>
                          <p className="text-slate-700 font-semibold text-sm mt-1">{card.label}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{card.sub}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Class and Subject Mappings Info Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                    <h3 className="font-bold text-[#001F54] text-base mb-4 flex items-center gap-2">
                      <BookOpen size={18} className="text-[#007BFF]" />
                      My Active Assignments
                    </h3>
                    {assignments.length === 0 ? (
                      <p className="text-slate-400 text-sm">You have no active subject/class assignments yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignments.map((ass, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#007BFF] to-[#001F54] flex items-center justify-center text-white font-black text-xs">
                              {ass.class.replace(' ', '')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-800 text-sm truncate">{ass.subjectName}</p>
                              <p className="text-slate-400 text-xs">{ass.class}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Score Entry */}
              {activePanel === 'scores' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-black text-[#001F54]">Score Entry</h2>
                    <p className="text-slate-400 text-sm mt-1">Select an assigned class & subject, then enter CA and Exam scores. Grades are processed automatically.</p>
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Subject & Class Assignment</label>
                        <select value={selectedAssignment} onChange={e => setSelectedAssignment(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-slate-50 font-semibold text-[#001F54]">
                          <option value="">Select Assignment</option>
                          {assignments.map((a, idx) => (
                            <option key={idx} value={`${a.subjectID}:${a.class}`}>
                              {a.subjectName} — {a.class}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Term</label>
                        <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-slate-50">
                          {['First','Second','Third'].map(t => <option key={t} value={t}>{t} Term</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Academic Session</label>
                        <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-slate-50">
                          {['2024/2025','2025/2026','2026/2027'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Approval Status Banner */}
                  {approvalStatus === 'approved' && (
                    <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                      <Lock size={16} className="text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="text-amber-800 font-bold text-sm">Results Approved by Admin</p>
                        <p className="text-amber-600 text-xs mt-0.5">These results have been approved and are visible to students. Contact the Admin to allow reupload if corrections are needed.</p>
                      </div>
                    </div>
                  )}
                  {approvalStatus === 'pending' && submitMessage && (
                    <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                      <CheckCircle size={16} className="text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-blue-800 font-bold text-sm">Scores Submitted — Pending Admin Approval</p>
                        <p className="text-blue-600 text-xs mt-0.5">Students cannot see these results until the Admin approves them.</p>
                      </div>
                    </div>
                  )}

                  {/* Score Table */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {loadingStudents ? (
                      <div className="flex items-center justify-center py-20 text-slate-400">
                        <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" />
                        Loading assigned student scorecard…
                      </div>
                    ) : students.length === 0 ? (
                      <div className="text-center py-20 text-slate-400">
                        <GraduationCap size={40} className="mx-auto mb-4 opacity-30" />
                        <p className="font-semibold text-slate-600">No students found for the selected assignment</p>
                        <p className="text-sm mt-1">Please select an assignment above or verify class registrations</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[800px] text-sm">
                            <thead>
                              <tr className="bg-gradient-to-r from-[#001F54] to-[#007BFF]">
                                {['#', 'Student Name', 'CA (/40)', 'Exam (/60)', 'Total', 'Grade', 'Remark / Custom Remark'].map(h => (
                                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {students.map((s, i) => {
                                const sc = scores[s.studentID] || { ca_score: 0, exam_score: 0, total: 0, grade: '', remark: '' };
                                return (
                                  <tr key={s.studentID} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-5 py-3.5 text-slate-400 font-medium text-sm whitespace-nowrap">{i + 1}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#007BFF] to-[#001F54] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                          {s.studentName?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <span className="font-semibold text-slate-800 text-sm whitespace-nowrap">{s.studentName}</span>
                                      </div>
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                      <input type="number" min="0" max="40" placeholder="0–40"
                                        value={sc.ca_score || ''}
                                        onChange={e => handleScoreChange(s.studentID, 'ca_score', e.target.value)}
                                        className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
                                      />
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                      <input type="number" min="0" max="60" placeholder="0–60"
                                        value={sc.exam_score || ''}
                                        onChange={e => handleScoreChange(s.studentID, 'exam_score', e.target.value)}
                                        className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
                                      />
                                    </td>
                                    <td className="px-5 py-3.5 font-black text-[#001F54] text-base whitespace-nowrap">{sc.total ?? '—'}</td>
                                    <td className="px-5 py-3.5 font-bold whitespace-nowrap">
                                      {sc.grade
                                        ? <span className={`px-2.5 py-0.5 rounded-full text-xs ${gradeChipClass(sc.grade)}`}>{sc.grade}</span>
                                        : <span className="text-slate-300 text-xs">—</span>
                                      }
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                      <input type="text" placeholder="Add remark"
                                        value={sc.remark || ''}
                                        onChange={e => handleScoreChange(s.studentID, 'remark', e.target.value)}
                                        className="w-full min-w-[160px] max-w-[240px] border border-slate-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="p-5 border-t border-slate-100 flex items-center justify-between">
                           <p className="text-sm text-slate-500">{students.length} student(s) in class</p>
                           {approvalStatus === 'approved' ? (
                             <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
                               <Lock size={14} /> Results locked — Admin approved
                             </div>
                           ) : (
                             <button onClick={handleSubmit} disabled={saving || !selectedAssignment}
                               className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all disabled:opacity-50 text-sm">
                               {saving
                                 ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                                 : <><Save size={14} /> Submit Scores</>
                               }
                             </button>
                           )}
                         </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Submissions History */}
              {activePanel === 'history' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#001F54]">Submission History</h2>
                      <p className="text-slate-400 text-sm mt-1">View and search results sheets you have submitted</p>
                    </div>
                    <button 
                      onClick={loadHistory} 
                      disabled={loadingHistory}
                      className="flex items-center gap-2 border border-slate-200 text-slate-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all text-sm disabled:opacity-60 self-start sm:self-auto"
                    >
                      Refresh List
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Search Student</label>
                        <input
                          type="text"
                          placeholder="Search student name..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Class</label>
                        <select 
                          value={filterClass} 
                          onChange={e => setFilterClass(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white font-medium text-slate-600"
                        >
                          <option value="All">All Classes</option>
                          {[...new Set(historyResults.map(r => r.class))].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Subject</label>
                        <select 
                          value={filterSubject} 
                          onChange={e => setFilterSubject(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white font-medium text-slate-600"
                        >
                          <option value="All">All Subjects</option>
                          {[...new Set(historyResults.map(r => r.subject_name))].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Status</label>
                        <select 
                          value={filterStatus} 
                          onChange={e => setFilterStatus(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white font-medium text-slate-600"
                        >
                          <option value="All">All Statuses</option>
                          <option value="approved">Approved</option>
                          <option value="pending">Pending Approval</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {loadingHistory ? (
                      <div className="flex items-center justify-center py-20 text-slate-400">
                        <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" /> Loading submission history…
                      </div>
                    ) : filteredHistory.length === 0 ? (
                      <div className="text-center py-20 text-slate-400">
                        <BarChart2 size={40} className="mx-auto mb-4 opacity-30" />
                        <p className="font-semibold text-slate-600">No records found</p>
                        <p className="text-sm mt-1">Try resetting your filters or submit scores first</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-sm">
                          <thead>
                            <tr className="bg-gradient-to-r from-[#001F54] to-[#007BFF] text-white">
                              {['Student Name', 'Class', 'Subject', 'Term / Session', 'CA (/40)', 'Exam (/60)', 'Total', 'Grade', 'Remark', 'Status'].map(h => (
                                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {filteredHistory.map((r, idx) => {
                              const parts = r.session_id.split('-');
                              const sessionYear = parts[0] || '—';
                              const termName = parts[1] || r.term || '—';
                              return (
                                <tr key={r.resultID || idx} className="hover:bg-blue-50/20 transition-colors">
                                  <td className="px-5 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{r.student_name}</td>
                                  <td className="px-5 py-3.5 text-slate-500 font-medium whitespace-nowrap">{r.class}</td>
                                  <td className="px-5 py-3.5 text-slate-800 font-medium whitespace-nowrap">{r.subject_name}</td>
                                  <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{termName} Term ({sessionYear})</td>
                                  <td className="px-5 py-3.5 text-slate-600 font-bold whitespace-nowrap">{r.ca_score}</td>
                                  <td className="px-5 py-3.5 text-slate-600 font-bold whitespace-nowrap">{r.exam_score}</td>
                                  <td className="px-5 py-3.5 text-[#001F54] font-black whitespace-nowrap">{r.total_score || r.total}</td>
                                  <td className="px-5 py-3.5 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeChipClass(r.grade)}`}>{r.grade}</span>
                                  </td>
                                  <td className="px-5 py-3.5 text-slate-500 italic max-w-[200px] truncate whitespace-nowrap" title={r.remark}>{r.remark || '—'}</td>
                                  <td className="px-5 py-3.5 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                      r.status === 'approved' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-amber-50 border border-amber-200 text-amber-700'
                                    }`}>
                                      {r.status === 'approved' ? 'Approved' : 'Pending'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Profile */}
              {activePanel === 'profile' && (
                <div>
                  <h2 className="text-2xl font-black text-[#001F54] mb-6">My Profile</h2>
                  <div className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <div className="flex items-center gap-5">
                        <div className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                          {currentUser?.avatar ? (
                            <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-400 to-orange-400 text-white text-2xl font-black">
                              {displayName[0]?.toUpperCase() || 'T'}
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

                    {/* Account Credentials */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="font-bold text-[#001F54] text-base">Account Credentials</h3>
                          <p className="text-slate-400 text-xs mt-0.5">Update your email/username address and login password</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                            <input 
                              type="text" 
                              value={teacherName} 
                              onChange={e => setTeacherName(e.target.value)}
                              required
                              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address / Username</label>
                            <input 
                              type="email" 
                              value={teacherEmail} 
                              onChange={e => setTeacherEmail(e.target.value)}
                              required
                              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">New Password</label>
                            <input 
                              type="password" 
                              value={teacherPassword} 
                              onChange={e => setTeacherPassword(e.target.value)}
                              placeholder="Leave blank to keep current"
                              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Confirm New Password</label>
                            <input 
                              type="password" 
                              value={confirmPassword} 
                              onChange={e => setConfirmPassword(e.target.value)}
                              placeholder="Leave blank to keep current"
                              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" 
                            />
                          </div>
                        </div>

                        <div className="flex justify-end mt-4">
                          <button 
                            type="submit"
                            disabled={updatingCreds}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all disabled:opacity-60"
                          >
                            {updatingCreds ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                            Save Profile
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Profile Session Info */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-md">
                      <div className="flex items-center gap-4 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-2xl">
                          {displayName[0]?.toUpperCase() || 'T'}
                        </div>
                        <div>
                          <p className="font-bold text-[#001F54] text-lg">{displayName}</p>
                          <p className="text-slate-500 text-sm">{teacherEmail}</p>
                          <span className="inline-block mt-1 px-2.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">Teacher</span>
                        </div>
                      </div>
                      <button onClick={handleLogout} className="flex items-center gap-2 border border-red-200 text-red-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
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
