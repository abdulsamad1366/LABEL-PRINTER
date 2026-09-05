-- Supabase SQL Migration Script for LabelStudio ERP
-- Paste and Run this in your Supabase SQL Editor

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create User Login History Table
CREATE TABLE IF NOT EXISTS public.user_login_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_name TEXT,
  user_email TEXT NOT NULL,
  login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_agent TEXT
);

-- 3. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  template_json JSONB NOT NULL,
  elements_json JSONB NOT NULL,
  csv_data_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Custom Templates Table
CREATE TABLE IF NOT EXISTS public.custom_templates (
  id TEXT PRIMARY KEY,
  user_id UUID,
  size_code TEXT NOT NULL,
  width_mm NUMERIC NOT NULL,
  height_mm NUMERIC NOT NULL,
  across INT NOT NULL,
  rows INT NOT NULL,
  margin_top_mm NUMERIC DEFAULT 0,
  margin_bottom_mm NUMERIC DEFAULT 0,
  margin_left_mm NUMERIC DEFAULT 0,
  margin_right_mm NUMERIC DEFAULT 0,
  col_gap_mm NUMERIC DEFAULT 0,
  row_gap_mm NUMERIC DEFAULT 0,
  finish TEXT DEFAULT 'Uncoated 70',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Inventory Stock Table
CREATE TABLE IF NOT EXISTS public.inventory_stock (
  id TEXT PRIMARY KEY,
  finish TEXT NOT NULL UNIQUE,
  sheet_count INT DEFAULT 0,
  min_threshold INT DEFAULT 100,
  unit_cost TEXT,
  status TEXT DEFAULT 'In Stock',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Print Audit Logs Table
CREATE TABLE IF NOT EXISTS public.print_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_name TEXT NOT NULL,
  size_code TEXT NOT NULL,
  label_count INT NOT NULL,
  output_mode TEXT NOT NULL,
  operator_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable Row Level Security on all tables for seamless application access
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_login_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_stock DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_audit_logs DISABLE ROW LEVEL SECURITY;

-- Insert Seed Inventory Data
INSERT INTO public.inventory_stock (id, finish, sheet_count, min_threshold, unit_cost, status) VALUES
  ('st_1', 'Uncoated 70', 1450, 200, '₹4.50 / A4 sheet', 'In Stock'),
  ('st_2', 'Fluorescent 75', 420, 100, '₹6.20 / A4 sheet', 'In Stock'),
  ('st_3', 'Gloss Paper 80', 890, 150, '₹5.80 / A4 sheet', 'In Stock'),
  ('st_4', 'Kraft', 95, 100, '₹5.00 / A4 sheet', 'Low Stock'),
  ('st_5', 'Pet Translucent', 310, 50, '₹12.00 / A4 sheet', 'In Stock'),
  ('st_6', 'Pet Silver Matte', 30, 50, '₹15.00 / A4 sheet', 'Critical')
ON CONFLICT (finish) DO NOTHING;
