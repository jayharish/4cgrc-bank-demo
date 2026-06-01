import { createClient } from '../node_modules/@supabase/supabase-js/dist/index.mjs';
import { SUPABASE_URL, SERVICE_KEY } from './_env.mjs';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const log = (msg) => process.stdout.write(`  ${msg}\n`);
const ok  = (msg) => process.stdout.write(`  ✓ ${msg}\n`);
const err = (msg) => process.stdout.write(`  ✗ ${msg}\n`);

async function upsert(table, rows, conflict = 'id') {
  const { error, count } = await supabase.from(table).upsert(rows, { onConflict: conflict, ignoreDuplicates: false });
  if (error) { err(`${table}: ${error.message}`); return false; }
  ok(`${table}: ${rows.length} rows`);
  return true;
}

// ── BRANCHES ──────────────────────────────────────────────────
const branches = [
  { id:'BR-001', name:'Al Reem Island Branch',    emirate:'Abu Dhabi',     type:'Main Branch',  status:'compliant', score:91, lat:24.5007, lng:54.4049, incidents:4,  overdue:2,  last_inspection:'2025-05-28', manager:'Ahmed Al Mazrouei' },
  { id:'BR-002', name:'DIFC Branch',              emirate:'Dubai',          type:'Main Branch',  status:'compliant', score:87, lat:25.2123, lng:55.2797, incidents:6,  overdue:3,  last_inspection:'2025-05-30', manager:'Sara Al Hosani' },
  { id:'BR-003', name:'Khalidiyah Branch',        emirate:'Abu Dhabi',     type:'Branch',       status:'critical',  score:54, lat:24.4736, lng:54.3625, incidents:18, overdue:14, last_inspection:'2025-05-10', manager:'Mohammed Al Suwaidi' },
  { id:'BR-004', name:'Gold Souk Branch',         emirate:'Dubai',          type:'Branch',       status:'warning',   score:72, lat:25.2869, lng:55.3097, incidents:11, overdue:8,  last_inspection:'2025-05-22', manager:'Fatima Al Nuaimi' },
  { id:'BR-005', name:'Yas Mall Branch',          emirate:'Abu Dhabi',     type:'Mall Branch',  status:'compliant', score:88, lat:24.4885, lng:54.6080, incidents:5,  overdue:2,  last_inspection:'2025-05-27', manager:'Khalid Al Mansoori' },
  { id:'BR-006', name:'Deira Branch',             emirate:'Dubai',          type:'Branch',       status:'warning',   score:63, lat:25.2697, lng:55.3094, incidents:14, overdue:10, last_inspection:'2025-05-15', manager:'Noura Al Kaabi' },
  { id:'BR-007', name:'Al Wahda Mall Branch',     emirate:'Abu Dhabi',     type:'Mall Branch',  status:'compliant', score:76, lat:24.4874, lng:54.3712, incidents:8,  overdue:4,  last_inspection:'2025-05-29', manager:'Ahmed Al Mazrouei' },
  { id:'BR-008', name:'JBR Branch',               emirate:'Dubai',          type:'Main Branch',  status:'compliant', score:82, lat:25.0787, lng:55.1320, incidents:7,  overdue:3,  last_inspection:'2025-05-26', manager:'Sara Al Hosani' },
  { id:'BR-009', name:'Al Ain Central Branch',   emirate:'Abu Dhabi',     type:'Branch',       status:'warning',   score:68, lat:24.2075, lng:55.7447, incidents:12, overdue:9,  last_inspection:'2025-05-18', manager:'Hamad Al Dhaheri' },
  { id:'BR-010', name:'Blue Waters Branch',       emirate:'Dubai',          type:'Branch',       status:'compliant', score:91, lat:25.0799, lng:55.1253, incidents:3,  overdue:1,  last_inspection:'2025-05-31', manager:'Sara Al Hosani' },
  { id:'BR-011', name:'Sharjah Central Branch',  emirate:'Sharjah',        type:'Main Branch',  status:'warning',   score:61, lat:25.3573, lng:55.3910, incidents:15, overdue:11, last_inspection:'2025-05-20', manager:'Ali Al Shamsi' },
  { id:'BR-012', name:'Ajman Corniche Branch',   emirate:'Ajman',          type:'Branch',       status:'critical',  score:58, lat:25.4052, lng:55.4352, incidents:19, overdue:16, last_inspection:'2025-05-08', manager:'Mariam Al Rashidi' },
  { id:'BR-013', name:'RAK Main Branch',          emirate:'Ras Al Khaimah', type:'Main Branch',  status:'compliant', score:74, lat:25.7895, lng:55.9432, incidents:9,  overdue:5,  last_inspection:'2025-05-25', manager:'Yousef Al Qasimi' },
  { id:'BR-014', name:'Fujairah Port Branch',    emirate:'Fujairah',       type:'Branch',       status:'compliant', score:79, lat:25.1288, lng:56.3361, incidents:7,  overdue:3,  last_inspection:'2025-05-24', manager:'Maryam Al Blooshi' },
  { id:'BR-015', name:'Downtown Dubai Branch',   emirate:'Dubai',          type:'Main Branch',  status:'compliant', score:85, lat:25.1972, lng:55.2796, incidents:6,  overdue:2,  last_inspection:'2025-05-29', manager:'Fatima Al Nuaimi' },
  { id:'BR-016', name:'Al Reef Mall Branch',     emirate:'Abu Dhabi',     type:'Mall Branch',  status:'warning',   score:70, lat:24.3986, lng:54.6147, incidents:13, overdue:9,  last_inspection:'2025-05-17', manager:'Khalid Al Mansoori' },
  { id:'BR-017', name:'Business Bay Branch',     emirate:'Dubai',          type:'Main Branch',  status:'compliant', score:89, lat:25.1884, lng:55.2660, incidents:4,  overdue:2,  last_inspection:'2025-05-30', manager:'Noura Al Kaabi' },
  { id:'BR-018', name:'Mussafah Branch',          emirate:'Abu Dhabi',     type:'Branch',       status:'critical',  score:56, lat:24.3483, lng:54.4865, incidents:21, overdue:18, last_inspection:'2025-05-05', manager:'Ahmed Al Mazrouei' },
  { id:'BR-019', name:'Dragon Mart Branch',      emirate:'Dubai',          type:'Mall Branch',  status:'compliant', score:77, lat:25.1617, lng:55.4136, incidents:8,  overdue:4,  last_inspection:'2025-05-28', manager:'Sara Al Hosani' },
  { id:'BR-020', name:'Umm Al Quwain Branch',    emirate:'Umm Al Quwain', type:'Branch',       status:'warning',   score:73, lat:25.5647, lng:55.5534, incidents:10, overdue:7,  last_inspection:'2025-05-21', manager:'Hassan Al Muaini' },
  { id:'BR-021', name:'Al Barsha Branch',        emirate:'Dubai',          type:'Branch',       status:'compliant', score:83, lat:25.1175, lng:55.1967, incidents:6,  overdue:3,  last_inspection:'2025-05-27', manager:'Fatima Al Nuaimi' },
  { id:'BR-022', name:'Madinat Zayed Branch',    emirate:'Abu Dhabi',     type:'Branch',       status:'warning',   score:65, lat:23.6825, lng:53.7132, incidents:14, overdue:10, last_inspection:'2025-05-16', manager:'Mohammed Al Suwaidi' },
  { id:'BR-023', name:'Nad Al Sheba Branch',     emirate:'Dubai',          type:'Branch',       status:'compliant', score:78, lat:25.1664, lng:55.3167, incidents:8,  overdue:4,  last_inspection:'2025-05-26', manager:'Ali Al Shamsi' },
  { id:'BR-024', name:'Qasr Al Hosn Branch',     emirate:'Abu Dhabi',     type:'Main Branch',  status:'compliant', score:93, lat:24.4884, lng:54.3537, incidents:2,  overdue:0,  last_inspection:'2025-05-31', manager:'Khalid Al Mansoori' },
  { id:'BR-025', name:'Sharjah Airport Branch',  emirate:'Sharjah',        type:'Branch',       status:'warning',   score:69, lat:25.3252, lng:55.5141, incidents:12, overdue:8,  last_inspection:'2025-05-19', manager:'Mariam Al Rashidi' },
];

