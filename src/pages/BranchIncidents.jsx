import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle2, Plus, Edit2, Trash2, X, Loader2, RefreshCw } from 'lucide-react';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import { dbQuery, dbInsert, dbUpdate, dbDelete } from '../lib/dataApi';
import { useAuth } from '../context/AuthContext';

const EMIRATE_OPTIONS = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
const DEPT_OPTIONS = ['ATM', 'Branding & Marketing', 'Facilities', 'Security', 'Quality Assurance'];
const STATUS_OPTIONS = ['Pending', 'Overdue', 'In Progress', 'Resolved'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const CATEGORY_OPTIONS = ['ATM Body Decal Damaged', 'Expired Campaign Poster', 'Broken Branch Signage', 'Dirty ATM Vestibule', 'Non-Compliant Queue Barrier', 'Digital Signage Content Expired', 'Missing Brochures', 'Security Camera Fault'];

const EMPTY_FORM = {
  title: '', description: '', location: '', emirate: '', category: '',
  department: DEPT_OPTIONS[0], priority: 'Medium', status: 'Pending',
  reported_by: '', assigned_to: '', due_date: '', type: 'branch',
};

function IncidentModal({ incident, onClose, onSaved, type }) {
  const { profile } = useAuth();
  const [form, setForm] = useState(incident || { ...EMPTY_FORM, type: type || 'branch', reported_by: profile?.full_name || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!incident?.id;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.location || !form.emirate || !form.category) {
      setError('Please fill in all required fields.'); return;
    }
    setSaving(true); setError('');
    try {
      if (isEdit) {
        const { error } = await dbUpdate('incidents', { ...form, updated_at: new Date().toISOString() }, { id: incident.id });
        if (error) throw error;
      } else {
        const ticket_id = `TKT-${Date.now().toString().slice(-6)}`;
        const { error } = await dbInsert('incidents', { ...form, ticket_id, reported_date: new Date().toISOString().split('T')[0] });
        if (error) throw error;
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-1)' }}>{isEdit ? 'Edit Incident' : 'New Incident Ticket'}</h2>
          <button onClick={onClose} style={{ color: 'var(--text-4)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Title *', key: 'title', type: 'text', placeholder: 'e.g. ATM Body Decal Damaged' },
            { label: 'Location *', key: 'location', type: 'text', placeholder: 'e.g. Al Reem Island Branch' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                style={{ width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none' }} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Emirate *', key: 'emirate', opts: EMIRATE_OPTIONS },
              { label: 'Department *', key: 'department', opts: DEPT_OPTIONS },
              { label: 'Category *', key: 'category', opts: CATEGORY_OPTIONS },
              { label: 'Priority', key: 'priority', opts: PRIORITY_OPTIONS },
              { label: 'Status', key: 'status', opts: STATUS_OPTIONS },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                <select value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                  style={{ width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none' }}>
                  <option value="">Select...</option>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</label>
              <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
                style={{ width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the incident..."
              style={{ width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none', resize: 'none' }} />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '8px 20px', background: 'var(--accent)', color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 6, opacity: saving ? 0.7 : 1 }}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Save Changes' : 'Submit Ticket'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function BranchIncidents({ type }) {
  const { profile } = useAuth();
  const canWrite = profile?.role && ['admin', 'manager', 'auditor'].includes(profile.role);

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ emirate: '', department: '', status: '' });
  const [applied, setApplied] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [search, setSearch] = useState('');

  const fetchIncidents = async () => {
    setLoading(true);
    const { data, error } = await dbQuery('incidents', {
      filters: [['type', type || 'branch']],
      order: { col: 'created_at', asc: false },
    });
    if (!error) setIncidents(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchIncidents(); }, [type]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this incident?')) return;
    await dbDelete('incidents', { id });
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  const handleSaved = () => { setShowModal(false); setEditingIncident(null); fetchIncidents(); };

  const filtered = useMemo(() => incidents.filter(i => {
    if (applied.emirate && i.emirate !== applied.emirate) return false;
    if (applied.department && i.department !== applied.department) return false;
    if (applied.status && i.status !== applied.status) return false;
    if (search && !i.title?.toLowerCase().includes(search.toLowerCase()) && !i.location?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [incidents, applied, search]);

  const stats = {
    total: incidents.length,
    overdue: incidents.filter(i => i.status === 'Overdue').length,
    resolved: incidents.filter(i => i.status === 'Resolved').length,
    critical: incidents.filter(i => i.priority === 'Critical').length,
  };

  const FILTER_DEFS = [
    { key: 'emirate', label: 'Emirate', type: 'select', options: EMIRATE_OPTIONS },
    { key: 'department', label: 'Department', type: 'select', options: DEPT_OPTIONS },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
  ];

  const priorityColor = (p) => ({
    Critical: '#F87171', High: '#FB923C', Medium: '#F59E0B', Low: '#94A3B8'
  }[p] || '#94A3B8');

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence>
        {(showModal || editingIncident) && (
          <IncidentModal
            incident={editingIncident}
            type={type}
            onClose={() => { setShowModal(false); setEditingIncident(null); }}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>{type === 'atm' ? 'ATM' : 'Branch'} Incidents</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-4)' }}>{incidents.length} total incidents in database</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <button onClick={fetchIncidents} style={{ padding: '8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', color: 'var(--text-3)' }}>
            <RefreshCw size={15} />
          </button>
          {canWrite && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--accent)', color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              <Plus size={15} /> New Incident
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Incidents', value: stats.total, subtitle: 'In database', icon: AlertTriangle, variant: 'danger' },
          { title: 'Overdue', value: stats.overdue, target: 0, targetLabel: 'target', trendGoodWhenDown: true, icon: Clock, variant: 'warning' },
          { title: 'Resolved', value: stats.resolved, target: stats.total, targetLabel: 'total', icon: CheckCircle2, variant: 'success' },
          { title: 'Critical', value: stats.critical, target: 0, targetLabel: 'target', trendGoodWhenDown: true, icon: AlertTriangle, variant: 'danger' },
        ].map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
            <KPICard {...card} />
          </motion.div>
        ))}
      </div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        onReset={() => { setFilters({ emirate: '', department: '', status: '' }); setApplied({}); }}
        onApply={() => setApplied({ ...filters })} />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Incidents Register</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{filtered.length} records</p>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search incidents..."
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 8, padding: '6px 12px', fontSize: 13, outline: 'none', width: 200 }} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3" style={{ color: 'var(--text-4)' }}>
            <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
            <span className="text-sm">Loading incidents...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <AlertTriangle size={32} style={{ color: 'var(--text-4)' }} />
            <p className="text-sm" style={{ color: 'var(--text-4)' }}>No incidents found. {canWrite && 'Click "New Incident" to add one.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Ticket ID', 'Title', 'Location', 'Emirate', 'Department', 'Priority', 'Status', 'Due Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((incident, i) => (
                  <tr key={incident.id}
                    style={{ borderTop: i > 0 ? `1px solid var(--border-subtle)` : 'none' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--surface-3)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{incident.ticket_id}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-1)', fontWeight: 500, maxWidth: 200 }}><div className="truncate" style={{ maxWidth: 180 }}>{incident.title}</div></td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{incident.location}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{incident.emirate}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{incident.department}</td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: priorityColor(incident.priority) }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: priorityColor(incident.priority), display: 'inline-block' }} />
                        {incident.priority}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}><StatusBadge status={incident.status} /></td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{incident.due_date || '—'}</td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      {canWrite && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditingIncident(incident)}
                            style={{ padding: '5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-4)' }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-4)'}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(incident.id)}
                            style={{ padding: '5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-4)' }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-4)'}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
