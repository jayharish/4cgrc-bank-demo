import { Search, RotateCcw, ChevronDown } from 'lucide-react';

export default function FilterBar({ filters, values, onChange, onReset, onApply }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
      {filters.map(filter => (
        <div key={filter.key} className="flex flex-col gap-0.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{filter.label}</label>
          {filter.type === 'select' ? (
            <div className="relative">
              <select
                value={values[filter.key] || ''}
                onChange={e => onChange(filter.key, e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[130px]"
              >
                <option value="">All</option>
                {filter.options.map(opt => (
                  <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          ) : filter.type === 'date' ? (
            <input
              type="date"
              value={values[filter.key] || ''}
              onChange={e => onChange(filter.key, e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={filter.placeholder || 'Search...'}
                value={values[filter.key] || ''}
                onChange={e => onChange(filter.key, e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex items-end gap-2 ml-auto">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw size={13} />
          Reset
        </button>
        {onApply && (
          <button
            onClick={onApply}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