// ── ATMS ──────────────────────────────────────────────────────
const atms = [
  { id:'ATM-001', name:'Abu Dhabi Airport T1 ATM',      emirate:'Abu Dhabi',     location:'Abu Dhabi International Airport T1', model:'NCR SelfServ 80',            status:'Online',  lat:24.4428, lng:54.6481, incidents:3,  last_serviced:'2025-05-28', uptime:88.0 },
  { id:'ATM-002', name:'Mall of the Emirates ATM',      emirate:'Dubai',          location:'Mall of the Emirates',               model:'Diebold Nixdorf DN200',        status:'Online',  lat:25.1182, lng:55.2003, incidents:2,  last_serviced:'2025-05-27', uptime:91.0 },
  { id:'ATM-003', name:'Dubai Metro Union Station ATM', emirate:'Dubai',          location:'Dubai Metro – Union Station',        model:'NCR SelfServ 68',              status:'Offline', lat:25.2654, lng:55.3130, incidents:7,  last_serviced:'2025-05-18', uptime:52.0 },
  { id:'ATM-004', name:'Yas Mall ATM',                  emirate:'Abu Dhabi',     location:'Yas Mall — Ground Floor',            model:'Hyosung MX5600XP',             status:'Online',  lat:24.4858, lng:54.6064, incidents:1,  last_serviced:'2025-05-30', uptime:94.0 },
  { id:'ATM-005', name:'Al Wahda Mall ATM',             emirate:'Abu Dhabi',     location:'Al Wahda Mall — Entrance B',         model:'NCR SelfServ 80',              status:'Online',  lat:24.4869, lng:54.3710, incidents:4,  last_serviced:'2025-05-25', uptime:82.0 },
  { id:'ATM-006', name:'Gold Souk Metro ATM',           emirate:'Dubai',          location:'Gold Souk Metro — Dubai',            model:'Diebold Nixdorf DN200',        status:'Offline', lat:25.2881, lng:55.3027, incidents:9,  last_serviced:'2025-05-12', uptime:47.0 },
  { id:'ATM-007', name:'ADNEC ATM',                     emirate:'Abu Dhabi',     location:'ADNEC Convention Centre',            model:'NCR SelfServ 68',              status:'Online',  lat:24.4586, lng:54.6138, incidents:2,  last_serviced:'2025-05-28', uptime:90.0 },
  { id:'ATM-008', name:'Dubai Airport T3 ATM',          emirate:'Dubai',          location:'Dubai International Airport T3',     model:'Wincor Nixdorf CINEO C4060',   status:'Online',  lat:25.2528, lng:55.3644, incidents:3,  last_serviced:'2025-05-29', uptime:87.0 },
  { id:'ATM-009', name:'Sharjah City Centre ATM',       emirate:'Sharjah',        location:'Sharjah City Centre',                model:'NCR SelfServ 80',              status:'Online',  lat:25.3281, lng:55.3802, incidents:5,  last_serviced:'2025-05-24', uptime:75.0 },
  { id:'ATM-010', name:'Ajman City Centre ATM',         emirate:'Ajman',          location:'Ajman City Centre Mall',             model:'Hyosung MX5600XP',             status:'Offline', lat:25.4097, lng:55.4416, incidents:11, last_serviced:'2025-05-08', uptime:44.0 },
  { id:'ATM-011', name:'RAK City Centre ATM',           emirate:'Ras Al Khaimah', location:'RAK City Centre',                    model:'Diebold Nixdorf DN200',        status:'Online',  lat:25.6744, lng:55.9944, incidents:4,  last_serviced:'2025-05-23', uptime:79.0 },
  { id:'ATM-012', name:'Fujairah Mall ATM',             emirate:'Fujairah',       location:'Fujairah Mall Entrance',             model:'NCR SelfServ 68',              status:'Online',  lat:25.1211, lng:56.3418, incidents:3,  last_serviced:'2025-05-22', uptime:83.0 },
  { id:'ATM-013', name:'Marina Mall ATM',               emirate:'Abu Dhabi',     location:'Marina Mall — Corniche',             model:'NCR SelfServ 80',              status:'Online',  lat:24.4762, lng:54.3237, incidents:2,  last_serviced:'2025-05-27', uptime:89.0 },
  { id:'ATM-014', name:'JBR Beach Kiosk ATM',           emirate:'Dubai',          location:'Jumeirah Beach Road Kiosk',          model:'Wincor Nixdorf CINEO C4060',   status:'Online',  lat:25.2048, lng:55.2397, incidents:2,  last_serviced:'2025-05-28', uptime:86.0 },
  { id:'ATM-015', name:'Mussafah Industrial ATM',       emirate:'Abu Dhabi',     location:'Mussafah Industrial Area',           model:'Diebold Nixdorf DN200',        status:'Online',  lat:24.3527, lng:54.4970, incidents:8,  last_serviced:'2025-05-19', uptime:61.0 },
];

