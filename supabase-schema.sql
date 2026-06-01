-- ============================================================
-- 4CGRC Bank Demo — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES (extends auth.users) ───────────────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT,
  role        TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin','manager','auditor','viewer')),
  department  TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT true,
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── BRANCHES ────────────────────────────────────────────────
CREATE TABLE public.branches (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  emirate         TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'Branch',
  status          TEXT NOT NULL DEFAULT 'compliant' CHECK (status IN ('compliant','warning','critical')),
  score           INTEGER NOT NULL DEFAULT 80 CHECK (score BETWEEN 0 AND 100),
  lat             NUMERIC(10,6) NOT NULL,
  lng             NUMERIC(10,6) NOT NULL,
  incidents       INTEGER DEFAULT 0,
  overdue         INTEGER DEFAULT 0,
  last_inspection DATE,
  due_date        DATE,
  manager         TEXT,
  phone           TEXT,
  address         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ATMS ────────────────────────────────────────────────────
CREATE TABLE public.atms (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  emirate         TEXT NOT NULL,
  location        TEXT,
  model           TEXT,
  status          TEXT NOT NULL DEFAULT 'Online' CHECK (status IN ('Online','Offline','Maintenance')),
  cash_level      TEXT DEFAULT 'Normal' CHECK (cash_level IN ('Full','Normal','Low','Empty')),
  lat             NUMERIC(10,6) NOT NULL,
  lng             NUMERIC(10,6) NOT NULL,
  last_serviced   DATE,
  next_service    DATE,
  incidents       INTEGER DEFAULT 0,
  uptime          NUMERIC(5,2) DEFAULT 99.0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INCIDENTS ───────────────────────────────────────────────
CREATE TABLE public.incidents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id       TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  location        TEXT NOT NULL,
  emirate         TEXT NOT NULL,
  branch_id       TEXT REFERENCES public.branches(id),
  atm_id          TEXT REFERENCES public.atms(id),
  type            TEXT NOT NULL DEFAULT 'branch',
  category        TEXT NOT NULL,
  department      TEXT NOT NULL,
  priority        TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Critical')),
  status          TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','In Progress','Resolved','Overdue')),
  reported_by     TEXT,
  assigned_to     TEXT,
  reported_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date        DATE,
  resolved_date   DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OBSERVATIONS ────────────────────────────────────────────
CREATE TABLE public.observations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_id          TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  location        TEXT NOT NULL,
  emirate         TEXT NOT NULL,
  branch_id       TEXT REFERENCES public.branches(id),
  category        TEXT NOT NULL,
  department      TEXT NOT NULL,
  severity        TEXT NOT NULL DEFAULT 'Low' CHECK (severity IN ('Low','Medium','High','Critical')),
  status          TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','In Progress','Resolved','Closed')),
  reported_by     TEXT,
  assigned_to     TEXT,
  observed_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date        DATE,
  evidence_url    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VENDORS ─────────────────────────────────────────────────
CREATE TABLE public.vendors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  contact_name    TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  status          TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Warning','SLA Breach','Inactive')),
  sla_target      INTEGER DEFAULT 24,
  sla_actual      NUMERIC(5,1) DEFAULT 24.0,
  active_orders   INTEGER DEFAULT 0,
  completed       INTEGER DEFAULT 0,
  contract_value  NUMERIC(12,2),
  contract_end    DATE,
  rating          NUMERIC(3,1) DEFAULT 4.0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WORK ORDERS ─────────────────────────────────────────────
CREATE TABLE public.work_orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        TEXT UNIQUE NOT NULL,
  vendor_id       UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  location        TEXT,
  category        TEXT,
  priority        TEXT DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Critical')),
  status          TEXT DEFAULT 'Pending' CHECK (status IN ('Pending','In Progress','Completed','Overdue')),
  raised_date     DATE DEFAULT CURRENT_DATE,
  due_date        DATE,
  completed_date  DATE,
  cost            NUMERIC(10,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── MERCHANTS ───────────────────────────────────────────────
CREATE TABLE public.merchants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  emirate         TEXT NOT NULL,
  location        TEXT,
  lat             NUMERIC(10,6),
  lng             NUMERIC(10,6),
  status          TEXT NOT NULL DEFAULT 'Compliant' CHECK (status IN ('Compliant','Warning','Non-Compliant')),
  compliance_score INTEGER DEFAULT 80 CHECK (compliance_score BETWEEN 0 AND 100),
  last_audit      DATE,
  next_audit      DATE,
  contact_name    TEXT,
  contact_email   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CHECKLIST TEMPLATES ─────────────────────────────────────
CREATE TABLE public.checklist_templates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  description     TEXT,
  items           JSONB NOT NULL DEFAULT '[]',
  is_active       BOOLEAN DEFAULT true,
  created_by      UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CHECKLIST SUBMISSIONS ───────────────────────────────────
CREATE TABLE public.checklist_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id     UUID REFERENCES public.checklist_templates(id),
  branch_id       TEXT REFERENCES public.branches(id),
  atm_id          TEXT REFERENCES public.atms(id),
  submitted_by    UUID REFERENCES public.profiles(id),
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  score           INTEGER,
  status          TEXT DEFAULT 'Completed' CHECK (status IN ('Draft','Completed','Reviewed')),
  responses       JSONB NOT NULL DEFAULT '{}',
  notes           TEXT
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atms                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_submissions  ENABLE ROW LEVEL SECURITY;

-- Profiles: users see their own, admins see all
CREATE POLICY "profiles_self" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_admin" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- All authenticated users can read core data
CREATE POLICY "branches_read"     ON public.branches    FOR SELECT TO authenticated USING (true);
CREATE POLICY "atms_read"         ON public.atms        FOR SELECT TO authenticated USING (true);
CREATE POLICY "incidents_read"    ON public.incidents   FOR SELECT TO authenticated USING (true);
CREATE POLICY "observations_read" ON public.observations FOR SELECT TO authenticated USING (true);
CREATE POLICY "vendors_read"      ON public.vendors     FOR SELECT TO authenticated USING (true);
CREATE POLICY "work_orders_read"  ON public.work_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "merchants_read"    ON public.merchants   FOR SELECT TO authenticated USING (true);
CREATE POLICY "templates_read"    ON public.checklist_templates   FOR SELECT TO authenticated USING (true);
CREATE POLICY "submissions_read"  ON public.checklist_submissions FOR SELECT TO authenticated USING (true);

-- Admins and managers can write
CREATE POLICY "branches_write" ON public.branches FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "atms_write" ON public.atms FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "incidents_write" ON public.incidents FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager','auditor'))
);
CREATE POLICY "observations_write" ON public.observations FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager','auditor'))
);
CREATE POLICY "vendors_write" ON public.vendors FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "work_orders_write" ON public.work_orders FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "merchants_write" ON public.merchants FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "templates_write" ON public.checklist_templates FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "submissions_write" ON public.checklist_submissions FOR ALL TO authenticated USING (
  auth.uid() IS NOT NULL
);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_branches_updated_at     BEFORE UPDATE ON public.branches     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_atms_updated_at         BEFORE UPDATE ON public.atms         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_incidents_updated_at    BEFORE UPDATE ON public.incidents    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_observations_updated_at BEFORE UPDATE ON public.observations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_vendors_updated_at      BEFORE UPDATE ON public.vendors      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_merchants_updated_at    BEFORE UPDATE ON public.merchants    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
