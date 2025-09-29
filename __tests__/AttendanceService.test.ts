import { AttendanceRecord } from '@/models/AttendanceRecord';
import { saveAttendanceRecord, listAttendance, getAttendanceAggregation } from '@/services/AttendanceService';
import * as Database from '@/database';

// Mock database functions
jest.mock('@/database', () => ({
  executeSql: jest.fn(),
  executeSqlWrite: jest.fn()
}));

const mockExecuteSql = Database.executeSql as jest.MockedFunction<typeof Database.executeSql>;
const mockExecuteSqlWrite = Database.executeSqlWrite as jest.MockedFunction<typeof Database.executeSqlWrite>;

describe('AttendanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAttendanceRecord', () => {
    it('should save attendance record successfully', async () => {
      const record = new AttendanceRecord({
        studentId: 1,
        date: '2024-05-02',
        status: 'HADIR',
        reason: null
      });

      mockExecuteSqlWrite.mockResolvedValue({
        insertId: 1,
        rowsAffected: 1
      } as any);

      await expect(saveAttendanceRecord(record)).resolves.not.toThrow();
      expect(mockExecuteSqlWrite).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO attendance'),
        expect.any(Array)
      );
    });

    it('should handle save errors gracefully', async () => {
      const record = new AttendanceRecord({
        studentId: 1,
        date: '2024-05-02',
        status: 'HADIR'
      });

      mockExecuteSqlWrite.mockRejectedValue(new Error('Database error'));

      await expect(saveAttendanceRecord(record)).rejects.toThrow('Database error');
    });
  });

  describe('listAttendance', () => {
    it('should fetch attendance records by student ID', async () => {
      const mockRows = [
        {
          id: 1,
          student_id: 1,
          date: '2024-05-02',
          status: 'HADIR',
          reason: null
        }
      ];

      mockExecuteSql.mockResolvedValue(mockRows);

      const result = await listAttendance(1);
      expect(result).toHaveLength(1);
      expect(result[0].studentId).toBe(1);
      expect(result[0].status).toBe('HADIR');
    });

    it('should fetch attendance records with filter', async () => {
      const mockRows = [
        {
          id: 1,
          student_id: 1,
          date: '2024-05-02',
          status: 'HADIR',
          reason: null
        }
      ];

      mockExecuteSql.mockResolvedValue(mockRows);

      const result = await listAttendance({ nim: '12345', className: 'TI-1A' });
      expect(result).toHaveLength(1);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('WHERE u.nim = ? AND u.class = ?'),
        ['12345', 'TI-1A']
      );
    });
  });

  describe('getAttendanceAggregation', () => {
    it('should return aggregated attendance data', async () => {
      const mockRows = [
        {
          student_id: 1,
          nim: '12345',
          name: 'John Doe',
          class: 'TI-1A',
          date: '2024-05-02',
          status: 'HADIR',
          reason: null
        }
      ];

      mockExecuteSql.mockResolvedValue(mockRows);

      const result = await getAttendanceAggregation({ nim: '12345' });
      expect(result).toHaveLength(1);
      expect(result[0].student_nim).toBe('12345');
      expect(result[0].student_name).toBe('John Doe');
      expect(result[0].status).toBe('HADIR');
    });

    it('should handle empty results', async () => {
      mockExecuteSql.mockResolvedValue([]);

      const result = await getAttendanceAggregation();
      expect(result).toHaveLength(0);
    });
  });
});
