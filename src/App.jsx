import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  BarChart2, Users, BookOpen, FileText, Shield, Cloud,
  Trophy, CheckCircle, TrendingUp, Lock, ChevronRight,
  GraduationCap, Settings, UserCheck, Star, ArrowRight,
  Globe, Cpu, Database, Menu, X
} from 'lucide-react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

/* ─── Animated Counter ─────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (1500 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Animated Dashboard Hero Visual ──────────────── */
function HeroDashboard() {
  const [activeBar, setActiveBar] = useState(0);
  const bars = [78, 92, 65, 88, 73, 95, 82];
  const subjects = ['MTH', 'ENG', 'SCI', 'HST', 'BIO', 'PHY', 'CHM'];
  useEffect(() => {
    const t = setInterval(() => setActiveBar(p => (p + 1) % bars.length), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="animate-float bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 40px 80px rgba(0,31,84,0.22)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001F54] to-[#007BFF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">BFSS Dashboard</p>
              <p className="text-blue-200 text-[10px]">Academic Year 2025/2026</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
        </div>

        <div className="p-5">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Students', value: '1,248', Icon: Users, color: 'bg-blue-50 text-blue-700' },
              { label: 'Pass Rate', value: '87%', Icon: CheckCircle, color: 'bg-green-50 text-green-700' },
              { label: 'Avg Score', value: '74.2', Icon: TrendingUp, color: 'bg-purple-50 text-purple-700' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className={`${s.color} rounded-xl p-3 text-center`}>
                <s.Icon size={16} className="mx-auto mb-1 opacity-70" />
                <div className="font-black text-sm">{s.value}</div>
                <div className="text-[10px] font-medium opacity-70">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-slate-600 mb-3">SSS 1 — Performance by Subject</p>
            <div className="flex items-end gap-2 h-20">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{ height: `${h * 0.75}%`, background: i === activeBar ? 'linear-gradient(180deg,#007BFF,#001F54)' : '#E2E8F0', opacity: i === activeBar ? 1 : 0.6 }}
                    animate={{ height: `${h * 0.75}%` }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="text-[8px] text-slate-500 font-medium">{subjects[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div>
            <p className="text-xs font-bold text-slate-600 mb-2">Recent Submissions</p>
            {[
              { name: 'Adaeze O.', subject: 'Mathematics', score: 92, grade: 'A1' },
              { name: 'Chukwuma P.', subject: 'English', score: 78, grade: 'B2' },
              { name: 'Fatima A.', subject: 'Biology', score: 85, grade: 'A1' },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-[#001F54] flex items-center justify-center text-white text-[10px] font-bold">{r.name[0]}</div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{r.name}</p>
                    <p className="text-[10px] text-slate-400">{r.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">{r.score}</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">{r.grade}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating badge — top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.2, type: 'spring' }}
        className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 animate-float-slow z-10"
        style={{ boxShadow: '0 10px 40px rgba(0,31,84,0.15)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
            <CheckCircle size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Scores Submitted</p>
            <p className="text-[10px] text-slate-400">SSS 2 — Mathematics</p>
          </div>
        </div>
      </motion.div>

      {/* Floating badge — bottom left */}
      <motion.div
        initial={{ opacity: 0, scale: 0, x: -30 }} animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.4, type: 'spring' }}
        className="absolute -bottom-4 -left-4 bg-gradient-to-br from-[#001F54] to-[#007BFF] rounded-2xl px-4 py-3 z-10 shadow-xl"
      >
        <p className="text-white text-[10px] font-medium">Class Position</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Trophy size={16} className="text-yellow-300" />
          <p className="text-white font-black text-xl">1st</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Home Page ─────────────────────────────────────── */
function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const features = [
    { Icon: FileText, title: 'Smart Score Entry', desc: 'Teachers enter CA and Exam scores in an intuitive editable grid. Grades and remarks auto-calculate instantly as each score is typed.' },
    { Icon: Trophy, title: 'Automatic Class Ranking', desc: 'Class positions are computed per subject per term with proper tie-breaking — no manual counting or sorting required.' },
    { Icon: BarChart2, title: 'Admin Analytics', desc: 'Live dashboards show student count, teacher count, pass rates, and subject averages refreshed in real time.' },
    { Icon: Shield, title: 'Role-Based Access Control', desc: 'Admins, Teachers, Students, and Parents each see only what they need. Every API route is protected server-side with JWT.' },
    { Icon: FileText, title: 'Printable Report Cards', desc: 'Students and Parents can view and print result slips showing all subject scores, grades, remarks, and class rankings.' },
    { Icon: Cloud, title: 'Cloud-Powered Database', desc: 'Built on TiDB Cloud — a distributed, MySQL-compatible database that scales automatically and maintains high availability.' },
  ];

  const roles = [
    { role: 'Administrator', color: 'from-violet-600 to-purple-800', Icon: Settings, perms: ['Create and manage all user accounts', 'Configure subjects, classes, and sessions', 'Assign teachers to subject/class pairs', 'View school-wide analytics and statistics'] },
    { role: 'Teacher', color: 'from-amber-500 to-orange-700', Icon: BookOpen, perms: ['View assigned class rosters', 'Enter CA and exam scores per subject', 'Edit submitted scores before deadline', 'Preview auto-calculated grades in real time'] },
    { role: 'Student', color: 'from-emerald-500 to-teal-700', Icon: GraduationCap, perms: ['View result card per term', 'See grade, remark and class position', 'Print or download report slip', 'Track performance history by session'] },
    { role: 'Parent', color: 'from-cyan-500 to-blue-700', Icon: UserCheck, perms: ["View your child's result card", 'Monitor academic performance per term', 'Download report slips at any time', 'Stay informed every academic term'] },
  ];

  const stats = [
    { value: 1248, suffix: '+', label: 'Students Enrolled' },
    { value: 87, suffix: '%', label: 'Average Pass Rate' },
    { value: 42, suffix: '', label: 'Subjects Managed' },
    { value: 3600, suffix: '+', label: 'Result Cards Generated' },
  ];

  const gradeScale = [
    { grade: 'A1', range: '75–100', color: 'bg-emerald-500', remark: 'Excellent' },
    { grade: 'B2', range: '70–74', color: 'bg-blue-500', remark: 'Very Good' },
    { grade: 'B3', range: '65–69', color: 'bg-sky-500', remark: 'Good' },
    { grade: 'C4', range: '60–64', color: 'bg-yellow-500', remark: 'Credit' },
    { grade: 'C5', range: '55–59', color: 'bg-amber-500', remark: 'Credit' },
    { grade: 'C6', range: '50–54', color: 'bg-orange-400', remark: 'Credit' },
    { grade: 'D7', range: '45–49', color: 'bg-orange-500', remark: 'Pass' },
    { grade: 'E8', range: '40–44', color: 'bg-red-400', remark: 'Pass' },
    { grade: 'F9', range: '0–39', color: 'bg-red-600', remark: 'Fail' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── NAV ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#001F54] to-[#007BFF] flex items-center justify-center shadow-lg shadow-blue-300/40">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <div>
              <span className="font-black text-[#001F54] text-xl leading-none">BFSS</span>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Best Foundation Secondary School</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#007BFF] transition-colors">Features</a>
            <a href="#roles" className="hover:text-[#007BFF] transition-colors">Portals</a>
            <a href="#grading" className="hover:text-[#007BFF] transition-colors">Grading</a>
            <a href="#contact" className="hover:text-[#007BFF] transition-colors">Get Started</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-300/40 hover:shadow-blue-400/50 transition-all text-sm">
              Access Portal <ArrowRight size={14} />
            </Link>
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} className="text-slate-700" /> : <Menu size={20} className="text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3"
            >
              {['Features', 'Portals', 'Grading', 'Get Started'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} onClick={() => setMobileOpen(false)} className="block text-slate-600 font-semibold text-sm py-2 hover:text-[#007BFF] transition-colors">{item}</a>
              ))}
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-semibold px-5 py-3 rounded-xl text-sm mt-2">
                Access Portal
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001F54] via-[#003399] to-[#007BFF]" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-[#007BFF]/30 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-white/5 blur-[80px] animate-float" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              System Online — Connected to TiDB Cloud
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6">
              Smart Academic
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Result Management
              </span>
              for Modern Schools
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-blue-100 leading-relaxed mb-10 max-w-xl">
              Replace paper-based result sheets with a secure, role-based digital platform. Administrators configure, teachers enter scores, and students view their report cards — all in one seamless system.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 bg-white text-[#001F54] font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-base">
                Access Your Portal <ArrowRight size={16} />
              </Link>
              <a href="#features" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-base">
                Learn More
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-2 mt-8">
              {['Admin Portal', 'Teacher Portal', 'Student Portal', 'Parent Portal'].map((p, i) => (
                <Link key={i} to="/login" className="text-xs bg-white/10 border border-white/20 text-blue-100 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors font-medium">
                  {p}
                </Link>
              ))}
            </motion.div>
          </div>

          <HeroDashboard />
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 20C1200 80 900 0 720 40C540 80 240 10 0 50L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────── */}
      <section id="stats" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all">
                <p className="text-4xl md:text-5xl font-black text-[#001F54] mb-2"><Counter target={s.value} suffix={s.suffix} /></p>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────── */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#007BFF] text-xs font-bold uppercase tracking-widest">Platform Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#001F54] mt-3 mb-4">Everything Your School Needs</h2>
            <p className="text-slate-500 max-w-xl mx-auto">A complete, end-to-end academic results pipeline — from score entry to report card download.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.Icon size={22} className="text-[#007BFF]" />
                </div>
                <h3 className="text-[#001F54] font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#001F54] to-[#003399]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Simple Workflow</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">How It Works</h2>
            <p className="text-blue-200 max-w-xl mx-auto">Three straightforward steps from score entry to published report cards.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', Icon: Settings, title: 'Administrator Configures', desc: 'The administrator sets up subjects, class lists, and assigns each teacher to their respective subjects. User accounts are created for all roles.' },
              { step: '02', Icon: FileText, title: 'Teachers Enter Scores', desc: 'Teachers log in, select their assigned class and subject, then enter CA and exam scores. Grades and remarks compute automatically using the WAEC scale.' },
              { step: '03', Icon: GraduationCap, title: 'Students View Results', desc: 'Students and parents access their secure portal to view result cards with grades, remarks, and class positions for each term.' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#007BFF] to-[#001F54] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/40">
                  <s.Icon size={28} className="text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <span className="text-blue-300 font-black text-xs tracking-widest">STEP {s.step}</span>
                  <h3 className="text-white font-bold text-xl mt-2 mb-3">{s.title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ─────────────────────────────────────── */}
      <section id="roles" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#007BFF] text-xs font-bold uppercase tracking-widest">Access Portals</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#001F54] mt-3 mb-4">Built For Every Role</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Each user type gets a dedicated, focused experience — no clutter, just what they need.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all">
                <div className={`bg-gradient-to-br ${r.color} p-6 flex items-center gap-4`}>
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                    <r.Icon size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-2xl">{r.role}</h3>
                    <Link to="/login" className="text-white/70 text-xs hover:text-white font-semibold transition-colors flex items-center gap-1">
                      Access Portal <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <ul className="space-y-3">
                    {r.perms.map((p, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={11} className="text-[#007BFF]" />
                        </div>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRADING SCALE ─────────────────────────────── */}
      <section id="grading" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#007BFF] text-xs font-bold uppercase tracking-widest">Grading System</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#001F54] mt-3 mb-4">West African Grading Scale</h2>
            <p className="text-slate-500">Automatically applied to every score entry — no manual calculation required.</p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {gradeScale.map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-4 border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 ${g.color} rounded-xl flex items-center justify-center text-white font-black text-sm mx-auto mb-3`}>{g.grade}</div>
                <p className="text-slate-700 font-semibold text-xs">{g.range}</p>
                <p className="text-slate-400 text-[10px] mt-1">{g.remark}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-gradient-to-br from-[#001F54] to-[#007BFF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Transform Your School's Results Management?
            </h2>
            <p className="text-xl text-blue-200 mb-10">
              Log in with your credentials and experience a faster, more reliable academic process.
            </p>
            <Link to="/login" className="inline-flex items-center gap-3 bg-white text-[#001F54] font-black px-10 py-5 rounded-2xl shadow-2xl text-lg hover:scale-105 transition-all">
              Get Started Now <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="bg-[#001F54] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#007BFF] to-white/20 flex items-center justify-center">
              <span className="text-white font-black">B</span>
            </div>
            <div>
              <span className="text-white font-black">BFSS</span>
              <p className="text-blue-300 text-[10px]">Best Foundation Secondary School</p>
            </div>
          </div>
          <p className="text-blue-400 text-xs">© {new Date().getFullYear()} Best Foundation Secondary School. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-blue-400">
            <Link to="/login" className="hover:text-white transition-colors">Admin</Link>
            <Link to="/login" className="hover:text-white transition-colors">Teacher</Link>
            <Link to="/login" className="hover:text-white transition-colors">Student</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Private Route Guard ──────────────────────────── */
function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  if (!token || !userString) return <Navigate to="/login" replace />;
  const user = JSON.parse(userString);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'Admin') return <Navigate to="/admin" replace />;
    if (user.role === 'Teacher') return <Navigate to="/teacher" replace />;
    return <Navigate to="/student" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['Admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/teacher" element={<PrivateRoute allowedRoles={['Teacher']}><TeacherDashboard /></PrivateRoute>} />
        <Route path="/student" element={<PrivateRoute allowedRoles={['Student', 'Parent']}><StudentDashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
