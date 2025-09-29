# Rencana Pengujian

## Tujuan
Memastikan semua fungsionalitas utama (registrasi/login, pencatatan absensi, ekspor/impor, rekap admin) berjalan sesuai unit kompetensi.

## Lingkup
- Validasi form registrasi & login mahasiswa.
- Pengujian CRUD absensi di SQLite.
- Ekspor data mahasiswa ke JSON.
- Impor data admin dari file JSON.
- Filter rekap berdasarkan NIM, kelas, tanggal, status.

## Skenario Manual
1. **Registrasi Mahasiswa Baru**
   - Input valid -> berhasil, diarahkan ke tab mahasiswa.
   - Input NIM duplikat -> gagal, tampil pesan.
2. **Login Mahasiswa**
   - Kredensial benar -> masuk.
   - Password salah -> pesan kesalahan.
3. **Absensi Harian**
   - Pilih status, simpan -> data muncul di riwayat.
   - Status Izin/Sakit tanpa alasan -> izinkan (opsional).
4. **Ekspor Data**
   - Setelah memiliki catatan -> file dibuat & dialog share tampil.
5. **Login Admin**
   - Gunakan kredensial default -> masuk.
6. **Impor Data**
   - File valid -> jumlah data bertambah sesuai ringkasan.
   - File dengan status tidak valid -> impor gagal, tampil pesan.
7. **Rekap Data**
   - Filter berdasarkan NIM/Kelas/Tanggal -> tabel mengikuti filter.

## Unit Test (Jest)
- parseAttendancePayload memvalidasi struktur dan status.
- Student.buildExportPayload menghasilkan payload tunggal & jamak.

## Data Uji
- __tests__/fixtures/sample_attendance.json digunakan untuk simulasi impor.

## Kriteria Kelulusan
- Semua skenario manual tercapai tanpa error.
- Unit test lulus (
pm test).
