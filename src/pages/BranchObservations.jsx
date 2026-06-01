import { useState, useMemo } from 'react';
import { Eye, Edit2, Trash2, Plus, X, ClipboardList, Building2, Users } from 'lucide-react';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import { OBSERVATIONS, OBSERVATIONS_SUMMARY } from '../data/observations';

const EMIRATE_OPTIONS = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
const DEPT_OPTIONS = ['ATM', 'Branding & Marketing', 'Facilities', 'Security', 'Quality Assurance'];

function AddObservationModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Add New Observation</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Branch', opts: ['Al Reem Island Branch', 'DIFC Branch', 'Khalidiyah Branch', 'Gold Souk Branch', 'Yas Mall Branch'] },
            { label: 'Department', opts: DEPT_OPTIONS },
            { label: 'Metric / Observation', opts: ['Are all windows free from damage?', 'Are all campaign posters current?', 'Is the ATM vestibule clean?', 'Are queue barriers functional?', 'Is CCTV properly positioned?'] },
            { label: 'Answer', opts: ['Good Condition', 'Needs Attention', 'Damaged', 'Missing', 'Non-Compliant'] },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{field.label}</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select {field.label}</option>
                {field.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date Observed</label>
            <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="2025-05-31" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes</label>
            <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Additional context or details..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Photo Evidence</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <p className="text-sm text-slate-400">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-300 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={onClose} className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium">Save Observation</button>
        </div>
      </div>
    </div>
  );
}

export default function BranchObservations({ type }) {
  const [filters, setFilters] = useState({ emirate: '', department: '', answer: '', startDate: '', endDate: '' });
  const [applied, setApplied] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const handleReset = () => { setFilters({ emirate: '', department: '', answer: '', startDate: '', endDate: '' }); setApplied({}); };
  const handleApply = () => setApplied({ ...filters });

  const filtered = useMemo(() => {
    return OBSERVATIONS.filter(o => {
      if (applied.emirate && o.emirate !== applied.emirate) return false;
      if (applied.department && o.department !== applied.department) return false;
      if (applied.answer && o.answer !== applied.answer) return false;
      if (search && !o.branchName.toLowerCase().includes(search.toLowerCase()) && !o.metric.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [applied, search]);

  const FILTER_DEFS = [
    { key: 'emirate', label: 'Emirate', type: 'select', options: EMIRATE_OPTIONS },
    { key: 'department', label: 'Department', type: 'select', options: DEPT_OPTIONS },
    { key: 'answer', label: 'Answer', type: 'select', options: ['Good Condition', 'Needs Attention', 'Damaged'] },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ];

  const { totalMetrics, totalObservations, branchesVisited, departments, deleted } = OBSERVATIONS_SUMMARY;

  return (
    <div className="p-6 space-y-6">
      {showModal && <AddObservationModal onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{type === 'atm' ? 'ATM Observations' : 'Branch Observations'}</h2>
          <p className="text-sm text-slate-400 mt-0.5">Observations / {type === 'atm' ? 'ATMs' : 'Branches'} — Observation Log</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={16} />
          Add Observation
        </button>
      </div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={handleReset} onApply={handleApply} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Metrics Tracked" value={totalMetrics} subtitle="Active compliance metrics" icon={ClipboardList} variant="primary" />
        <KPICard title="Total Observations" value={totalObservations} subtitle="Recorded this period" icon={Eye} variant="neutral" />
        <KPICard title="Branches Visited" value={branchesVisited} subtitle="Unique branch sites" icon={Building2} variant="success" />
        <KPICard title="Departments" value={departments} subtitle="Active departments" icon={Users} variant="neutral" />
        <KPICard title="Deleted Records" value={deleted} subtitle="Removed observations" icon={Trash2} variant="neutral" />
      </div>

      {/* Observation breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Good Condition', count: filtered.filter(o => o.answer === 'Good Condition').length, color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
          { label: 'Needs Attention', count: filtered.filter(o => o.answer === 'Needs Attention').length, color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
          { label: 'Damaged', count: filtered.filter(o => o.answer === 'Damaged').length, color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
        ].map(item => (
          <div key={item.label} className={`${item.bg} rounded-xl px-4 py-3 flex items-center gap-3`}>
            <span className={`w-3 h-3 rounded-full ${item.color}`} />
            <div>
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className={`text-xl font-bold ${item.text}`}>{item.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Observations Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} observations in filtered view</p>
          </div>
          <input
            type="text"
            placeholder="Search observations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Obs. ID', 'Branch Code', 'Branch Name', 'Metric / Question', 'Answer', 'Department', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(obs => (
                <tr key={obs.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-medium text-blue-600">{obs.id}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{obs.branchCode}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700 whitespace-nowrap">{obs.branchName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[220px]">
                    <p className="truncate" title={obs.metric}>{obs.metric}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={obs.answer} /></td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{obs.department}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{obs.date}</td>
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
          <span>Showing {filtered.length} of {OBSERVATIONS.length} records</span>
          <p className="text-xs text-slate-400">Total observations across all periods: {totalObservations.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
