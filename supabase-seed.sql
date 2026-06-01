-- ============================================================
-- 4CGRC Bank Demo — Seed Data
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run (ON CONFLICT DO NOTHING)
-- ============================================================

-- ─── BRANCHES (25 UAE branches) ──────────────────────────────
INSERT INTO public.branches (id, name, emirate, type, status, score, lat, lng, incidents, overdue, last_inspection, manager)
VALUES
  ('BR-001','Al Reem Island Branch','Abu Dhabi','Main Branch','compliant',91,24.5007,54.4049,4,2,'2025-05-28','Ahmed Al Mazrouei'),
  ('BR-002','DIFC Branch','Dubai','Main Branch','compliant',87,25.2123,55.2797,6,3,'2025-05-30','Sara Al Hosani'),
  ('BR-003','Khalidiyah Branch','Abu Dhabi','Branch','critical',54,24.4736,54.3625,18,14,'2025-05-10','Mohammed Al Suwaidi'),
  ('BR-004','Gold Souk Branch','Dubai','Branch','warning',72,25.2869,55.3097,11,8,'2025-05-22','Fatima Al Nuaimi'),
  ('BR-005','Yas Mall Branch','Abu Dhabi','Mall Branch','compliant',88,24.4885,54.6080,5,2,'2025-05-27','Khalid Al Mansoori'),
  ('BR-006','Deira Branch','Dubai','Branch','warning',63,25.2697,55.3094,14,10,'2025-05-15','Noura Al Kaabi'),
  ('BR-007','Al Wahda Mall Branch','Abu Dhabi','Mall Branch','compliant',76,24.4874,54.3712,8,4,'2025-05-29','Ahmed Al Mazrouei'),
  ('BR-008','JBR Branch','Dubai','Main Branch','compliant',82,25.0787,55.1320,7,3,'2025-05-26','Sara Al Hosani'),
  ('BR-009','Al Ain Central Branch','Abu Dhabi','Branch','warning',68,24.2075,55.7447,12,9,'2025-05-18','Hamad Al Dhaheri'),
  ('BR-010','Blue Waters Branch','Dubai','Branch','compliant',91,25.0799,55.1253,3,1,'2025-05-31','Sara Al Hosani'),
  ('BR-011','Sharjah Central Branch','Sharjah','Main Branch','warning',61,25.3573,55.3910,15,11,'2025-05-20','Ali Al Shamsi'),
  ('BR-012','Ajman Corniche Branch','Ajman','Branch','critical',58,25.4052,55.4352,19,16,'2025-05-08','Mariam Al Rashidi'),
  ('BR-013','RAK Main Branch','Ras Al Khaimah','Main Branch','compliant',74,25.7895,55.9432,9,5,'2025-05-25','Yousef Al Qasimi'),
  ('BR-014','Fujairah Port Branch','Fujairah','Branch','compliant',79,25.1288,56.3361,7,3,'2025-05-24','Maryam Al Blooshi'),
  ('BR-015','Downtown Dubai Branch','Dubai','Main Branch','compliant',85,25.1972,55.2796,6,2,'2025-05-29','Fatima Al Nuaimi'),
  ('BR-016','Al Reef Mall Branch','Abu Dhabi','Mall Branch','warning',70,24.3986,54.6147,13,9,'2025-05-17','Khalid Al Mansoori'),
  ('BR-017','Business Bay Branch','Dubai','Main Branch','compliant',89,25.1884,55.2660,4,2,'2025-05-30','Noura Al Kaabi'),
  ('BR-018','Mussafah Branch','Abu Dhabi','Branch','critical',56,24.3483,54.4865,21,18,'2025-05-05','Ahmed Al Mazrouei'),
  ('BR-019','Dragon Mart Branch','Dubai','Mall Branch','compliant',77,25.1617,55.4136,8,4,'2025-05-28','Sara Al Hosani'),
  ('BR-020','Umm Al Quwain Branch','Umm Al Quwain','Branch','warning',73,25.5647,55.5534,10,7,'2025-05-21','Hassan Al Muaini'),
  ('BR-021','Al Barsha Branch','Dubai','Branch','compliant',83,25.1175,55.1967,6,3,'2025-05-27','Fatima Al Nuaimi'),
  ('BR-022','Madinat Zayed Branch','Abu Dhabi','Branch','warning',65,23.6825,53.7132,14,10,'2025-05-16','Mohammed Al Suwaidi'),
  ('BR-023','Nad Al Sheba Branch','Dubai','Branch','compliant',78,25.1664,55.3167,8,4,'2025-05-26','Ali Al Shamsi'),
  ('BR-024','Qasr Al Hosn Branch','Abu Dhabi','Main Branch','compliant',93,24.4884,54.3537,2,0,'2025-05-31','Khalid Al Mansoori'),
  ('BR-025','Sharjah Airport Branch','Sharjah','Branch','warning',69,25.3252,55.5141,12,8,'2025-05-19','Mariam Al Rashidi')
