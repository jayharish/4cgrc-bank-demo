import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Cloud, CheckCircle2, Clock, BarChart2, Package, Shield } from 'lucide-react';
import FilterBar from '../components/FilterBar';

const REPORT_TYPES = [
  { value: 'monthly', label: 'Monthly Compliance Report', icon: FileText, desc: 'Full monthly snapshot of branch & ATM compliance status' },
  { value: 'ageing', label: 'Ageing Report', icon: Clock, desc: 'Overdue ticket analysis by age bracket and severity' },
  { value: 'branch', label: 'Branch Report', icon: BarChart2, desc: 'Detailed per-branch inspection and incident breakdown' },
  { value: 'vendor-sla', label: 'Vendor SLA Report', icon: Package, desc: 'Vendor performance against contracted SLA targets' },
  { value: 'executive', label: 'Executive Governance Report', icon: Shield, desc: 'C-suite summary: KPIs, risk flags, and remediation plan' },
];

const RECENT_REPORTS = [
  { name: 'May 2025 Monthly Compliance Report', type: 'Monthly Report', generated: '2025-06-01', size: '2.4 MB', pages: 18 },
  { name: 'Q1 2025 Executive Governance Report', type: 'Executive Governance', generated: '2025-04-05', size: '1.8 MB', pages: 12 },
  { name: 'April 2025 Branch Report — Abu Dhabi', type: 'Branch Report', generated: '2025-05-03', size: '3.1 MB', pages: 24 },
  { name: 'AlMansoori Facilities SLA Report — May', type: 'Vendor SLA Report', generated: '2025-06-01', size: '0.9 MB', pages: 6 },
  { name: 'Overdue Tickets Ageing Report — May 2025', type: 'Ageing Report', generated: '2025-05-31', size: '1.2 MB', pages: 9 },
];

export default function Reports() {
  const [filters, setFilters] = useState({ branch: '', department: '', type: '', startDate: '', endDate: '' });
  const [selectedType, setSelectedType] = useState('monthly');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);

  const handleReset = () => setFilters({ branch: '', department: '', type: '', startDate: '', endDate: '' });

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(null);
    setTimeout(() => {
      setGenerating(false);
      const rt = REPORT_TYPES.find(r => r.value === selectedType);
      setGenerated({ name: rt?.label || 'Compliance Report', pages: Math.floor(Math.random() * 15) + 8, size: `${(Math.random() * 3 + 0.8).toFixed(1)} MB` });
    }, 2200);
  };

  const FILTER_DEFS = [
    { key: 'branch', label: 'Branch', type: 'select', options: ['Al Reem Island Branch', 'DIFC Branch', 'Khalidiyah Branch', 'Gold Souk Branch', 'Yas Mall Branch'] },
    { key: 'department', label: 'Department', type: 'select', options: ['ATM', 'Branding & Marketing', 'Facilities', 'Security', 'Quality Assurance'] },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ];

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reports</h2>
        <p className="text-sm text-slate-400 mt-0.5">Generate & export compliance reports for audit and governance</p>
      </div>

      <FilterBar filters={FILTER_DEFS} values={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={handleReset} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Report builder */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Select Report Type</h3>
              <p className="text-xs text-slate-400 mt-0.5">Choose the type of compliance report to generate</p>
            </div>
            <div className="p-4 grid grid-cols-1 gap-2">
              {REPORT_TYPES.map(rt => (
                <label
                  key={rt.value}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedType === rt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={rt.value}
                    checked={selectedType === rt.value}
                    onChange={() => setSelectedType(rt.value)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedType === rt.value ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    <rt.icon size={16} className={selectedType === rt.value ? 'text-blue-600' : 'text-slate-400'} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${selectedType === rt.value ? 'text-blue-700' : 'text-slate-700'}`}>{rt.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{rt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2.5 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Cloud size={18} />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated report preview */}
          {generated && (
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border-2 border-blue-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-14 bg-white rounded-lg border border-blue-200 flex items-center justify-center shadow-sm">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Report Ready</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800">{generated.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Generated on {new Date().toLocaleDateString('en-AE', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{generated.pages} pages</span>
                      <span>·</span>
                      <span>{generated.size}</span>
                      <span>·</span>
                      <span>PDF format</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                  <Download size={15} />
                  Download PDF
                </button>
              </div>

              {/* Mock PDF pages preview */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3].map(p => (
                  <div key={p} className="shrink-0 w-32 h-44 bg-white rounded-lg border border-slate-200 shadow-sm p-2 flex flex-col gap-1.5">
                    <div className="h-4 bg-blue-100 rounded" />
                    <div className="h-2 bg-slate-100 rounded w-3/4" />
                    <div className="h-2 bg-slate-100 rounded" />
                    <div className="h-2 bg-slate-100 rounded w-2/3" />
                    <div className="h-12 bg-slate-50 rounded border border-slate-100 mt-1" />
                    <div className="h-2 bg-slate-100 rounded" />
                    <div className="h-2 bg-slate-100 rounded w-4/5" />
                    <div className="h-2 bg-slate-100 rounded w-1/2" />
                    <div className="text-center text-xs text-slate-300 mt-auto">pg. {p}</div>
                  </div>
                ))}
                <div className="shrink-0 w-32 h-44 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <span className="text-xs text-slate-300">+{generated.pages - 3} more</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent reports */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Recent Reports</h3>
            <p className="text-xs text-slate-400 mt-0.5">Previously generated reports</p>
          </div>
          <div className="divide-y divide-slate-100">
            {RECENT_REPORTS.map((report, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-10 bg-blue-50 rounded border border-blue-100 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-snug">{report.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{report.type}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                    <span>{report.generated}</span>
                    <span>·</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <button className="p-1.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
