const BADGE_STYLES = {
  'Compliant':    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'compliant':    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Resolved':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Completed':    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Online':       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Active':       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Warning':      'bg-amber-50 text-amber-700 border border-amber-200',
  'warning':      'bg-amber-50 text-amber-700 border border-amber-200',
  'Review Due':   'bg-amber-50 text-amber-700 border border-amber-200',
  'In Progress':  'bg-purple-50 text-purple-700 border border-purple-200',
  'Pending':      'bg-blue-50 text-blue-700 border border-blue-200',
  'Open':         'bg-blue-50 text-blue-700 border border-blue-200',
  'Critical':     'bg-red-50 text-red-700 border border-red-200',
  'critical':     'bg-red-50 text-red-700 border border-red-200',
  'Non-Compliant':'bg-red-50 text-red-700 border border-red-200',
  'Overdue':      'bg-red-50 text-red-700 border border-red-200',
  'Offline':      'bg-red-50 text-red-700 border border-red-200',
  'SLA Breach':   'bg-red-50 text-red-700 border border-red-200',
  'Damaged':      'bg-orange-50 text-orange-700 border border-orange-200',
  'Missing':      'bg-orange-50 text-orange-700 border border-orange-200',
  'Expired':      'bg-slate-100 text-slate-600 border border-slate-200',
  'Needs Attention':'bg-amber-50 text-amber-700 border border-amber-200',
  'Good Condition': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const DEFAULT_STYLE = 'bg-slate-100 text-slate-600 border border-slate-200';

export default function StatusBadge({ status, size = 'sm' }) {
  const style = BADGE_STYLES[status] || DEFAULT_STYLE;
  const sizeClass = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${style} ${sizeClass}`}>
      {status}
    </span>
  );
}
