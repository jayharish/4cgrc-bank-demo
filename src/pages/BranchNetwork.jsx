import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2, AlertTriangle, Clock, TrendingUp, Eye, MoreHorizontal, Download, Maximize2, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import ScoreGauge from '../components/ScoreGauge';
import { dbQuery } from '../lib/dataApi';
import { BRANCHES as BRANCHES_MOCK, PENDING_INSPECTIONS, BRANCH_SCORE_BY_EMIRATE as EMIRATE_CHART_MOCK, TOP_INCIDENT_BRANCHES as TOP_MOCK } from '../data/branches';

const EMIRATE_OPTIONS = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const STATUS_COLOR = {
  compliant: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: e.fill || e.color }} />
          <span className="text-slate-600">{e.name}:</span>
          <span className="font-semibold text-slate-800">{e.value}</span>
        </div>
      ))}
    </div>
  );
};

function ChartCard({ title, subtitle, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(o => !o)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-all">
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-slate-200 shadow-lg z-10 py-1">
              {['Download PNG', 'Download CSV', 'View Full Screen'].map(opt => (
                <button key={opt} onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50">
                  {opt === 'View Full Screen' ? <Maximize2 size={13} className="text-slate-400" /> : <Download size={13} className="text-slate-400" />}
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function BranchNetwork() {
  const [filters, setFilters] = useState({ emirate: '', status: '', startDate: '', endDate: '' });
  const [applied, setApplied] = useState({});
  const [BRANCHES, setBranches] = useState(BRANCHES_MOCK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbQuery('branches', { order: { col: 'name', asc: true } }).then(({ data, error }) => {
      if (!error && data?.length > 0) {
        setBranches(data.map(b => ({ ...b, lastInspection: b.last_inspection, inspector: b.manager })));
      }
      setLoading(false);
    });
  }, []);

  const handleReset = () => { setFilters({ emirate: '', status: '', startDate: '', endDate: '' }); setApplied({}); };
  const handleApply = () => setApplied({ ...filters });

  const filteredBranches = useMemo(() => {
    return BRANCHES.filter(b => {
      if (applied.emirate && b.emirate !== applied.emirate) return false;
      if (applied.status && b.status !== applied.status) return false;
      return true;
    });
  }, [applied, BRANCHES]);

  const FILTER_DEFS = [
    { key: 'emirate', label: 'Emirate', type: 'select', options: EMIRATE_OPTIONS },
    { key: 'status', label: 'Status', type: 'select', options: ['compliant', 'warning', 'critical'] },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ];

  const avgScore = filteredBranches.length > 0 ? Math.round(filteredBranches.reduce((s, b) => s + b.score, 0) / filteredBranches.length) : 0;
  const totalIncidents = filteredBranches.reduce((s, b) => s + (b.incidents || 0), 0);
  const totalOverdue = filteredBranches.reduce((s, b) => s + (b.overdue || 0), 0);

  // Compute charts from live data
  const BRANCH_SCORE_BY_EMIRATE = useMemo(() => {
    const map = {};
    BRANCHES.forEach(b => {
      if (!map[b.emirate]) map[b.emirate] = { emirate: b.emirate, scores: [], branches: 0 };
      map[b.emirate].scores.push(b.score);
      map[b.emirate].branches++;
    });
    return Object.values(map).map(e => ({ emirate: e.emirate, score: Math.round(e.scores.reduce((a, s) => a + s, 0) / e.scores.length), branches: e.branches }));
  }, [BRANCHES]);

  const TOP_INCIDENT_BRANCHES = useMemo(() =>
    [...BRANCHES].sort((a, b) => (b.incidents || 0) - (a.incidents || 0)).slice(0, 7).map(b => ({ id: b.id, name: b.name, incidents: b.incidents || 0 })),
  [BRANCHES]);

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.35 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>Branch Network</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-4)' }}>Locations / Branches — UAE Coverage Map</p>
        </div>
        {loading && <Loader2 size={18} className="animate-spin" style={{ color: 'var(--accent)' }} />}
      </motion.div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={handleReset} onApply={handleApply} />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Avg. Branch Score', value: avgScore, suffix: '%', target: 85, targetLabel: 'compliance target', icon: TrendingUp, variant: 'primary' },
          { title: 'Unique Locations', value: filteredBranches.length, subtitle: 'Branches in filtered view', icon: Building2, variant: 'neutral' },
          { title: 'Incidents Reported', value: totalIncidents, target: 0, targetLabel: 'target', trendGoodWhenDown: true, icon: AlertTriangle, variant: 'danger' },
          { title: 'Overdue Tickets', value: totalOverdue, target: 0, targetLabel: 'target', trendGoodWhenDown: true, icon: Clock, variant: 'danger' },
        ].map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}>
            <KPICard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Map + gauge */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Map */}
        <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ height: 440 }}>
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Interactive Branch Map</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {[['#10B981', 'Compliant'], ['#F59E0B', 'Attention'], ['#EF4444', 'Critical']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
          <MapContainer
            center={[24.4539, 54.3773]}
            zoom={7}
            style={{ height: 'calc(100% - 53px)', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredBranches.map(branch => (
              <CircleMarker
                key={branch.id}
                center={[branch.lat, branch.lng]}
                radius={branch.incidents > 15 ? 12 : branch.incidents > 8 ? 9 : 7}
                pathOptions={{
                  color: STATUS_COLOR[branch.status],
                  fillColor: STATUS_COLOR[branch.status],
                  fillOpacity: 0.85,
                  weight: 2,
                  opacity: 1,
                }}
              >
                <Popup>
                  <div className="text-xs min-w-[200px]">
                    <p className="font-bold text-slate-800 text-sm mb-1">{branch.name}</p>
                    <p className="text-slate-500 mb-2">{branch.id} · {branch.emirate}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="bg-slate-50 rounded p-1.5">
                        <p className="text-slate-400 text-xs">Score</p>
                        <p className={`font-bold ${branch.score >= 80 ? 'text-emerald-600' : branch.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{branch.score}%</p>
                      </div>
                      <div className="bg-slate-50 rounded p-1.5">
                        <p className="text-slate-400 text-xs">Incidents</p>
                        <p className="font-bold text-slate-700">{branch.incidents}</p>
                      </div>
                      <div className="bg-slate-50 rounded p-1.5">
                        <p className="text-slate-400 text-xs">Overdue</p>
                        <p className={`font-bold ${branch.overdue > 5 ? 'text-red-600' : 'text-slate-700'}`}>{branch.overdue}</p>
                      </div>
                      <div className="bg-slate-50 rounded p-1.5">
                        <p className="text-slate-400 text-xs">Last Visit</p>
                        <p className="font-bold text-slate-700">{branch.lastInspection}</p>
                      </div>
                    </div>
                    <button className="mt-2.5 w-full text-xs text-blue-600 font-semibold hover:underline">
                      View Branch Details →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Gauge sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center gap-4">
            <ScoreGauge value={avgScore} label="Network Health Score" />
            <div className="w-full space-y-2">
              {[
                { label: 'Compliant', count: filteredBranches.filter(b => b.status === 'compliant').length, color: 'bg-emerald-500' },
                { label: 'Needs Attention', count: filteredBranches.filter(b => b.status === 'warning').length, color: 'bg-amber-500' },
                { label: 'Critical', count: filteredBranches.filter(b => b.status === 'critical').length, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Branch Types</h4>
            {[
              { label: 'Main Branch', count: filteredBranches.filter(b => b.type === 'Main Branch').length },
              { label: 'Branch', count: filteredBranches.filter(b => b.type === 'Branch').length },
              { label: 'Mall Branch', count: filteredBranches.filter(b => b.type === 'Mall Branch').length },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-600">{item.label}</span>
                <span className="text-xs font-bold text-slate-700">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Latest Inspections */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Latest Inspections</h3>
            <p className="text-xs text-slate-400 mt-0.5">Most recently inspected branches</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Branch Code', 'Branch Name', 'Inspected', 'Incidents'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBranches.slice(0, 8).sort((a, b) => new Date(b.lastInspection) - new Date(a.lastInspection)).map(branch => (
                  <tr key={branch.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{branch.id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{branch.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{branch.lastInspection}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        branch.incidents > 12 ? 'bg-red-50 text-red-600' : branch.incidents > 6 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>{branch.incidents}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Inspections */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Pending Inspections This Month</h3>
              <p className="text-xs text-slate-400 mt-0.5">Branches due for inspection</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">{PENDING_INSPECTIONS.length} Due</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Branch Code', 'Branch Name', 'Last Inspection', 'Due Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PENDING_INSPECTIONS.map(branch => (
                  <tr key={branch.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{branch.id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{branch.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{branch.lastInspection}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">{branch.dueDate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Top Locations by Incidents" subtitle="Highest incident-count branches">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_INCIDENT_BRANCHES} layout="vertical" margin={{ left: 20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <YAxis dataKey="id" type="category" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="incidents" name="Incidents" fill="#2DD4BF" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Score by Emirate" subtitle="Average branch compliance score per emirate">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BRANCH_SCORE_BY_EMIRATE} layout="vertical" margin={{ left: 30, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <YAxis dataKey="emirate" type="category" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="Avg Score %" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {BRANCH_SCORE_BY_EMIRATE.map((entry, i) => (
                  <Cell key={i} fill={entry.score >= 75 ? '#1E40AF' : entry.score >= 65 ? '#3B82F6' : '#93C5FD'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </motion.div>
  );
}
