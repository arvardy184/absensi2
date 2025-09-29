# Panduan Pengguna & Developer

## Persiapan
1. Pastikan Node.js 18+ terpasang.
2. Instal Expo CLI secara global (opsional): 
pm install -g expo-cli.
3. Jalankan 
pm install di direktori proyek untuk memasang dependencies.
4. Untuk menjalankan aplikasi: 
px expo start lalu pilih platform (Android/iOS/Web).

## Struktur Folder Penting
- App.tsx: entry point yang menyiapkan provider, navigasi, dan inisialisasi database.
- src/models: kelas OOP (User, Student, Admin, AttendanceRecord).
- src/services: logika bisnis (autentikasi, absensi, impor/ekspor).
- src/screens: tampilan UI untuk mahasiswa & admin.
- src/utils: utilitas seperti parser JSON impor.
- __tests__: unit test menggunakan Jest.
- docs: dokumentasi arsitektur, panduan, dan rencana pengujian.

## Alur Mahasiswa
1. Buka aplikasi, pilih "Masuk sebagai Mahasiswa".
2. Registrasi akun baru (Nama, NIM, Password, Kelas) atau login.
3. Halaman utama menyediakan pilihan status kehadiran dan alasan opsional.
4. Riwayat absensi menampilkan daftar historis.
5. Halaman Ekspor membuat file JSON (ttendance_<nim>_<timestamp>.json) dan memicu fitur share perangkat.

## Alur Admin
1. Pilih "Masuk sebagai Admin" dan gunakan kredensial default dmin / admin123.
2. Dashboard menyediakan tombol impor file JSON dari mahasiswa.
3. Setelah impor, ringkasan data muncul (jumlah mahasiswa baru, catatan kesalahan, dsb).
4. Halaman rekap menampilkan tabel gabungan dengan filter NIM, kelas, tanggal, dan status.

## Basis Data Lokal
- Menggunakan SQLite via expo-sqlite.
- Tabel users menyimpan mahasiswa & admin.
- Tabel ttendance menyimpan catatan absensi.

## Ekspor & Impor File
- Ekspor: expo-file-system menulis file JSON, expo-sharing menawarkan dialog berbagi.
- Impor: expo-document-picker memilih file, parser memvalidasi struktur, data dimasukkan ke SQLite.

## Testing
- Jalankan 
pm test untuk unit test.
- Test fokus pada parser impor dan fungsi helper OOP.

## Kredensial Admin Default
- Username: dmin
- Password: dmin123

## Catatan Keamanan
- Password mahasiswa disimpan plaintext di SQLite sesuai scope tugas; produksi perlu hashing.
- File impor otomatis membuat akun mahasiswa bila belum ada dengan password default default123.

## Perluasan
- Tambahkan validasi tanggal dan status lebih lanjut.
- Integrasi dengan sinkronisasi cloud bila dibutuhkan.
