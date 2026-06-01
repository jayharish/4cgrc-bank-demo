-- ============================================================
-- 4CGRC — FIX RLS POLICIES (Run this FIRST)
-- ============================================================

-- ─── FIX 1: Profiles infinite recursion ──────────────────────
-- The original policy does SELECT FROM profiles INSIDE a profiles policy → infinite loop
-- Fix: use a SECURITY DEFINER function that bypasses RLS

DROP POLICY IF EXISTS "profiles_self"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin" ON public.profiles;

-- Anyone can read their own profile
CREATE POLICY "profiles_read_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can read ALL profiles (uses security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE POLICY "profiles_read_all_admin"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Admins can write (update/delete) other profiles
CREATE POLICY "profiles_write_admin"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── FIX 2: Allow reads without authentication (for demo) ─────
-- The original policies require "authenticated" role but fail before
-- session is fully initialized. Add anon-friendly reads.

-- Remove old policies and recreate with both anon and authenticated
DROP POLICY IF EXISTS "branches_read"     ON public.branches;
DROP POLICY IF EXISTS "atms_read"         ON public.atms;
DROP POLICY IF EXISTS "incidents_read"    ON public.incidents;
DROP POLICY IF EXISTS "observations_read" ON public.observations;
DROP POLICY IF EXISTS "vendors_read"      ON public.vendors;
DROP POLICY IF EXISTS "work_orders_read"  ON public.work_orders;
DROP POLICY IF EXISTS "merchants_read"    ON public.merchants;
DROP POLICY IF EXISTS "templates_read"    ON public.checklist_templates;
DROP POLICY IF EXISTS "submissions_read"  ON public.checklist_submissions;

-- All authenticated users can read core data
CREATE POLICY "branches_read"     ON public.branches    FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
CREATE POLICY "atms_read"         ON public.atms        FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
CREATE POLICY "incidents_read"    ON public.incidents   FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
CREATE POLICY "observations_read" ON public.observations FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
CREATE POLICY "vendors_read"      ON public.vendors     FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
CREATE POLICY "work_orders_read"  ON public.work_orders FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
CREATE POLICY "merchants_read"    ON public.merchants   FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
CREATE POLICY "templates_read"    ON public.checklist_templates   FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
CREATE POLICY "submissions_read"  ON public.checklist_submissions FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));

-- ─── FIX 3: Verify seed ran — re-run if tables are empty ──────
-- Quick check counts (run these as separate queries to verify):
-- SELECT COUNT(*) FROM public.branches;         -- should be 25
-- SELECT COUNT(*) FROM public.atms;             -- should be 15
-- SELECT COUNT(*) FROM public.vendors;          -- should be 8
-- SELECT COUNT(*) FROM public.merchants;        -- should be 12
-- SELECT COUNT(*) FROM public.checklist_templates; -- should be 3
