import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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

function fmt(val) {
  if (typeof val !== 'number') return val;
  if (val >= 1000) return (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'K';
  return val % 1 !== 0 ? val.toFixed(1) : val.toLocaleString();
}

export default function KPICard({
  title,
  value,
  suffix = '',
  prefix = '',
  target,
  targetLabel = 'current target',
  trend,
  trendPeriod,
  trendGoodWhenDown = false,
  subtitle,
  dataStatus,
  variant = 'primary',
  icon: Icon,
  loading,
}) {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  const statusColor = STATUS_COLOR[variant] || STATUS_COLOR.primary;

  const trendNum = typeof trend === 'number' ? Math.abs(trend) : null;
  const trendUp = typeof trend === 'number' ? trend >= 0 : null;
  const trendGood = trendUp !== null ? (trendGoodWhenDown ? !trendUp : trendUp) : null;
  const trendColor = trendGood === null ? '#94A3B8' : trendGood ? '#10B981' : '#EF4444';

  if (loading) {
    return (
      <div style={{ background: 'var(--surface-2, #1e2535)', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem 1.25rem', minHeight: 130 }}>
        <div className="shimmer h-4 w-28 rounded mb-3" />
        <div className="shimmer h-8 w-16 rounded mb-2" />
        <div className="shimmer h-3 w-24 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(0,0,0,0.22)' }}
      transition={{ duration: 0.16 }}
      style={{
        background: 'var(--surface-2, #1e2535)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '1rem 1.25rem 0.9rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 130,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top-left accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${statusColor}90, transparent)`,
        borderRadius: '14px 14px 0 0',
      }} />

      {/* Title row with optional icon badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <p style={{ color: 'var(--text-2)', fontSize: 12, fontWeight: 600, lineHeight: 1.3, flex: 1, paddingRight: Icon ? 8 : 0 }}>
          {title}
        </p>
        {Icon && (
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${statusColor}28 0%, ${statusColor}14 100%)`,
            border: `1px solid ${statusColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={15} style={{ color: statusColor }} strokeWidth={1.8} />
          </div>
        )}
      </div>

      {/* STATUS + TREND row */}
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, alignItems: 'flex-start' }}>

        {/* STATUS */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <p style={{ color: 'var(--text-4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>STATUS</p>
          <p style={{ color: statusColor, fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px' }}>
            {prefix}{fmt(typeof value === 'number' ? (value % 1 !== 0 ? animated : Math.round(animated)) : value)}{suffix}
          </p>
          {target !== undefined ? (
            <div style={{ marginTop: 5 }}>
              <p style={{ color: 'var(--text-4)', fontSize: 10, marginBottom: 1 }}>vs</p>
              <p style={{ color: 'var(--text-2)', fontSize: 12, fontWeight: 600, lineHeight: 1 }}>
                {prefix}{typeof target === 'number' ? target.toLocaleString() : target}{suffix}
              </p>
              <p style={{ color: 'var(--text-4)', fontSize: 10, marginTop: 1 }}>{targetLabel}</p>
            </div>
          ) : subtitle ? (
            <p style={{ color: 'var(--text-4)', fontSize: 11, marginTop: 4, lineHeight: 1.3 }}>{subtitle}</p>
          ) : null}
        </div>

        {/* TREND */}
        {trend !== undefined && (
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <p style={{ color: 'var(--text-4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>TREND</p>
            <p style={{ color: trendColor, fontSize: 20, fontWeight: 800, lineHeight: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 15 }}>{trendUp ? '↑' : '↓'}</span>
              <span>{trendNum % 1 !== 0 ? trendNum.toFixed(1) : trendNum}</span>
            </p>
            {trendPeriod && (
              <div style={{ marginTop: 5 }}>
                <p style={{ color: 'var(--text-4)', fontSize: 10, marginBottom: 1 }}>vs</p>
                <p style={{ color: 'var(--text-2)', fontSize: 11, fontWeight: 500, lineHeight: 1.2 }}>{trendPeriod}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {dataStatus && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 7, borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-4)', fontSize: 10 }}>{dataStatus}</p>
        </div>
      )}
    </motion.div>
  );
}
