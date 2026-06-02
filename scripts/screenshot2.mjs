import puppeteer from 'puppeteer';
import { SUPABASE_URL, SERVICE_KEY } from './_env.mjs';
import { createClient } from '../node_modules/@supabase/supabase-js/dist/index.mjs';

const PORT = 3000;
const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: linkData } = await admin.auth.admin.generateLink({
  type: 'magiclink', email: 'jayh.jethva@gmail.com',
  options: { redirectTo: `http://localhost:${PORT}/` },
});
const magicUrl = linkData.properties.action_link;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// ── Login once ─────────────────────────────────────────────
await page.goto(magicUrl, { waitUntil: 'networkidle2', timeout: 20000 });
await new Promise(r => setTimeout(r, 3000));
console.log('Logged in at:', page.url().slice(0, 60));

async function snap(path, url, scrollY = 0) {
  await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  if (scrollY) { await page.evaluate(y => window.scrollTo(0, y), scrollY); await new Promise(r => setTimeout(r, 500)); }
  await page.screenshot({ path });
  console.log(`✓ ${path}`);
}

await snap('/tmp/ss-dashboard.png',          '/');
await snap('/tmp/ss-branches.png',           '/locations/branches');
await snap('/tmp/ss-branches-map.png',       '/locations/branches', 400);
await snap('/tmp/ss-atms.png',              '/locations/atms');
await snap('/tmp/ss-vendors.png',           '/vendors');
await snap('/tmp/ss-merchants.png',         '/merchants');
await snap('/tmp/ss-inspections.png',       '/inspections');
await snap('/tmp/ss-inspections-tmpl.png',  '/inspections', 400);

await browser.close();
console.log('\nAll done.');
