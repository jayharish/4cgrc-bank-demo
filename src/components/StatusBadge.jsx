const BADGE_CONFIG = {
  'Compliant':      { bg: 'rgba(16,185,129,0.12)',  text: '#22C55E', border: 'rgba(34,197,94,0.25)' },
  'compliant':      { bg: 'rgba(16,185,129,0.12)',  text: '#22C55E', border: 'rgba(34,197,94,0.25)' },
  'Resolved':       { bg: 'rgba(16,185,129,0.12)',  text: '#22C55E', border: 'rgba(34,197,94,0.25)' },
  'Completed':      { bg: 'rgba(16,185,129,0.12)',  text: '#22C55E', border: 'rgba(34,197,94,0.25)' },
  'Online':         { bg: 'rgba(16,185,129,0.12)',  text: '#22C55E', border: 'rgba(34,197,94,0.25)' },
  'Active':         { bg: 'rgba(16,185,129,0.12)',  text: '#22C55E', border: 'rgba(34,197,94,0.25)' },
  'Good Condition': { bg: 'rgba(16,185,129,0.12)',  text: '#22C55E', border: 'rgba(34,197,94,0.25)' },
  'Warning':        { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
  'warning':        { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
  'Review Due':     { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
  'Needs Attention':{ bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
  'In Progress':    { bg: 'rgba(139,92,246,0.12)',  text: '#A78BFA', border: 'rgba(139,92,246,0.25)' },
  'Pending':        { bg: 'rgba(71,139,235,0.12)',  text: '#60A5FA', border: 'rgba(71,139,235,0.25)' },
  'Open':           { bg: 'rgba(71,139,235,0.12)',  text: '#60A5FA', border: 'rgba(71,139,235,0.25)' },
  'Critical':       { bg: 'rgba(239,68,68,0.12)',   text: '#F87171', border: 'rgba(239,68,68,0.25)' },
  'critical':       { bg: 'rgba(239,68,68,0.12)',   text: '#F87171', border: 'rgba(239,68,68,0.25)' },
  'Non-Compliant':  { bg: 'rgba(239,68,68,0.12)',   text: '#F87171', border: 'rgba(239,68,68,0.25)' },
  'Overdue':        { bg: 'rgba(239,68,68,0.12)',   text: '#F87171', border: 'rgba(239,68,68,0.25)' },
  'Offline':        { bg: 'rgba(239,68,68,0.12)',   text: '#F87171', border: 'rgba(239,68,68,0.25)' },
  'SLA Breach':     { bg: 'rgba(239,68,68,0.12)',   text: '#F87171', border: 'rgba(239,68,68,0.25)' },
  'Damaged':        { bg: 'rgba(249,115,22,0.12)',  text: '#FB923C', border: 'rgba(249,115,22,0.25)' },
  'Missing':        { bg: 'rgba(249,115,22,0.12)',  text: '#FB923C', border: 'rgba(249,115,22,0.25)' },
  'Expired':        { bg: 'rgba(100,116,139,0.12)', text: '#94A3B8', border: 'rgba(100,116,139,0.25)' },
};

const DEFAULT_CONFIG = { bg: 'rgba(100,116,139,0.10)', text: '#94A3B8', border: 'rgba(100,116,139,0.20)' };

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = BADGE_CONFIG[status] || DEFAULT_CONFIG;
  const padding = size === 'xs' ? '2px 8px' : '3px 10px';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      padding,
      background: cfg.bg,
      color: cfg.text,
      border: `1px solid ${cfg.border}`,
    }}>
      {status}
    </span>
  );
}
