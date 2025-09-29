import { parseAttendancePayload } from '@/utils/importProcessor';

describe('parseAttendancePayload', () => {
  it('parses valid payloads', () => {
    const json = JSON.stringify({
      student: {
        nim: '12345',
        name: 'Budi',
        class: 'TI-1A'
      },
      records: [
        {
          date: '2024-05-01',
          status: 'HADIR',
          reason: null
        }
      ]
    });

    const result = parseAttendancePayload(json);
    expect(result.student.nim).toBe('12345');
    expect(result.records).toHaveLength(1);
  });

  it('throws on invalid status', () => {
    const json = JSON.stringify({
      student: {
        nim: '12345',
        name: 'Budi',
        class: 'TI-1A'
      },
      records: [
        {
          date: '2024-05-01',
          status: 'UNKNOWN',
          reason: null
        }
      ]
    });

    expect(() => parseAttendancePayload(json)).toThrow('Status');
  });

  it('throws when student info incomplete', () => {
    const json = JSON.stringify({
      student: {
        nim: '',
        name: '',
        class: 'TI-1A'
      },
      records: []
    });

    expect(() => parseAttendancePayload(json)).toThrow('Informasi mahasiswa tidak lengkap');
  });
});
