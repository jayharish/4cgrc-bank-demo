import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);
  useEffect(() => {
    const n = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isNaN(n)) { setValue(target); return; }
    start.current = null;
    const animate = (ts) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(e * n * 10) / 10);
      if (p < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

const STATUS_COLOR = {
  primary: '#60A5FA',
  success: '#10B981',
  danger:  '#EF4444',
  warning: '#F59E0B',
  neutral: '#94A3B8',
};

function fmt(val, suffix) {
  if (typeof val !== 'number') return val;
  if (val >= 1000) return (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'K';
  return val % 1 !== 0 ? val.toFixed(1) : val.toLocaleString();
}

export default function KPICard({
  title,
  value,
  suffix = '',
  prefix = '',
  target,           // optional: comparison value (number or string)
  targetLabel = 'current target',
  trend,            // optional: change value (number)
  trendPeriod,      // optional: "Apr. 2022"
  trendGoodWhenDown = false, // true for "lower is better" KPIs (incidents, breaches)
  subtitle,         // shown as small note below value when no target
  dataStatus,       // "Data Status: Jun '25" footer line
  variant = 'primary',
  loading,
}) {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  const displayVal = typeof value === 'number'
    ? (value % 1 !== 0 ? animated.toFixed(1) : Math.round(animated).toLocaleString())
    : value;

  const statusColor = STATUS_COLOR[variant] || STATUS_COLOR.primary;

  const trendNum = typeof trend === 'number' ? Math.abs(trend) : null;
  const trendUp = typeof trend === 'number' ? trend >= 0 : null;
  const trendGood = trendUp !== null
    ? (trendGoodWhenDown ? !trendUp : trendUp)
    : null;
  const trendColor = trendGood === null ? '#94A3B8' : trendGood ? '#10B981' : '#EF4444';

  if (loading) {
    return (
      <div style={{ background: 'var(--surface-2, #1e2535)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
        <div className="shimmer h-4 w-28 rounded mb-3" />
        <div className="shimmer h-8 w-16 rounded mb-2" />
        <div className="shimmer h-3 w-24 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
      transition={{ duration: 0.18 }}
      style={{
        background: 'var(--surface-2, #1e2535)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '1rem 1.25rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Title */}
      <p style={{ color: 'var(--text-1)', fontSize: 13, fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
        {title}
      </p>

      {/* STATUS + TREND row */}
      <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>

        {/* STATUS */}
        <div style={{ flex: '1 1 0' }}>
          <p style={{ color: 'var(--text-4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>STATUS</p>
          <p style={{ color: statusColor, fontSize: 28, fontWeight: 800, lineHeight: 1, marginBottom: 0 }}>
            {prefix}{fmt(typeof value === 'number' ? (value % 1 !== 0 ? animated : Math.round(animated)) : value, suffix)}{suffix}
          </p>
          {target !== undefined ? (
            <div style={{ marginTop: 6 }}>
              <p style={{ color: 'var(--text-4)', fontSize: 11, marginBottom: 1 }}>vs</p>
              <p style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
                {prefix}{typeof target === 'number' ? target.toLocaleString() : target}{suffix}
              </p>
              <p style={{ color: 'var(--text-4)', fontSize: 10, marginTop: 1 }}>{targetLabel}</p>
            </div>
          ) : subtitle ? (
            <p style={{ color: 'var(--text-4)', fontSize: 11, marginTop: 5, lineHeight: 1.3 }}>{subtitle}</p>
          ) : null}
        </div>

        {/* TREND — only if provided */}
        {trend !== undefined && (
          <div style={{ flex: '1 1 0' }}>
            <p style={{ color: 'var(--text-4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>TREND</p>
            <p style={{ color: trendColor, fontSize: 20, fontWeight: 800, lineHeight: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 16 }}>{trendUp ? '↑' : '↓'}</span>
              <span>{trendNum % 1 !== 0 ? trendNum.toFixed(1) : trendNum}</span>
            </p>
            {trendPeriod && (
              <div style={{ marginTop: 6 }}>
                <p style={{ color: 'var(--text-4)', fontSize: 11, marginBottom: 1 }}>vs</p>
                <p style={{ color: 'var(--text-2)', fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{trendPeriod}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {dataStatus && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-4)', fontSize: 10 }}>{dataStatus}</p>
          <ClipboardList size={13} style={{ color: 'var(--text-4)', opacity: 0.6 }} />
        </div>
      )}
    </motion.div>
  );
}
