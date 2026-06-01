import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle2, Plus, Eye, Edit2, Trash2, X } from 'lucide-react';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import { INCIDENTS } from '../data/incidents';

const EMIRATE_OPTIONS = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
const DEPT_OPTIONS = ['ATM', 'Branding & Marketing', 'Facilities', 'Security', 'Quality Assurance'];
const STATUS_OPTIONS = ['Pending', 'Overdue', 'In Progress', 'Resolved'];

function AddTicketModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Add New Incident Ticket</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Branch', type: 'select', opts: ['Al Reem Island Branch', 'DIFC Branch', 'Khalidiyah Branch', 'Gold Souk Branch'] },
            { label: 'Department', type: 'select', opts: DEPT_OPTIONS },
            { label: 'Metric / Incident Type', type: 'select', opts: ['ATM Body Decal Damaged', 'Expired Campaign Poster', 'Broken Branch Signage', 'Dirty ATM Vestibule', 'Non-Compliant Queue Barrier', 'Digital Signage Content Expired'] },
            { label: 'Answer / Finding', type: 'select', opts: ['Damaged', 'Missing', 'Non-Compliant', 'Expired', 'Needs Attention'] },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{field.label}</label>
              {field.type === 'select' ? (
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select {field.label}</option>
                  {field.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={field.type} className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Weight (Severity 1-5)</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date Observed</label>
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="2025-05-31" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes / Description</label>
            <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe the issue observed..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Attach Photo Evidence</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <p className="text-sm text-slate-400">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-300 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={onClose} className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium">Submit Ticket</button>
        </div>
      </div>
    </div>
  );
}

export default function BranchIncidents({ type }) {
  const [filters, setFilters] = useState({ emirate: '', department: '', status: '', startDate: '', endDate: '' });
  const [applied, setApplied] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const handleReset = () => { setFilters({ emirate: '', department: '', status: '', startDate: '', endDate: '' }); setApplied({}); };
  const handleApply = () => setApplied({ ...filters });

  const filtered = useMemo(() => {
    return INCIDENTS.filter(i => {
      if (applied.emirate && i.emirate !== applied.emirate) return false;
      if (applied.department && i.department !== applied.department) return false;
      if (applied.status && i.status !== applied.status) return false;
      if (search && !i.branchName.toLowerCase().includes(search.toLowerCase()) && !i.metric.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [applied, search]);

  const FILTER_DEFS = [
    { key: 'emirate', label: 'Emirate', type: 'select', options: EMIRATE_OPTIONS },
    { key: 'department', label: 'Department', type: 'select', options: DEPT_OPTIONS },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ];

  const weightBadge = (w) => {
    const colors = { 5: 'bg-red-100 text-red-700', 4: 'bg-orange-100 text-orange-700', 3: 'bg-amber-100 text-amber-700', 2: 'bg-yellow-100 text-yellow-700', 1: 'bg-slate-100 text-slate-600' };
    return <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colors[w]}`}>W{w}</span>;
  };

  const overdueColor = (days) => {
    if (days > 30) return 'text-red-600 font-bold';
    if (days >= 15) return 'text-amber-600 font-semibold';
    if (days > 0) return 'text-slate-600';
    return 'text-emerald-600';
  };

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      {showModal && <AddTicketModal onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{type === 'atm' ? 'ATM Incidents' : 'Branch Incidents'}</h2>
          <p className="text-sm text-slate-400 mt-0.5">Incidents / {type === 'atm' ? 'ATMs' : 'Branches'} — Ticket Management</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={16} />
          Add Ticket
        </button>
      </div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={handleReset} onApply={handleApply} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Metrics Tracked" value={66} subtitle="Active compliance metrics" icon={CheckCircle2} variant="primary" />
        <KPICard title="Pending Tickets" value={570} subtitle="Awaiting resolution" icon={AlertTriangle} variant="danger" />
        <KPICard title="Tickets Resolved" value={1} subtitle="Very low resolution rate" icon={CheckCircle2} variant="warning" />
        <KPICard title="Critical Tickets" value={262} subtitle="Severity weight 4-5" icon={AlertTriangle} variant="danger" />
        <KPICard title="Overdue Tickets" value={563} subtitle="SLA breach — escalate" icon={Clock} variant="danger" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Tickets Summary</h3>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} tickets in filtered view</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 pl-3 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Ticket ID', 'Branch', 'Metric / Incident', 'Finding', 'Status', 'Weight', 'Dept.', 'Date', 'Overdue', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(ticket => (
                <tr key={ticket.id} className={`hover:bg-slate-50 transition-colors ${ticket.status === 'Overdue' ? 'border-l-2 border-l-red-400' : ''}`}>
                  <td className="px-4 py-3 text-xs font-mono font-medium text-blue-600">{ticket.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-slate-700 whitespace-nowrap">{ticket.branchName}</p>
                      <p className="text-xs text-slate-400">{ticket.emirate}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 max-w-[180px]">
                    <p className="truncate" title={ticket.metric}>{ticket.metric}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={ticket.answer} /></td>
                  <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                  <td className="px-4 py-3">{weightBadge(ticket.weight)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{ticket.department}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{ticket.date}</td>
                  <td className="px-4 py-3">
                    {ticket.daysOverdue > 0 ? (
                      <span className={`text-xs font-semibold ${overdueColor(ticket.daysOverdue)}`}>{ticket.daysOverdue}d</span>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"><Edit2 size={14} /></button>
                      <button className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {INCIDENTS.length} tickets</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 28].map((p, i) => (
              <button key={i} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === 1 ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
