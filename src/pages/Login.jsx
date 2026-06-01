import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
        navigate('/');
      } else {
        await signUp(form.email, form.password, form.fullName);
        setError('');
        setMode('login');
        setError('Account created! Check your email to confirm, then log in.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: isDark ? '#09090C' : '#F1F5F9' }}>

      {/* Glow orbs */}
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(71,139,235,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 8px 32px rgba(71,139,235,0.4)' }}
          >
            <Shield size={26} className="text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-1)' }}>4C360</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-4)' }}>Banking Compliance Platform</p>
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 }}
          className="p-8"
        >
          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'var(--surface-3)' }}>
            {['login', 'signup'].map(tab => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(''); }}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize"
                style={{
                  background: mode === tab ? 'var(--accent)' : 'transparent',
                  color: mode === tab ? 'white' : 'var(--text-4)',
                }}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="fullname"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Jay Harish Jethva"
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    required={mode === 'signup'}
                    style={{ width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Email Address</label>
              <input
                type="email"
                placeholder="you@bank.ae"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                style={{ width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', borderRadius: 10, padding: '10px 40px 10px 14px', fontSize: 14, outline: 'none' }}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-4)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl text-xs"
                  style={{
                    background: error.includes('created') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${error.includes('created') ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    color: error.includes('created') ? '#22C55E' : '#F87171',
                  }}
                >
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 4px 20px rgba(71,139,235,0.3)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs mt-5" style={{ color: 'var(--text-4)' }}>
              Demo: sign up first, then the first account gets admin access.
            </p>
          )}
        </motion.div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-4)' }}>
          4C GRC · Banking Compliance Platform · UAE
        </p>
      </motion.div>
    </div>
  );
}
