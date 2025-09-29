# ⏰ Setup Jam Absen Tanpa Database

## 🎯 **Konfigurasi Jam Absen**

Jam absen diatur langsung di kode tanpa menggunakan database tambahan.

### **📍 Lokasi Konfigurasi**
File: `src/utils/attendanceTime.ts`

```typescript
// KONFIGURASI JAM ABSEN - Ubah disini jika perlu
const ATTENDANCE_START_HOUR = 8;   // Jam 08:00
const ATTENDANCE_START_MIN = 0;
const ATTENDANCE_END_HOUR = 8;     // Jam 08:30  
const ATTENDANCE_END_MIN = 30;

// MODE TESTING - Set ke true untuk testing diluar jam absen
const ENABLE_TEST_MODE = true; // ⭐ Ubah ke false untuk production
```

## 🧪 **Mode Testing**

### **Development (Testing Mode ON)**
```typescript
const ENABLE_TEST_MODE = true;
```
- ✅ Mahasiswa bisa absen HADIR kapan saja
- 🧪 UI menampilkan peringatan "MODE TESTING AKTIF"
- ⚠️ Tetap ada validasi, tapi tidak memblokir absen

### **Production (Testing Mode OFF)**
```typescript
const ENABLE_TEST_MODE = false;
```
- ❌ Mahasiswa hanya bisa absen HADIR jam 08:00-08:30
- ✅ IZIN/SAKIT tetap bisa kapan saja
- 🔒 Validasi ketat sesuai jam yang diatur

## 🎮 **Cara Mengubah Jam Absen**

### **1. Edit File Konfigurasi**
Buka `src/utils/attendanceTime.ts` dan ubah:

```typescript
// Contoh: Ubah ke jam 07:30 - 09:00
const ATTENDANCE_START_HOUR = 7;   // Jam 07:30
const ATTENDANCE_START_MIN = 30;
const ATTENDANCE_END_HOUR = 9;     // Jam 09:00  
const ATTENDANCE_END_MIN = 0;
```

### **2. Restart Aplikasi**
- Restart Expo development server
- Perubahan akan langsung terlihat

### **3. Testing vs Production**
```typescript
// Untuk testing (bisa absen diluar jam)
const ENABLE_TEST_MODE = true;

// Untuk production (ketat sesuai jam)
const ENABLE_TEST_MODE = false;
```

## 🔧 **Fitur yang Tersedia**

### **✅ Validasi Real-time**
- Cek waktu saat ini vs jam yang diatur
- Tampilkan status di UI mahasiswa
- Info jam absen di dashboard admin

### **✅ Mode Testing**
- Bisa testing diluar jam absen
- UI menampilkan warning mode testing
- Easy switch on/off

### **✅ Flexible Rules**
- HADIR: Sesuai jam yang diatur
- IZIN/SAKIT: Kapan saja
- 1x absen per hari

### **✅ UI Informatif**
- Tampilan waktu real-time
- Status validasi jam absen
- Peringatan test mode

## 📱 **UI Display**

### **Student Screen**:
```
Waktu sekarang: 10:30
Jam absen HADIR: 08:00 - 08:30
🧪 MODE TESTING: Diluar jam absen tapi diizinkan untuk testing
* Mode testing aktif - absen diperbolehkan diluar jam
```

### **Admin Dashboard**:
```
⏰ Pengaturan Jam Absen
Jam Absen HADIR: 08:00 - 08:30
🧪 MODE TESTING AKTIF - Absen diperbolehkan diluar jam untuk testing
```

## 🚀 **Keunggulan Pendekatan Ini**

### **✅ Simple**
- Tidak perlu tabel database tambahan
- Konfigurasi langsung di kode
- Easy to maintain

### **✅ Flexible**
- Mudah ubah jam absen
- Test mode untuk development
- Production ready

### **✅ Performance**
- Tidak ada query database tambahan
- Validasi langsung di memory
- Fast response

### **✅ Developer Friendly**
- Konfigurasi jelas di satu tempat
- Easy testing dengan test mode
- No database migration needed

## 📋 **Checklist Setup**

- ✅ Jam absen di-set: **08:00 - 08:30**
- ✅ Test mode: **AKTIF** (untuk testing)
- ✅ UI menampilkan info jam absen
- ✅ Validasi real-time berjalan
- ✅ IZIN/SAKIT tetap bisa kapan saja
- ✅ Database tidak perlu tabel tambahan

## 🔄 **Untuk Production**

Sebelum deploy ke production:

1. **Ubah test mode ke OFF**:
   ```typescript
   const ENABLE_TEST_MODE = false;
   ```

2. **Pastikan jam absen sesuai kebutuhan**:
   ```typescript
   const ATTENDANCE_START_HOUR = 8;   // Sesuaikan
   const ATTENDANCE_START_MIN = 0;
   const ATTENDANCE_END_HOUR = 8;     
   const ATTENDANCE_END_MIN = 30;
   ```

3. **Build dan deploy**

---

**Status: ✅ READY FOR TESTING**
**Jam Absen: 08:00 - 08:30**
**Test Mode: AKTIF** 🧪



