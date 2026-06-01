import { useState, useMemo } from 'react';
import {
  Building2, AlertTriangle, Clock, CheckCircle2, Star, MoreHorizontal, Download, Maximize2
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import { INCIDENTS_TREND, TOP_OVERDUE } from '../data/incidents';

const BRANCH_DONUT = [
  { name: '86.2% Compliant', value: 86.2, color: '#10B981' },
  { name: '9.4% Minor Issues', value: 9.4, color: '#F59E0B' },
  { name: '4.4% Critical', value: 4.4, color: '#EF4444' },
];
const ATM_DONUT = [
  { name: '85.3% Compliant', value: 85.3, color: '#10B981' },
  { name: '10.4% Minor Issues', value: 10.4, color: '#F59E0B' },
  { name: '4.3% Critical', value: 4.3, color: '#EF4444' },
];

const EMIRATE_OPTIONS = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
const MONTH_OPTIONS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function ChartCard({ title, subtitle, children, className = '' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(o => !o)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      {label && <p className="font-semibold text-slate-700 mb-1.5">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-slate-700">{payload[0].name}</p>
    </div>
  );
};

function DonutChart({ data }) {
  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {`${data[index].value.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" labelLine={false} label={renderLabel}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-1.5 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-xs text-slate-600 flex-1">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExecutiveSummary() {
  const [filters, setFilters] = useState({ month: '', year: '', emirate: '', startDate: '', endDate: '' });
  const [applied, setApplied] = useState({});

  const handleReset = () => { setFilters({ month: '', year: '', emirate: '', startDate: '', endDate: '' }); setApplied({}); };
  const handleApply = () => setApplied({ ...filters });

  const trendData = useMemo(() => {
    if (applied.emirate) {
      return INCIDENTS_TREND.map(d => ({ ...d, branches: Math.round(d.branches * 0.35), atms: Math.round(d.atms * 0.28) }));
    }
    return INCIDENTS_TREND;
  }, [applied]);

  const FILTER_DEFS = [
    { key: 'month', label: 'Month', type: 'select', options: MONTH_OPTIONS },
    { key: 'year', label: 'Year', type: 'select', options: ['2024', '2025'] },
    { key: 'emirate', label: 'Emirate', type: 'select', options: EMIRATE_OPTIONS },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ];

  const overdueColor = (days) => {
    if (days > 30) return 'text-red-600 font-bold';
    if (days >= 15) return 'text-amber-600 font-semibold';
    return 'text-emerald-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 leading-tight">Executive Summary</h2>
        <p className="text-sm text-slate-400 mt-0.5">Compliance Command Center — UAE Branch &amp; ATM Network</p>
      </div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={handleReset} onApply={handleApply} />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Branches Surveyed" value="152 / 158" subtitle="6 branches pending survey" icon={Building2} variant="primary" />
        <KPICard title="ATM Incidents" value={126} subtitle="↑ 11% vs last month" icon={AlertTriangle} variant="danger" />
        <KPICard title="Branch Incidents" value={571} subtitle="↑ 29% vs last month" icon={AlertTriangle} variant="danger" />
        <KPICard title="Overdue Tickets" value={563} subtitle="Immediate action required" icon={Clock} variant="danger" />
        <KPICard title="SLA Compliance" value={73.4} suffix="%" subtitle="Target: 80% — Below threshold" icon={CheckCircle2} variant="warning" />
        <KPICard title="Avg. Branch Score" value={68.2} suffix="%" subtitle="Target: 75% — Below threshold" icon={Star} variant="warning" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Branch Network Compliance" subtitle="Current period distribution across 158 branches">
          <DonutChart data={BRANCH_DONUT} />
        </ChartCard>
        <ChartCard title="ATM Network Compliance" subtitle="Current period distribution across 89 ATMs">
          <DonutChart data={ATM_DONUT} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Incidents Trend" subtitle="12-month rolling — Branches vs ATMs" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBranch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradATM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Area type="monotone" dataKey="branches" name="Branch Incidents" stroke="#2563EB" strokeWidth={2.5} fill="url(#gradBranch)" dot={false} activeDot={{ r: 5, fill: '#2563EB' }} />
              <Area type="monotone" dataKey="atms" name="ATM Incidents" stroke="#EF4444" strokeWidth={2.5} fill="url(#gradATM)" dot={false} activeDot={{ r: 5, fill: '#EF4444' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Top Overdue Tickets</h3>
              <p className="text-xs text-slate-400 mt-0.5">Longest unresolved SLA breaches</p>
            </div>
            <button className="text-xs text-blue-600 font-medium hover:underline">View all</button>
          </div>
          <div className="divide-y divide-slate-100">
            {TOP_OVERDUE.map((ticket, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{ticket.metric}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{ticket.branch} · {ticket.department}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold ${overdueColor(ticket.daysOverdue)}`}>{ticket.daysOverdue}d overdue</span>
                    <span className="text-xs text-slate-400">{ticket.id}</span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${ticket.daysOverdue > 30 ? 'bg-red-500' : ticket.daysOverdue >= 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (ticket.daysOverdue / 50) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-red-50">
            <p className="text-xs text-red-600 font-semibold">⚠ 563 total overdue tickets require escalation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Resolution Rate', value: '0.2%', sub: '1 resolved of 571 branch incidents', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
          { label: 'Critical Ticket Rate', value: '45.9%', sub: '262 of 571 incidents are critical severity', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Audit Readiness Score', value: '61.4%', sub: 'Based on open tickets & SLA compliance', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
        ].map((item, i) => (
          <div key={i} className={`${item.bg} border ${item.border} rounded-xl px-5 py-4`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
