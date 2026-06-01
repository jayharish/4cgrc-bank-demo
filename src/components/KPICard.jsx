import { useEffect, useRef, useState } from 'react';

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

const VARIANT_STYLES = {
  primary: { border: 'border-l-blue-600', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: 'kpi-primary' },
  danger:  { border: 'border-l-red-500',  iconBg: 'bg-red-50',  iconColor: 'text-red-500',  label: 'kpi-danger' },
  warning: { border: 'border-l-amber-500',iconBg: 'bg-amber-50',iconColor: 'text-amber-500',label: 'kpi-warning' },
  success: { border: 'border-l-emerald-500',iconBg:'bg-emerald-50',iconColor:'text-emerald-600',label:'kpi-success'},
  neutral: { border: 'border-l-slate-400', iconBg: 'bg-slate-100', iconColor: 'text-slate-500', label: 'kpi-neutral' },
};

export default function KPICard({ title, value, subtitle, icon: Icon, variant = 'primary', suffix = '', prefix = '', trend, loading }) {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;

  const displayValue = typeof value === 'number' ? animated : value;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 border-l-4 border-l-slate-200">
        <div className="shimmer h-4 w-24 rounded mb-3" />
        <div className="shimmer h-8 w-16 rounded mb-2" />
        <div className="shimmer h-3 w-32 rounded" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${styles.border} p-5 flex items-start justify-between gap-3 transition-shadow hover:shadow-md`}>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{title}</p>
        <p className="text-2xl font-bold text-slate-800 leading-none mb-1">
          {prefix}{typeof value === 'number' ? (
            value % 1 !== 0 ? displayValue.toFixed(1) : Math.round(displayValue).toLocaleString()
          ) : value}{suffix}
        </p>
        {subtitle && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{subtitle}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trend >= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
            <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={styles.iconColor} />
        </div>
      )}
    </div>
  );
}
