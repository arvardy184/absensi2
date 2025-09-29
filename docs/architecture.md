# Absensi App Architecture Plan

## Overview
- Mobile app built with Expo (React Native) with TypeScript for type safety.
- Local persistence through Expo SQLite (expo-sqlite) with thin repository abstractions.
- Two roles implemented within one binary: Student (Mahasiswa) and Admin.
- Modular folder structure under src/ separating navigation, screens, components, models, services, hooks, utils, and database access.

## Data Model
- Table users
  - id INTEGER PRIMARY KEY AUTOINCREMENT
  - 
ame TEXT
  - 
im TEXT UNIQUE (students only)
  - password TEXT
  - class TEXT (kelas; nullable for admin)
  - ole TEXT CHECK (student | dmin)
  - created_at TEXT ISO string
- Table ttendance
  - id INTEGER PRIMARY KEY AUTOINCREMENT
  - student_id INTEGER REFERENCES users(id)
  - date TEXT ISO (YYYY-MM-DD)
  - status TEXT ENUM (HADIR, IZIN, SAKIT, ALFA)
  - eason TEXT nullable
  - synced_at TEXT nullable (for future use)

## Core Classes
- User (abstract) with shared identity and password validation logic.
- Student extends User, exposes markAttendance and exportAttendance behaviors.
- Admin extends User, exposes importAttendance behavior.
- AttendanceRecord encapsulates attendance row mapping, provides formatting helpers.
- AttendanceService orchestrates DB operations, uses repository pattern.
- FileExporter / FileImporter implement IDataTransfer interface demonstrating polymorphism.

## Navigation Structure
- Root Stack: RoleSelection, StudentStack, AdminStack.
- StudentStack: StudentAuth, StudentRegister, StudentHomeTabs.
  - Tabs: Absen, History, Export.
- AdminStack: AdminLogin, AdminDashboard, AdminRecap.

## Key Libraries
- expo-sqlite for database operations.
- expo-file-system, expo-sharing, expo-document-picker for export/import workflows.
- @react-navigation/native, @react-navigation/stack, @react-navigation/bottom-tabs for routing.
- @react-native-async-storage/async-storage to hold session info.
- date-fns for date formatting & filtering utilities.

## File Import/Export Strategy
- Export: query student records, serialize to JSON, write to FileSystem.documentDirectory + "attendance_<nim>.json", then share.
- Import: pick JSON file, parse, validate schema, upsert students (if missing) & attendance rows, return summary counts.

## Testing Strategy
- Use Jest with 	s-jest preset and React Native testing presets.
- Mock Expo modules in tests.
- Unit test importAttendanceData utility and validation logic, export builder, and filter functions.
- Provide sample fixture data under __tests__/fixtures.

## Documentation
- Use JSDoc on classes and exported functions.
- Generate developer guide under docs/user-guide.md.

## Outstanding Questions
- Hard-coded admin credentials stored in env config file.
- Export format JSON covering metadata (student) + records.
