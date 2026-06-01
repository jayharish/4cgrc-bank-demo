import { useState } from 'react';
import { ClipboardList, Eye, Edit2, Copy, ChevronDown, ChevronUp, CheckSquare, Square, Plus } from 'lucide-react';

const CHECKLISTS = [
  {
    id: 'CHK-001',
    title: 'Branch Interior Audit',
    items: 32,
    department: 'Quality Assurance',
    status: 'Active',
    lastUpdated: '2025-05-20',
    description: 'Comprehensive interior compliance audit covering signage, cleanliness, branding, and customer-facing areas.',
    sections: [
      {
        name: 'Signage & Branding',
        items: [
          'All branch signage is legible and undamaged',
          'Campaign posters are within validity dates',
          'Digital displays show approved content',
          'FAB logo placement complies with brand guidelines',
          'Navigation signs are clearly visible from entrance',
          'No unauthorized stickers or materials visible',
        ],
      },
      {
        name: 'Cleanliness & Maintenance',
        items: [
          'Lobby floor is clean and free from hazards',
          'All windows are streak-free and undamaged',
          'Teller counters are clean and organized',
          'Restrooms are clean and stocked',
          'Air conditioning is functional and noise-free',
          'Ceiling tiles are intact and free from stains',
        ],
      },
      {
        name: 'Safety & Security',
        items: [
          'All fire exit signs are illuminated',
          'CCTV cameras are correctly positioned and functional',
          'Queue barriers are in correct position and undamaged',
          'Emergency contacts are posted visibly',
          'Fire extinguisher inspection tag is current',
        ],
      },
    ],
  },
  {
    id: 'CHK-002',
    title: 'ATM Physical Inspection',
    items: 18,
    department: 'ATM',
    status: 'Active',
    lastUpdated: '2025-05-25',
    description: 'Physical condition and compliance checklist for ATM terminals and vestibule areas.',
    sections: [
      {
        name: 'ATM Terminal',
        items: [
          'ATM body decal is intact and undamaged',
          'QR code sticker is visible and scannable',
          'Receipt paper is stocked',
          'Screen is functional with no scratches',
          'Keypad buttons are all responsive',
          'Card reader slot is unobstructed',
        ],
      },
      {
        name: 'Vestibule & Surroundings',
        items: [
          'Vestibule floor is clean',
          'Lighting is adequate and functional',
          'Privacy screen is in place',
          'No suspicious devices attached to ATM',
          'Branding panels are intact',
        ],
      },
    ],
  },
  {
    id: 'CHK-003',
    title: 'Marketing Collateral Review',
    items: 24,
    department: 'Branding & Marketing',
    status: 'Active',
    lastUpdated: '2025-05-18',
    description: 'Compliance review of all marketing materials, promotional content, and branding collateral.',
    sections: [
      {
        name: 'Print Materials',
        items: [
          'All campaign posters show correct validity period',
          'Product brochures reflect current rates and features',
          'Standees are positioned per planogram',
          'No expired materials visible',
          'Poster frames are undamaged',
        ],
      },
      {
        name: 'Digital Content',
        items: [
          'Digital signage content matches approved template',
          'Content rotation schedule is followed',
          'Screen brightness is within brand standard',
          'No personal or unapproved content shown',
        ],
      },
    ],
  },
  {
    id: 'CHK-004',
    title: 'Vendor Site Visit',
    items: 15,
    department: 'Facilities',
    status: 'Active',
    lastUpdated: '2025-05-10',
    description: 'Vendor accountability checklist for FM, security, and maintenance partner site visits.',
    sections: [
      {
        name: 'Service Delivery',
        items: [
          'Vendor representative signed in on arrival',
          'Work order reference presented',
          'PPE worn throughout visit',
          'Work completed within SLA timeframe',
          'Site left clean after service',
        ],
      },
      {
        name: 'Documentation',
        items: [
          'Service report signed by branch manager',
          'Materials used documented',
          'Next service date confirmed',
          'Before/after photos captured',
          'Customer complaint log reviewed',
        ],
      },
    ],
  },
];

const DEPT_COLORS = {
  'Quality Assurance': 'bg-purple-100 text-purple-700',
  'ATM': 'bg-blue-100 text-blue-700',
  'Branding & Marketing': 'bg-pink-100 text-pink-700',
  'Facilities': 'bg-emerald-100 text-emerald-700',
  'Security': 'bg-amber-100 text-amber-700',
};

