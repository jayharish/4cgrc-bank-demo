import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  const { op = 'select', table, select = '*', filters = [], order, limit, single, rows, values, match } = req.body || {};

  if (!table) { res.status(400).json({ error: 'table required' }); return; }

  try {
    let q, result;

    if (op === 'insert') {
      q = supabase.from(table).insert(rows).select();
      result = await q;
    } else if (op === 'update') {
      q = supabase.from(table).update(values);
      for (const [col, val] of Object.entries(match || {})) q = q.eq(col, val);
      q = q.select();
      result = await q;
    } else if (op === 'delete') {
      q = supabase.from(table).delete();
      for (const [col, val] of Object.entries(match || {})) q = q.eq(col, val);
      result = await q;
    } else {
      // select (default)
      q = supabase.from(table).select(select);
      for (const [col, val] of filters) q = q.eq(col, val);
      if (order) q = q.order(order.col, { ascending: order.asc !== false });
      if (limit) q = q.limit(Number(limit));
      if (single) q = q.single();
      result = await q;
    }

    const { data, error } = result;
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