// ── VENDORS ───────────────────────────────────────────────────
const vendors = [
  { id:'a1000001-0000-0000-0000-000000000001', name:'AlMansoori Facilities',  category:'Cleaning & Janitorial',   status:'SLA Breach', sla_target:24,  sla_actual:31.0,  active_orders:14, contract_end:'2025-12-31', rating:3.1 },
  { id:'a1000001-0000-0000-0000-000000000002', name:'Securitas Gulf',          category:'Security Services',        status:'Active',     sla_target:4,   sla_actual:3.8,   active_orders:7,  contract_end:'2026-03-31', rating:4.6 },
  { id:'a1000001-0000-0000-0000-000000000003', name:'NCR Gulf Solutions',      category:'ATM Servicing',            status:'Active',     sla_target:8,   sla_actual:7.2,   active_orders:22, contract_end:'2026-06-30', rating:4.4 },
  { id:'a1000001-0000-0000-0000-000000000004', name:'Emirates FM Services',    category:'Facilities Maintenance',   status:'SLA Breach', sla_target:48,  sla_actual:52.0,  active_orders:18, contract_end:'2025-09-30', rating:3.3 },
  { id:'a1000001-0000-0000-0000-000000000005', name:'Diebold Nixdorf Gulf',    category:'ATM Hardware',             status:'Active',     sla_target:12,  sla_actual:11.4,  active_orders:9,  contract_end:'2026-01-31', rating:4.2 },
  { id:'a1000001-0000-0000-0000-000000000006', name:'Al Futtaim Facilities',   category:'Building Maintenance',     status:'Active',     sla_target:72,  sla_actual:68.0,  active_orders:6,  contract_end:'2026-02-28', rating:4.5 },
  { id:'a1000001-0000-0000-0000-000000000007', name:'Gulf Print & Branding',   category:'Signage & Branding',       status:'SLA Breach', sla_target:96,  sla_actual:104.0, active_orders:8,  contract_end:'2025-11-30', rating:3.0 },
  { id:'a1000001-0000-0000-0000-000000000008', name:'ENOC Gulf Maintenance',   category:'Electrical & Plumbing',    status:'Active',     sla_target:36,  sla_actual:33.0,  active_orders:5,  contract_end:'2026-04-30', rating:4.7 },
];

