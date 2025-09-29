import { registerStudent, findStudentByCredentials, findStudentById, authenticateAdmin } from '@/services/UserService';
import { Student } from '@/models/Student';
import { Admin } from '@/models/Admin';
import * as Database from '@/database';

// Mock database functions
jest.mock('@/database', () => ({
  executeSql: jest.fn(),
  executeSqlWrite: jest.fn()
}));

const mockExecuteSql = Database.executeSql as jest.MockedFunction<typeof Database.executeSql>;
const mockExecuteSqlWrite = Database.executeSqlWrite as jest.MockedFunction<typeof Database.executeSqlWrite>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerStudent', () => {
    it('should register a new student successfully', async () => {
      const payload = {
        name: 'John Doe',
        nim: '12345',
        password: 'password123',
        className: 'TI-1A'
      };

      mockExecuteSqlWrite.mockResolvedValue({
        insertId: 1,
        rowsAffected: 1
      } as any);

      const result = await registerStudent(payload);
      
      expect(result).toBeInstanceOf(Student);
      expect(result.nim).toBe('12345');
      expect(result.name).toBe('John Doe');
      expect(result.className).toBe('TI-1A');
      expect(mockExecuteSqlWrite).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([payload.name, payload.nim, payload.nim, payload.password, payload.className])
      );
    });

    it('should handle registration errors', async () => {
      const payload = {
        name: 'John Doe',
        nim: '12345',
        password: 'password123',
        className: 'TI-1A'
      };

      mockExecuteSqlWrite.mockRejectedValue(new Error('UNIQUE constraint failed'));

      await expect(registerStudent(payload)).rejects.toThrow('UNIQUE constraint failed');
    });
  });

  describe('findStudentByCredentials', () => {
    it('should find student with valid credentials', async () => {
      const mockRow = {
        id: 1,
        username: '12345',
        name: 'John Doe',
        nim: '12345',
        password: 'password123',
        class: 'TI-1A',
        created_at: '2024-05-02T10:00:00.000Z'
      };

      mockExecuteSql.mockResolvedValue([mockRow]);

      const result = await findStudentByCredentials('12345', 'password123');
      
      expect(result).toBeInstanceOf(Student);
      expect(result?.nim).toBe('12345');
      expect(result?.name).toBe('John Doe');
    });

    it('should return null for invalid credentials', async () => {
      const mockRow = {
        id: 1,
        username: '12345',
        name: 'John Doe',
        nim: '12345',
        password: 'password123',
        class: 'TI-1A',
        created_at: '2024-05-02T10:00:00.000Z'
      };

      mockExecuteSql.mockResolvedValue([mockRow]);

      const result = await findStudentByCredentials('12345', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null when student not found', async () => {
      mockExecuteSql.mockResolvedValue([]);

      const result = await findStudentByCredentials('99999', 'password123');
      expect(result).toBeNull();
    });
  });

  describe('findStudentById', () => {
    it('should find student by ID', async () => {
      const mockRow = {
        id: 1,
        username: '12345',
        name: 'John Doe',
        nim: '12345',
        password: 'password123',
        class: 'TI-1A',
        created_at: '2024-05-02T10:00:00.000Z'
      };

      mockExecuteSql.mockResolvedValue([mockRow]);

      const result = await findStudentById(1);
      
      expect(result).toBeInstanceOf(Student);
      expect(result?.id).toBe(1);
      expect(result?.nim).toBe('12345');
    });

    it('should return null when student not found', async () => {
      mockExecuteSql.mockResolvedValue([]);

      const result = await findStudentById(999);
      expect(result).toBeNull();
    });
  });

  describe('authenticateAdmin', () => {
    it('should authenticate admin with correct credentials', async () => {
      const mockRow = {
        id: 1,
        username: 'admin',
        name: 'Administrator',
        password: 'admin123',
        created_at: '2024-05-02T10:00:00.000Z'
      };

      mockExecuteSql.mockResolvedValue([mockRow]);

      const result = await authenticateAdmin('admin', 'admin123');
      
      expect(result).toBeInstanceOf(Admin);
      expect(result?.username).toBe('admin');
      expect(result?.name).toBe('Administrator');
    });

    it('should return null for incorrect credentials', async () => {
      const result = await authenticateAdmin('admin', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null when admin not found in database', async () => {
      mockExecuteSql.mockResolvedValue([]);

      const result = await authenticateAdmin('admin', 'admin123');
      expect(result).toBeNull();
    });
  });
});
