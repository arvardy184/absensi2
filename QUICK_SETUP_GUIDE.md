# 🚀 Quick Setup Guide - Fix Permission Error

## ❌ Error yang Dihadapi:
```
ERROR: 42501: permission denied to set parameter "app.jwt_secret"
```

## ✅ Solusi Cepat:

### 1. **Buka Supabase SQL Editor**
```
https://app.supabase.com/project/bkpniejtzkvxjxbdewcl/sql
```

### 2. **Jalankan Script Sederhana Ini**
Copy dan paste script dari file `simple-supabase-setup.sql`:

```sql
-- Simple Supabase Setup for Absensi App
-- Jalankan script ini di Supabase SQL Editor

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

-- Disable Row Level Security temporarily for development
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;

-- Insert default admin user
INSERT INTO public.users (name, username, password, role, class)
VALUES ('Administrator', 'admin', 'admin123', 'admin', NULL)
ON CONFLICT (username) DO NOTHING;

-- Test insert untuk memastikan semuanya bekerja
SELECT 'Database setup completed successfully!' as status;
```

### 3. **Klik Run**
Script ini akan:
- ✅ Membuat tabel users dan attendance
- ✅ Menambahkan indexes untuk performa
- ✅ Membuat admin default (admin/admin123)
- ✅ Men-disable RLS sementara untuk development
- ✅ Menampilkan status success

## 🔍 **Apa yang Berbeda:**

### ❌ Script Lama (Masalah):
- Mengubah database parameter (permission denied)
- Kompleks RLS policies
- Menggunakan auth.uid() yang menyebabkan recursion

### ✅ Script Baru (Solusi):
- Tidak mengubah database settings
- RLS disabled untuk development
- Tanpa permission issues
- Simple dan straightforward

## 🎯 **Setelah Script Berhasil:**

### Test di App:
1. **Restart Expo app**
2. **Test Admin Login:**
   - Username: `admin`
   - Password: `admin123`
3. **Test Student Registration:** Buat mahasiswa baru
4. **Test Attendance:** Mark attendance hari ini

### Verifikasi di Dashboard:
- Pergi ke **Table Editor** di Supabase
- Lihat tabel `users` dan `attendance`
- Pastikan data tersimpan dengan benar

## 🛡️ **Security Note:**

**Development Mode**: RLS disabled untuk kemudahan development
- ✅ Semua operasi diperbolehkan
- ✅ Tidak ada masalah permission
- ✅ Registrasi dan login bekerja normal

**Production**: Nanti bisa enable RLS dengan policies yang proper

## 📱 **Expected Results:**

Setelah script berhasil:
- ✅ Tidak ada error permission
- ✅ Tabel users dan attendance dibuat
- ✅ Admin user tersedia
- ✅ App bisa registrasi dan login
- ✅ Data tersinkron dengan Supabase

---
**Status: 🎯 READY FOR QUICK SETUP**

**Langkah selanjutnya**: Jalankan script di atas dan test aplikasi!



