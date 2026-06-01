import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const start = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const numTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isNaN(numTarget)) { setValue(target); return; }

    const animate = (ts) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * numTarget * 10) / 10);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

const VARIANT_BORDER = {
  primary: 'var(--accent)',
  danger:  '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  neutral: '#64748B',
};
const VARIANT_ICON_BG = {
  primary: 'rgba(37,99,235,0.1)',
  danger:  'rgba(239,68,68,0.1)',
  warning: 'rgba(245,158,11,0.1)',
  success: 'rgba(16,185,129,0.1)',
  neutral: 'rgba(100,116,139,0.1)',
};
const VARIANT_ICON_COLOR = {
  primary: 'var(--accent)',
  danger:  '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  neutral: '#64748B',
};

export default function KPICard({ title, value, subtitle, icon: Icon, variant = 'primary', suffix = '', prefix = '', trend, loading }) {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  const borderColor = VARIANT_BORDER[variant] || VARIANT_BORDER.primary;
  const iconBg = VARIANT_ICON_BG[variant] || VARIANT_ICON_BG.primary;
  const iconColor = VARIANT_ICON_COLOR[variant] || VARIANT_ICON_COLOR.primary;

  const displayValue = typeof value === 'number' ? animated : value;

  if (loading) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeftWidth: 4, borderLeftColor: 'var(--border)', borderRadius: 14 }} className="p-5">
        <div className="shimmer h-4 w-24 rounded mb-3" />
        <div className="shimmer h-8 w-16 rounded mb-2" />
        <div className="shimmer h-3 w-32 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: `0 12px 32px rgba(0,0,0,0.15), 0 0 0 1px ${borderColor}22` }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'var(--surface)',
        border: `1px solid var(--border)`,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 14,
        padding: '1.25rem',
      }}
      className="flex items-start justify-between gap-3"
    >
      <div className="flex-1 min-w-0">
        <p style={{ color: 'var(--text-4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{title}</p>
        <p style={{ color: 'var(--text-1)', fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
          {prefix}{typeof value === 'number' ? (
            value % 1 !== 0 ? displayValue.toFixed(1) : Math.round(displayValue).toLocaleString()
          ) : value}{suffix}
        </p>
        {subtitle && <p style={{ color: 'var(--text-4)', fontSize: 11, marginTop: 3 }}>{subtitle}</p>}
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 11, fontWeight: 600, color: trend >= 0 ? '#EF4444' : '#10B981' }}>
            <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
            <span style={{ color: 'var(--text-4)', fontWeight: 400 }}>vs last month</span>
          </div>
        )}
      </div>
      {Icon && (
        <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      )}
    </motion.div>
  );
}
