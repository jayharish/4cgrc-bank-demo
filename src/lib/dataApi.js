// Client-side helper — calls /api/data (Vercel function with service role key)
const BASE = '/api/data';

async function call(body) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'API error');
  return json;
}

export const db = {
  from: (table) => ({
    select: (select = '*') => ({
      eq: (col, val) => ({
        order: (col2, opts = {}) => ({
          limit: async (n) => call({ table, select, filters: [[col, val]], order: { col: col2, asc: opts.ascending }, limit: n }),
          then: (resolve, reject) => call({ table, select, filters: [[col, val]] }).then(r => resolve(r)).catch(reject),
        }),
        then: (resolve, reject) => call({ table, select, filters: [[col, val]] }).then(r => resolve(r)).catch(reject),
      }),
      order: (col2, opts = {}) => ({
        limit: async (n) => call({ table, select, order: { col: col2, asc: opts.ascending }, limit: n }),
        then: (resolve, reject) => call({ table, select, order: { col: col2, asc: opts.ascending } }).then(r => resolve(r)).catch(reject),
      }),
      then: (resolve, reject) => call({ table, select }).then(r => resolve(r)).catch(reject),
    }),
    insert: (data) => ({
      select: async () => call({ table, insert: data }),
      then: (resolve, reject) => call({ table, insert: data }).then(r => resolve(r)).catch(reject),
    }),
    update: (data) => ({
      match: (m) => ({
        select: async () => call({ table, update: data, match: m }),
        then: (resolve, reject) => call({ table, update: data, match: m }).then(r => resolve(r)).catch(reject),
      }),
      eq: (col, val) => ({
        select: async () => call({ table, update: data, match: { [col]: val } }),
        then: (resolve, reject) => call({ table, update: data, match: { [col]: val } }).then(r => resolve(r)).catch(reject),
      }),
    }),
  }),
};