ON CONFLICT (id) DO NOTHING;

-- ─── ATMS (15 UAE ATMs) ──────────────────────────────────────
INSERT INTO public.atms (id, name, emirate, location, model, status, lat, lng, incidents, last_serviced)
VALUES
  ('ATM-001','Abu Dhabi Airport T1 ATM','Abu Dhabi','Abu Dhabi International Airport T1','NCR SelfServ 80','Online',24.4428,54.6481,3,'2025-05-28'),
  ('ATM-002','Mall of the Emirates ATM','Dubai','Mall of the Emirates','Diebold Nixdorf DN200','Online',25.1182,55.2003,2,'2025-05-27'),
  ('ATM-003','Dubai Metro Union Station ATM','Dubai','Dubai Metro – Union Station','NCR SelfServ 68','Offline',25.2654,55.3130,7,'2025-05-18'),
  ('ATM-004','Yas Mall ATM','Abu Dhabi','Yas Mall — Ground Floor','Hyosung MX5600XP','Online',24.4858,54.6064,1,'2025-05-30'),
  ('ATM-005','Al Wahda Mall ATM','Abu Dhabi','Al Wahda Mall — Entrance B','NCR SelfServ 80','Online',24.4869,54.3710,4,'2025-05-25'),
  ('ATM-006','Gold Souk Metro ATM','Dubai','Gold Souk Metro — Dubai','Diebold Nixdorf DN200','Offline',25.2881,55.3027,9,'2025-05-12'),
  ('ATM-007','ADNEC ATM','Abu Dhabi','ADNEC Convention Centre','NCR SelfServ 68','Online',24.4586,54.6138,2,'2025-05-28'),
  ('ATM-008','Dubai Airport T3 ATM','Dubai','Dubai International Airport T3','Wincor Nixdorf CINEO C4060','Online',25.2528,55.3644,3,'2025-05-29'),
  ('ATM-009','Sharjah City Centre ATM','Sharjah','Sharjah City Centre','NCR SelfServ 80','Online',25.3281,55.3802,5,'2025-05-24'),
  ('ATM-010','Ajman City Centre ATM','Ajman','Ajman City Centre Mall','Hyosung MX5600XP','Offline',25.4097,55.4416,11,'2025-05-08'),
  ('ATM-011','RAK City Centre ATM','Ras Al Khaimah','RAK City Centre','Diebold Nixdorf DN200','Online',25.6744,55.9944,4,'2025-05-23'),
  ('ATM-012','Fujairah Mall ATM','Fujairah','Fujairah Mall Entrance','NCR SelfServ 68','Online',25.1211,56.3418,3,'2025-05-22'),
  ('ATM-013','Marina Mall ATM','Abu Dhabi','Marina Mall — Corniche','NCR SelfServ 80','Online',24.4762,54.3237,2,'2025-05-27'),
  ('ATM-014','JBR Beach Kiosk ATM','Dubai','Jumeirah Beach Road Kiosk','Wincor Nixdorf CINEO C4060','Online',25.2048,55.2397,2,'2025-05-28'),
  ('ATM-015','Mussafah Industrial ATM','Abu Dhabi','Mussafah Industrial Area','Diebold Nixdorf DN200','Online',24.3527,54.4970,8,'2025-05-19')
ON CONFLICT (id) DO NOTHING;

