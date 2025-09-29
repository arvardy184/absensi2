import { AttendanceStatus } from '@/constants';
import { AttendanceRecord } from '@/models/AttendanceRecord';
import { AttendanceFilter } from '@/types';
import { SupabaseService } from '@/services/SupabaseService';

/**
 * Menyimpan record absensi ke database Supabase.
 * Mendemonstrasikan:
 * - Akses basis data dengan operasi INSERT OR UPDATE (Unit Kompetensi J.620100.021.02)
 * - Penggunaan method toPersistenceObject() dari class (Unit Kompetensi J.620100.018.02)
 * - Pengelolaan data absensi dalam array/collection (Unit Kompetensi J.620100.017.02)
 * 
 * @param record - Instance AttendanceRecord yang akan disimpan
 * @throws Error jika terjadi kesalahan saat menyimpan ke database
 */
export const saveAttendanceRecord = async (record: AttendanceRecord): Promise<AttendanceRecord> => {
  try {
    console.log('🔧 saveAttendanceRecord called with:', record);
    return await SupabaseService.saveAttendanceRecord(record);
  } catch (error) {
    console.error('❌ Error in saveAttendanceRecord:', error);
    throw error;
  }
};

/**
 * Interface untuk data absensi yang sudah diagregasi dengan informasi mahasiswa.
 * Digunakan untuk tampilan rekapitulasi admin.
 * Mendemonstrasikan penggunaan interface program (Unit Kompetensi J.620100.018.02).
 */
export interface AggregatedAttendanceRow {
  /** ID unik mahasiswa */
  student_id: number;
  /** Nomor Induk Mahasiswa */
  student_nim: string;
  /** Nama lengkap mahasiswa */
  student_name: string;
  /** Kelas mahasiswa (nullable) */
  student_class: string | null;
  /** Tanggal absensi dalam format YYYY-MM-DD */
  date: string;
  /** Status kehadiran */
  status: AttendanceStatus;
  /** Alasan jika ada (untuk izin/sakit) */
  reason: string | null;
}

/**
 * Mengambil daftar record absensi dari database.
 * Mendemonstrasikan:
 * - Method overloading dengan parameter berbeda tipe (Unit Kompetensi J.620100.018.02)
 * - Query database dengan kondisi dinamis (Unit Kompetensi J.620100.021.02)
 * - Penggunaan array untuk mengelola daftar data (Unit Kompetensi J.620100.017.02)
 * - Struktur kontrol percabangan untuk logika berbeda (Unit Kompetensi J.620100.017.02)
 */
export async function listAttendance(studentId: number): Promise<AttendanceRecord[]>;
export async function listAttendance(filter: AttendanceFilter): Promise<AttendanceRecord[]>;
export async function listAttendance(input: number | AttendanceFilter): Promise<AttendanceRecord[]> {
  if (typeof input === 'number') {
    return await SupabaseService.getStudentAttendance(input);
  }

  // For filtered attendance, use the aggregation function and convert to AttendanceRecord
  const aggregatedData = await SupabaseService.getFilteredAttendance(input);
  return aggregatedData.map(row => new AttendanceRecord({
    id: row.id,
    studentId: row.student_id,
    date: row.date,
    status: row.status,
    reason: row.reason
  }));
}

/**
 * Mengambil data absensi yang sudah diagregasi dengan informasi mahasiswa.
 * Digunakan untuk halaman rekapitulasi admin dengan fitur filter.
 * Mendemonstrasikan:
 * - JOIN query untuk menggabungkan data dari multiple table (Unit Kompetensi J.620100.021.02)
 * - Penggunaan array untuk membangun kondisi WHERE dinamis (Unit Kompetensi J.620100.017.02)
 * - Penggunaan method map untuk transformasi data (Unit Kompetensi J.620100.017.02)
 * 
 * @param filter - Filter opsional untuk menyaring data (NIM, kelas, tanggal)
 * @returns Promise yang resolve ke array data absensi teragregasi
 */
export const getAttendanceAggregation = async (
  filter: AttendanceFilter = {}
): Promise<AggregatedAttendanceRow[]> => {
  const data = await SupabaseService.getFilteredAttendance(filter);
  return data.map(row => ({
    student_id: row.student_id,
    student_nim: row.student_nim,
    student_name: row.student_name,
    student_class: row.student_class,
    date: row.date,
    status: row.status,
    reason: row.reason
  }));
};

/**
 * Get attendance record for specific student and date
 * Used to check if attendance already exists before creating new one
 */
export const getAttendanceByStudentAndDate = async (
  studentId: number,
  date: string
): Promise<AttendanceRecord | null> => {
  return await SupabaseService.getAttendanceByStudentAndDate(studentId, date);
};
