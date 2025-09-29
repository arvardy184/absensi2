import { AttendanceRecord } from '@/models/AttendanceRecord';
import { Student } from '@/models/Student';

describe('Student.buildExportPayload', () => {
  const student = new Student({
    id: 1,
    username: '12345',
    name: 'Siti',
    password: 'secret',
    nim: '12345',
    className: 'TI-1B'
  });

  const record = new AttendanceRecord({
    studentId: 1,
    date: '2024-05-02',
    status: 'HADIR',
    reason: null
  });

  it('builds payload for a single record', () => {
    const payload = student.buildExportPayload(record) as any;
    expect(payload.student.nim).toBe('12345');
    expect(payload.records).toHaveLength(1);
  });

  it('builds payload for multiple records', () => {
    const payload = student.buildExportPayload([record, record]) as any;
    expect(payload.records).toHaveLength(2);
  });
});