-- ─── VENDORS (with explicit UUIDs for FK references) ─────────
INSERT INTO public.vendors (id, name, category, status, sla_target, sla_actual, active_orders, contract_end, rating)
VALUES
  ('a1000001-0000-0000-0000-000000000001','AlMansoori Facilities','Cleaning & Janitorial','SLA Breach',24,31.0,14,'2025-12-31',3.1),
  ('a1000001-0000-0000-0000-000000000002','Securitas Gulf','Security Services','Active',4,3.8,7,'2026-03-31',4.6),
  ('a1000001-0000-0000-0000-000000000003','NCR Gulf Solutions','ATM Servicing','Active',8,7.2,22,'2026-06-30',4.4),
  ('a1000001-0000-0000-0000-000000000004','Emirates FM Services','Facilities Maintenance','SLA Breach',48,52.0,18,'2025-09-30',3.3),
  ('a1000001-0000-0000-0000-000000000005','Diebold Nixdorf Gulf','ATM Hardware','Active',12,11.4,9,'2026-01-31',4.2),
  ('a1000001-0000-0000-0000-000000000006','Al Futtaim Facilities','Building Maintenance','Active',72,68.0,6,'2026-02-28',4.5),
  ('a1000001-0000-0000-0000-000000000007','Gulf Print & Branding','Signage & Branding','SLA Breach',96,104.0,8,'2025-11-30',3.0),
  ('a1000001-0000-0000-0000-000000000008','ENOC Gulf Maintenance','Electrical & Plumbing','Active',36,33.0,5,'2026-04-30',4.7)
ON CONFLICT (id) DO NOTHING;

-- ─── WORK ORDERS ─────────────────────────────────────────────
INSERT INTO public.work_orders (order_id, vendor_id, title, location, category, status, raised_date, due_date)
VALUES
  ('WO-9841','a1000001-0000-0000-0000-000000000001','Cleaning Service — Mussafah Branch','Mussafah Branch','Cleaning','Overdue','2025-05-01','2025-05-02'),
  ('WO-9842','a1000001-0000-0000-0000-000000000003','ATM Repair — Dubai Metro Union','ATM-003 Dubai Metro Union','ATM Repair','Overdue','2025-05-15','2025-05-15'),
  ('WO-9843','a1000001-0000-0000-0000-000000000004','Maintenance — Khalidiyah Branch','Khalidiyah Branch','Maintenance','Overdue','2025-05-10','2025-05-12'),
  ('WO-9844','a1000001-0000-0000-0000-000000000007','Signage Update — Gold Souk Branch','Gold Souk Branch','Signage','Overdue','2025-05-18','2025-05-22'),
  ('WO-9845','a1000001-0000-0000-0000-000000000002','Security Audit — DIFC Branch','DIFC Branch','Security','Completed','2025-05-20','2025-05-21'),
  ('WO-9846','a1000001-0000-0000-0000-000000000005','ATM Repair — Gold Souk Metro','ATM-006 Gold Souk Metro','ATM Repair','In Progress','2025-05-22','2025-05-23'),
  ('WO-9847','a1000001-0000-0000-0000-000000000001','Cleaning — Sharjah Central Branch','Sharjah Central Branch','Cleaning','Pending','2025-05-25','2025-05-26'),
  ('WO-9848','a1000001-0000-0000-0000-000000000006','Building Maintenance — Al Wahda Mall','Al Wahda Mall Branch','Building Maintenance','Pending','2025-05-26','2025-05-28'),
  ('WO-9849','a1000001-0000-0000-0000-000000000004','Maintenance — Ajman Corniche Branch','Ajman Corniche Branch','Maintenance','Pending','2025-05-27','2025-05-29'),
  ('WO-9850','a1000001-0000-0000-0000-000000000008','Electrical Work — RAK Main Branch','RAK Main Branch','Electrical','In Progress','2025-05-28','2025-05-30')
ON CONFLICT (order_id) DO NOTHING;

