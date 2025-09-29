/**
 * Tipe untuk peran pengguna dalam sistem.
 * Mendemonstrasikan penggunaan tipe data yang sesuai (Unit Kompetensi J.620100.017.02).
 */
export type UserRole = 'student' | 'admin';

/**
 * Interface untuk properti dasar pengguna.
 * Mendemonstrasikan penggunaan interface program (Unit Kompetensi J.620100.018.02).
 */
export interface IUserProps {
  id?: number;
  username: string;
  name: string;
  password: string;
  className?: string | null;
  createdAt?: string;
}

/**
 * Abstract base class untuk semua pengguna dalam sistem absensi.
 * Mendemonstrasikan:
 * - Pemrograman berorientasi objek dengan inheritance (Unit Kompetensi J.620100.018.02)
 * - Encapsulation dengan properti private dan protected
 * - Abstract class sebagai template untuk subclass
 * - Pengelolaan hak akses properti (private, public, protected)
 */
export abstract class User {
  /** ID unik pengguna (private - hanya bisa diakses melalui getter) */
  private readonly _id?: number;
  /** Nama lengkap pengguna (private - encapsulation) */
  private readonly _name: string;
  /** Username untuk login (private - encapsulation) */
  private readonly _username: string;
  /** Password terenkripsi (private - keamanan) */
  private _password: string;
  /** Timestamp pembuatan (protected - bisa diakses subclass) */
  protected readonly createdAt: string;

  /**
   * Constructor protected - hanya bisa dipanggil oleh subclass.
   * Mendemonstrasikan inheritance dan encapsulation.
   */
  protected constructor({ id, name, username, password, createdAt }: IUserProps) {
    this._id = id;
    this._name = name;
    this._username = username;
    this._password = password;
    this.createdAt = createdAt ?? new Date().toISOString();
  }

  /** Getter untuk ID pengguna - mendemonstrasikan encapsulation */
  public get id(): number | undefined {
    return this._id;
  }

  /** Getter untuk nama pengguna - mendemonstrasikan encapsulation */
  public get name(): string {
    return this._name;
  }

  /** Getter untuk username - mendemonstrasikan encapsulation */
  public get username(): string {
    return this._username;
  }

  /**
   * Validasi password dengan kandidat yang diberikan.
   * Mendemonstrasikan enkapsulasi keamanan data sensitif.
   * 
   * @param candidate - Password kandidat untuk divalidasi
   * @returns true jika password cocok, false jika tidak
   */
  public validatePassword(candidate: string): boolean {
    return this._password === candidate;
  }

  /**
   * Mengizinkan subclass untuk mengubah password dengan tetap menjaga enkapsulasi.
   * Mendemonstrasikan protected method untuk inheritance.
   * 
   * @param newPassword - Password baru
   */
  protected updatePassword(newPassword: string): void {
    this._password = newPassword;
  }

  /**
   * Abstract getter untuk role pengguna.
   * Harus diimplementasikan oleh subclass (polymorphism).
   */
  public abstract get role(): UserRole;

  /**
   * Abstract method untuk konversi ke objek database.
   * Harus diimplementasikan oleh subclass (polymorphism).
   * Mendemonstrasikan abstract method dan polymorphism.
   */
  public abstract toPersistenceObject(): Record<string, unknown>;
}
