import { AttendanceRecord } from './AttendanceRecord';
import { IUserProps, User } from './User';

export interface AdminProps extends IUserProps {
  username: string;
}

/**
 * Represents an admin user who can perform import and aggregation tasks.
 */
export class Admin extends User {
  constructor(props: AdminProps) {
    super(props);
  }

  public override get role(): 'admin' {
    return 'admin';
  }

  /**
   * Aggregates records from multiple imports, keeping the method polymorphic.
   */
  public consolidateRecords(records: AttendanceRecord[]): AttendanceRecord[] {
    return [...records];
  }

  public override toPersistenceObject(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      nim: null,
      password: undefined,
      class: null,
      role: this.role,
      created_at: new Date().toISOString()
    };
  }
}