// ── WORK ORDERS ───────────────────────────────────────────────
const workOrders = [
  { order_id:'WO-9841', vendor_id:'a1000001-0000-0000-0000-000000000001', vendor_name:'AlMansoori Facilities',  title:'Cleaning Service — Mussafah Branch',          location:'Mussafah Branch',              category:'Cleaning',          status:'Overdue',     raised_date:'2025-05-01', due_date:'2025-05-02' },
  { order_id:'WO-9842', vendor_id:'a1000001-0000-0000-0000-000000000003', vendor_name:'NCR Gulf Solutions',      title:'ATM Repair — Dubai Metro Union',               location:'ATM-003 Dubai Metro Union',    category:'ATM Repair',         status:'Overdue',     raised_date:'2025-05-15', due_date:'2025-05-15' },
  { order_id:'WO-9843', vendor_id:'a1000001-0000-0000-0000-000000000004', vendor_name:'Emirates FM Services',    title:'Maintenance — Khalidiyah Branch',              location:'Khalidiyah Branch',            category:'Maintenance',        status:'Overdue',     raised_date:'2025-05-10', due_date:'2025-05-12' },
  { order_id:'WO-9844', vendor_id:'a1000001-0000-0000-0000-000000000007', vendor_name:'Gulf Print & Branding',   title:'Signage Update — Gold Souk Branch',            location:'Gold Souk Branch',             category:'Signage',            status:'Overdue',     raised_date:'2025-05-18', due_date:'2025-05-22' },
  { order_id:'WO-9845', vendor_id:'a1000001-0000-0000-0000-000000000002', vendor_name:'Securitas Gulf',          title:'Security Audit — DIFC Branch',                 location:'DIFC Branch',                  category:'Security',           status:'Completed',   raised_date:'2025-05-20', due_date:'2025-05-21' },
  { order_id:'WO-9846', vendor_id:'a1000001-0000-0000-0000-000000000005', vendor_name:'Diebold Nixdorf Gulf',    title:'ATM Repair — Gold Souk Metro',                 location:'ATM-006 Gold Souk Metro',      category:'ATM Repair',         status:'In Progress', raised_date:'2025-05-22', due_date:'2025-05-23' },
  { order_id:'WO-9847', vendor_id:'a1000001-0000-0000-0000-000000000001', vendor_name:'AlMansoori Facilities',  title:'Cleaning — Sharjah Central Branch',            location:'Sharjah Central Branch',       category:'Cleaning',           status:'Pending',     raised_date:'2025-05-25', due_date:'2025-05-26' },
  { order_id:'WO-9848', vendor_id:'a1000001-0000-0000-0000-000000000006', vendor_name:'Al Futtaim Facilities',   title:'Building Maintenance — Al Wahda Mall',         location:'Al Wahda Mall Branch',         category:'Building Maintenance',status:'Pending',     raised_date:'2025-05-26', due_date:'2025-05-28' },
  { order_id:'WO-9849', vendor_id:'a1000001-0000-0000-0000-000000000004', vendor_name:'Emirates FM Services',    title:'Maintenance — Ajman Corniche Branch',          location:'Ajman Corniche Branch',        category:'Maintenance',        status:'Pending',     raised_date:'2025-05-27', due_date:'2025-05-29' },
  { order_id:'WO-9850', vendor_id:'a1000001-0000-0000-0000-000000000008', vendor_name:'ENOC Gulf Maintenance',   title:'Electrical Work — RAK Main Branch',            location:'RAK Main Branch',              category:'Electrical',         status:'In Progress', raised_date:'2025-05-28', due_date:'2025-05-30' },
];

// ── MERCHANTS ─────────────────────────────────────────────────
const merchants = [
  { name:'Carrefour UAE',              category:'POS Partner',    emirate:'Dubai',          location:'Mall of the Emirates, Dubai',   lat:25.1182, lng:55.2003, status:'Compliant',     compliance_score:96, last_audit:'2025-05-15', next_audit:'2025-08-15' },
  { name:'LuLu Hypermarket',           category:'POS Partner',    emirate:'Abu Dhabi',     location:'Yas Mall, Abu Dhabi',            lat:24.4858, lng:54.6064, status:'Compliant',     compliance_score:88, last_audit:'2025-05-10', next_audit:'2025-08-10' },
  { name:'Noon UAE',                   category:'Loyalty Partner', emirate:'Dubai',          location:'Dubai Internet City',            lat:25.1002, lng:55.1544, status:'Review Due',    compliance_score:72, last_audit:'2025-03-20', next_audit:'2025-06-20' },
  { name:'Emirates NBD ATM Merchant',  category:'ATM Merchant',   emirate:'Dubai',          location:'Gold Souk, Dubai',               lat:25.2869, lng:55.3097, status:'Non-Compliant', compliance_score:61, last_audit:'2025-04-05', next_audit:'2025-07-05' },
  { name:'Spinneys',                   category:'POS Partner',    emirate:'Abu Dhabi',     location:'Al Reem Island, Abu Dhabi',      lat:24.5007, lng:54.4049, status:'Compliant',     compliance_score:94, last_audit:'2025-05-20', next_audit:'2025-08-20' },
  { name:'ADNOC Distribution',         category:'ATM Merchant',   emirate:'Abu Dhabi',     location:'Multiple UAE Locations',         lat:24.4586, lng:54.6138, status:'Compliant',     compliance_score:79, last_audit:'2025-04-15', next_audit:'2025-07-15' },
  { name:'Al Ansari Exchange',         category:'Loyalty Partner', emirate:'Dubai',          location:'Deira, Dubai',                   lat:25.2697, lng:55.3094, status:'Non-Compliant', compliance_score:55, last_audit:'2025-02-28', next_audit:'2025-05-28' },
  { name:'Etisalat Business',          category:'POS Partner',    emirate:'Sharjah',        location:'Sharjah Central',                lat:25.3573, lng:55.3910, status:'Compliant',     compliance_score:83, last_audit:'2025-04-22', next_audit:'2025-07-22' },
  { name:'Virgin Megastore UAE',       category:'POS Partner',    emirate:'Dubai',          location:'Dubai Mall',                     lat:25.1972, lng:55.2796, status:'Compliant',     compliance_score:91, last_audit:'2025-05-18', next_audit:'2025-08-18' },
  { name:'Waitrose Emirates',          category:'POS Partner',    emirate:'Dubai',          location:'JBR, Dubai',                     lat:25.0787, lng:55.1320, status:'Review Due',    compliance_score:67, last_audit:'2025-03-10', next_audit:'2025-06-10' },
  { name:'RAK Ceramics',               category:'ATM Merchant',   emirate:'Ras Al Khaimah', location:'RAK City',                       lat:25.6744, lng:55.9944, status:'Compliant',     compliance_score:85, last_audit:'2025-05-05', next_audit:'2025-08-05' },
  { name:'Al Mana Fashion',            category:'Loyalty Partner', emirate:'Sharjah',        location:'City Centre Sharjah',            lat:25.3281, lng:55.3802, status:'Non-Compliant', compliance_score:48, last_audit:'2025-01-15', next_audit:'2025-04-15' },
];

