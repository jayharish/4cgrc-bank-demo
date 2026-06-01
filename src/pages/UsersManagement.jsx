import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Edit2, Trash2, X, Loader2, CheckCircle2, RefreshCw, Crown, Eye, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const ROLES = ['admin', 'manager', 'auditor', 'viewer'];
const ROLE_META = {
  admin:   { label: 'Admin',   color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', icon: Crown,        desc: 'Full access — manage users, all CRUD' },
  manager: { label: 'Manager', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  icon: Shield,       desc: 'Create & edit all records, manage vendors' },
  auditor: { label: 'Auditor', color: '#34D399', bg: 'rgba(52,211,153,0.12)',  icon: Eye,          desc: 'Create incidents & observations, read-only otherwise' },
  viewer:  { label: 'Viewer',  color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', icon: AlertTriangle, desc: 'Read-only access to all data' },
};

function EditUserModal({ user, onClose, onSaved }) {
  const [role, setRole] = useState(user.role);
  const [fullName, setFullName] = useState(user.full_name || '');
  const [department, setDepartment] = useState(user.department || '');
  const [isActive, setIsActive] = useState(user.is_active !== false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('profiles').update({ role, full_name: fullName, department, is_active: isActive }).eq('id', user.id);
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>Edit User</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)' }}><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-3)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #478BEB, #7C3AED)' }}>
              {(fullName || user.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>{user.email}</p>
              <p className="text-xs" style={{ color: 'var(--text-4)' }}>Joined {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          {[{ label: 'Full Name', val: fullName, set: setFullName }, { label: 'Department', val: department, set: setDepartment }].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
              <input value={f.val} onChange={e => f.set(e.target.value)}
                style={{ width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none' }} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => {
                const m = ROLE_META[r];
                const Icon = m.icon;
                return (
                  <button key={r} onClick={() => setRole(r)}
                    style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${role === r ? m.color : 'var(--border)'}`, background: role === r ? m.bg : 'var(--surface-3)', cursor: 'pointer', textAlign: 'left' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={13} style={{ color: m.color }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.label}</span>
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--text-4)', lineHeight: 1.4 }}>{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--surface-3)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>Account Active</span>
            <button onClick={() => setIsActive(a => !a)}
              style={{ width: 44, height: 24, borderRadius: 12, background: isActive ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
              <span style={{ position: 'absolute', top: 3, left: isActive ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '8px 20px', background: 'var(--accent)', color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            {saving && <Loader2 size={14} className="animate-spin" />} Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UsersManagement({ tab }) {
  const { profile: myProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tab || 'users');
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeactivate = async (id) => {
    if (id === myProfile?.id) { alert("You can't deactivate your own account."); return; }
    if (!window.confirm('Deactivate this user?')) return;
    await supabase.from('profiles').update({ is_active: false }).eq('id', id);
    fetchUsers();
  };

  const TABS = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  ];

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence>
        {editingUser && (
          <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSaved={() => { setEditingUser(null); fetchUsers(); }} />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>Users Management</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-4)' }}>{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} style={{ padding: '8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', color: 'var(--text-3)' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLES.map((r, i) => {
          const m = ROLE_META[r];
          const Icon = m.icon;
          const count = users.filter(u => u.role === r).length;
          return (
            <motion.div key={r} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: `4px solid ${m.color}`, borderRadius: 14, padding: '1.25rem' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{m.label}s</p>
                  <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>{count}</p>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color: m.color }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--surface-3)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: activeTab === t.id ? 'var(--accent)' : 'transparent', color: activeTab === t.id ? 'white' : 'var(--text-3)', border: 'none', cursor: 'pointer' }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
              <span className="text-sm" style={{ color: 'var(--text-4)' }}>Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Users size={32} style={{ color: 'var(--text-4)' }} />
              <p className="text-sm" style={{ color: 'var(--text-4)' }}>No users yet. Sign up to get started.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['User', 'Role', 'Department', 'Status', 'Last Login', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const m = ROLE_META[u.role] || ROLE_META.viewer;
                  const isMe = u.id === myProfile?.id;
                  return (
                    <tr key={u.id} style={{ borderTop: i > 0 ? `1px solid var(--border-subtle)` : 'none' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--surface-3)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                            style={{ background: 'linear-gradient(135deg, #478BEB, #7C3AED)', flexShrink: 0 }}>
                            {(u.full_name || u.email || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              {u.full_name || '—'}
                              {isMe && <span style={{ fontSize: 10, background: 'rgba(71,139,235,0.15)', color: '#478BEB', padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>You</span>}
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, border: `1px solid ${m.color}40` }}>
                          {m.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>{u.department || '—'}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={u.is_active !== false ? 'Active' : 'Offline'} /></td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-4)' }}>{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-4)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditingUser(u)} style={{ padding: 5, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-4)' }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-4)'}>
                            <Edit2 size={14} />
                          </button>
                          {!isMe && (
                            <button onClick={() => handleDeactivate(u.id)} style={{ padding: 5, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-4)' }}
                              onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'}
                              onMouseOut={e => e.currentTarget.style.color = 'var(--text-4)'}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map((r, i) => {
            const m = ROLE_META[r];
            const Icon = m.icon;
            const permissions = {
              admin:   ['View all data', 'Create & edit all records', 'Delete records', 'Manage users & roles', 'Generate reports', 'System settings'],
              manager: ['View all data', 'Create & edit all records', 'Manage vendors', 'Generate reports', 'Manage checklists'],
              auditor: ['View all data', 'Create incidents & observations', 'Submit checklists', 'Generate reports'],
              viewer:  ['View all data', 'Download reports'],
            };
            return (
              <motion.div key={r} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${m.color}`, borderRadius: 14, padding: '1.25rem' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: m.color }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>{m.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{users.filter(u => u.role === r).length} users assigned</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {permissions[r].map(perm => (
                    <div key={perm} className="flex items-center gap-2.5">
                      <CheckCircle2 size={13} style={{ color: m.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{perm}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