-- ─── MERCHANTS ────────────────────────────────────────────────
INSERT INTO public.merchants (name, category, emirate, location, lat, lng, status, compliance_score, last_audit, next_audit)
VALUES
  ('Carrefour UAE','POS Partner','Dubai','Mall of the Emirates, Dubai',25.1182,55.2003,'Compliant',96,'2025-05-15','2025-08-15'),
  ('LuLu Hypermarket','POS Partner','Abu Dhabi','Yas Mall, Abu Dhabi',24.4858,54.6064,'Compliant',88,'2025-05-10','2025-08-10'),
  ('Noon UAE','Loyalty Partner','Dubai','Dubai Internet City',25.1002,55.1544,'Warning',72,'2025-03-20','2025-06-20'),
  ('Emirates NBD ATM Merchant','ATM Merchant','Dubai','Gold Souk, Dubai',25.2869,55.3097,'Non-Compliant',61,'2025-04-05','2025-07-05'),
  ('Spinneys','POS Partner','Abu Dhabi','Al Reem Island, Abu Dhabi',24.5007,54.4049,'Compliant',94,'2025-05-20','2025-08-20'),
  ('ADNOC Distribution','ATM Merchant','Abu Dhabi','Multiple UAE Locations',24.4586,54.6138,'Compliant',79,'2025-04-15','2025-07-15'),
  ('Al Ansari Exchange','Loyalty Partner','Dubai','Deira, Dubai',25.2697,55.3094,'Non-Compliant',55,'2025-02-28','2025-05-28'),
  ('Etisalat Business','POS Partner','Sharjah','Sharjah Central',25.3573,55.3910,'Compliant',83,'2025-04-22','2025-07-22'),
  ('Virgin Megastore UAE','POS Partner','Dubai','Dubai Mall',25.1972,55.2796,'Compliant',91,'2025-05-18','2025-08-18'),
  ('Waitrose Emirates','POS Partner','Dubai','JBR, Dubai',25.0787,55.1320,'Warning',67,'2025-03-10','2025-06-10'),
  ('RAK Ceramics','ATM Merchant','Ras Al Khaimah','RAK City',25.6744,55.9944,'Compliant',85,'2025-05-05','2025-08-05'),
  ('Al Mana Fashion','Loyalty Partner','Sharjah','City Centre Sharjah',25.3281,55.3802,'Non-Compliant',48,'2025-01-15','2025-04-15')
ON CONFLICT DO NOTHING;

