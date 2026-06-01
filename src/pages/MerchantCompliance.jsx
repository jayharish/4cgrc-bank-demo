import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Store, AlertTriangle, Calendar, CheckCircle2, Eye, Edit2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import { MERCHANTS } from '../data/merchants';

const EMIRATE_OPTIONS = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'];
const CATEGORY_OPTIONS = ['POS Partner', 'ATM Merchant', 'Loyalty Partner'];

const STATUS_COLORS = {
  'Compliant': '#10B981',
  'Non-Compliant': '#EF4444',
  'Review Due': '#F59E0B',
};

export default function MerchantCompliance() {
  const [filters, setFilters] = useState({ emirate: '', category: '', status: '' });
  const [applied, setApplied] = useState({});

  const handleReset = () => { setFilters({ emirate: '', category: '', status: '' }); setApplied({}); };
  const handleApply = () => setApplied({ ...filters });

  const filtered = useMemo(() => {
    return MERCHANTS.filter(m => {
      if (applied.emirate && m.emirate !== applied.emirate) return false;
      if (applied.category && m.category !== applied.category) return false;
      if (applied.status && m.status !== applied.status) return false;
      return true;
    });
  }, [applied]);

  const FILTER_DEFS = [
    { key: 'emirate', label: 'Emirate', type: 'select', options: EMIRATE_OPTIONS },
    { key: 'category', label: 'Category', type: 'select', options: CATEGORY_OPTIONS },
    { key: 'status', label: 'Status', type: 'select', options: ['Compliant', 'Non-Compliant', 'Review Due'] },
  ];

  const nonCompliant = filtered.filter(m => m.status === 'Non-Compliant').length;
  const reviewDue = filtered.filter(m => m.status === 'Review Due').length;
  const avgScore = Math.round(filtered.reduce((s, m) => s + m.score, 0) / filtered.length);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Merchant Compliance</h2>
          <p className="text-sm text-slate-400 mt-0.5">Merchant Compliance Monitoring — POS, ATM & Loyalty Partners</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full">NEW MODULE</span>
      </div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={handleReset} onApply={handleApply} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Registered Merchants" value={filtered.length} subtitle="In filtered view" icon={Store} variant="primary" />
        <KPICard title="Non-Compliant" value={nonCompliant} subtitle="Require immediate action" icon={AlertTriangle} variant="danger" />
        <KPICard title="Reviews Due" value={reviewDue} subtitle="Audits overdue this month" icon={Calendar} variant="warning" />
        <KPICard title="Overall Compliance" value={avgScore} suffix="%" subtitle="Average compliance score" icon={CheckCircle2} variant={avgScore >= 85 ? 'success' : 'warning'} />
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ height: 400 }}>
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Merchant Locations</h3>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {[['#10B981', 'Compliant'], ['#F59E0B', 'Review Due'], ['#EF4444', 'Non-Compliant']].map(([c, l]) => (
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
          {filtered.map(merchant => (
            <CircleMarker
              key={merchant.id}
              center={[merchant.lat, merchant.lng]}
              radius={8}
              pathOptions={{
                color: STATUS_COLORS[merchant.status] || '#64748B',
                fillColor: STATUS_COLORS[merchant.status] || '#64748B',
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-xs min-w-[180px]">
                  <p className="font-bold text-slate-800 text-sm mb-0.5">{merchant.name}</p>
                  <p className="text-slate-400 mb-1.5">{merchant.category}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-slate-50 rounded p-1.5">
                      <p className="text-slate-400 text-xs">Score</p>
                      <p className={`font-bold text-sm ${merchant.score >= 85 ? 'text-emerald-600' : merchant.score >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{merchant.score}%</p>
                    </div>
                    <div className="bg-slate-50 rounded p-1.5">
                      <p className="text-slate-400 text-xs">Status</p>
                      <p className={`font-bold text-xs ${merchant.score >= 85 ? 'text-emerald-600' : merchant.score >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{merchant.status}</p>
                    </div>
                    <div className="bg-slate-50 rounded p-1.5 col-span-2">
                      <p className="text-slate-400 text-xs">Next Audit</p>
                      <p className="font-bold text-slate-700">{merchant.nextAudit}</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Merchant table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Merchant Directory</h3>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} merchants in filtered view</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Merchant', 'Category', 'Location', 'Last Audit', 'Next Audit', 'Compliance Score', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(merchant => (
                <tr key={merchant.id} className={`hover:bg-slate-50 transition-colors ${merchant.status === 'Non-Compliant' ? 'bg-red-50' : merchant.status === 'Review Due' ? 'bg-amber-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{merchant.name}</p>
                      <p className="text-xs text-slate-400">{merchant.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{merchant.category}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[160px] truncate">{merchant.location}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{merchant.lastAudit}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      new Date(merchant.nextAudit) < new Date('2025-06-30') ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>{merchant.nextAudit}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${merchant.score >= 85 ? 'bg-emerald-500' : merchant.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${merchant.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{merchant.score}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={merchant.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"><Edit2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {CATEGORY_OPTIONS.map(cat => {
          const catMerchants = filtered.filter(m => m.category === cat);
          const catCompliant = catMerchants.filter(m => m.status === 'Compliant').length;
          const catScore = catMerchants.length > 0 ? Math.round(catMerchants.reduce((s, m) => s + m.score, 0) / catMerchants.length) : 0;
          return (
            <div key={cat} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{cat}</p>
              <div className="flex items-end gap-3">
                <p className="text-2xl font-bold text-slate-800">{catMerchants.length}</p>
                <p className="text-xs text-slate-400 mb-1">merchants</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${catScore}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-600">{catScore}%</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{catCompliant}/{catMerchants.length} compliant</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
