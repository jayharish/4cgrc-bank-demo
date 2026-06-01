-- ============================================================
-- 4CGRC Bank Demo — Migrations
-- Run AFTER the original supabase-schema.sql
-- ============================================================

-- Fix: allow 'Warning' status for merchants (covers 'Review Due' too)
ALTER TABLE public.merchants DROP CONSTRAINT IF EXISTS merchants_status_check;
ALTER TABLE public.merchants ADD CONSTRAINT merchants_status_check
  CHECK (status IN ('Compliant','Warning','Non-Compliant','Review Due'));

-- Fix: allow Pending status for work orders
ALTER TABLE public.work_orders DROP CONSTRAINT IF EXISTS work_orders_status_check;
ALTER TABLE public.work_orders ADD CONSTRAINT work_orders_status_check
  CHECK (status IN ('Pending','Open','In Progress','Completed','Overdue'));

-- Fix: add vendor_name text column to work orders for display without join
ALTER TABLE public.work_orders ADD COLUMN IF NOT EXISTS vendor_name TEXT;

-- Update vendor_name from vendors table
UPDATE public.work_orders wo
SET vendor_name = v.name
FROM public.vendors v
WHERE wo.vendor_id = v.id;

-- Auto-admin: make first user admin (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  user_role TEXT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  user_role := CASE WHEN user_count = 0 THEN 'admin' ELSE 'viewer' END;
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', user_role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── INSPECTION ENGINE TABLES ─────────────────────────────────
-- Already using checklist_templates + checklist_submissions with enhanced JSONB
-- Add score_breakdown column to submissions for detailed reporting
ALTER TABLE public.checklist_submissions ADD COLUMN IF NOT EXISTS score_breakdown JSONB DEFAULT '{}';
ALTER TABLE public.checklist_submissions ADD COLUMN IF NOT EXISTS tickets_created INTEGER DEFAULT 0;
ALTER TABLE public.checklist_submissions ADD COLUMN IF NOT EXISTS inspector_name TEXT;
ALTER TABLE public.checklist_submissions ADD COLUMN IF NOT EXISTS branch_name TEXT;

-- Add template_type to checklist_templates for better filtering
ALTER TABLE public.checklist_templates ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';
ALTER TABLE public.checklist_templates ADD COLUMN IF NOT EXISTS last_used DATE;
ALTER TABLE public.checklist_templates ADD COLUMN IF NOT EXISTS use_count INTEGER DEFAULT 0;