-- ─── SAMPLE INCIDENTS ─────────────────────────────────────────
INSERT INTO public.incidents (ticket_id, title, description, location, emirate, branch_id, type, category, department, priority, status, reported_by, assigned_to, reported_date, due_date)
VALUES
  ('TKT-001','CCTV Camera Malfunction — Vault Area','3 of 8 CCTV cameras in vault area are non-functional. Security blind spot identified.','Khalidiyah Branch','Abu Dhabi','BR-003','branch','Physical Security','Operations',  'Critical','Overdue','Ahmed Al Mazrouei','Mohammed Al Suwaidi','2025-05-10','2025-05-10'),
  ('TKT-002','AML Transaction Monitoring Alert','Automated AML system flagged 12 transactions above threshold without proper documentation.','Mussafah Branch','Abu Dhabi','BR-018','branch','Compliance','Compliance','Critical','In Progress','Compliance Team','Khalid Al Mansoori','2025-05-12','2025-05-13'),
  ('TKT-003','ATM Out of Service — Dubai Metro','ATM-003 at Dubai Metro Union station offline for 6+ days. No maintenance scheduled.','Dubai Metro – Union Station','Dubai',NULL,'atm','ATM Maintenance','IT & ATM','High','Overdue','NCR Gulf Solutions','IT Team','2025-05-15','2025-05-16'),
  ('TKT-004','Broken Queue Management System','Electronic queue system displaying wrong numbers. Manual token system in use causing delays.','Gold Souk Branch','Dubai','BR-004','branch','Customer Service','Operations','Medium','In Progress','Branch Manager','Fatima Al Nuaimi','2025-05-16','2025-05-20'),
  ('TKT-005','Damaged Signage — Exterior Fascia','Main exterior bank signage has letter damage. Brand compliance breach per CBUAE guidelines.','Ajman Corniche Branch','Ajman','BR-012','branch','Branding','Facilities','Low','Pending','Mariam Al Rashidi','Gulf Print & Branding','2025-05-18','2025-06-01'),
  ('TKT-006','Cash Replenishment Overdue — ATM-006','ATM at Gold Souk Metro has not been replenished for 16 days. Cash level critical.','Gold Souk Metro — Dubai','Dubai',NULL,'atm','Cash Management','Operations','High','In Progress','Operations Team','Diebold Nixdorf Gulf','2025-05-19','2025-05-20'),
  ('TKT-007','Staff KYC Training Not Current','7 staff members overdue for mandatory annual KYC/AML refresher training.','Deira Branch','Dubai','BR-006','branch','Staff Compliance','HR','Medium','Pending','HR Team','Noura Al Kaabi','2025-05-20','2025-05-31'),
  ('TKT-008','Fire Exit Blocked — Storage Room','Emergency fire exit in ground floor storage room blocked by equipment boxes. Safety violation.','Sharjah Central Branch','Sharjah','BR-011','branch','Health & Safety','Facilities','High','Pending','Ali Al Shamsi','Emirates FM Services','2025-05-21','2025-05-22'),
  ('TKT-009','Customer Complaint — Teller Conduct','Formal complaint received regarding unprofessional conduct by teller during transaction.','Blue Waters Branch','Dubai','BR-010','branch','Customer Service','Operations','Low','Resolved','Customer Relations','Sara Al Hosani','2025-05-22','2025-05-25'),
  ('TKT-010','Outdated Regulatory Notices','CBUAE consumer protection notices displayed are from 2023, not current 2025 version.','Al Ain Central Branch','Abu Dhabi','BR-009','branch','Regulatory Compliance','Compliance','Medium','Pending','Hamad Al Dhaheri','Compliance Team','2025-05-23','2025-06-05'),
  ('TKT-011','Security Guard Station Unmanned','Security booth at main entrance unmanned during peak hours (12:00-14:00).','Madinat Zayed Branch','Abu Dhabi','BR-022','branch','Physical Security','Security','High','Overdue','Mohammed Al Suwaidi','Securitas Gulf','2025-05-24','2025-05-25'),
  ('TKT-012','ATM Skimmer Risk — Precautionary Check','Suspected card skimming device reported by customer at Ajman City Centre ATM.','Ajman City Centre Mall','Ajman',NULL,'atm','Security','Security','Critical','In Progress','Security Team','Security Team','2025-05-25','2025-05-25'),
  ('TKT-013','Cleaning SLA Breach — Mussafah Branch','Daily cleaning not performed for 3 consecutive days. Vendor AlMansoori in breach.','Mussafah Branch','Abu Dhabi','BR-018','branch','Facilities','Facilities','Low','Overdue','Branch Manager','AlMansoori Facilities','2025-05-01','2025-05-02'),
  ('TKT-014','Accessibility Ramp Damaged','Wheelchair ramp at main entrance cracked and unusable. Accessibility compliance breach.','Al Reef Mall Branch','Abu Dhabi','BR-016','branch','Accessibility','Facilities','Medium','In Progress','Khalid Al Mansoori','Emirates FM Services','2025-05-26','2025-06-01'),
  ('TKT-015','Safe Combination Change Overdue','Vault safe combination not changed in 180+ days (policy mandates 90-day cycle).','Fujairah Port Branch','Fujairah','BR-014','branch','Physical Security','Operations','Medium','Resolved','Maryam Al Blooshi','Branch Manager','2025-05-27','2025-05-30')
ON CONFLICT (ticket_id) DO NOTHING;

