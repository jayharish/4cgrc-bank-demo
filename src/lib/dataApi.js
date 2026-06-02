// Server-side proxy — calls /api/data (Vercel function using service key)
// Returns { data, error } matching Supabase client shape

async function call(body) {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: { message: json.error } };
    return { data: json.data, error: null };
  } catch (e) {
    return { data: null, error: { message: e.message } };
  }
}

// Read rows from a table
// opts: { select, filters: [[col, val], ...], order: { col, asc }, limit, single }
export function dbQuery(table, opts = {}) {
  return call({ op: 'select', table, ...opts });
}

// Insert one or more rows; rows can be an object or array
export function dbInsert(table, rows) {
  return call({ op: 'insert', table, rows: Array.isArray(rows) ? rows : [rows] });
}

// Update rows matching { col: val, ... } in match object
export function dbUpdate(table, values, match) {
  return call({ op: 'update', table, values, match });
}

// Delete rows matching { col: val, ... } in match object
export function dbDelete(table, match) {
  return call({ op: 'delete', table, match });
}
