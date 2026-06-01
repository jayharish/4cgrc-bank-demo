import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Cpu, AlertTriangle, Clock, WifiOff, MoreHorizontal, Download, Maximize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import ScoreGauge from '../components/ScoreGauge';
import { ATMS } from '../data/atms';

const EMIRATE_OPTIONS = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'];

const STATUS_COLOR = { online: '#10B981', offline: '#EF4444' };

const ATM_BY_EMIRATE = [
  { emirate: 'Abu Dhabi', count: 6, score: 79 },
  { emirate: 'Dubai', count: 5, score: 74 },
  { emirate: 'Sharjah', count: 1, score: 75 },
  { emirate: 'Ajman', count: 1, score: 44 },
  { emirate: 'Ras Al Khaimah', count: 1, score: 79 },
  { emirate: 'Fujairah', count: 1, score: 83 },
];

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

export default function ATMNetwork() {
  const [filters, setFilters] = useState({ emirate: '', status: '', model: '' });
  const [applied, setApplied] = useState({});

  const handleReset = () => { setFilters({ emirate: '', status: '', model: '' }); setApplied({}); };
  const handleApply = () => setApplied({ ...filters });

  const filtered = useMemo(() => {
    return ATMS.filter(a => {
      if (applied.emirate && a.emirate !== applied.emirate) return false;
      if (applied.status && a.connectivity.toLowerCase() !== applied.status.toLowerCase()) return false;
      return true;
    });
  }, [applied]);

  const offlineATMs = filtered.filter(a => a.connectivity === 'Offline');
  const avgScore = Math.round(filtered.reduce((s, a) => s + a.score, 0) / filtered.length);

  const FILTER_DEFS = [
    { key: 'emirate', label: 'Emirate', type: 'select', options: EMIRATE_OPTIONS },
    { key: 'status', label: 'Connectivity', type: 'select', options: ['Online', 'Offline'] },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">ATM Network</h2>
        <p className="text-sm text-slate-400 mt-0.5">Locations / ATMs — UAE ATM Coverage & Status</p>
      </div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={handleReset} onApply={handleApply} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total ATMs" value={filtered.length} subtitle="In filtered view" icon={Cpu} variant="primary" />
        <KPICard title="ATMs Online" value={filtered.filter(a => a.connectivity === 'Online').length} subtitle="Active & serving customers" icon={Cpu} variant="success" />
        <KPICard title="ATMs Offline" value={offlineATMs.length} subtitle="Requires immediate action" icon={WifiOff} variant="danger" />
        <KPICard title="Total Incidents" value={filtered.reduce((s, a) => s + a.incidents, 0)} subtitle="Across ATM network" icon={AlertTriangle} variant="danger" />
      </div>

      {offlineATMs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <WifiOff size={18} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">ATMs Currently Offline</p>
            <p className="text-xs text-red-600 mt-0.5">{offlineATMs.map(a => `${a.id} (${a.location})`).join(' · ')}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ height: 440 }}>
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">ATM Location Map</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {[['#10B981', 'Online'], ['#EF4444', 'Offline']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
          <MapContainer center={[24.4539, 54.3773]} zoom={7} style={{ height: 'calc(100% - 53px)', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(atm => (
              <CircleMarker
                key={atm.id}
                center={[atm.lat, atm.lng]}
                radius={atm.connectivity === 'Offline' ? 11 : 8}
                pathOptions={{
                  color: STATUS_COLOR[atm.status],
                  fillColor: STATUS_COLOR[atm.status],
                  fillOpacity: 0.9,
                  weight: atm.connectivity === 'Offline' ? 3 : 2,
                }}
              >
                <Popup>
                  <div className="text-xs min-w-[200px]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-slate-800 text-sm">{atm.id}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${atm.connectivity === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{atm.connectivity}</span>
                    </div>
                    <p className="text-slate-600 font-medium mb-0.5">{atm.location}</p>
                    <p className="text-slate-400 mb-2">{atm.model}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="bg-slate-50 rounded p-1.5">
                        <p className="text-slate-400 text-xs">Score</p>
                        <p className={`font-bold ${atm.score >= 80 ? 'text-emerald-600' : atm.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{atm.score}%</p>
                      </div>
                      <div className="bg-slate-50 rounded p-1.5">
                        <p className="text-slate-400 text-xs">Incidents</p>
                        <p className="font-bold text-slate-700">{atm.incidents}</p>
                      </div>
                      <div className="bg-slate-50 rounded p-1.5 col-span-2">
                        <p className="text-slate-400 text-xs">Last Cash Replenishment</p>
                        <p className="font-bold text-slate-700">{atm.lastCash}</p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center gap-4">
            <ScoreGauge value={avgScore} label="ATM Health Score" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">By Emirate</h4>
            {ATM_BY_EMIRATE.map(item => (
              <div key={item.emirate} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-600">{item.emirate}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{item.count} ATMs</span>
                  <span className={`text-xs font-bold ${item.score >= 75 ? 'text-emerald-600' : item.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ATM table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">ATM Inventory</h3>
          <p className="text-xs text-slate-400 mt-0.5">All ATMs with status and performance data</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['ATM ID', 'Location', 'Emirate', 'Model', 'Last Cash Top-Up', 'Last Inspection', 'Incidents', 'Score', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(atm => (
                <tr key={atm.id} className={`hover:bg-slate-50 transition-colors ${atm.connectivity === 'Offline' ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 text-xs font-mono font-medium text-slate-600">{atm.id}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700 max-w-[200px] truncate">{atm.location}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{atm.emirate}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{atm.model}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{atm.lastCash}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{atm.lastInspection}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${atm.incidents > 6 ? 'bg-red-50 text-red-600' : atm.incidents > 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{atm.incidents}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-14">
                        <div className={`h-1.5 rounded-full ${atm.score >= 80 ? 'bg-emerald-500' : atm.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${atm.score}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{atm.score}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={atm.connectivity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="ATMs by Emirate" subtitle="Distribution and average score">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ATM_BY_EMIRATE} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="emirate" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="ATM Count" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ATM Score by Emirate" subtitle="Average health score per emirate">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ATM_BY_EMIRATE} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="emirate" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="Avg Score %" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {ATM_BY_EMIRATE.map((e, i) => <Cell key={i} fill={e.score >= 75 ? '#10B981' : e.score >= 60 ? '#F59E0B' : '#EF4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
