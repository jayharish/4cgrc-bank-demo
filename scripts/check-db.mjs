import { createClient } from '../node_modules/@supabase/supabase-js/dist/index.mjs';
import { SUPABASE_URL, SERVICE_KEY } from './_env.mjs';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Check templates
const { data: templates, error: tErr } = await supabase
  .from('checklist_templates')
  .select('id, name, is_active, category')
  .limit(10);

console.log('Templates:', JSON.stringify(templates, null, 2));
if (tErr) console.error('Error:', tErr);

// Check RLS policies for templates
const { data: policies, error: pErr } = await supabase
  .rpc('pg_policies_for_table', { table_name: 'checklist_templates' })
  .limit(20);
if (pErr) console.log('(RLS query not available via client)');
