/**
 * Utility untuk validasi jam absen
 * Jam absen: 08:00 - 08:30
 * Dengan mode testing untuk development
 */

export interface TimeValidation {
  isValid: boolean;
  message: string;
  currentTime: string;
  allowedStart: string;
  allowedEnd: string;
  isTestMode: boolean;
}

// KONFIGURASI JAM ABSEN - Ubah disini jika perlu
const ATTENDANCE_START_HOUR = 8;   
const ATTENDANCE_START_MIN = 0;
const ATTENDANCE_END_HOUR = 8;     
const ATTENDANCE_END_MIN = 30;

// MODE TESTING - Set ke true untuk testing diluar jam absen
const ENABLE_TEST_MODE = true; 

/**
 * Validasi apakah waktu saat ini dalam jam absen yang diperbolehkan
 */
export const validateAttendanceTime = (): TimeValidation => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  
  const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
  const allowedStart = `${ATTENDANCE_START_HOUR.toString().padStart(2, '0')}:${ATTENDANCE_START_MIN.toString().padStart(2, '0')}`;
  const allowedEnd = `${ATTENDANCE_END_HOUR.toString().padStart(2, '0')}:${ATTENDANCE_END_MIN.toString().padStart(2, '0')}`;
  
  // Hitung total menit untuk perbandingan
  const currentTotalMin = currentHour * 60 + currentMin;
  const startTotalMin = ATTENDANCE_START_HOUR * 60 + ATTENDANCE_START_MIN;
  const endTotalMin = ATTENDANCE_END_HOUR * 60 + ATTENDANCE_END_MIN;
  
  // Cek apakah dalam jam yang diperbolehkan
  const isWithinSchedule = currentTotalMin >= startTotalMin && currentTotalMin <= endTotalMin;
  
  // Jika test mode aktif, selalu allow
  const isValid = ENABLE_TEST_MODE || isWithinSchedule;
  
  let message: string;
  if (ENABLE_TEST_MODE && !isWithinSchedule) {
    message = `🧪 MODE TESTING: Diluar jam absen (${allowedStart}-${allowedEnd}) tapi diizinkan untuk testing`;
  } else if (isWithinSchedule) {
    message = `✅ Waktu absen valid`;
  } else {
    message = `❌ Absen HADIR hanya diperbolehkan jam ${allowedStart}-${allowedEnd}`;
  }
  
  return {
    isValid,
    message,
    currentTime,
    allowedStart,
    allowedEnd,
    isTestMode: ENABLE_TEST_MODE
  };
};

/**
 * Get info jam absen untuk ditampilkan di UI
 */
export const getAttendanceTimeInfo = () => {
  const startTime = `${ATTENDANCE_START_HOUR.toString().padStart(2, '0')}:${ATTENDANCE_START_MIN.toString().padStart(2, '0')}`;
  const endTime = `${ATTENDANCE_END_HOUR.toString().padStart(2, '0')}:${ATTENDANCE_END_MIN.toString().padStart(2, '0')}`;
  
  return {
    startTime,
    endTime,
    displayText: `${startTime} - ${endTime}`,
    isTestMode: ENABLE_TEST_MODE
  };
};
