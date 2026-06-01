import { createClient } from '../node_modules/@supabase/supabase-js/dist/index.mjs';
import { SUPABASE_URL, SERVICE_KEY } from './_env.mjs';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const { data, error } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: 'jayh.jethva@gmail.com',
});

if (error) { console.error(error); process.exit(1); }

// We need the token from the link to simulate a session
const hashed_token = data?.properties?.hashed_token;
const action_link = data?.properties?.action_link;
console.log(JSON.stringify({ hashed_token, action_link }, null, 2));