// ── INCIDENTS ─────────────────────────────────────────────────
const incidents = [
  { ticket_id:'TKT-001', title:'CCTV Camera Malfunction — Vault Area',         description:'3 of 8 CCTV cameras in vault area non-functional. Security blind spot identified.',                                                  location:'Khalidiyah Branch',           emirate:'Abu Dhabi', branch_id:'BR-003', type:'branch', category:'Physical Security',        department:'Operations', priority:'Critical', status:'Overdue',     reported_by:'Ahmed Al Mazrouei',   assigned_to:'Mohammed Al Suwaidi',   reported_date:'2025-05-10', due_date:'2025-05-10' },
  { ticket_id:'TKT-002', title:'AML Transaction Monitoring Alert',              description:'Automated AML system flagged 12 transactions above threshold without proper documentation.',                                          location:'Mussafah Branch',             emirate:'Abu Dhabi', branch_id:'BR-018', type:'branch', category:'Compliance',               department:'Compliance', priority:'Critical', status:'In Progress', reported_by:'Compliance Team',     assigned_to:'Khalid Al Mansoori',    reported_date:'2025-05-12', due_date:'2025-05-13' },
  { ticket_id:'TKT-003', title:'ATM Out of Service — Dubai Metro',              description:'ATM-003 at Dubai Metro Union station offline for 6+ days. No maintenance scheduled.',                                                 location:'Dubai Metro – Union Station', emirate:'Dubai',     branch_id:null,     type:'atm',    category:'ATM Maintenance',          department:'IT & ATM', priority:'High',     status:'Overdue',     reported_by:'NCR Gulf Solutions',  assigned_to:'IT Team',               reported_date:'2025-05-15', due_date:'2025-05-16' },
  { ticket_id:'TKT-004', title:'Broken Queue Management System',                description:'Electronic queue system displaying wrong numbers. Manual token system causing delays.',                                               location:'Gold Souk Branch',            emirate:'Dubai',     branch_id:'BR-004', type:'branch', category:'Customer Service',         department:'Operations', priority:'Medium',   status:'In Progress', reported_by:'Branch Manager',      assigned_to:'Fatima Al Nuaimi',      reported_date:'2025-05-16', due_date:'2025-05-20' },
  { ticket_id:'TKT-005', title:'Damaged Signage — Exterior Fascia',             description:'Main exterior bank signage has letter damage. Brand compliance breach per CBUAE guidelines.',                                         location:'Ajman Corniche Branch',       emirate:'Ajman',     branch_id:'BR-012', type:'branch', category:'Branding',                 department:'Facilities', priority:'Low',      status:'Pending',     reported_by:'Mariam Al Rashidi',   assigned_to:'Gulf Print & Branding', reported_date:'2025-05-18', due_date:'2026-06-01' },
  { ticket_id:'TKT-006', title:'Cash Replenishment Overdue — ATM-006',         description:'ATM at Gold Souk Metro has not been replenished for 16 days. Cash level critical.',                                                   location:'Gold Souk Metro — Dubai',     emirate:'Dubai',     branch_id:null,     type:'atm',    category:'Cash Management',          department:'Operations', priority:'High',     status:'In Progress', reported_by:'Operations Team',     assigned_to:'Diebold Nixdorf Gulf',  reported_date:'2025-05-19', due_date:'2025-05-20' },
  { ticket_id:'TKT-007', title:'Staff KYC Training Not Current',                description:'7 staff members overdue for mandatory annual KYC/AML refresher training.',                                                           location:'Deira Branch',                emirate:'Dubai',     branch_id:'BR-006', type:'branch', category:'Staff Compliance',         department:'HR',         priority:'Medium',   status:'Pending',     reported_by:'HR Team',             assigned_to:'Noura Al Kaabi',        reported_date:'2025-05-20', due_date:'2025-05-31' },
  { ticket_id:'TKT-008', title:'Fire Exit Blocked — Storage Room',              description:'Emergency fire exit in ground floor storage room blocked by equipment boxes. Safety violation.',                                       location:'Sharjah Central Branch',      emirate:'Sharjah',   branch_id:'BR-011', type:'branch', category:'Health & Safety',          department:'Facilities', priority:'High',     status:'Pending',     reported_by:'Ali Al Shamsi',       assigned_to:'Emirates FM Services',  reported_date:'2025-05-21', due_date:'2025-05-22' },
  { ticket_id:'TKT-009', title:'Customer Complaint — Teller Conduct',           description:'Formal complaint received regarding unprofessional conduct by teller during transaction.',                                            location:'Blue Waters Branch',          emirate:'Dubai',     branch_id:'BR-010', type:'branch', category:'Customer Service',         department:'Operations', priority:'Low',      status:'Resolved',    reported_by:'Customer Relations',  assigned_to:'Sara Al Hosani',        reported_date:'2025-05-22', due_date:'2025-05-25' },
  { ticket_id:'TKT-010', title:'Outdated Regulatory Notices',                   description:'CBUAE consumer protection notices displayed are from 2023, not current 2025 version.',                                                location:'Al Ain Central Branch',       emirate:'Abu Dhabi', branch_id:'BR-009', type:'branch', category:'Regulatory Compliance',    department:'Compliance', priority:'Medium',   status:'Pending',     reported_by:'Hamad Al Dhaheri',    assigned_to:'Compliance Team',       reported_date:'2025-05-23', due_date:'2026-06-05' },
  { ticket_id:'TKT-011', title:'Security Guard Station Unmanned',               description:'Security booth at main entrance unmanned during peak hours (12:00–14:00).',                                                           location:'Madinat Zayed Branch',        emirate:'Abu Dhabi', branch_id:'BR-022', type:'branch', category:'Physical Security',        department:'Security',   priority:'High',     status:'Overdue',     reported_by:'Mohammed Al Suwaidi', assigned_to:'Securitas Gulf',        reported_date:'2025-05-24', due_date:'2025-05-25' },
  { ticket_id:'TKT-012', title:'ATM Skimmer Risk — Precautionary Check',        description:'Suspected card skimming device reported by customer at Ajman City Centre ATM.',                                                       location:'Ajman City Centre Mall',      emirate:'Ajman',     branch_id:null,     type:'atm',    category:'Security',                 department:'Security',   priority:'Critical', status:'In Progress', reported_by:'Security Team',       assigned_to:'Security Team',         reported_date:'2025-05-25', due_date:'2025-05-25' },
  { ticket_id:'TKT-013', title:'Cleaning SLA Breach — Mussafah Branch',         description:'Daily cleaning not performed for 3 consecutive days. Vendor AlMansoori in breach.',                                                  location:'Mussafah Branch',             emirate:'Abu Dhabi', branch_id:'BR-018', type:'branch', category:'Facilities',               department:'Facilities', priority:'Low',      status:'Overdue',     reported_by:'Branch Manager',      assigned_to:'AlMansoori Facilities', reported_date:'2025-05-01', due_date:'2025-05-02' },
  { ticket_id:'TKT-014', title:'Accessibility Ramp Damaged',                    description:'Wheelchair ramp at main entrance cracked and unusable. Accessibility compliance breach.',                                             location:'Al Reef Mall Branch',         emirate:'Abu Dhabi', branch_id:'BR-016', type:'branch', category:'Accessibility',            department:'Facilities', priority:'Medium',   status:'In Progress', reported_by:'Khalid Al Mansoori',  assigned_to:'Emirates FM Services',  reported_date:'2025-05-26', due_date:'2026-06-01' },
  { ticket_id:'TKT-015', title:'Safe Combination Change Overdue',               description:'Vault safe combination not changed in 180+ days (policy mandates 90-day cycle).',                                                    location:'Fujairah Port Branch',        emirate:'Fujairah',  branch_id:'BR-014', type:'branch', category:'Physical Security',        department:'Operations', priority:'Medium',   status:'Resolved',    reported_by:'Maryam Al Blooshi',   assigned_to:'Branch Manager',        reported_date:'2025-05-27', due_date:'2025-05-30' },
];

