import { ADMIN_CREDENTIALS } from '@/constants';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    nim TEXT UNIQUE,
    password TEXT NOT NULL,
    class TEXT,
    role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
    created_at TEXT NOT NULL
  );
`;

const CREATE_ATTENDANCE_TABLE = `
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('HADIR','IZIN','SAKIT','ALFA')),
    reason TEXT,
    FOREIGN KEY(student_id) REFERENCES users(id)
  );
`;

const CREATE_ATTENDANCE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance (student_id, date);
`;

let database: SQLite.Database | null = null;

/**
 * Returns the singleton SQLite database connection.
 * Only works on mobile platforms - throws on web.
 */
export const getDb = (): SQLite.Database => {
  if (Platform.OS === 'web') {
    throw new Error('SQLite not available on web platform. Use Supabase instead.');
  }
  
  if (!database) {
    database = SQLite.openDatabase('absensi.db');
  }
  return database;
};

/**
 * Initializes the database - SQLite for mobile, skip for web (uses Supabase)
 */
export const initializeDatabase = async (): Promise<void> => {
  // Skip SQLite initialization on web - we use Supabase instead
  if (Platform.OS === 'web') {
    console.log('🌐 Web platform detected - skipping SQLite, using Supabase');
    return;
  }
  
  await runMigrations();
  await ensureDefaultAdmin();
};

const runMigrations = (): Promise<void> =>
  new Promise((resolve, reject) => {
    const db = getDb();
    db.transaction(
      (tx) => {
        tx.executeSql(CREATE_USERS_TABLE);
        tx.executeSql(CREATE_ATTENDANCE_TABLE);
        tx.executeSql(CREATE_ATTENDANCE_INDEX);
      },
      (error) => reject(error),
      () => resolve()
    );
  });

const ensureDefaultAdmin = (): Promise<void> =>
  new Promise((resolve, reject) => {
    executeSql<{ id: number }>(
      'SELECT id FROM users WHERE role = ? AND username = ? LIMIT 1',
      ['admin', ADMIN_CREDENTIALS.username]
    )
      .then((rows) => {
        if (rows.length > 0) {
          resolve();
          return;
        }
        const db = getDb();
        db.transaction(
          (tx) => {
            tx.executeSql(
              'INSERT INTO users (name, username, nim, password, class, role, created_at) VALUES (?, ?, NULL, ?, NULL, \'admin\', ?)',
              [
                'Administrator',
                ADMIN_CREDENTIALS.username,
                ADMIN_CREDENTIALS.password,
                new Date().toISOString()
              ]
            );
          },
          (error) => reject(error),
          () => resolve()
        );
      })
      .catch(reject);
  });

/**
 * Helper to run SQL read queries.
 * Only works on mobile platforms.
 */
export const executeSql = <T = unknown>(sql: string, params: (string | number | null)[] = []): Promise<T[]> =>
  new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      reject(new Error('SQLite not available on web platform. Use Supabase instead.'));
      return;
    }
    
    const db = getDb();
    db.readTransaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => {
          resolve(result.rows._array as T[]);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });

/**
 * Helper to run SQL write operations and expose the native result set (for insertId, rowsAffected).
 * Only works on mobile platforms.
 */
export const executeSqlWrite = (
  sql: string,
  params: (string | number | null)[] = []
): Promise<SQLite.SQLResultSet> =>
  new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      reject(new Error('SQLite not available on web platform. Use Supabase instead.'));
      return;
    }
    
    const db = getDb();
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
