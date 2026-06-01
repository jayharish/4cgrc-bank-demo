import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function DataTable({ columns, data, pageSize = 10, searchable = true, searchPlaceholder = 'Search...' }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        const val = col.accessor ? row[col.accessor] : '';
        return String(val).toLowerCase().includes(lower);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      const cmp = aVal > bVal ? 1 : -1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(0);
  };

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.accessor) return <ChevronsUpDown size={12} style={{ color: 'var(--border)' }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} style={{ color: 'var(--accent)' }} />
      : <ChevronDown size={12} style={{ color: 'var(--accent)' }} />;
  };

  return (
    <div className="flex flex-col gap-3">
      {searchable && (
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 8, fontSize: 13, paddingLeft: 34, paddingRight: 12, paddingTop: 7, paddingBottom: 7, width: '100%' }}
          />
        </div>
      )}

      <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              {columns.map(col => (
                <th
                  key={col.key || col.accessor}
                  style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                  onClick={() => col.sortable && handleSort(col.accessor)}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: 'var(--surface)' }}>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-4)', fontSize: 13 }}>
                  No data found
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr key={i} style={{ borderTop: i > 0 ? `1px solid var(--border-subtle)` : 'none' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--surface-3)'}
                  onMouseOut={e => e.currentTarget.style.background = 'var(--surface)'}
                >
                  {columns.map(col => (
                    <td key={col.key || col.accessor} style={{ padding: '10px 16px', color: 'var(--text-2)', whiteSpace: 'nowrap', fontSize: 13 }}>
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between" style={{ fontSize: 12, color: 'var(--text-4)' }}>
          <span>
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length} records
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{ padding: '6px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--text-3)', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p = i;
              if (totalPages > 5) {
                if (page < 3) p = i;
                else if (page > totalPages - 4) p = totalPages - 5 + i;
                else p = page - 2 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 30, height: 30, borderRadius: 8, fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                    background: page === p ? 'var(--accent)' : 'transparent',
                    color: page === p ? 'white' : 'var(--text-3)',
                  }}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              style={{ padding: '6px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--text-3)', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
