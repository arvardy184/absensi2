import { AttendanceStatus } from '@/constants';

export interface AttendanceRecordProps {
  id?: number;
  studentId: number;
  date: string;
  status: AttendanceStatus;
  reason?: string | null;
}

/**
 * Represents a single attendance record entry and encapsulates related helpers.
 */
export class AttendanceRecord {
  private readonly _id?: number;
  private readonly _studentId: number;
  private readonly _date: string;
  private readonly _status: AttendanceStatus;
  private readonly _reason?: string | null;

  constructor(props: AttendanceRecordProps) {
    this._id = props.id;
    this._studentId = props.studentId;
    this._date = props.date;
    this._status = props.status;
    this._reason = props.reason ?? null;
  }

  public get id(): number | undefined {
    return this._id;
  }

  public get studentId(): number {
    return this._studentId;
  }

  public get date(): string {
    return this._date;
  }

  public get status(): AttendanceStatus {
    return this._status;
  }

  public get reason(): string | null {
    return this._reason ?? null;
  }

  public toPersistenceObject(): Record<string, unknown> {
    return {
      id: this._id,
      student_id: this._studentId,
      date: this._date,
      status: this._status,
      reason: this._reason
    };
  }

  public static fromRow(row: Record<string, unknown>): AttendanceRecord {
    return new AttendanceRecord({
      id: row.id as number | undefined,
      studentId: Number(row.student_id),
      date: String(row.date),
      status: row.status as AttendanceStatus,
      reason: (row.reason as string | null) ?? null
    });
  }
}
