import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { Package, AlertTriangle, Clock, TrendingUp, CheckCircle2, Eye, Edit2, MoreHorizontal, Download, Maximize2 } from 'lucide-react';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import { VENDORS, WORK_ORDERS, VENDOR_SLA_CHART } from '../data/vendors';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: e.fill }} />
          <span className="text-slate-600">{e.name}:</span>
          <span className="font-semibold text-slate-800">{e.value}h</span>
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

export default function VendorManagement() {
  const [search, setSearch] = useState('');

  const filteredVendors = useMemo(() => {
    if (!search) return VENDORS;
    return VENDORS.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const filteredWOs = useMemo(() => {
    if (!search) return WORK_ORDERS;
    return WORK_ORDERS.filter(wo => wo.vendor.toLowerCase().includes(search.toLowerCase()) || wo.location.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const slaBreaches = VENDORS.filter(v => v.status === 'SLA Breach').length;
  const totalOpenWOs = VENDORS.reduce((s, v) => s + v.openWOs, 0);
  const avgResponseRate = 94.2;
  const avgResolutionDays = 4.1;

  const slaBarColor = (target, actual) => actual > target ? '#EF4444' : '#10B981';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vendor Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">Vendor Accountability Dashboard — SLA Monitoring & Work Orders</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full">NEW MODULE</span>
        </div>
      </div>

      {/* SLA breach alert */}
      {slaBreaches > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">{slaBreaches} Vendors in SLA Breach</p>
            <p className="text-xs text-red-600 mt-0.5">
              {VENDORS.filter(v => v.status === 'SLA Breach').map(v => `${v.name} (+${v.slaActual - v.slaTarget}h over target)`).join(' · ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Active Vendors" value={VENDORS.length} subtitle="Under contract" icon={Package} variant="primary" />
        <KPICard title="SLA Breaches" value={slaBreaches} subtitle="Vendors over SLA target" icon={AlertTriangle} variant="danger" />
        <KPICard title="Open Work Orders" value={totalOpenWOs} subtitle="Across all vendors" icon={Clock} variant="warning" />
        <KPICard title="Avg. Response Rate" value={avgResponseRate} suffix="%" subtitle="Vendor SLA adherence" icon={CheckCircle2} variant="success" />
        <KPICard title="Avg. Resolution Time" value={avgResolutionDays} suffix=" days" subtitle="Mean time to resolve" icon={TrendingUp} variant="neutral" />
      </div>

      {/* Vendor table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Vendor Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">SLA performance and contract status</p>
          </div>
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Vendor Name', 'Category', 'Contract Expiry', 'SLA Target', 'SLA Actual', 'Variance', 'Open WOs', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.map(vendor => {
                const variance = vendor.slaActual - vendor.slaTarget;
                return (
                  <tr key={vendor.id} className={`hover:bg-slate-50 transition-colors ${vendor.status === 'SLA Breach' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{vendor.name}</p>
                        <p className="text-xs text-slate-400">{vendor.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{vendor.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{vendor.contractExpiry}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{vendor.slaTarget}h</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${vendor.slaActual > vendor.slaTarget ? 'text-red-600' : 'text-emerald-600'}`}>{vendor.slaActual}h</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${variance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {variance > 0 ? `+${variance}h` : `${variance}h`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${vendor.openWOs > 15 ? 'bg-red-50 text-red-600' : vendor.openWOs > 8 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                        {vendor.openWOs}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs font-semibold text-slate-700">{vendor.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={vendor.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Eye size={14} /></button>
                        <button className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"><Edit2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA chart */}
      <ChartCard title="Vendor SLA Performance" subtitle="Target vs Actual response time (hours) — Red bars indicate breach">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={VENDOR_SLA_CHART} margin={{ left: 0, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="vendor" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="target" name="SLA Target (hrs)" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="actual" name="Actual Time (hrs)" radius={[4, 4, 0, 0]} maxBarSize={24}>
              {VENDOR_SLA_CHART.map((entry, i) => (
                <Cell key={i} fill={slaBarColor(entry.target, entry.actual)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Work Orders */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Work Orders Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">Recent work orders across all vendors</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {[['Open', 'bg-blue-50 text-blue-700'], ['In Progress', 'bg-purple-50 text-purple-700'], ['Overdue', 'bg-red-50 text-red-700'], ['Completed', 'bg-emerald-50 text-emerald-700']].map(([s, c]) => (
              <span key={s} className={`px-2 py-0.5 rounded-full font-medium ${c}`}>
                {WORK_ORDERS.filter(wo => wo.status === s).length} {s}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['WO Number', 'Location', 'Type', 'Vendor', 'Category', 'Raised', 'Due Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WORK_ORDERS.map(wo => (
                <tr key={wo.id} className={`hover:bg-slate-50 transition-colors ${wo.status === 'Overdue' ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 text-xs font-mono font-medium text-blue-600">{wo.id}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700 whitespace-nowrap">{wo.location}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${wo.type === 'ATM' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{wo.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{wo.vendor}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{wo.category}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{wo.raised}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{wo.due}</td>
                  <td className="px-4 py-3"><StatusBadge status={wo.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
