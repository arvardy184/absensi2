import { AttendanceStatus } from '@/constants';
import { AttendanceRecord } from './AttendanceRecord';
import { IUserProps, User } from './User';

export interface StudentProps extends IUserProps {
  nim: string;
  className: string;
}

/**
 * Represents a student user with specific helpers related to attendance.
 */
export class Student extends User {
  private readonly _nim: string;
  private readonly _className: string;

  constructor(props: StudentProps) {
    super(props);
    this._nim = props.nim;
    this._className = props.className;
  }

  public get nim(): string {
    return this._nim;
  }

  public get className(): string {
    return this._className;
  }

  public override get role(): 'student' {
    return 'student';
  }

  /**
   * Generates a domain object representing an attendance row for this student.
   */
  public markAttendance(status: AttendanceStatus, date: string, reason?: string | null): AttendanceRecord {
    return new AttendanceRecord({
      studentId: this.id ?? 0,
      date,
      status,
      reason: reason ?? null
    });
  }

  /**
   * Builds a serializable export payload for one or many attendance records.
   */
  public buildExportPayload(record: AttendanceRecord): Record<string, unknown>;
  public buildExportPayload(records: AttendanceRecord[]): Record<string, unknown>;
  public buildExportPayload(data: AttendanceRecord | AttendanceRecord[]): Record<string, unknown> {
    const records = Array.isArray(data) ? data : [data];
    return {
      student: {
        nim: this._nim,
        name: this.name,
        class: this._className
      },
      exportedAt: new Date().toISOString(),
      records: records.map((item) => item.toPersistenceObject())
    };
  }

  public override toPersistenceObject(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      nim: this._nim,
      password: undefined,
      class: this._className,
      role: this.role,
      created_at: new Date().toISOString()
    };
  }
}
