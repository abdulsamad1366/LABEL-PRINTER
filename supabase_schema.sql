-- Supabase SQL Database Migration Schema for LabelStudio ERP

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'Production Manager',
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  name TEXT NOT NULL,
  template_json JSONB NOT NULL,
  elements_json JSONB NOT NULL,
  csv_data_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- 3. Create Custom Templates Table
CREATE TABLE IF NOT EXISTS public.custom_templates (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  size_code TEXT NOT NULL,
  width_mm NUMERIC NOT NULL,
  height_mm NUMERIC NOT NULL,
  across INT NOT NULL,
  rows INT NOT NULL,
  margin_top_mm NUMERIC DEFAULT 0,
  margin_left_mm NUMERIC DEFAULT 0,
  col_gap_mm NUMERIC DEFAULT 0,
  row_gap_mm NUMERIC DEFAULT 0,
  finish TEXT DEFAULT 'Uncoated 70',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates viewable by everyone" ON public.custom_templates FOR SELECT USING (true);
CREATE POLICY "Authenticated users insert templates" ON public.custom_templates FOR INSERT WITH CHECK (true);

-- 4. Create Inventory Stock Table
CREATE TABLE IF NOT EXISTS public.inventory_stock (
  id TEXT PRIMARY KEY,
  finish TEXT NOT NULL UNIQUE,
  sheet_count INT DEFAULT 0,
  min_threshold INT DEFAULT 100,
  unit_cost TEXT,
  status TEXT DEFAULT 'In Stock',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inventory viewable by everyone" ON public.inventory_stock FOR SELECT USING (true);
CREATE POLICY "Inventory updateable by authenticated users" ON public.inventory_stock FOR UPDATE USING (true);

-- Insert Seed Inventory Data
INSERT INTO public.inventory_stock (id, finish, sheet_count, min_threshold, unit_cost, status) VALUES
  ('st_1', 'Uncoated 70', 1450, 200, '₹4.50 / A4 sheet', 'In Stock'),
  ('st_2', 'Fluorescent 75', 420, 100, '₹6.20 / A4 sheet', 'In Stock'),
  ('st_3', 'Gloss Paper 80', 890, 150, '₹5.80 / A4 sheet', 'In Stock'),
  ('st_4', 'Kraft', 95, 100, '₹5.00 / A4 sheet', 'Low Stock'),
  ('st_5', 'Pet Translucent', 310, 50, '₹12.00 / A4 sheet', 'In Stock'),
  ('st_6', 'Pet Silver Matte', 30, 50, '₹15.00 / A4 sheet', 'Critical')
ON CONFLICT (finish) DO NOTHING;

-- 5. Create Print Audit Logs Table
CREATE TABLE IF NOT EXISTS public.print_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_name TEXT NOT NULL,
  size_code TEXT NOT NULL,
  label_count INT NOT NULL,
  output_mode TEXT NOT NULL,
  operator_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.print_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audit logs viewable by authenticated users" ON public.print_audit_logs FOR SELECT USING (true);
CREATE POLICY "Audit logs insertable by anyone" ON public.print_audit_logs FOR INSERT WITH CHECK (true);

-- 6. Create User Login History Table (FOR USER LOGIN AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.user_login_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT NOT NULL,
  user_role TEXT,
  login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_agent TEXT
);

ALTER TABLE public.user_login_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Login history viewable by everyone" ON public.user_login_history FOR SELECT USING (true);
CREATE POLICY "Login history insertable by anyone" ON public.user_login_history FOR INSERT WITH CHECK (true);
