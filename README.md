# 📱 Aplikasi Absensi React Native

Aplikasi mobile tunggal untuk sistem absensi kelas yang melayani dua peran: **Mahasiswa** dan **Admin**. Dibangun dengan React Native Expo dan database SQLite lokal.

## 🎯 Fitur Utama

### 👨‍🎓 Fitur Mahasiswa
- **Registrasi & Login** - Pendaftaran akun baru dengan NIM dan login
- **Absensi Harian** - Mencatat kehadiran (Hadir, Izin, Sakit, Alfa) dengan alasan
- **Riwayat Absensi** - Melihat histori absensi pribadi
- **Ekspor Data** - Mengekspor data absensi ke file JSON untuk dibagikan

### 👨‍💼 Fitur Admin
- **Login Admin** - Akses dengan kredensial admin (username: `admin`, password: `admin123`)
- **Impor Data** - Mengimpor file JSON absensi dari mahasiswa
- **Dashboard** - Ringkasan hasil impor dan navigasi
- **Rekapitulasi** - Melihat data gabungan dengan filter (NIM, Kelas, Tanggal, Status)

## 🏗️ Arsitektur Aplikasi

### Struktur Folder
```
src/
├── components/     # Reusable UI components
├── constants/      # App constants & types
├── context/        # React Context providers
├── database/       # SQLite database setup
├── models/         # Domain object classes
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── services/       # Business logic services
├── types/          # TypeScript type definitions
└── utils/          # Helper utilities
```

### Database Schema
```sql
-- Tabel Users (Mahasiswa & Admin)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  nim TEXT UNIQUE,
  password TEXT NOT NULL,
  class TEXT,
  role TEXT CHECK(role IN ('student', 'admin')),
  created_at TEXT NOT NULL
);

-- Tabel Attendance (Data Absensi)
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT CHECK(status IN ('HADIR','IZIN','SAKIT','ALFA')),
  reason TEXT,
  synced_at TEXT,
  FOREIGN KEY(student_id) REFERENCES users(id)
);
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih baru)
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio / Xcode (untuk emulator)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd absensi

# Install dependencies
npm install

# Start development server
npm start
```

### Testing
```bash
# Run unit tests
npm test

# Run specific test file
npm test UserService.test.ts
```

## 🧪 Unit Testing

Aplikasi dilengkapi dengan **48 unit tests** yang mencakup:

- **Service Layer Tests** - AttendanceService, UserService, DataTransferService
- **Model Tests** - User, Student, Admin, AttendanceRecord classes
- **Utility Tests** - Date helpers, import processor
- **Integration Tests** - Export/import functionality

```bash
Test Suites: 7 passed, 7 total
Tests:       48 passed, 48 total
Coverage: 100% functions, 90%+ lines
```

## 📖 Dokumentasi

- **[Architecture Guide](docs/architecture.md)** - Penjelasan arsitektur aplikasi
- **[User Guide](docs/user-guide.md)** - Panduan penggunaan aplikasi
- **[Test Plan](docs/test-plan.md)** - Strategi dan skenario pengujian
- **[Unit Competency Validation](docs/unit-competency-validation.md)** - Validasi pemenuhan unit kompetensi

## 🏆 Unit Kompetensi yang Dipenuhi

Aplikasi ini secara eksplisit mendemonstrasikan pemenuhan unit kompetensi berikut:

### ✅ J.620100.017.02 - Pemrograman Terstruktur
- Penggunaan tipe data yang sesuai (TypeScript interfaces, union types)
- Struktur kontrol percabangan (`if/else`) dan perulangan (`for`, `map`)
- Prosedur dan fungsi untuk modularitas kode
- Array untuk mengelola daftar data absensi
- Akses file untuk fitur ekspor/impor

### ✅ J.620100.018.02 - Pemrograman Berorientasi Objek
- Class untuk entitas (`User`, `Student`, `Admin`, `AttendanceRecord`)
- Inheritance dengan base class `User` dan subclass `Student`/`Admin`
- Hak akses properti (`private`, `public`, `protected`)
- Polymorphism dan method overloading
- Interface program (`IDataTransfer`, `IUserProps`)

### ✅ J.620100.019.02 - Library/Komponen Pre-existing
- `expo-sqlite` untuk database lokal
- `expo-document-picker` & `expo-sharing` untuk file operations
- `@react-navigation/native` untuk navigasi
- `@react-native-picker/picker` untuk UI components

### ✅ J.620100.021.02 - Akses Basis Data
- Database SQLite lokal dengan schema terstruktur
- Query efisien dengan prepared statements
- Operasi CRUD lengkap (Create, Read, Update, Delete)

### ✅ J.620100.023.02 - Dokumentasi Kode Program
- JSDoc comments untuk semua fungsi dan class penting
- Dokumentasi algoritma kompleks (import/export process)
- README dan dokumentasi arsitektur

### ✅ J.620100.025.02 & J.620100.033.02 - Debugging & Pengujian Unit
- Framework Jest untuk unit testing
- 48 test cases dengan coverage tinggi
- Mocking untuk isolasi testing
- Skenario pengujian lengkap (happy path, error handling, edge cases)

## 📱 Flow Aplikasi

### Alur Mahasiswa
1. **Role Selection** → Pilih "Masuk sebagai Mahasiswa"
2. **Login/Register** → Login dengan NIM/password atau registrasi baru
3. **Home** → Lakukan absensi harian dengan pilihan status
4. **History** → Lihat riwayat absensi pribadi
5. **Export** → Ekspor data ke file JSON

### Alur Admin
1. **Role Selection** → Pilih "Masuk sebagai Admin"  
2. **Admin Login** → Login dengan kredensial admin
3. **Dashboard** → Impor file JSON dari mahasiswa
4. **Recap** → Lihat rekapitulasi dengan filter

## 🔧 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator  
npm run web        # Run in web browser
npm test           # Run unit tests
```

### Code Style
- **Indentation**: 2 spaces
- **Naming**: camelCase
- **Language**: TypeScript dengan JSDoc comments
- **Architecture**: Clean Architecture dengan separation of concerns

## 📄 License

MIT License - Lihat file [LICENSE](LICENSE) untuk detail lengkap.

## 👥 Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

**Dibuat dengan ❤️ menggunakan React Native Expo**
