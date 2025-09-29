import { ATTENDANCE_STATUSES, AttendanceStatus } from '@/constants';

export interface ParsedAttendancePayload {
  student: {
    nim: string;
    name: string;
    class: string;
  };
  records: Array<{
    date: string;
    status: AttendanceStatus;
    reason?: string | null;
  }>;
}

/**
 * Validates the JSON import content and ensures mandatory fields exist.
 */
export const parseAttendancePayload = (content: string): ParsedAttendancePayload => {
  const candidate = JSON.parse(content);
  if (!candidate || typeof candidate !== 'object') {
    throw new Error('Payload tidak valid');
  }
  const { student, records } = candidate as ParsedAttendancePayload;
  if (!student?.nim || !student.name || !student.class) {
    throw new Error('Informasi mahasiswa tidak lengkap');
  }
  if (!Array.isArray(records)) {
    throw new Error('Daftar absensi tidak ditemukan');
  }
  records.forEach((record) => {
    if (!record.date || !record.status) {
      throw new Error('Record absensi tidak lengkap');
    }
    if (!ATTENDANCE_STATUSES.includes(record.status)) {
      throw new Error(`Status ${record.status} tidak dikenali`);
    }
  });
  return {
    student: {
      nim: student.nim,
      name: student.name,
      class: student.class
    },
    records: records.map((record) => ({
      date: record.date,
      status: record.status,
      reason: record.reason ?? null
    }))
  };
};
