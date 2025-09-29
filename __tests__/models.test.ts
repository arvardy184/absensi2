import { User } from '@/models/User';
import { Student } from '@/models/Student';
import { Admin } from '@/models/Admin';
import { AttendanceRecord } from '@/models/AttendanceRecord';

describe('Models', () => {
  describe('Student', () => {
    const studentData = {
      id: 1,
      username: '12345',
      name: 'John Doe',
      password: 'password123',
      nim: '12345',
      className: 'TI-1A'
    };

    it('should create student instance with correct properties', () => {
      const student = new Student(studentData);

      expect(student.id).toBe(1);
      expect(student.name).toBe('John Doe');
      expect(student.username).toBe('12345');
      expect(student.nim).toBe('12345');
      expect(student.className).toBe('TI-1A');
      expect(student.role).toBe('student');
    });

    it('should validate password correctly', () => {
      const student = new Student(studentData);

      expect(student.validatePassword('password123')).toBe(true);
      expect(student.validatePassword('wrongpassword')).toBe(false);
    });

    it('should mark attendance correctly', () => {
      const student = new Student(studentData);
      const record = student.markAttendance('HADIR', '2024-05-02', 'Present');

      expect(record).toBeInstanceOf(AttendanceRecord);
      expect(record.studentId).toBe(1);
      expect(record.date).toBe('2024-05-02');
      expect(record.status).toBe('HADIR');
      expect(record.reason).toBe('Present');
    });

    it('should build export payload for single record', () => {
      const student = new Student(studentData);
      const record = new AttendanceRecord({
        studentId: 1,
        date: '2024-05-02',
        status: 'HADIR',
        reason: null
      });

      const payload = student.buildExportPayload(record) as any;

      expect(payload.student.nim).toBe('12345');
      expect(payload.student.name).toBe('John Doe');
      expect(payload.student.class).toBe('TI-1A');
      expect(payload.records).toHaveLength(1);
      expect(payload.exportedAt).toBeDefined();
    });

    it('should build export payload for multiple records', () => {
      const student = new Student(studentData);
      const records = [
        new AttendanceRecord({ studentId: 1, date: '2024-05-01', status: 'HADIR' }),
        new AttendanceRecord({ studentId: 1, date: '2024-05-02', status: 'IZIN', reason: 'Sick' })
      ];

      const payload = student.buildExportPayload(records) as any;

      expect(payload.records).toHaveLength(2);
      expect(payload.records[0].status).toBe('HADIR');
      expect(payload.records[1].status).toBe('IZIN');
      expect(payload.records[1].reason).toBe('Sick');
    });

    it('should convert to persistence object correctly', () => {
      const student = new Student(studentData);
      const persistenceObj = student.toPersistenceObject();

      expect(persistenceObj.id).toBe(1);
      expect(persistenceObj.name).toBe('John Doe');
      expect(persistenceObj.nim).toBe('12345');
      expect(persistenceObj.class).toBe('TI-1A');
      expect(persistenceObj.role).toBe('student');
      expect(persistenceObj.password).toBeUndefined(); // Should not expose password
    });
  });

  describe('Admin', () => {
    const adminData = {
      id: 1,
      username: 'admin',
      name: 'Administrator',
      password: 'admin123'
    };

    it('should create admin instance with correct properties', () => {
      const admin = new Admin(adminData);

      expect(admin.id).toBe(1);
      expect(admin.name).toBe('Administrator');
      expect(admin.username).toBe('admin');
      expect(admin.role).toBe('admin');
    });

    it('should validate password correctly', () => {
      const admin = new Admin(adminData);

      expect(admin.validatePassword('admin123')).toBe(true);
      expect(admin.validatePassword('wrongpassword')).toBe(false);
    });

    it('should consolidate records correctly', () => {
      const admin = new Admin(adminData);
      const records = [
        new AttendanceRecord({ studentId: 1, date: '2024-05-01', status: 'HADIR' }),
        new AttendanceRecord({ studentId: 2, date: '2024-05-01', status: 'IZIN' })
      ];

      const consolidated = admin.consolidateRecords(records);

      expect(consolidated).toHaveLength(2);
      expect(consolidated[0]).toEqual(records[0]);
      expect(consolidated[1]).toEqual(records[1]);
    });

    it('should convert to persistence object correctly', () => {
      const admin = new Admin(adminData);
      const persistenceObj = admin.toPersistenceObject();

      expect(persistenceObj.id).toBe(1);
      expect(persistenceObj.name).toBe('Administrator');
      expect(persistenceObj.username).toBe('admin');
      expect(persistenceObj.role).toBe('admin');
      expect(persistenceObj.nim).toBeNull();
      expect(persistenceObj.class).toBeNull();
      expect(persistenceObj.password).toBeUndefined(); // Should not expose password
    });
  });

  describe('AttendanceRecord', () => {
    const recordData = {
      id: 1,
      studentId: 123,
      date: '2024-05-02',
      status: 'HADIR' as const,
      reason: 'Present in class'
    };

    it('should create attendance record with correct properties', () => {
      const record = new AttendanceRecord(recordData);

      expect(record.id).toBe(1);
      expect(record.studentId).toBe(123);
      expect(record.date).toBe('2024-05-02');
      expect(record.status).toBe('HADIR');
      expect(record.reason).toBe('Present in class');
    });

    it('should handle null reason correctly', () => {
      const record = new AttendanceRecord({
        ...recordData,
        reason: null
      });

      expect(record.reason).toBeNull();
    });

    it('should convert to persistence object correctly', () => {
      const record = new AttendanceRecord(recordData);
      const persistenceObj = record.toPersistenceObject();

      expect(persistenceObj.id).toBe(1);
      expect(persistenceObj.student_id).toBe(123);
      expect(persistenceObj.date).toBe('2024-05-02');
      expect(persistenceObj.status).toBe('HADIR');
      expect(persistenceObj.reason).toBe('Present in class');
    });

    it('should create from database row correctly', () => {
      const row = {
        id: 1,
        student_id: 123,
        date: '2024-05-02',
        status: 'HADIR',
        reason: 'Present in class'
      };

      const record = AttendanceRecord.fromRow(row);

      expect(record.id).toBe(1);
      expect(record.studentId).toBe(123);
      expect(record.date).toBe('2024-05-02');
      expect(record.status).toBe('HADIR');
      expect(record.reason).toBe('Present in class');
    });

    it('should handle null reason from database row', () => {
      const row = {
        id: 1,
        student_id: 123,
        date: '2024-05-02',
        status: 'HADIR',
        reason: null
      };

      const record = AttendanceRecord.fromRow(row);
      expect(record.reason).toBeNull();
    });
  });
});
