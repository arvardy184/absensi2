export const ATTENDANCE_STATUSES = ['HADIR', 'IZIN', 'SAKIT', 'ALFA'] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
} as const;


export const CLASS_OPTIONS = [
  { label: 'Informatika', value: 'IF' },
  { label: 'Sistem Informasi', value: 'SI' },
  { label: 'Sistem Informasi Akuntansi', value: 'SIA' },
] as const;

// Common colors for consistent theming
export const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#eff6ff',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
  surface: '#ffffff',
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    light: '#9ca3af',
    white: '#ffffff',
  },
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },
  status: {
    HADIR: '#10b981',
    IZIN: '#f59e0b', 
    SAKIT: '#8b5cf6',
    ALFA: '#ef4444',
  }
} as const;

// Common spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Common border radius
export const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
