import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, BarChart2,
  Settings, LogOut, ChevronLeft, ChevronRight, Circle,
  Plus, Trash2, Loader2, CheckCircle, AlertCircle,
  UserCheck, Activity, Clock, Bell, Lock, Globe,
  CalendarDays, Save, ToggleLeft, ToggleRight, Mail,
  Pencil, ArrowUp, School, X, ShieldCheck, RefreshCw, Menu
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://orm-backend-cziu.onrender.com/api';
const SCHOOL_NAME = 'Best Foundation Secondary School';
const SCHOOL_SHORT = 'BFSS';

/* ─── Nav Items ─────────────────────────────────────── */
const NAV = [
  { id: 'overview',  Icon: LayoutDashboard, label: 'Overview' },
  { id: 'students',  Icon: GraduationCap,   label: 'Students' },
  { id: 'teachers',  Icon: Users,           label: 'Teachers' },
  { id: 'parents',   Icon: UserCheck,       label: 'Parents' },
  { id: 'subjects',  Icon: BookOpen,        label: 'Subjects' },
  { id: 'classes',   Icon: School,          label: 'Classes' },
  { id: 'approval',  Icon: ShieldCheck,     label: 'Approvals' },
  { id: 'results',   Icon: BarChart2,       label: 'Results' },
  { id: 'settings',  Icon: Settings,        label: 'Settings' },
];