// ── INSPECTION TEMPLATES ──────────────────────────────────────
const templates = [
  {
    id: 'b0000001-0000-0000-0000-000000000001',
    name: 'Standard Branch Compliance Inspection',
    category: 'Branch',
    description: 'Comprehensive branch inspection covering security, customer experience, branding, staff compliance, and AML/CFT per CBUAE BSR 2023.',
    version: '1.0',
    is_active: true,
    use_count: 0,
    items: [
      { id:'S1', title:'Physical Security & Safety', items:[
        {id:'S1-1',text:'All CCTV cameras operational and covering required zones',weight:'W5',ref:'CBUAE/BSR/2023/4.1'},
        {id:'S1-2',text:'Access control system functional at all entry points',weight:'W4',ref:'CBUAE/BSR/2023/4.2'},
        {id:'S1-3',text:'Security guard present and following post order',weight:'W4',ref:'CBUAE/BSR/2023/4.3'},
        {id:'S1-4',text:'Fire exits clear, unobstructed, and marked correctly',weight:'W5',ref:'Dubai Civil Defence/2022'},
        {id:'S1-5',text:'Safe and vault combination changed within 90 days',weight:'W3',ref:'CBUAE/BSR/2023/4.5'},
        {id:'S1-6',text:'Panic button / duress alarm tested and functional',weight:'W5',ref:'CBUAE/BSR/2023/4.6'},
      ]},
      { id:'S2', title:'Customer Experience Standards', items:[
        {id:'S2-1',text:'Queue management system operational',weight:'W3',ref:'CBUAE/CPR/2021/3.1'},
        {id:'S2-2',text:'Waiting area clean, air-conditioned, and seating adequate',weight:'W2',ref:'CBUAE/CPR/2021/3.2'},
        {id:'S2-3',text:'Accessibility ramp / disabled facilities functional',weight:'W4',ref:'UAE Disability Law/2006'},
        {id:'S2-4',text:'Customer feedback forms / complaint channel visible',weight:'W2',ref:'CBUAE/CPR/2021/3.4'},
        {id:'S2-5',text:'Average teller wait time within 10-minute SLA',weight:'W3',ref:'CBUAE/CPR/2021/3.5'},
      ]},
      { id:'S3', title:'Signage & Branding Compliance', items:[
        {id:'S3-1',text:'Exterior fascia signage intact with no damage',weight:'W2',ref:'Brand Standards 2024'},
        {id:'S3-2',text:'Current CBUAE consumer protection notices displayed (2025 version)',weight:'W3',ref:'CBUAE/CPR/2021/5.1'},
        {id:'S3-3',text:'Product and fee schedule displayed at counters',weight:'W3',ref:'CBUAE/CPR/2021/5.2'},
        {id:'S3-4',text:'Internal branch signage consistent with brand guidelines',weight:'W1',ref:'Brand Standards 2024'},
      ]},
      { id:'S4', title:'Staff Conduct & Compliance', items:[
        {id:'S4-1',text:'All staff wearing official uniform and ID badge',weight:'W2',ref:'HR Policy 2023'},
        {id:'S4-2',text:'Staff KYC/AML training certificates current (within 12 months)',weight:'W4',ref:'CBUAE/AML/2021/6.1'},
        {id:'S4-3',text:'Teller conduct professional and per service standards',weight:'W3',ref:'CBUAE/CPR/2021/4.1'},
        {id:'S4-4',text:'Branch manager present or authorized deputy in place',weight:'W3',ref:'CBUAE/BSR/2023/3.1'},
      ]},
      { id:'S5', title:'AML / CFT Compliance', items:[
        {id:'S5-1',text:'Transaction monitoring alerts reviewed within 24 hours',weight:'W5',ref:'CBUAE/AML/2021/8.1'},
        {id:'S5-2',text:'Suspicious transaction reports filed correctly',weight:'W5',ref:'CBUAE/AML/2021/8.2'},
        {id:'S5-3',text:'High-risk customer files reviewed on schedule',weight:'W4',ref:'CBUAE/AML/2021/7.3'},
        {id:'S5-4',text:'PEP screening updated within required timeframe',weight:'W4',ref:'CBUAE/AML/2021/7.4'},
      ]},
      { id:'S6', title:'Document & Records Management', items:[
        {id:'S6-1',text:'Customer files complete with current KYC documentation',weight:'W4',ref:'CBUAE/AML/2021/5.1'},
        {id:'S6-2',text:'Transaction logs and EOD reconciliation completed',weight:'W3',ref:'CBUAE/BSR/2023/7.1'},
        {id:'S6-3',text:'Previous inspection findings remediated and documented',weight:'W3',ref:'Internal Audit Policy'},
      ]},
    ]
  },
  {
    id: 'b0000001-0000-0000-0000-000000000002',
    name: 'ATM Compliance Inspection Checklist',
    category: 'ATM',
    description: 'Field inspection for ATM units covering physical integrity, security, cash management, and branding per CBUAE ATM regulations.',
    version: '1.0',
    is_active: true,
    use_count: 0,
    items: [
      { id:'S1', title:'Physical Integrity', items:[
        {id:'S1-1',text:'ATM fascia and cabinet free from damage or tampering',weight:'W5',ref:'CBUAE/ATM/2022/2.1'},
        {id:'S1-2',text:'Card reader slot clear of skimming devices',weight:'W5',ref:'CBUAE/ATM/2022/2.2'},
        {id:'S1-3',text:'PIN pad shield in place and functional',weight:'W5',ref:'CBUAE/ATM/2022/2.3'},
        {id:'S1-4',text:'Screen functioning, no dead pixels or display errors',weight:'W3',ref:'CBUAE/ATM/2022/2.4'},
      ]},
      { id:'S2', title:'Security & Software', items:[
        {id:'S2-1',text:'CCTV coverage of ATM area functional',weight:'W5',ref:'CBUAE/ATM/2022/3.1'},
        {id:'S2-2',text:'ATM software version current and patched',weight:'W4',ref:'CBUAE/ATM/2022/3.2'},
        {id:'S2-3',text:'Network connectivity stable, uptime above 99%',weight:'W4',ref:'CBUAE/ATM/2022/3.3'},
      ]},
      { id:'S3', title:'Cash Management', items:[
        {id:'S3-1',text:'Cash level above minimum threshold (>20%)',weight:'W4',ref:'CBUAE/ATM/2022/4.1'},
        {id:'S3-2',text:'Cash replenishment schedule followed (max 7 days)',weight:'W3',ref:'CBUAE/ATM/2022/4.2'},
        {id:'S3-3',text:'Receipt paper loaded, printer functional',weight:'W2',ref:'CBUAE/ATM/2022/4.3'},
      ]},
      { id:'S4', title:'Branding & Customer Notice', items:[
        {id:'S4-1',text:'Bank branding and logo displayed correctly',weight:'W1',ref:'Brand Standards 2024'},
        {id:'S4-2',text:'Transaction fee schedule displayed on ATM screen',weight:'W3',ref:'CBUAE/CPR/2021/5.3'},
      ]},
    ]
  },
  {
    id: 'b0000001-0000-0000-0000-000000000003',
    name: 'Customer Service Quality Audit',
    category: 'Branch',
    description: 'Spot-check audit focused on customer service standards, staff professionalism, and accessibility compliance.',
    version: '1.0',
    is_active: true,
    use_count: 0,
    items: [
      { id:'S1', title:'Queue & Wait Time Management', items:[
        {id:'S1-1',text:'Electronic queue system working correctly',weight:'W3',ref:'CBUAE/CPR/2021/3.1'},
        {id:'S1-2',text:'Average wait time below 10 minutes (observed)',weight:'W3',ref:'CBUAE/CPR/2021/3.5'},
        {id:'S1-3',text:'Priority queue for elderly / special needs customers',weight:'W3',ref:'UAE Disability Law/2006'},
      ]},
      { id:'S2', title:'Staff Professionalism', items:[
        {id:'S2-1',text:'Staff greet customers within 30 seconds',weight:'W2',ref:'Service Standards 2023'},
        {id:'S2-2',text:'Professional dress code and ID badges worn',weight:'W2',ref:'HR Policy 2023'},
        {id:'S2-3',text:'No personal phone use during customer service',weight:'W2',ref:'HR Policy 2023'},
        {id:'S2-4',text:'Staff able to explain products and fees clearly',weight:'W3',ref:'CBUAE/CPR/2021/4.2'},
      ]},
      { id:'S3', title:'Accessibility & Inclusivity', items:[
        {id:'S3-1',text:'Wheelchair ramp accessible and unobstructed',weight:'W4',ref:'UAE Disability Law/2006'},
        {id:'S3-2',text:'Accessible teller window available',weight:'W3',ref:'UAE Disability Law/2006'},
        {id:'S3-3',text:'Arabic language service available',weight:'W3',ref:'UAE Language Policy'},
      ]},
    ]
  },
];

