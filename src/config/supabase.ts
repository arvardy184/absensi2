import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://bkpniejtzkvxjxbdewcl.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcG5pZWp0emt2eGp4YmRld2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODI1MzYsImV4cCI6MjA3NDY1ODUzNn0.xWzzS-MQgJulW6zLXXaU-4LR1lxp463BubvhyFC07gY';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          name: string;
          username: string;
          nim: string | null;
          password: string;
          class: string | null;
          role: 'student' | 'admin';
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          username: string;
          nim?: string | null;
          password: string;
          class?: string | null;
          role: 'student' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          username?: string;
          nim?: string | null;
          password?: string;
          class?: string | null;
          role?: 'student' | 'admin';
          created_at?: string;
        };
      };
      attendance: {
        Row: {
          id: number;
          student_id: number;
          date: string;
          status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALFA';
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          student_id: number;
          date: string;
          status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALFA';
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          student_id?: number;
          date?: string;
          status?: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALFA';
          reason?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