-- ─── INSPECTION TEMPLATES ─────────────────────────────────────
-- Standard Branch Inspection Template
INSERT INTO public.checklist_templates (id, name, category, description, items, is_active)
VALUES
(
  'b0000001-0000-0000-0000-000000000001',
  'Standard Branch Compliance Inspection',
  'Branch',
  'Comprehensive branch inspection covering security, customer experience, branding, staff compliance, and AML/CFT requirements per CBUAE BSR 2023.',
  '[
    {
      "id": "S1", "title": "Physical Security & Safety",
      "items": [
        {"id": "S1-1", "text": "All CCTV cameras operational and covering required zones", "weight": "W5", "ref": "CBUAE/BSR/2023/4.1"},
        {"id": "S1-2", "text": "Access control system functional at all entry points", "weight": "W4", "ref": "CBUAE/BSR/2023/4.2"},
        {"id": "S1-3", "text": "Security guard present and following post order", "weight": "W4", "ref": "CBUAE/BSR/2023/4.3"},
        {"id": "S1-4", "text": "Fire exits clear, unobstructed, and marked correctly", "weight": "W5", "ref": "Dubai Civil Defence/2022"},
        {"id": "S1-5", "text": "Safe and vault combination changed within 90 days", "weight": "W3", "ref": "CBUAE/BSR/2023/4.5"},
        {"id": "S1-6", "text": "Panic button / duress alarm tested and functional", "weight": "W5", "ref": "CBUAE/BSR/2023/4.6"}
      ]
    },
    {
      "id": "S2", "title": "Customer Experience Standards",
      "items": [
        {"id": "S2-1", "text": "Queue management system operational", "weight": "W3", "ref": "CBUAE/CPR/2021/3.1"},
        {"id": "S2-2", "text": "Waiting area clean, air-conditioned, and seating adequate", "weight": "W2", "ref": "CBUAE/CPR/2021/3.2"},
        {"id": "S2-3", "text": "Accessibility ramp / disabled facilities functional", "weight": "W4", "ref": "UAE Disability Law/2006"},
        {"id": "S2-4", "text": "Customer feedback forms / complaint channel visible", "weight": "W2", "ref": "CBUAE/CPR/2021/3.4"},
        {"id": "S2-5", "text": "Average teller wait time within 10-minute SLA", "weight": "W3", "ref": "CBUAE/CPR/2021/3.5"}
      ]
    },
    {
      "id": "S3", "title": "Signage & Branding Compliance",
      "items": [
        {"id": "S3-1", "text": "Exterior fascia signage intact with no damage", "weight": "W2", "ref": "Brand Standards 2024"},
        {"id": "S3-2", "text": "Current CBUAE consumer protection notices displayed (2025 version)", "weight": "W3", "ref": "CBUAE/CPR/2021/5.1"},
        {"id": "S3-3", "text": "Product and fee schedule displayed at counters", "weight": "W3", "ref": "CBUAE/CPR/2021/5.2"},
        {"id": "S3-4", "text": "Internal branch signage consistent with brand guidelines", "weight": "W1", "ref": "Brand Standards 2024"}
      ]
    },
    {
      "id": "S4", "title": "Staff Conduct & Compliance",
      "items": [
        {"id": "S4-1", "text": "All staff wearing official uniform and ID badge", "weight": "W2", "ref": "HR Policy 2023"},
        {"id": "S4-2", "text": "Staff KYC/AML training certificates current (within 12 months)", "weight": "W4", "ref": "CBUAE/AML/2021/6.1"},
        {"id": "S4-3", "text": "Teller conduct professional and per service standards", "weight": "W3", "ref": "CBUAE/CPR/2021/4.1"},
        {"id": "S4-4", "text": "Branch manager present or authorized deputy in place", "weight": "W3", "ref": "CBUAE/BSR/2023/3.1"}
      ]
    },
    {
      "id": "S5", "title": "AML / CFT Compliance",
      "items": [
        {"id": "S5-1", "text": "Transaction monitoring alerts reviewed within 24 hours", "weight": "W5", "ref": "CBUAE/AML/2021/8.1"},
        {"id": "S5-2", "text": "Suspicious transaction reports filed correctly", "weight": "W5", "ref": "CBUAE/AML/2021/8.2"},
        {"id": "S5-3", "text": "High-risk customer files reviewed on schedule", "weight": "W4", "ref": "CBUAE/AML/2021/7.3"},
        {"id": "S5-4", "text": "PEP screening updated within required timeframe", "weight": "W4", "ref": "CBUAE/AML/2021/7.4"}
      ]
    },
    {
      "id": "S6", "title": "Document & Records Management",
      "items": [
        {"id": "S6-1", "text": "Customer files complete with current KYC documentation", "weight": "W4", "ref": "CBUAE/AML/2021/5.1"},
        {"id": "S6-2", "text": "Transaction logs and EOD reconciliation completed", "weight": "W3", "ref": "CBUAE/BSR/2023/7.1"},
        {"id": "S6-3", "text": "Previous inspection findings remediated and documented", "weight": "W3", "ref": "Internal Audit Policy"}
      ]
    }
  ]'::jsonb,
  true
),
(
  'b0000001-0000-0000-0000-000000000002',
  'ATM Compliance Inspection Checklist',
  'ATM',
  'Field inspection checklist for ATM units covering physical integrity, security, cash management, and branding per CBUAE ATM regulations.',
  '[
    {
      "id": "S1", "title": "Physical Integrity",
      "items": [
        {"id": "S1-1", "text": "ATM fascia and cabinet free from damage or tampering", "weight": "W5", "ref": "CBUAE/ATM/2022/2.1"},
        {"id": "S1-2", "text": "Card reader slot clear of skimming devices", "weight": "W5", "ref": "CBUAE/ATM/2022/2.2"},
        {"id": "S1-3", "text": "PIN pad shield in place and functional", "weight": "W5", "ref": "CBUAE/ATM/2022/2.3"},
        {"id": "S1-4", "text": "Screen functioning, no dead pixels or display errors", "weight": "W3", "ref": "CBUAE/ATM/2022/2.4"}
      ]
    },
    {
      "id": "S2", "title": "Security & Software",
      "items": [
        {"id": "S2-1", "text": "CCTV coverage of ATM area functional", "weight": "W5", "ref": "CBUAE/ATM/2022/3.1"},
        {"id": "S2-2", "text": "ATM software version current and patched", "weight": "W4", "ref": "CBUAE/ATM/2022/3.2"},
        {"id": "S2-3", "text": "Network connectivity stable, uptime above 99%", "weight": "W4", "ref": "CBUAE/ATM/2022/3.3"}
      ]
    },
    {
      "id": "S3", "title": "Cash Management",
      "items": [
        {"id": "S3-1", "text": "Cash level above minimum threshold (>20%)", "weight": "W4", "ref": "CBUAE/ATM/2022/4.1"},
        {"id": "S3-2", "text": "Cash replenishment schedule followed (max 7 days)", "weight": "W3", "ref": "CBUAE/ATM/2022/4.2"},
        {"id": "S3-3", "text": "Receipt paper loaded, printer functional", "weight": "W2", "ref": "CBUAE/ATM/2022/4.3"}
      ]
    },
    {
      "id": "S4", "title": "Branding & Customer Notice",
      "items": [
        {"id": "S4-1", "text": "Bank branding and logo displayed correctly", "weight": "W1", "ref": "Brand Standards 2024"},
        {"id": "S4-2", "text": "Transaction fee schedule displayed on ATM screen", "weight": "W3", "ref": "CBUAE/CPR/2021/5.3"}
      ]
    }
  ]'::jsonb,
  true
),
(
  'b0000001-0000-0000-0000-000000000003',
  'Customer Service Quality Audit',
  'Branch',
  'Spot-check audit focused on customer service standards, staff professionalism, and accessibility compliance.',
  '[
    {
      "id": "S1", "title": "Queue & Wait Time Management",
      "items": [
        {"id": "S1-1", "text": "Electronic queue system working correctly", "weight": "W3", "ref": "CBUAE/CPR/2021/3.1"},
        {"id": "S1-2", "text": "Average wait time below 10 minutes (observed)", "weight": "W3", "ref": "CBUAE/CPR/2021/3.5"},
        {"id": "S1-3", "text": "Priority queue for elderly / special needs customers", "weight": "W3", "ref": "UAE Disability Law/2006"}
      ]
    },
    {
      "id": "S2", "title": "Staff Professionalism",
      "items": [
        {"id": "S2-1", "text": "Staff greet customers within 30 seconds", "weight": "W2", "ref": "Service Standards 2023"},
        {"id": "S2-2", "text": "Professional dress code and ID badges worn", "weight": "W2", "ref": "HR Policy 2023"},
        {"id": "S2-3", "text": "No personal phone use during customer service", "weight": "W2", "ref": "HR Policy 2023"},
        {"id": "S2-4", "text": "Staff able to explain products and fees clearly", "weight": "W3", "ref": "CBUAE/CPR/2021/4.2"}
      ]
    },
    {
      "id": "S3", "title": "Accessibility & Inclusivity",
      "items": [
        {"id": "S3-1", "text": "Wheelchair ramp accessible and unobstructed", "weight": "W4", "ref": "UAE Disability Law/2006"},
        {"id": "S3-2", "text": "Accessible teller window available", "weight": "W3", "ref": "UAE Disability Law/2006"},
        {"id": "S3-3", "text": "Arabic language service available", "weight": "W3", "ref": "UAE Language Policy"}
      ]
    }
  ]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- ─── MAKE FIRST SIGNED-UP USER AN ADMIN ──────────────────────
-- Run this separately after signing up your first user:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
