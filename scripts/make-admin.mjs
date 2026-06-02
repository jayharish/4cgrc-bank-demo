import { createClient } from '../node_modules/@supabase/supabase-js/dist/index.mjs';
import { SUPABASE_URL, SERVICE_KEY } from './_env.mjs';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const { data: { users }, error } = await supabase.auth.admin.listUsers();
if (error) { console.error(error); process.exit(1); }

// Find users whose email contains "firas" (case-insensitive)
const candidates = users.filter(u => u.email?.toLowerCase().includes('firas'));

if (candidates.length === 0) {
  console.log('No user found with "firas" in email. All users:');
  users.forEach(u => console.log(`  ${u.email} (${u.created_at})`));
  process.exit(1);
}

for (const user of candidates) {
  console.log(`Promoting ${user.email} to admin...`);

  // Update app_metadata (JWT claims)
  await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { role: 'admin' }
  });

  // Update profiles table
  await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);

  console.log(`✓ ${user.email} is now ADMIN`);
}
