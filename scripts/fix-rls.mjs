// Fix RLS policies via Supabase Management API (requires a Personal Access Token)
import { SERVICE_KEY, SUPABASE_URL } from './_env.mjs';

const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1] || '';

// The Supabase Management API v1 accepts service_role key as Bearer token for SQL execution
// Endpoint: POST /v1/projects/{ref}/database/query
const runSQL = async (sql) => {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
};

// First, check current policies
const check = await runSQL(`
  SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
  FROM pg_policies
  WHERE schemaname = 'public'
  ORDER BY tablename, policyname
  LIMIT 50;
`);
console.log('Mgmt API status:', check.status);
console.log('Response:', check.body.substring(0, 500));