/* ─── Sidebar ────────────────────────────────────────── */
function Sidebar({ active, onSelect, collapsed, onToggle, user, onLogout, isMobile, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}
      <motion.aside
        animate={{ width: isMobile ? (collapsed ? 0 : 260) : (collapsed ? 72 : 260) }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full flex flex-col z-40 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #001F54 0%, #003399 60%, #007BFF 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center px-4 py-5 border-b border-white/10 min-h-[72px]">
          {collapsed && !isMobile ? (
            <button onClick={onToggle} className="w-full flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
                <span className="text-white font-black text-xl">B</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-[11px] leading-tight truncate">{SCHOOL_SHORT}</p>
                <p className="text-blue-300 text-[9px] tracking-widest">{SCHOOL_NAME}</p>
              </div>
              <button onClick={isMobile ? onClose : onToggle} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
                {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { onSelect(item.id); if (isMobile) onClose(); }}
              title={collapsed && !isMobile ? item.label : ''}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                active === item.id
                  ? 'bg-white text-[#001F54] font-bold shadow-lg'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.Icon size={18} className="flex-shrink-0" />
              {(!collapsed || isMobile) && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold truncate">
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/10 px-3 py-4">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" alt="Avatar" />
            ) : (
              <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-tr from-orange-400 to-yellow-400 flex items-center justify-center font-black text-white text-sm">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
            {(!collapsed || isMobile) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user?.name || 'Administrator'}</p>
                <p className="text-blue-300 text-[10px]">Admin</p>
              </motion.div>
            )}
            {(!collapsed || isMobile) && (
              <button onClick={onLogout} title="Sign out" className="text-blue-300 hover:text-red-400 transition-colors flex-shrink-0">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

/* ─── Stat Card ──────────────────────────────────────── */
function StatCard({ Icon, label, value, sub, color, iconColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/40 transition-all"
    >
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon size={20} className={iconColor} />
      </div>
      <p className="text-3xl font-black text-[#001F54]">{value}</p>
      <p className="text-slate-700 font-semibold text-sm mt-1">{label}</p>
      {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
    </motion.div>
  );
}

/* ─── Overview Panel ─────────────────────────────────── */
function OverviewPanel({ stats, onNavigate }) {
  const cards = [
    { Icon: GraduationCap, label: 'Total Students',   value: stats.students ?? '—', sub: 'All classes combined',     color: 'bg-blue-50',   iconColor: 'text-blue-600' },
    { Icon: Users,         label: 'Teachers',          value: stats.teachers ?? '—', sub: 'Active staff accounts',    color: 'bg-violet-50', iconColor: 'text-violet-600' },
    { Icon: BookOpen,      label: 'Subjects',           value: stats.subjects ?? '—', sub: 'Configured in the system', color: 'bg-amber-50',  iconColor: 'text-amber-600' },
    { Icon: BarChart2,     label: 'Results Entered',    value: stats.results  ?? '—', sub: 'Score records this term',  color: 'bg-emerald-50',iconColor: 'text-emerald-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[#001F54]">Overview</h2>
        <p className="text-slate-400 mt-1 text-sm">Welcome to the {SCHOOL_NAME} management portal.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-[#001F54] text-base mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { Icon: GraduationCap, label: 'Add Student',  action: 'students' },
            { Icon: Users,         label: 'Add Teacher',  action: 'teachers' },
            { Icon: BookOpen,      label: 'Add Subject',  action: 'subjects' },
            { Icon: BarChart2,     label: 'View Results', action: 'results' },
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => onNavigate(a.action)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#007BFF] hover:bg-blue-50 transition-all group text-center"
            >
              <a.Icon size={20} className="text-slate-400 group-hover:text-[#007BFF] transition-colors" />
              <span className="text-xs font-semibold text-slate-600 group-hover:text-[#001F54]">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Portal Details */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-[#001F54] text-base mb-4">Portal Setup</h3>
        <div className="space-y-2">
          {[
            { Icon: BookOpen,      label: 'Grading Scale',    sub: 'WAEC / NECO Standard (A1–F9)',  status: 'Active' },
            { Icon: Users,         label: 'Active Portals',   sub: 'Admin, Teacher, Student, Parent', status: 'Enabled' },
            { Icon: GraduationCap, label: 'Report Sheets',    sub: 'Instant Card Generation & PDF',   status: 'Online' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <s.Icon size={16} className="text-slate-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">{s.label}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-600 font-medium">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── User Table Panel ───────────────────────────────── */
function UserTablePanel({ role, Icon: RoleIcon, endpoint }) {
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [editingUser,  setEditingUser]  = useState(null);
  const [form,         setForm]         = useState({ name:'', email:'', password:'', class:'', gender:'', DOB:'', studentID:'', subjectID:'' });
  const [editForm,     setEditForm]     = useState({ name:'', email:'', password:'', class:'', gender:'', DOB:'', studentID:'' });
  
  // Custom states for multi-subject assignments
  const [teacherAssignments, setTeacherAssignments] = useState([
    { class: '', subjectID: '' },
    { class: '', subjectID: '' },
    { class: '', subjectID: '' }
  ]);
  const [editTeacherAssignments, setEditTeacherAssignments] = useState([
    { class: '', subjectID: '' },
    { class: '', subjectID: '' },
    { class: '', subjectID: '' }
  ]);

  // Custom states for multi-child parent links (up to 5 children)
  const createEmptyChildLinks = () => [{ studentID: '' }, { studentID: '' }, { studentID: '' }, { studentID: '' }, { studentID: '' }];
  const [parentChildLinks, setParentChildLinks] = useState(createEmptyChildLinks);
  const [editParentChildLinks, setEditParentChildLinks] = useState(createEmptyChildLinks);

  const [students,     setStudents]     = useState([]);
  const [subjects,     setSubjects]     = useState([]);
  const [classes,      setClasses]      = useState([]);
  const [error,        setError]        = useState('');
  const [editError,    setEditError]    = useState('');
  const [success,      setSuccess]      = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [editSubmit,   setEditSubmit]   = useState(false);

  const DEFAULT_CLASSES = ['JSS 1','JSS 2','JSS 3','SSS 1','SSS 2','SSS 3'];
  const classList = classes.length > 0 ? classes : DEFAULT_CLASSES;
  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/${endpoint}`, { headers });
      setUsers(r.data.data || r.data || []);
    } catch { setUsers([]); }
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (role === 'Student' || role === 'Teacher') {
      axios.get(`${API}/academic/classes`, { headers })
        .then(r => setClasses((r.data || []).map(c => typeof c === 'string' ? c : c.className)))
        .catch(() => setClasses(DEFAULT_CLASSES));
    }
    if (role === 'Parent') {
      axios.get(`${API}/students`, { headers })
        .then(r => setStudents(r.data.data || r.data || []))
        .catch(() => {});
    }
    if (role === 'Teacher') {
      axios.get(`${API}/subjects`, { headers })
        .then(r => setSubjects(r.data.data || r.data || []))
        .catch(() => {});
    }
  }, [endpoint, role]);

  const handleCreate = async e => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      const payload = { ...form, role };
      ['class','gender','DOB','studentID','subjectID'].forEach(k => { if (!payload[k]) delete payload[k]; });
      
      // For Parent: pass studentIDs array from multi-slot links
      if (role === 'Parent') {
        const studentIDs = parentChildLinks
          .map(l => parseInt(l.studentID))
          .filter(Boolean);
        if (studentIDs.length > 0) {
          payload.studentIDs = studentIDs;
          payload.studentID = studentIDs[0];
        } else {
          delete payload.studentID;
        }
      }
      
      // Call create user
      const res = await axios.post(`${API}/users`, payload, { headers });
      
      // If teacher, submit assignments
      if (role === 'Teacher') {
        const teacherID = res.data.user.userID;
        for (const ass of teacherAssignments) {
          if (ass.class && ass.subjectID) {
            await axios.post(
              `${API}/academic/assignments`,
              { teacherID, subjectID: parseInt(ass.subjectID), class: ass.class },
              { headers }
            );
          }
        }
      }

      setSuccess(`${role} account created successfully.`);
      setShowModal(false);
      setForm({ name:'', email:'', password:'', class:'', gender:'', DOB:'', studentID:'', subjectID:'' });
      setTeacherAssignments([{ class: '', subjectID: '' }, { class: '', subjectID: '' }, { class: '', subjectID: '' }]);
      setParentChildLinks(createEmptyChildLinks());
      load();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create account.'); }
    setSubmitting(false);
  };

  const handleDelete = async id => {
    if (!window.confirm(`Delete this ${role.toLowerCase()} account? This action cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/users/${id}`, { headers });
      load();
    } catch {}
  };

  const handlePromote = async (student) => {
    if (!student.studentID) {
      alert('Missing Student ID for promotion.');
      return;
    }
    if (!window.confirm(`Promote ${student.name} from class "${student.class}" to the next level?`)) return;
    try {
      const res = await axios.post(`${API}/students/${student.studentID}/promote`, {}, { headers });
      setSuccess(res.data.message || 'Student promoted successfully.');
      load();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to promote student.');
    }
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setEditError('');
    setEditForm({
      name: u.name || u.username || '',
      email: u.email || u.username || '',
      password: '',
      class: u.class || '',
      gender: u.gender || '',
      DOB: u.DOB ? u.DOB.substring(0, 10) : '',
      studentID: u.studentID || ''
    });

    if (role === 'Teacher') {
      setEditTeacherAssignments([{ class: '', subjectID: '' }, { class: '', subjectID: '' }, { class: '', subjectID: '' }]);
      axios.get(`${API}/academic/assignments`, { headers })
        .then(res => {
          const allAss = res.data || [];
          const myAss = allAss.filter(a => a.teacherID === u.userID);
          const mapped = [0, 1, 2].map(i => {
            if (myAss[i]) {
              return { class: myAss[i].class, subjectID: String(myAss[i].subjectID) };
            }
            return { class: '', subjectID: '' };
          });
          setEditTeacherAssignments(mapped);
        })
        .catch(() => {});
    }

    if (role === 'Parent') {
      // Populate child slots from the user's studentIDs array
      const existingIDs = Array.isArray(u.studentIDs) ? u.studentIDs : (u.studentID ? [u.studentID] : []);
      const populated = [0,1,2,3,4].map(i => ({ studentID: existingIDs[i] ? String(existingIDs[i]) : '' }));
      setEditParentChildLinks(populated);
    } else {
      setEditParentChildLinks(createEmptyChildLinks());
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setEditError('');
    setEditSubmit(true);
    try {
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;
      if (role !== 'Student') {
        delete payload.class;
        delete payload.gender;
        delete payload.DOB;
      }
      if (role !== 'Parent') {
        delete payload.studentID;
      }
      if (role === 'Teacher') {
        payload.assignments = editTeacherAssignments.filter(a => a.class && a.subjectID);
      }
      // For Parent: pass studentIDs array
      if (role === 'Parent') {
        const studentIDs = editParentChildLinks
          .map(l => parseInt(l.studentID))
          .filter(Boolean);
        payload.studentIDs = studentIDs;
        payload.studentID = studentIDs[0] || null;
      }
      
      await axios.put(`${API}/users/${editingUser.userID || editingUser.id}`, payload, { headers });
      setSuccess(`${role} account updated successfully.`);
      setEditingUser(null);
      load();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setEditError(err.response?.data?.error || err.response?.data?.message || 'Failed to update account.');
    }
    setEditSubmit(false);
  };

  const renderHead = () => {
    return (
      <tr className="bg-slate-50 border-b border-slate-100">
        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
        {role === 'Student' && <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Class</th>}
        {role === 'Teacher' && (
          <>
            <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Classes</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Subjects</th>
          </>
        )}
        {role === 'Parent' && (
          <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Children</th>
        )}
        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date Added</th>
        <th className="text-right px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
      </tr>
    );
  };

  const renderRow = (u, i) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return '—';
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <tr key={u.id || u.userID || i} className="hover:bg-slate-50/60 transition-colors">
        <td className="px-5 py-3.5 text-sm font-semibold text-slate-400 whitespace-nowrap">{i + 1}</td>
        <td className="px-5 py-3.5 text-sm font-bold text-[#001F54] whitespace-nowrap">{u.name || u.username || '—'}</td>
        <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{u.email || u.username || '—'}</td>
        
        {role === 'Student' && (
          <td className="px-5 py-3.5 text-sm font-semibold text-[#007BFF] whitespace-nowrap">{u.class || '—'}</td>
        )}
        
        {role === 'Teacher' && (
          <>
            <td className="px-5 py-3.5 text-sm text-slate-500 truncate max-w-[150px] whitespace-nowrap" title={u.classes}>{u.classes || '—'}</td>
            <td className="px-5 py-3.5 text-sm text-slate-500 truncate max-w-[150px] whitespace-nowrap" title={u.subjects}>{u.subjects || '—'}</td>
          </>
        )}
        
        {role === 'Parent' && (
          <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">
            {(() => {
              const ids = Array.isArray(u.studentIDs) && u.studentIDs.length > 0 ? u.studentIDs : (u.studentID ? [u.studentID] : []);
              if (ids.length === 0) return '—';
              return ids.map(sid => {
                const s = students.find(st => st.studentID === sid || st.studentID === Number(sid));
                return s ? `${s.name} (${s.class})` : `ID: ${sid}`;
              }).join(', ');
            })()}
          </td>
        )}
        
        <td className="px-5 py-3.5 text-sm text-slate-400 whitespace-nowrap">{formatDate(u.created_at || u.createdAt)}</td>
        
        <td className="px-5 py-3.5 text-right text-sm whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            {role === 'Student' && (
              <button
                onClick={() => handlePromote(u)}
                title="Promote Student"
                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ArrowUp size={14} />
              </button>
            )}
            <button
              onClick={() => openEdit(u)}
              title="Edit Profile"
              className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => handleDelete(u.id || u.userID)}
              title="Delete Account"
              className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#001F54] flex items-center gap-2.5">
            <RoleIcon size={22} className="text-[#007BFF]" />
            {role}s
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage all {role.toLowerCase()} accounts</p>
        </div>
        <button
          onClick={() => {
            setForm({ name:'', email:'', password:'', class:'', gender:'', DOB:'', studentID:'', subjectID:'' });
            setTeacherAssignments([{ class: '', subjectID: '' }, { class: '', subjectID: '' }, { class: '', subjectID: '' }]);
            setError('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all text-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add {role}
        </button>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle size={15} /> {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" />
            Loading {role.toLowerCase()} accounts…
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <RoleIcon size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-slate-600">No {role.toLowerCase()} accounts yet</p>
            <p className="text-sm mt-1">Click "Add {role}" to create the first one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>{renderHead()}</thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u, i) => renderRow(u, i))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-black text-[#001F54]">Create {role} Account</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
              </div>
              <p className="text-slate-400 text-sm mb-6">Fill in the details below to create a new {role.toLowerCase()} account.</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input type="text" placeholder="e.g. Adaeze Okonkwo" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input type="email" placeholder="user@school.edu.ng" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Password</label>
                  <input type="password" placeholder="Minimum 6 characters" value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                </div>

                {role === 'Student' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Class</label>
                        <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))} required
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white">
                          <option value="">Select Class</option>
                          {classList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Gender</label>
                        <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white">
                          <option value="">Select Gender</option>
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Date of Birth</label>
                      <input type="date" value={form.DOB} onChange={e => setForm(p => ({ ...p, DOB: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                    </div>
                  </>
                )}

                {role === 'Teacher' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Assign Classes & Subjects (Up to 3)</label>
                    {teacherAssignments.map((ass, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">Class {index + 1}</label>
                          <select 
                            value={ass.class} 
                            onChange={e => {
                              setTeacherAssignments(prev => prev.map((item, i) => 
                                i === index ? { ...item, class: e.target.value } : item
                              ));
                            }}
                            required={index === 0}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white"
                          >
                            <option value="">Select Class</option>
                            {classList.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">Subject {index + 1}</label>
                          <select 
                            value={ass.subjectID} 
                            onChange={e => {
                              setTeacherAssignments(prev => prev.map((item, i) => 
                                i === index ? { ...item, subjectID: e.target.value } : item
                              ));
                            }}
                            required={index === 0}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white"
                          >
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                              <option key={s.subjectID || s.id} value={s.subjectID || s.id}>
                                {s.subjectName || s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {role === 'Parent' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Link Children (Up to 5)</label>
                    {parentChildLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 w-16 flex-shrink-0">Child {index + 1}</span>
                        <select
                          value={link.studentID}
                          onChange={e => {
                            setParentChildLinks(prev => prev.map((item, i) => 
                              i === index ? { ...item, studentID: e.target.value } : item
                            ));
                          }}
                          required={index === 0}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white"
                        >
                          <option value="">Select Child / Student{index === 0 ? ' (Required)' : ' (Optional)'}</option>
                          {students.map(s => (
                            <option key={s.studentID} value={s.studentID}>{s.name} ({s.class})</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 border border-slate-200 text-slate-600 font-semibold px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : `Create ${role}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Modal ────────────────────────────────── */}
      <AnimatePresence>
        {editingUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={e => e.target === e.currentTarget && setEditingUser(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-black text-[#001F54]">Edit {role} Account</h3>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
              </div>
              <p className="text-slate-400 text-sm mb-6">Modify details for this {role.toLowerCase()} account.</p>

              {editError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle size={14} /> {editError}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input type="text" placeholder="e.g. Adaeze Okonkwo" value={editForm.name}
                    onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address / Username</label>
                  <input type="email" placeholder="user@school.edu.ng" value={editForm.email}
                    onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">New Password (leave blank to keep current)</label>
                  <input type="password" placeholder="Minimum 6 characters" value={editForm.password}
                    onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                </div>

                {role === 'Student' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Class</label>
                        <select value={editForm.class} onChange={e => setEditForm(p => ({ ...p, class: e.target.value }))} required
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white">
                          <option value="">Select Class</option>
                          {classList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Gender</label>
                        <select value={editForm.gender} onChange={e => setEditForm(p => ({ ...p, gender: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white">
                          <option value="">Select Gender</option>
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Date of Birth</label>
                      <input type="date" value={editForm.DOB} onChange={e => setEditForm(p => ({ ...p, DOB: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                    </div>
                  </>
                )}

                {role === 'Teacher' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Assign Classes & Subjects (Up to 3)</label>
                    {editTeacherAssignments.map((ass, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">Class {index + 1}</label>
                          <select 
                            value={ass.class} 
                            onChange={e => {
                              setEditTeacherAssignments(prev => prev.map((item, i) => 
                                i === index ? { ...item, class: e.target.value } : item
                              ));
                            }}
                            required={index === 0}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white"
                          >
                            <option value="">Select Class</option>
                            {classList.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">Subject {index + 1}</label>
                          <select 
                            value={ass.subjectID} 
                            onChange={e => {
                              setEditTeacherAssignments(prev => prev.map((item, i) => 
                                i === index ? { ...item, subjectID: e.target.value } : item
                              ));
                            }}
                            required={index === 0}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white"
                          >
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                              <option key={s.subjectID || s.id} value={s.subjectID || s.id}>
                                {s.subjectName || s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {role === 'Parent' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Linked Children (Up to 5)</label>
                    {editParentChildLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 w-16 flex-shrink-0">Child {index + 1}</span>
                        <select
                          value={link.studentID}
                          onChange={e => {
                            setEditParentChildLinks(prev => prev.map((item, i) => 
                              i === index ? { ...item, studentID: e.target.value } : item
                            ));
                          }}
                          required={index === 0}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white"
                        >
                          <option value="">Select Child / Student{index === 0 ? ' (Required)' : ' (Optional)'}</option>
                          {students.map(s => (
                            <option key={s.studentID} value={s.studentID}>{s.name} ({s.class})</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditingUser(null)}
                    className="flex-1 border border-slate-200 text-slate-600 font-semibold px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={editSubmit}
                    className="flex-1 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-bold px-4 py-3 rounded-xl shadow-lg text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {editSubmit ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Subjects Panel ─────────────────────────────────── */
function SubjectsPanel() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/subjects`, { headers });
      setSubjects(r.data.data || r.data || []);
    } catch { setSubjects([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await axios.post(`${API}/subjects`, { subjectName: newSubject }, { headers });
      setShowModal(false);
      setNewSubject('');
      load();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create subject.');
    }
    setSubmitting(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this subject? Any associated results may be affected.')) return;
    try {
      await axios.delete(`${API}/academic/subjects/${id}`, { headers });
      load();
    } catch {}
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await axios.post(`${API}/academic/seed-defaults`, {}, { headers });
      setSuccess('Default subjects and classes initialized!');
      load();
      setTimeout(() => setSuccess(''), 4000);
    } catch { alert('Failed to initialize defaults.'); }
    setSeeding(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#001F54] flex items-center gap-2.5">
            <BookOpen size={22} className="text-[#007BFF]" /> Subjects
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage the school subject catalogue</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button onClick={handleSeedDefaults} disabled={seeding}
            className="flex items-center gap-2 border border-[#007BFF] text-[#007BFF] font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all text-sm disabled:opacity-60">
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Init Defaults
          </button>
          <button onClick={() => { setError(''); setShowModal(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all text-sm">
            <Plus size={15} /> Add Subject
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle size={15} /> {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" /> Loading subjects…
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-slate-600">No subjects configured yet</p>
            <p className="text-sm mt-1">Click "Init Defaults" to load standard subjects, or "Add Subject" to create a custom one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {subjects.map((s, i) => (
              <motion.div key={s.subjectID || s.id || i}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className="group relative bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#007BFF] to-[#001F54] flex items-center justify-center text-white font-black text-xs">
                    {(s.subjectName || s.name || '?').substring(0, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{s.subjectName || s.name}</p>
                    <p className="text-slate-400 text-xs">All Classes</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(s.subjectID || s.id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-black text-[#001F54]">Add Subject</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
              <p className="text-slate-400 text-sm mb-6">Add a new subject to the school catalogue.</p>
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Subject Name</label>
                  <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)}
                    required placeholder="e.g. Mathematics"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 border border-slate-200 text-slate-600 font-semibold px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-bold px-4 py-3 rounded-xl shadow-lg text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Add Subject'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Classes Panel ──────────────────────────────────── */
function ClassesPanel() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/academic/classes`, { headers });
      setClasses(r.data || []);
    } catch { setClasses([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await axios.post(`${API}/academic/classes`, { className: newClass }, { headers });
      setShowModal(false);
      setNewClass('');
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create class.');
    }
    setSubmitting(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this class? Students in this class will not be removed.')) return;
    try {
      await axios.delete(`${API}/academic/classes/${id}`, { headers });
      load();
    } catch {}
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await axios.post(`${API}/academic/seed-defaults`, {}, { headers });
      setSuccess('Default subjects and classes initialized successfully!');
      load();
      setTimeout(() => setSuccess(''), 4000);
    } catch { alert('Failed to initialize defaults.'); }
    setSeeding(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#001F54] flex items-center gap-2.5">
            <School size={22} className="text-[#007BFF]" /> Classes
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage school class levels and academic arms</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button onClick={handleSeedDefaults} disabled={seeding}
            className="flex items-center gap-2 border border-[#007BFF] text-[#007BFF] font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all text-sm disabled:opacity-60">
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Init Defaults
          </button>
          <button onClick={() => { setError(''); setShowModal(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all text-sm">
            <Plus size={15} /> Add Class
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle size={15} /> {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" /> Loading classes…
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <School size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-slate-600">No classes configured yet</p>
            <p className="text-sm mt-1">Click "Init Defaults" to load JSS/SSS classes, or "Add Class" for a custom class.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes.map((c, i) => {
              const className = typeof c === 'string' ? c : c.className;
              const classID   = typeof c === 'string' ? i  : c.classID;
              const isJSS = className?.startsWith('JSS');
              return (
                <motion.div key={classID}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                  className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm mb-3 ${isJSS ? 'bg-gradient-to-tr from-blue-500 to-blue-700' : 'bg-gradient-to-tr from-violet-500 to-purple-700'}`}>
                    {className?.replace(' ', '')}
                  </div>
                  <p className="font-bold text-[#001F54] text-sm">{className}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{isJSS ? 'Junior Secondary' : 'Senior Secondary'}</p>
                  <button onClick={() => handleDelete(classID)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-black text-[#001F54]">Add Class</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
              <p className="text-slate-400 text-sm mb-6">Create a new class level for the school.</p>
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Class Name</label>
                  <input type="text" value={newClass} onChange={e => setNewClass(e.target.value)} required
                    placeholder="e.g. JSS 1 or Form 1"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 border border-slate-200 text-slate-600 font-semibold px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-bold px-4 py-3 rounded-xl shadow-lg text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Adding…</> : 'Add Class'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Results Approval Panel ──────────────────── */
function ApprovalPanel() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/results/pending`, { headers });
      setPending(r.data || []);
    } catch { setPending([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Group pending results by class + subjectID + session_id
  const groups = pending.reduce((acc, r) => {
    const key = `${r.class}||${r.subjectID}||${r.session_id}`;
    if (!acc[key]) acc[key] = { class: r.class, subjectID: r.subjectID, subject_name: r.subject_name, session_id: r.session_id, rows: [] };
    acc[key].rows.push(r);
    return acc;
  }, {});
  const groupList = Object.values(groups);

  const handleApprove = async (group) => {
    const key = `${group.class}-${group.subjectID}-${group.session_id}`;
    setActionLoading(key);
    try {
      await axios.post(`${API}/results/approve`, { class: group.class, subjectID: group.subjectID, session_id: group.session_id }, { headers });
      setSuccess(`Approved ${group.subject_name} — ${group.class} (${group.session_id})`);
      setTimeout(() => setSuccess(''), 4000);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve results.');
    }
    setActionLoading('');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#001F54] flex items-center gap-2.5">
          <ShieldCheck size={22} className="text-[#007BFF]" /> Results Approval
        </h2>
        <p className="text-slate-400 text-sm mt-1">Review and approve pending results before students can view them</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle size={15} /> {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" /> Loading pending results…
          </div>
        ) : groupList.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <CheckCircle size={44} className="mx-auto mb-4 opacity-20" />
            <p className="font-semibold text-slate-600">No pending results</p>
            <p className="text-sm mt-1">All submitted results have been approved</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {groupList.map((group, gi) => {
              const key = `${group.class}-${group.subjectID}-${group.session_id}`;
              const isLoading = actionLoading === key;
              const [session, term] = group.session_id.split('-');
              return (
                <div key={gi} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg">{group.class}</span>
                      <span className="font-bold text-slate-800">{group.subject_name}</span>
                      <span className="text-slate-400 text-sm">{term} Term — {session}</span>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">{group.rows.length} student{group.rows.length !== 1 ? 's' : ''}</span>
                    </div>
                    <button
                      onClick={() => handleApprove(group)}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                      Approve Results
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-xs">
                      <thead>
                        <tr className="bg-slate-50">
                          {['Student', 'CA', 'Exam', 'Total', 'Grade', 'Remark'].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {group.rows.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/40">
                            <td className="px-3 py-2 font-semibold text-slate-800 whitespace-nowrap">{r.student_name}</td>
                            <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{r.ca_score}</td>
                            <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{r.exam_score}</td>
                            <td className="px-3 py-2 font-bold text-[#001F54] whitespace-nowrap">{r.total_score}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.grade === 'A1' ? 'bg-emerald-100 text-emerald-700' :
                                ['B2','B3'].includes(r.grade) ? 'bg-blue-100 text-blue-700' :
                                ['C4','C5','C6'].includes(r.grade) ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                              }`}>{r.grade}</span>
                            </td>
                            <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{r.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Results Panel ────────────────────── */
function ResultsPanel() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allowLoading, setAllowLoading] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/results`, { headers });
      setResults(r.data.data || r.data || []);
    } catch { setResults([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAllowReupload = async (r) => {
    const key = `${r.class}-${r.subjectID}-${r.session_id}`;
    setAllowLoading(key);
    try {
      await axios.post(`${API}/results/allow-reupload`, { class: r.class, subjectID: r.subjectID, session_id: r.session_id }, { headers });
      setSuccess(`Reupload allowed for ${r.subject_name} — ${r.class}`);
      setTimeout(() => setSuccess(''), 4000);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed.');
    }
    setAllowLoading('');
  };

  const gradeClass = grade => {
    if (grade === 'A1') return 'bg-emerald-100 text-emerald-700';
    if (['B2','B3'].includes(grade)) return 'bg-blue-100 text-blue-700';
    if (['C4','C5','C6'].includes(grade)) return 'bg-yellow-100 text-yellow-700';
    if (['D7','E8'].includes(grade)) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#001F54] flex items-center gap-2.5">
          <BarChart2 size={22} className="text-[#007BFF]" /> Results
        </h2>
        <p className="text-slate-400 text-sm mt-1">All submitted result records. Click "Allow Reupload" to let a teacher re-enter scores for an approved batch.</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle size={15} /> {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 size={22} className="animate-spin mr-3 text-[#007BFF]" /> Loading results…
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BarChart2 size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-slate-600">No results submitted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Student', 'Class', 'Subject', 'CA', 'Exam', 'Total', 'Grade', 'Remark', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.map((r, i) => (
                  <tr key={r.resultID || i} className="hover:bg-slate-50/40">
                    <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.student_name}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.class}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.subject_name}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.ca_score}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.exam_score}</td>
                    <td className="px-4 py-3 font-bold text-[#001F54] whitespace-nowrap">{r.total_score || r.total}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeClass(r.grade)}`}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.remark}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.status === 'approved' ? (
                        <button
                          onClick={() => handleAllowReupload(r)}
                          disabled={allowLoading === `${r.class}-${r.subjectID}-${r.session_id}`}
                          className="flex items-center gap-1 border border-amber-200 text-amber-700 font-semibold px-2 py-1 rounded-lg text-xs hover:bg-amber-50 transition-all disabled:opacity-60"
                        >
                          {allowLoading === `${r.class}-${r.subjectID}-${r.session_id}` ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <RefreshCw size={12} />
                          )}
                          Allow Reupload
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Settings Panel (Real Platform Settings) ─────────── */
function SettingsPanel({ user, onUserUpdate, onLogout }) {
  const [schoolName, setSchoolName] = useState('Best Foundation Secondary School');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [currentTerm, setCurrentTerm] = useState('First');
  const [passMark, setPassMark] = useState('40');
  const [maxCA, setMaxCA] = useState('40');
  const [maxExam, setMaxExam] = useState('60');
  const [allowLateEntry, setAllowLateEntry] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [saved, setSaved] = useState(false);

  const [adminEmail, setAdminEmail] = useState(user?.username || 'adminORM@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');
  const [updatingCreds, setUpdatingCreds] = useState(false);

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (!adminEmail) {
      setCredError('Email is required.');
      return;
    }

    if (adminPassword && adminPassword !== confirmPassword) {
      setCredError('Passwords do not match.');
      return;
    }

    setUpdatingCreds(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const payload = { username: adminEmail };
      if (adminPassword) {
        payload.password = adminPassword;
      }

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

  const handleSave = (section) => {
    setSaved(section);
    setTimeout(() => setSaved(false), 3000);
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[#007BFF]' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const SaveBar = ({ section }) => (
    saved === section && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-600 text-xs font-semibold">
        <CheckCircle size={13} /> Saved successfully
      </motion.div>
    )
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#001F54] flex items-center gap-2.5">
          <Settings size={22} className="text-[#007BFF]" /> Settings
        </h2>
        <p className="text-slate-400 text-sm mt-1">Configure your school's platform settings and preferences</p>
      </div>

      <div className="space-y-6">

        {/* Profile Picture Upload */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-5">
            <div className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#001F54] to-[#007BFF] text-white text-2xl font-black">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
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
                        await axios.put(`${API}/users/${user.userID}`, { avatar: base64String }, { headers });
                        const updated = { ...user, avatar: base64String };
                        localStorage.setItem('user', JSON.stringify(updated));
                        onUserUpdate(updated);
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

        {/* School Information */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#001F54] text-base">School Information</h3>
              <p className="text-slate-400 text-xs mt-0.5">Basic details about your institution</p>
            </div>
            <SaveBar section="school" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">School Name</label>
              <input value={schoolName} onChange={e => setSchoolName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">School Email</label>
              <input placeholder="info@yourschool.edu.ng" type="email"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">School Address</label>
              <input placeholder="e.g. 12 School Road, Lagos"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
              <input placeholder="e.g. +234 800 000 0000"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => handleSave('school')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all">
              <Save size={14} /> Save School Info
            </button>
          </div>
        </div>

        {/* Academic Configuration */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#001F54] text-base">Academic Configuration</h3>
              <p className="text-slate-400 text-xs mt-0.5">Current academic session and term settings</p>
            </div>
            <SaveBar section="academic" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Academic Year</label>
              <select value={academicYear} onChange={e => setAcademicYear(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white">
                {['2024/2025','2025/2026','2026/2027'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Current Term</label>
              <select value={currentTerm} onChange={e => setCurrentTerm(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white">
                {['First','Second','Third'].map(t => <option key={t} value={t}>{t} Term</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Minimum Pass Mark</label>
              <input type="number" value={passMark} onChange={e => setPassMark(e.target.value)} min="1" max="100"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => handleSave('academic')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all">
              <Save size={14} /> Save Academic Settings
            </button>
          </div>
        </div>

        {/* Score Configuration */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#001F54] text-base">Score Allocation</h3>
              <p className="text-slate-400 text-xs mt-0.5">Define the maximum marks for CA and Exam components</p>
            </div>
            <SaveBar section="score" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Max CA Score</label>
              <input type="number" value={maxCA} onChange={e => setMaxCA(e.target.value)} min="1" max="100"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
              <p className="text-slate-400 text-xs mt-1">Continuous Assessment maximum marks</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Max Exam Score</label>
              <input type="number" value={maxExam} onChange={e => setMaxExam(e.target.value)} min="1" max="100"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" />
              <p className="text-slate-400 text-xs mt-1">Terminal examination maximum marks</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
            Combined total: <strong>{parseInt(maxCA || 0) + parseInt(maxExam || 0)} marks</strong> — must equal 100 for the WAEC grading scale to apply correctly.
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => handleSave('score')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 transition-all">
              <Save size={14} /> Save Score Config
            </button>
          </div>
        </div>

        {/* Platform Preferences */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-5">
            <h3 className="font-bold text-[#001F54] text-base">Platform Preferences</h3>
            <p className="text-slate-400 text-xs mt-0.5">Toggle system-level behaviours</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div>
                <p className="text-sm font-semibold text-slate-700">Allow Late Score Entry</p>
                <p className="text-xs text-slate-400 mt-0.5">Teachers can edit submitted scores after the initial deadline</p>
              </div>
              <ToggleSwitch enabled={allowLateEntry} onToggle={() => setAllowLateEntry(p => !p)} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div>
                <p className="text-sm font-semibold text-slate-700">Email Notifications</p>
                <p className="text-xs text-slate-400 mt-0.5">Send emails when results are published or updated</p>
              </div>
              <ToggleSwitch enabled={emailNotifications} onToggle={() => setEmailNotifications(p => !p)} />
            </div>
          </div>
        </div>

        {/* Account Credentials */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#001F54] text-base">Account Credentials</h3>
              <p className="text-slate-400 text-xs mt-0.5">Update your administrator email and login password</p>
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
                <input 
                  type="email" 
                  value={adminEmail} 
                  onChange={e => setAdminEmail(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">New Password</label>
                <input 
                  type="password" 
                  value={adminPassword} 
                  onChange={e => setAdminPassword(e.target.value)}
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
                Save Credentials
              </button>
            </div>
          </form>
        </div>

        {/* Admin Account */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-5">
            <h3 className="font-bold text-[#001F54] text-base">Administrator Account</h3>
            <p className="text-slate-400 text-xs mt-0.5">Your account details and session management</p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#001F54] to-[#007BFF] flex items-center justify-center text-white font-black text-xl">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-bold text-[#001F54] text-base">{user?.name || 'Administrator'}</p>
              <p className="text-slate-500 text-sm">{user?.username || 'admin@school.com'}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#007BFF] text-white text-xs font-bold rounded-full">Administrator</span>
            </div>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-2 border border-red-200 text-red-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─── Admin Dashboard (Root) ─────────────────────────── */
export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const user = currentUser;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true); // always hide sidebar on mobile
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      const [stu, tea, sub, res] = await Promise.allSettled([
        axios.get(`${API}/students`, { headers }),
        axios.get(`${API}/teachers`, { headers }),
        axios.get(`${API}/subjects`, { headers }),
        axios.get(`${API}/results`, { headers }),
      ]);
      const pick = r => r.status === 'fulfilled' ? (r.value.data?.data || r.value.data || []).length : '—';
      setStats({ students: pick(stu), teachers: pick(tea), subjects: pick(sub), results: pick(res) });
    };
    loadStats();
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };
  const sidebarWidth = isMobile ? 0 : (collapsed ? 72 : 260);
  const activeNav = NAV.find(n => n.id === active);

  const renderPanel = () => {
    switch (active) {
      case 'overview': return <OverviewPanel stats={stats} onNavigate={setActive} />;
      case 'students': return <UserTablePanel role="Student" Icon={GraduationCap} endpoint="students" />;
      case 'teachers': return <UserTablePanel role="Teacher" Icon={Users} endpoint="teachers" />;
      case 'parents':  return <UserTablePanel role="Parent" Icon={UserCheck} endpoint="parents" />;
      case 'subjects': return <SubjectsPanel />;
      case 'classes':  return <ClassesPanel />;
      case 'approval': return <ApprovalPanel />;
      case 'results':  return <ResultsPanel />;
      case 'settings': return <SettingsPanel user={user} onUserUpdate={setCurrentUser} onLogout={handleLogout} />;
      default:         return <OverviewPanel stats={stats} onNavigate={setActive} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        active={active} onSelect={setActive}
        collapsed={collapsed} onToggle={() => setCollapsed(p => !p)}
        user={user} onLogout={handleLogout}
        isMobile={isMobile} onClose={() => setCollapsed(true)}
      />

      <motion.main
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-1 min-h-screen"
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => setCollapsed(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
                >
                  <Menu size={20} />
                </button>
              )}
              <div>
                <p className="text-[#001F54] font-bold text-base md:text-lg">{activeNav?.label}</p>
                <p className="text-slate-400 text-xs hidden sm:block">{SCHOOL_NAME} — Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                System Online
              </div>
              <div className="hidden md:block w-px h-5 bg-slate-200" />
              <div className="flex items-center gap-2.5">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-8 h-8 rounded-xl object-cover" alt="Avatar" />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#001F54] to-[#007BFF] flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{user?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Panel Content */}
        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
