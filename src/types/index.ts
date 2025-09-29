import { AttendanceStatus } from '@/constants';

export interface AttendanceFilter {
  nim?: string;
  kelas?: string; // Changed from className to match Supabase function parameter
  className?: string; // Keep for backward compatibility
  date?: string;
  startDate?: string; // For date range filtering
  endDate?: string; // For date range filtering
  status?: AttendanceStatus;
}

export interface ImportSummary {
  importedRecords: number;
  importedStudents: number;
  skippedRecords: number;
  errors: string[];
}

export interface RawAttendanceRow {
  id?: number;
  student_id: number;
  student_nim: string;
  student_name: string;
  class: string;
  date: string;
  status: AttendanceStatus;
  reason?: string | null;
}
