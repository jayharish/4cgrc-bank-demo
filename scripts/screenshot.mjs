import puppeteer from 'puppeteer';
import { createClient } from '../node_modules/@supabase/supabase-js/dist/index.mjs';
import { SUPABASE_URL, SERVICE_KEY } from './_env.mjs';

// Generate a fresh magic link token
const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
  type: 'magiclink',
  email: 'jayh.jethva@gmail.com',
  options: { redirectTo: 'http://localhost:3000/' }
});
if (linkErr) { console.error('Link error:', linkErr); process.exit(1); }

const magicUrl = linkData.properties.action_link.replace(
  'http://localhost:3000',
  'http://localhost:3000'
);
console.log('Magic link ready');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Visit magic link — this exchanges the token and sets cookies/localStorage
await page.goto(magicUrl, { waitUntil: 'networkidle2', timeout: 15000 });
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: '/tmp/s1-after-login.png' });
console.log('After-login captured');

// Now go to dashboard
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: '/tmp/s2-dashboard.png' });
console.log('Dashboard captured');

// Navigate to Inspection Engine — capture console errors
const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warn') consoleErrors.push(`[${msg.type()}] ${msg.text()}`); });
await page.goto('http://localhost:3000/inspections', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2500));
console.log('Console messages:', consoleErrors.join('\n') || 'none');
await page.screenshot({ path: '/tmp/s3-inspection-top.png' });
console.log('Inspection Engine top captured');

// Scroll to templates
await page.evaluate(() => window.scrollTo(0, 500));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/tmp/s4-inspection-templates.png' });
console.log('Templates captured');

// Scroll to bottom
await page.evaluate(() => window.scrollTo(0, 2000));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: '/tmp/s5-inspection-bottom.png' });
console.log('Bottom captured');

await browser.close();
console.log('Done');
