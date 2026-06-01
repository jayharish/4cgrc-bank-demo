import { createClient } from '../node_modules/@supabase/supabase-js/dist/index.mjs';
import { SUPABASE_URL, SERVICE_KEY, ANON_KEY } from './_env.mjs';

// Test with anon key (no session)
const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// Test with service key
const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const tables = ['branches', 'atms', 'vendors', 'checklist_templates', 'checklist_submissions', 'profiles', 'merchants', 'incidents'];

console.log('\n── Anon key (no session) ───────────────────────');
for (const table of tables) {
  const { data, error } = await anonClient.from(table).select('id').limit(1);
  console.log(`  ${table}: ${error ? `❌ ${error.code} ${error.message}` : `✓ (${data?.length} rows)`}`);
}

console.log('\n── Service key (Node.js) ───────────────────────');
for (const table of tables) {
  const { data, error } = await serviceClient.from(table).select('id').limit(1);
  console.log(`  ${table}: ${error ? `❌ ${error.code} ${error.message}` : `✓ (${data?.length} rows)`}`);
}
