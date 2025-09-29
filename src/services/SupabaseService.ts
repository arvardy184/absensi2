import { supabase, Database } from '@/config/supabase';
import { AttendanceRecord } from '@/models/AttendanceRecord';
import { Student } from '@/models/Student';
import { Admin } from '@/models/Admin';
import { AttendanceStatus } from '@/constants';
import { AttendanceFilter } from '@/types';

// Types for database operations
type UserRow = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type AttendanceRow = Database['public']['Tables']['attendance']['Row'];
type AttendanceInsert = Database['public']['Tables']['attendance']['Insert'];

export interface AttendanceWithUserInfo {
  id: number;
  student_id: number;
  date: string;
  status: AttendanceStatus;
  reason: string | null;
  student_name: string;
  student_nim: string;
  student_class: string;
}

/**
 * Supabase Service untuk menggantikan SQLite database
 * Menggunakan Supabase sebagai backend database
 */
export class SupabaseService {
  /**
   * Authenticate user (student or admin)
   */
  static async authenticateUser(username: string, password: string): Promise<Student | Admin | null> {
    try {
      const { data, error } = await supabase.rpc('authenticate_user', {
        input_username: username,
        input_password: password
      });

      if (error) {
        console.error('Authentication error:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const user = data[0];
      
      if (user.role === 'student') {
        return new Student({
          id: user.id,
          name: user.name,
          username: user.username,
          nim: user.nim!,
          password: '', // Don't return password
          className: user.class!
        });
      } else if (user.role === 'admin') {
        return new Admin({
          id: user.id,
          name: user.name,
          username: user.username,
          password: '' // Don't return password
        });
      }

      return null;
    } catch (error) {
      console.error('Error in authenticateUser:', error);
      return null;
    }
  }

  /**
   * Register new student
   */
  static async registerStudent(
    name: string,
    username: string,
    nim: string,
    password: string,
    className: string
  ): Promise<Student | null> {
    try {
      const userData: UserInsert = {
        name,
        username,
        nim,
        password,
        class: className,
        role: 'student'
      };

      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        return null;
      }

      return new Student({
        id: data.id,
        name: data.name,
        username: data.username,
        nim: data.nim!,
        password: '',
        className: data.class!
      });
    } catch (error) {
      console.error('Error in registerStudent:', error);
      return null;
    }
  }

  /**
   * Check if username already exists
   */
  static async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking username:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkUsernameExists:', error);
      return false;
    }
  }

  /**
   * Check if NIM already exists
   */
  static async checkNimExists(nim: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('nim', nim)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking NIM:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkNimExists:', error);
      return false;
    }
  }

  /**
   * Save attendance record
   */
  static async saveAttendanceRecord(record: AttendanceRecord): Promise<AttendanceRecord> {
    try {
      const attendanceData: AttendanceInsert = {
        student_id: record.studentId,
        date: record.date,
        status: record.status,
        reason: record.reason
      };

      if (record.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('attendance')
          .update(attendanceData)
          .eq('id', record.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating attendance:', error);
          throw error;
        }

        return new AttendanceRecord({
          id: data.id,
          studentId: data.student_id,
          date: data.date,
          status: data.status as AttendanceStatus,
          reason: data.reason
        });
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('attendance')
          .insert(attendanceData)
          .select()
          .single();

        if (error) {
          console.error('Error inserting attendance:', error);
          throw error;
        }

        return new AttendanceRecord({
          id: data.id,
          studentId: data.student_id,
          date: data.date,
          status: data.status as AttendanceStatus,
          reason: data.reason
        });
      }
    } catch (error) {
      console.error('Error in saveAttendanceRecord:', error);
      throw error;
    }
  }

  /**
   * Get attendance records for a student
   */
  static async getStudentAttendance(studentId: number): Promise<AttendanceRecord[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching student attendance:', error);
        throw error;
      }

      return data.map(row => new AttendanceRecord({
        id: row.id,
        studentId: row.student_id,
        date: row.date,
        status: row.status as AttendanceStatus,
        reason: row.reason
      }));
    } catch (error) {
      console.error('Error in getStudentAttendance:', error);
      throw error;
    }
  }

  /**
   * Get attendance record for specific student and date
   */
  static async getAttendanceByStudentAndDate(
    studentId: number,
    date: string
  ): Promise<AttendanceRecord | null> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching attendance by date:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      return new AttendanceRecord({
        id: data.id,
        studentId: data.student_id,
        date: data.date,
        status: data.status as AttendanceStatus,
        reason: data.reason
      });
    } catch (error) {
      console.error('Error in getAttendanceByStudentAndDate:', error);
      throw error;
    }
  }

  /**
   * Get filtered attendance with user info (for admin)
   */
  static async getFilteredAttendance(filter: AttendanceFilter): Promise<AttendanceWithUserInfo[]> {
    try {
      const { data, error } = await supabase.rpc('get_attendance_with_user_info', {
        filter_nim: filter.nim || null,
        filter_class: filter.kelas || filter.className || null,
        filter_date_start: filter.startDate || filter.date || null,
        filter_date_end: filter.endDate || filter.date || null,
        filter_status: filter.status || null
      });

      if (error) {
        console.error('Error fetching filtered attendance:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFilteredAttendance:', error);
      throw error;
    }
  }


  /**
   * Get all unique classes (for filter dropdown)
   */
  static async getAllClasses(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('class')
        .eq('role', 'student')
        .not('class', 'is', null);

      if (error) {
        console.error('Error fetching classes:', error);
        return [];
      }

      // Get unique classes
      const classes = [...new Set(data.map(row => row.class).filter(Boolean))];
      return classes.sort();
    } catch (error) {
      console.error('Error in getAllClasses:', error);
      return [];
    }
  }
}