async function fixRLSPolicies() {
  log('Fixing RLS infinite recursion via stored function...');
  // We'll use the supabase admin API to create a helper function that avoids recursion
  // This is done by updating users' app_metadata with their role
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) { err(`Could not list users: ${error.message}`); return; }

  for (const user of users.users) {
    // Get the profile role for this user
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role || 'viewer';

    // Store role in app_metadata (service role key can set this)
    await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: { role }
    });

    ok(`User ${user.email} → role: ${role} (stored in app_metadata)`);
  }
}

async function makeFirstUserAdmin() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) { err(`List users failed: ${error.message}`); return; }
  if (!users.users.length) { log('No users found yet'); return; }

  // Sort by created_at, first user gets admin
  const sorted = [...users.users].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const firstUser = sorted[0];

  // Update profiles table
  const { error: pe } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', firstUser.id);

  // Update app_metadata
  await supabase.auth.admin.updateUserById(firstUser.id, {
    app_metadata: { role: 'admin' }
  });

  if (pe) err(`Profile update failed: ${pe.message}`);
  else ok(`${firstUser.email} is now ADMIN (both profiles table + app_metadata)`);
}

async function main() {
  console.log('\n🚀 4CGRC Database Seeding\n');

  // 1. Seed all tables
  console.log('── Seeding tables ───────────────────────');
  await upsert('branches',  branches,  'id');
  await upsert('atms',      atms,      'id');
  await upsert('vendors',   vendors,   'id');
  await upsert('work_orders', workOrders, 'order_id');

  // Merchants don't have a fixed id — delete all and re-insert for clean state
  const { error: mDel } = await supabase.from('merchants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (!mDel) {
    const { error: mIns } = await supabase.from('merchants').insert(merchants);
    if (mIns) err(`merchants: ${mIns.message}`);
    else ok(`merchants: ${merchants.length} rows`);
  }

  // Incidents — upsert by ticket_id
  await upsert('incidents', incidents, 'ticket_id');

  // Templates
  await upsert('checklist_templates', templates.map(t => ({ ...t, items: t.items })), 'id');

  // 2. Fix admin + app_metadata
  console.log('\n── Fixing user roles ────────────────────');
  await makeFirstUserAdmin();
  await fixRLSPolicies();

  console.log('\n✅ Done! All data is in Supabase.\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
