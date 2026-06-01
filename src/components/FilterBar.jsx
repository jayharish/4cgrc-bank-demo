import { Search, RotateCcw, ChevronDown } from 'lucide-react';

export default function FilterBar({ filters, values, onChange, onReset, onApply }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }} className="px-4 py-3 flex flex-wrap items-center gap-3">
      {filters.map(filter => (
        <div key={filter.key} className="flex flex-col gap-0.5">
          <label style={{ color: 'var(--text-4)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{filter.label}</label>
          {filter.type === 'select' ? (
            <div className="relative">
              <select
                value={values[filter.key] || ''}
                onChange={e => onChange(filter.key, e.target.value)}
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 8, fontSize: 13, paddingLeft: 10, paddingRight: 28, paddingTop: 6, paddingBottom: 6, minWidth: 130, appearance: 'none' }}
              >
                <option value="">All</option>
                {filter.options.map(opt => (
                  <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
            </div>
          ) : filter.type === 'date' ? (
            <input
              type="date"
              value={values[filter.key] || ''}
              onChange={e => onChange(filter.key, e.target.value)}
              style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 8, fontSize: 13, padding: '6px 10px' }}
            />
          ) : (
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
              <input
                type="text"
                placeholder={filter.placeholder || 'Search...'}
                value={values[filter.key] || ''}
                onChange={e => onChange(filter.key, e.target.value)}
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 8, fontSize: 13, paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6, width: 192 }}
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex items-end gap-2 ml-auto">
        <button
          onClick={onReset}
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-3)', borderRadius: 8, fontSize: 13, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text-1)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          <RotateCcw size={13} />
          Reset
        </button>
        {onApply && (
          <button
            onClick={onApply}
            style={{ background: 'var(--accent)', color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 600, padding: '6px 16px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
