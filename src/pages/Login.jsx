import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, TrendingUp, BarChart2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { username: form.email, password: form.password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">

      {/* ── Left Panel ────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#001F54] via-[#003399] to-[#007BFF] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-40 -left-10 w-60 h-60 rounded-full bg-[#007BFF]/40 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <span className="text-white font-black text-2xl">B</span>
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">Best Foundation</p>
              <p className="text-white font-black text-lg leading-tight">Secondary School</p>
              <p className="text-blue-300 text-xs tracking-widest">Result Management Portal</p>
            </div>
          </Link>
        </div>

        {/* Headline + Features */}
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Your School's<br />
            Results,<br />
            <span className="text-yellow-300">Reinvented.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-md mb-10">
            From score entry to published report cards — managed securely in one place.
          </p>

          <div className="space-y-3">
            {[
              { Icon: CheckCircle, text: 'Secure role-based access for all users' },
              { Icon: TrendingUp, text: 'Real-time grade calculation (A1–F9 scale)' },
              { Icon: BarChart2, text: 'Instant class rankings and printable report cards' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3"
              >
                <f.Icon size={18} className="text-blue-300 flex-shrink-0" />
                <span className="text-blue-100 text-sm font-medium">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-300 text-xs">© {new Date().getFullYear()} Best Foundation Secondary School</p>
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#001F54] to-[#007BFF] flex items-center justify-center">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <div>
              <p className="font-black text-[#001F54] text-sm leading-tight">Best Foundation Secondary School</p>
              <p className="text-slate-400 text-xs">Result Management Portal</p>
            </div>
          </div>

          <h1 className="text-3xl font-black text-[#001F54] mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to access your portal</p>

          {/* Role badges — icon only, no emojis */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {[
              { label: 'Admin', color: 'bg-violet-50 border-violet-200 text-violet-700', barColor: 'bg-violet-500' },
              { label: 'Teacher', color: 'bg-amber-50 border-amber-200 text-amber-700', barColor: 'bg-amber-500' },
              { label: 'Student', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', barColor: 'bg-emerald-500' },
              { label: 'Parent', color: 'bg-blue-50 border-blue-200 text-blue-700', barColor: 'bg-blue-500' },
            ].map((r, i) => (
              <div key={i} className={`border ${r.color} rounded-xl p-2.5 text-center`}>
                <div className={`w-5 h-1 ${r.barColor} rounded-full mx-auto mb-2`} />
                <div className="text-[10px] font-bold">{r.label}</div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Email Address</label>
              <input
                id="login-email"
                type="text"
                placeholder="Enter your email address"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all text-slate-800 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all text-slate-800 bg-slate-50"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#007BFF] to-[#001F54] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:scale-100 text-sm flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                : <>Sign In <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center mt-6 text-slate-400 text-xs">
            Accounts are created by your School Administrator.
          </p>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
            <p className="font-bold mb-2 text-blue-900">Default Administrator Login</p>
            <div className="space-y-1">
              <p>Email: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-slate-700">adminORM@gmail.com</code></p>
              <p>Password: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-slate-700">password123</code></p>
            </div>
          </div>

          <Link to="/" className="flex items-center justify-center gap-2 mt-6 text-sm text-[#007BFF] font-semibold hover:text-[#001F54] transition-colors">
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
