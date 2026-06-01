// Vercel serverless function — runs in Node.js, service key never reaches browser
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { table, select = '*', filters = [], order, limit, insert, update, match } = req.body || {};

  if (!table) { res.status(400).json({ error: 'table required' }); return; }

  try {
    if (insert) {
      // Insert/upsert
      const { data, error } = await supabase.from(table).insert(insert).select();
      if (error) { res.status(500).json({ error: error.message }); return; }
      res.json({ data });
      return;
    }

    if (update && match) {
      const { data, error } = await supabase.from(table).update(update).match(match).select();
      if (error) { res.status(500).json({ error: error.message }); return; }
      res.json({ data });
      return;
    }

    // Read
    let q = supabase.from(table).select(select);
    for (const [col, val] of filters) q = q.eq(col, val);
    if (order) q = q.order(order.col, { ascending: order.asc ?? true });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
