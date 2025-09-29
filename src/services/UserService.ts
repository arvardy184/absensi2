import { ADMIN_CREDENTIALS } from '@/constants';
import { executeSql, executeSqlWrite } from '@/database';
import { Admin } from '@/models/Admin';
import { Student } from '@/models/Student';

/**
 * Interface untuk payload registrasi mahasiswa baru.
 * Mendemonstrasikan penggunaan interface program (Unit Kompetensi J.620100.018.02).
 */
export interface RegisterStudentPayload {
  /** Nama lengkap mahasiswa */
  name: string;
  /** Nomor Induk Mahasiswa (NIM) - digunakan sebagai username */
  nim: string;
  /** Password untuk autentikasi */
  password: string;
  /** Kelas tempat mahasiswa terdaftar */
  className: string;
}

/**
 * Mendaftarkan mahasiswa baru ke dalam database lokal SQLite.
 * Mendemonstrasikan:
 * - Akses basis data (Unit Kompetensi J.620100.021.02)
 * - Penggunaan prosedur/fungsi untuk modularitas (Unit Kompetensi J.620100.017.02)
 * - Pemrograman berorientasi objek dengan class Student (Unit Kompetensi J.620100.018.02)
 * 
 * @param payload - Data mahasiswa yang akan didaftarkan
 * @returns Promise yang resolve ke instance Student baru
 * @throws Error jika NIM sudah terdaftar atau terjadi kesalahan database
 */
export const registerStudent = async (payload: RegisterStudentPayload): Promise<Student> => {
  const now = new Date().toISOString();
  const result = await executeSqlWrite(
    'INSERT INTO users (name, username, nim, password, class, role, created_at) VALUES (?, ?, ?, ?, ?, \'student\', ?);',
    [payload.name, payload.nim, payload.nim, payload.password, payload.className, now]
  );
  const id = result.insertId ?? 0;
  return new Student({
    id,
    username: payload.nim,
    name: payload.name,
    nim: payload.nim,
    password: payload.password,
    className: payload.className,
    createdAt: now
  });
};

/**
 * Mencari dan memvalidasi kredensial mahasiswa untuk proses login.
 * Mendemonstrasikan:
 * - Query database dengan kondisi pencarian (Unit Kompetensi J.620100.021.02)
 * - Validasi password menggunakan method class (Unit Kompetensi J.620100.018.02)
 * - Penggunaan struktur kontrol percabangan if/else (Unit Kompetensi J.620100.017.02)
 * 
 * @param nim - Nomor Induk Mahasiswa
 * @param candidatePassword - Password yang akan divalidasi
 * @returns Promise yang resolve ke instance Student jika valid, null jika tidak
 */
export const findStudentByCredentials = async (
  nim: string,
  candidatePassword: string
): Promise<Student | null> => {
  const rows = await executeSql(
    'SELECT * FROM users WHERE role = \'student\' AND (nim = ? OR username = ?) LIMIT 1',
    [nim, nim]
  );
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0] as any;
  if (row.password !== candidatePassword) {
    return null;
  }
  return new Student({
    id: row.id as number,
    username: row.username as string,
    name: row.name as string,
    nim: row.nim as string,
    password: row.password as string,
    className: row.class as string,
    createdAt: row.created_at as string
  });
};

/**
 * Mencari mahasiswa berdasarkan ID unik.
 * Digunakan untuk memulihkan sesi login dari penyimpanan lokal.
 * 
 * @param id - ID unik mahasiswa di database
 * @returns Promise yang resolve ke instance Student atau null jika tidak ditemukan
 */
export const findStudentById = async (id: number): Promise<Student | null> => {
  const rows = await executeSql('SELECT * FROM users WHERE id = ? AND role = \'student\'', [id]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0] as any;
  return new Student({
    id: row.id as number,
    username: row.username as string,
    name: row.name as string,
    nim: row.nim as string,
    password: row.password as string,
    className: row.class as string,
    createdAt: row.created_at as string
  });
};

/**
 * Autentikasi admin menggunakan kredensial yang telah dikonfigurasi.
 * Mendemonstrasikan:
 * - Validasi kredensial dengan konstanta yang telah didefinisikan
 * - Penggunaan struktur kontrol percabangan untuk validasi
 * - Query database untuk mengambil data admin
 * 
 * @param username - Username admin
 * @param password - Password admin
 * @returns Promise yang resolve ke instance Admin jika valid, null jika tidak
 */
export const authenticateAdmin = async (
  username: string,
  password: string
): Promise<Admin | null> => {
  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return null;
  }
  const rows = await executeSql('SELECT * FROM users WHERE role = \'admin\' AND username = ? LIMIT 1', [
    ADMIN_CREDENTIALS.username
  ]);
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0] as any;
  return new Admin({
    id: row.id as number,
    username: row.username as string,
    name: row.name as string,
    password: row.password as string,
    className: null,
    createdAt: row.created_at as string
  });
};
