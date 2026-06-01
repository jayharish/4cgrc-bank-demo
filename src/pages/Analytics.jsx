import { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MoreHorizontal, Download, Maximize2 } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import {
  INCIDENTS_BY_TYPE, INCIDENTS_BY_CITY, INCIDENTS_BY_DEPARTMENT, INCIDENTS_BY_BRANCH_TYPE
} from '../data/incidents';

const EMIRATE_OPTIONS = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const DEPT_COLORS = ['#EAB308', '#10B981', '#2563EB', '#EF4444', '#8B5CF6'];
const TYPE_COLORS = ['#2563EB', '#10B981', '#EF4444', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label || payload[0]?.name}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: e.fill || e.color }} />
          <span className="text-slate-600">{e.name || 'Count'}:</span>
          <span className="font-semibold text-slate-800">{e.value}</span>
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
      <p className="text-slate-500">{payload[0].value.toFixed(1)}%</p>
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

export default function Analytics({ type }) {
  const [filters, setFilters] = useState({ emirate: '', month: '', year: '' });
  const [applied, setApplied] = useState({});

  const handleReset = () => { setFilters({ emirate: '', month: '', year: '' }); setApplied({}); };
  const handleApply = () => setApplied({ ...filters });

  const FILTER_DEFS = [
    { key: 'emirate', label: 'Emirate', type: 'select', options: EMIRATE_OPTIONS },
    { key: 'month', label: 'Month', type: 'select', options: ['January','February','March','April','May','June','July','August','September','October','November','December'] },
    { key: 'year', label: 'Year', type: 'select', options: ['2024', '2025'] },
  ];

  const RADIAN = Math.PI / 180;
  const renderDonutLabel = (data) => ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
        {`${data[index].pct.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{type === 'atm' ? 'ATM Analytics' : 'Branch Analytics'}</h2>
        <p className="text-sm text-slate-400 mt-0.5">Analytics / {type === 'atm' ? 'ATMs' : 'Branches'} — Incident Breakdowns & Trends</p>
      </div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={handleReset} onApply={handleApply} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Branch Type Pie */}
        <ChartCard title="Incidents Per Branch Type" subtitle="Distribution across branch categories">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie
                  data={INCIDENTS_BY_BRANCH_TYPE}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                  labelLine={false}
                  label={renderDonutLabel(INCIDENTS_BY_BRANCH_TYPE)}
                >
                  {INCIDENTS_BY_BRANCH_TYPE.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {INCIDENTS_BY_BRANCH_TYPE.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                      <span className="text-xs text-slate-600">{item.type}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${item.pct}%`, background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.count} incidents</p>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Most Common Incidents */}
        <ChartCard title="Most Common Incidents" subtitle="Top incident types by frequency">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={INCIDENTS_BY_TYPE} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 9.5, fill: '#94A3B8' }} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={45} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Incidents" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Incidents Per City */}
        <ChartCard title="Incidents Per City" subtitle="Geographic distribution of incidents">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={INCIDENTS_BY_CITY} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Incidents" fill="#EF4444" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Incidents Per Department Donut */}
        <ChartCard title="Incidents Per Department" subtitle="Department-level breakdown">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={INCIDENTS_BY_DEPARTMENT}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  labelLine={false}
                  label={renderDonutLabel(INCIDENTS_BY_DEPARTMENT)}
                >
                  {INCIDENTS_BY_DEPARTMENT.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {INCIDENTS_BY_DEPARTMENT.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                      <span className="text-xs text-slate-600">{item.dept}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${item.pct}%`, background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.count} incidents</p>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Incidents Analysed', value: '571', sub: 'Branch incidents this period' },
          { label: 'Most Affected Emirate', value: 'Abu Dhabi', sub: '201 incidents' },
          { label: 'Most Common Type', value: 'Expired Poster', sub: '98 occurrences' },
          { label: 'Top Affected Dept.', value: 'ATM', sub: '344 incidents (60.2%)' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-lg font-bold text-slate-800">{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
