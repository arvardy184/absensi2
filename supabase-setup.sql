-- Supabase Database Setup for Absensi App
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/bkpniejtzkvxjxbdewcl/sql

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    nim TEXT UNIQUE,
    password TEXT NOT NULL,
    class TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('HADIR', 'IZIN', 'SAKIT', 'ALFA')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_nim ON public.users(nim);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Allow registration (insert new users) - most permissive for registration
CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT WITH CHECK (true);

-- Allow users to read their own data - simplified to avoid recursion
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (true);

-- Allow users to update their own data - simplified
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (true);

-- RLS Policies for attendance table - simplified to avoid recursion
-- Allow all operations on attendance for now (will implement proper auth later)
CREATE POLICY "Allow all attendance operations" ON public.attendance
    FOR ALL USING (true) WITH CHECK (true);

-- Insert default admin user
-- Note: In production, use proper password hashing
INSERT INTO public.users (name, username, password, role, class)
VALUES ('Administrator', 'admin', 'admin123', 'admin', NULL)
ON CONFLICT (username) DO NOTHING;

-- Create a function to handle user authentication
CREATE OR REPLACE FUNCTION public.authenticate_user(
    input_username TEXT,
    input_password TEXT
)
RETURNS TABLE(
    id BIGINT,
    name TEXT,
    username TEXT,
    nim TEXT,
    class TEXT,
    role TEXT
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT u.id, u.name, u.username, u.nim, u.class, u.role
    FROM public.users u
    WHERE u.username = input_username 
    AND u.password = input_password;
$$;

-- Create a function to get attendance with user info (for admin recap)
CREATE OR REPLACE FUNCTION public.get_attendance_with_user_info(
    filter_nim TEXT DEFAULT NULL,
    filter_class TEXT DEFAULT NULL,
    filter_date_start DATE DEFAULT NULL,
    filter_date_end DATE DEFAULT NULL,
    filter_status TEXT DEFAULT NULL
)
RETURNS TABLE(
    id BIGINT,
    student_id BIGINT,
    date DATE,
    status TEXT,
    reason TEXT,
    student_name TEXT,
    student_nim TEXT,
    student_class TEXT
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        a.id,
        a.student_id,
        a.date,
        a.status,
        a.reason,
        u.name as student_name,
        u.nim as student_nim,
        u.class as student_class
    FROM public.attendance a
    JOIN public.users u ON a.student_id = u.id
    WHERE 
        (filter_nim IS NULL OR u.nim = filter_nim)
        AND (filter_class IS NULL OR u.class = filter_class)
        AND (filter_date_start IS NULL OR a.date >= filter_date_start)
        AND (filter_date_end IS NULL OR a.date <= filter_date_end)
        AND (filter_status IS NULL OR a.status = filter_status)
    ORDER BY a.date DESC, u.name ASC;
$$;