function ChecklistCard({ checklist }) {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState({});

  const toggleItem = (sectionIdx, itemIdx) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setChecked(c => ({ ...c, [key]: !c[key] }));
  };

  const totalItems = checklist.sections.reduce((s, sec) => s + sec.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className={`bg-white rounded-xl border-2 transition-all ${expanded ? 'border-blue-200' : 'border-slate-200'} overflow-hidden`}>
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <ClipboardList size={18} className="text-blue-600 shrink-0" />
              <h3 className="text-sm font-bold text-slate-800">{checklist.title}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-2 leading-relaxed">{checklist.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DEPT_COLORS[checklist.department] || 'bg-slate-100 text-slate-600'}`}>
                {checklist.department}
              </span>
              <span className="text-xs text-slate-400">{checklist.items} items</span>
              <span className="text-xs text-slate-400">Updated {checklist.lastUpdated}</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{checklist.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium"
            >
              <Eye size={13} />
              {expanded ? 'Collapse' : 'View'}
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all" title="Edit">
              <Edit2 size={14} />
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all" title="Duplicate">
              <Copy size={14} />
            </button>
          </div>
        </div>

        {expanded && (
          <>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{checkedCount}/{totalItems} completed</span>
            </div>
          </>
        )}
      </div>

      {expanded && (
        <div className="border-t border-slate-100 divide-y divide-slate-100">
          {checklist.sections.map((section, sIdx) => (
            <div key={sIdx} className="px-5 py-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">{section.name}</h4>
              <div className="space-y-2.5">
                {section.items.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  const isChecked = !!checked[key];
                  return (
                    <button
                      key={iIdx}
                      onClick={() => toggleItem(sIdx, iIdx)}
                      className="w-full flex items-start gap-3 text-left group"
                    >
                      {isChecked
                        ? <CheckSquare size={16} className="text-blue-600 mt-0.5 shrink-0" />
                        : <Square size={16} className="text-slate-300 group-hover:text-slate-400 mt-0.5 shrink-0" />
                      }
                      <span className={`text-xs ${isChecked ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QualityChecklists({ tab }) {
  const [activeTab, setActiveTab] = useState(tab || 'templates');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quality Checklists</h2>
          <p className="text-sm text-slate-400 mt-0.5">Quality Checklists — Templates & Submission Tracking</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={16} />
          New Template
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { id: 'templates', label: 'Templates' },
          { id: 'submissions', label: 'Submissions' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <>
          {/* Summary row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Templates', value: CHECKLISTS.length, color: 'text-blue-600' },
              { label: 'Total Items', value: CHECKLISTS.reduce((s, c) => s + c.items, 0), color: 'text-slate-800' },
              { label: 'Active', value: CHECKLISTS.filter(c => c.status === 'Active').length, color: 'text-emerald-600' },
              { label: 'Departments Covered', value: 4, color: 'text-purple-600' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Checklist cards */}
          <div className="space-y-4">
            {CHECKLISTS.map(checklist => (
              <ChecklistCard key={checklist.id} checklist={checklist} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'submissions' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Checklist Submissions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Completed inspection submissions from field teams</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Submission ID', 'Checklist', 'Branch', 'Inspector', 'Date', 'Score', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'SUB-2201', checklist: 'Branch Interior Audit', branch: 'Al Reem Island Branch', inspector: 'Ahmed Al Mazrouei', date: '2025-05-28', score: 91, status: 'Compliant' },
                  { id: 'SUB-2202', checklist: 'ATM Physical Inspection', branch: 'DIFC Branch', inspector: 'Sara Al Hosani', date: '2025-05-30', score: 87, status: 'Compliant' },
                  { id: 'SUB-2203', checklist: 'Branch Interior Audit', branch: 'Khalidiyah Branch', inspector: 'Mohammed Al Suwaidi', date: '2025-05-10', score: 54, status: 'Critical' },
                  { id: 'SUB-2204', checklist: 'Marketing Collateral Review', branch: 'Gold Souk Branch', inspector: 'Fatima Al Nuaimi', date: '2025-05-22', score: 72, status: 'Warning' },
                  { id: 'SUB-2205', checklist: 'Vendor Site Visit', branch: 'Mussafah Branch', inspector: 'Khalid Al Mansoori', date: '2025-05-05', score: 56, status: 'Critical' },
                ].map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-blue-600">{sub.id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{sub.checklist}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{sub.branch}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{sub.inspector}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{sub.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${sub.score >= 80 ? 'bg-emerald-500' : sub.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sub.score}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{sub.score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        sub.status === 'Compliant' ? 'bg-emerald-50 text-emerald-700' :
                        sub.status === 'Warning' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>{sub.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
