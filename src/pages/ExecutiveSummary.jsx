import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2, AlertTriangle, Clock, CheckCircle2, Star,
  TrendingUp, ArrowRight, Activity, Shield, Zap, BarChart2,
  MoreHorizontal, Download, Maximize2, ChevronRight, MapPin
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { INCIDENTS_TREND, TOP_OVERDUE } from '../data/incidents';
import { useTheme } from '../context/ThemeContext';

const BRANCH_DONUT = [
  { name: '86.2% Compliant', value: 86.2, color: '#22C55E' },
  { name: '9.4% Minor Issues', value: 9.4, color: '#F59E0B' },
  { name: '4.4% Critical', value: 4.4, color: '#EF4444' },
];
const ATM_DONUT = [
  { name: '85.3% Compliant', value: 85.3, color: '#22C55E' },
  { name: '10.4% Minor Issues', value: 10.4, color: '#F59E0B' },
  { name: '4.3% Critical', value: 4.3, color: '#EF4444' },
];

const EMIRATE_OPTIONS = ['Abu Dhabi','Dubai','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* Animated counter */
function AnimatedNumber({ target, suffix = '', prefix = '', decimals = 0, duration = 1500 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now) => {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setVal(eased * target);
      if (pct < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3.5 py-2.5 text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
      {label && <p className="font-semibold mb-1.5" style={{ color: 'var(--text-1)' }}>{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          <span style={{ color: 'var(--text-3)' }}>{entry.name}:</span>
          <span className="font-bold" style={{ color: 'var(--text-1)' }}>{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
      <p className="font-semibold" style={{ color: 'var(--text-1)' }}>{payload[0].name}</p>
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
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
        {`${data[index].value.toFixed(1)}%`}
      </text>
    );
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={2} dataKey="value" labelLine={false} label={renderLabel}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-1.5 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-xs flex-1" style={{ color: 'var(--text-3)' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = '' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{title}</h3>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{subtitle}</p>}
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(o => !o)} className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--text-4)' }}>
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-44 rounded-xl overflow-hidden z-10 py-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
              {['Download PNG', 'Download CSV', 'View Full Screen'].map(opt => (
                <button key={opt} onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors" style={{ color: 'var(--text-2)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {opt === 'View Full Screen' ? <Maximize2 size={13} style={{ color: 'var(--text-4)' }} /> : <Download size={13} style={{ color: 'var(--text-4)' }} />}
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

/* KPI card with glow */
function KPI({ title, value, suffix = '', prefix = '', subtitle, icon: Icon, color, delay = 0 }) {
  const colors = {
    blue:  { border: '#478BEB', bg: 'rgba(71,139,235,0.12)', icon: '#478BEB', glow: 'rgba(71,139,235,0.20)' },
    red:   { border: '#EF4444', bg: 'rgba(239,68,68,0.10)',  icon: '#F14B4B', glow: 'rgba(239,68,68,0.15)' },
    amber: { border: '#F59E0B', bg: 'rgba(245,158,11,0.10)', icon: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
    green: { border: '#22C55E', bg: 'rgba(34,197,94,0.10)',  icon: '#22C55E', glow: 'rgba(34,197,94,0.15)' },
    slate: { border: '#64748B', bg: 'rgba(100,116,139,0.10)',icon: '#64748B', glow: 'rgba(100,116,139,0.12)' },
  };
  const c = colors[color] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="kpi-card relative"
      style={{
        borderLeftColor: c.border,
        boxShadow: `inset 0 0 40px ${c.glow}`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-4)' }}>{title}</p>
          <p className="text-2xl font-black leading-none mb-1" style={{ color: 'var(--text-1)' }}>
            <AnimatedNumber
              target={typeof value === 'number' ? value : 0}
              suffix={suffix}
              prefix={prefix}
              decimals={value % 1 !== 0 ? 1 : 0}
            />
          </p>
          {subtitle && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-4)' }}>{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg }}>
            <Icon size={18} style={{ color: c.icon }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ExecutiveSummary() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [filters, setFilters] = useState({ month: '', year: '', emirate: '', startDate: '', endDate: '' });
  const [applied, setApplied] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  const trendData = useMemo(() => {
    if (applied.emirate) return INCIDENTS_TREND.map(d => ({ ...d, branches: Math.round(d.branches * 0.35), atms: Math.round(d.atms * 0.28) }));
    return INCIDENTS_TREND;
  }, [applied]);

  const overdueColor = (d) => d > 30 ? '#F14B4B' : d >= 15 ? '#F59E0B' : '#22C55E';

  const heroStats = [
    { label: 'Branches Monitored', value: '158', icon: Building2 },
    { label: 'Compliance Score', value: '86.2%', icon: Shield },
    { label: 'ATMs Online', value: '89', icon: Activity },
    { label: 'Incidents Tracked', value: '697', icon: AlertTriangle },
  ];

  const features = [
    { icon: MapPin, title: 'Real-time Branch Network', desc: 'Live compliance map across all 7 UAE emirates with drill-down branch analytics', route: '/locations/branches', color: '#478BEB' },
    { icon: AlertTriangle, title: 'Incident Management', desc: 'Automated ticket creation, SLA tracking, and escalation workflows', route: '/incidents/branches', color: '#EF4444' },
    { icon: Package, title: 'Vendor Accountability', desc: 'SLA monitoring and work order management across all service vendors', route: '/vendors', color: '#F59E0B' },
    { icon: BarChart2, title: 'Compliance Analytics', desc: 'Multi-dimensional analytics by emirate, branch type, and department', route: '/analytics/branches', color: '#22C55E' },
  ];

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(135deg, #09090C 0%, #0D1018 40%, #111424 100%)' : 'linear-gradient(135deg, #EFF6FF 0%, #F0F4FF 100%)' }}>
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        {/* Glow orbs */}
        <div className="absolute pointer-events-none" style={{ top: '-80px', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(71,139,235,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute pointer-events-none" style={{ top: '40px', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-40px', left: '50%', width: 500, height: 300, background: 'radial-gradient(circle, rgba(71,139,235,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative px-6 pt-12 pb-10">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
              style={{ background: 'rgba(71,139,235,0.15)', border: '1px solid rgba(71,139,235,0.3)', color: '#478BEB' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live Compliance Dashboard
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black leading-tight mb-4 max-w-3xl"
          >
            {isDark ? (
              <span className="gradient-text">Compliance Intelligence<br />for UAE Banking</span>
            ) : (
              <span style={{ color: 'var(--text-1)' }}>Compliance Intelligence<br /><span style={{ color: 'var(--accent)' }}>for UAE Banking</span></span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base mb-8 max-w-xl"
            style={{ color: 'var(--text-3)' }}
          >
            Real-time governance across 158 branches and 89 ATMs. Track incidents, manage vendors, and maintain audit readiness — all in one platform.
          </motion.p>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-10">
            <button
              onClick={() => document.getElementById('dashboard-section').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 8px 32px rgba(71,139,235,0.35)' }}
            >
              Open Dashboard
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 btn-ghost"
            >
              Generate Report
            </button>
          </motion.div>

          {/* Floating stat bubbles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heroStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
                  border: '1px solid var(--border)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(71,139,235,0.15)' }}>
                  <stat.icon size={16} style={{ color: '#478BEB' }} />
                </div>
                <div>
                  <p className="text-base font-black leading-tight" style={{ color: 'var(--text-1)' }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-4)' }}>{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FEATURE CARDS ──────────────────────────────────── */}
      <div className="px-6 py-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-4)' }}
        >
          Platform Modules
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: `0 16px 48px rgba(0,0,0,0.15), 0 0 0 1px ${f.color}30` }}
              onClick={() => navigate(f.route)}
              className="text-left rounded-2xl p-5 transition-all duration-200"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: f.color + '18' }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-1)' }}>{f.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>{f.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: f.color }}>
                Open <ChevronRight size={13} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── DASHBOARD SECTION ───────────────────────────────── */}
      <div id="dashboard-section" className="px-6 py-6 space-y-5">
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl px-4 py-3 flex flex-wrap items-end gap-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {[
            { key: 'month', label: 'Month', opts: MONTHS },
            { key: 'year', label: 'Year', opts: ['2024', '2025'] },
            { key: 'emirate', label: 'Emirate', opts: EMIRATE_OPTIONS },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-4)' }}>{f.label}</label>
              <select
                value={filters[f.key]}
                onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
                className="rounded-xl px-3 py-1.5 text-sm outline-none"
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)', minWidth: 130 }}
              >
                <option value="">All</option>
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          {['startDate','endDate'].map(k => (
            <div key={k}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-4)' }}>{k === 'startDate' ? 'Start Date' : 'End Date'}</label>
              <input type="date" value={filters[k]} onChange={e => setFilters(p => ({ ...p, [k]: e.target.value }))}
                className="rounded-xl px-3 py-1.5 text-sm outline-none"
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)' }} />
            </div>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => { setFilters({ month:'',year:'',emirate:'',startDate:'',endDate:'' }); setApplied({}); }}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--surface-3)', color: 'var(--text-3)' }}>Reset</button>
            <button onClick={() => setApplied({ ...filters })}
              className="px-5 py-1.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>Apply</button>
          </div>
        </motion.div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <KPI title="Branches Surveyed" value={152} suffix=" / 158" subtitle="6 branches pending" icon={Building2} color="blue" delay={0} />
          <KPI title="ATM Incidents" value={126} subtitle="↑ 11% vs last month" icon={AlertTriangle} color="red" delay={0.05} />
          <KPI title="Branch Incidents" value={571} subtitle="↑ 29% vs last month" icon={AlertTriangle} color="red" delay={0.1} />
          <KPI title="Overdue Tickets" value={563} subtitle="Immediate action required" icon={Clock} color="red" delay={0.15} />
          <KPI title="SLA Compliance" value={73.4} suffix="%" subtitle="Target: 80% — Below" icon={CheckCircle2} color="amber" delay={0.2} />
          <KPI title="Avg. Branch Score" value={68.2} suffix="%" subtitle="Target: 75% — Below" icon={Star} color="amber" delay={0.25} />
        </div>

        {/* Donut charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Branch Network Compliance" subtitle="Distribution across 158 branches">
            <DonutChart data={BRANCH_DONUT} />
          </ChartCard>
          <ChartCard title="ATM Network Compliance" subtitle="Distribution across 89 ATMs">
            <DonutChart data={ATM_DONUT} />
          </ChartCard>
        </div>

        {/* Trend + overdue */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <ChartCard title="Incidents Trend" subtitle="12-month rolling — Branches vs ATMs" className="xl:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBranch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#478BEB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#478BEB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradATM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.20} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-4)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-4)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-3)', paddingTop: 12 }} />
                <Area type="monotone" dataKey="branches" name="Branch Incidents" stroke="#478BEB" strokeWidth={2.5} fill="url(#gradBranch)" dot={false} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="atms" name="ATM Incidents" stroke="#EF4444" strokeWidth={2.5} fill="url(#gradATM)" dot={false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Overdue */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>Top Overdue Tickets</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>Longest unresolved SLA breaches</p>
              </div>
              <button onClick={() => navigate('/incidents/branches')} className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>View all</button>
            </div>
            <div>
              {TOP_OVERDUE.map((ticket, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="px-5 py-3.5 transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-1)' }}>{ticket.metric}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{ticket.branch} · {ticket.department}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black" style={{ color: overdueColor(ticket.daysOverdue) }}>{ticket.daysOverdue}d</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: 'var(--surface-3)' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100,(ticket.daysOverdue/50)*100)}%`, background: overdueColor(ticket.daysOverdue) }} />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-3 rounded-b-2xl" style={{ background: 'rgba(239,68,68,0.08)', border: '0' }}>
              <p className="text-xs font-bold" style={{ color: '#F14B4B' }}>⚠ 563 total overdue tickets require escalation</p>
            </div>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6">
          {[
            { label: 'Resolution Rate', value: '0.2%', sub: '1 resolved of 571 branch incidents', color: '#F14B4B', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.20)' },
            { label: 'Critical Ticket Rate', value: '45.9%', sub: '262 of 571 incidents are critical severity', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.20)' },
            { label: 'Audit Readiness Score', value: '61.4%', sub: 'Based on open tickets & SLA compliance', color: '#478BEB', bg: 'rgba(71,139,235,0.08)', border: 'rgba(71,139,235,0.20)' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl px-5 py-4"
              style={{ background: item.bg, border: `1px solid ${item.border}` }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-4)' }}>{item.label}</p>
              <p className="text-2xl font-black" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-4)' }}>{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
