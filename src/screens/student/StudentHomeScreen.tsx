import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { ATTENDANCE_STATUSES, AttendanceStatus, COLORS, SPACING, RADIUS } from '@/constants';
import { useStudentAuth } from '@/context/StudentAuthContext';
import { saveAttendanceRecord, getAttendanceByStudentAndDate } from '@/services/AttendanceService';
import { validateAttendanceTime, getAttendanceTimeInfo, TimeValidation } from '@/utils/attendanceTime';
import { getToday } from '@/utils/date';
import { getResponsivePadding, responsive, isDesktopScreen, isTabletScreen } from '@/utils/responsive';

const StudentHomeScreen: React.FC = () => {
  const { student } = useStudentAuth();
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('HADIR');
  const [reason, setReason] = useState('');
  const [timeValidation, setTimeValidation] = useState<TimeValidation | null>(null);
  const [hasAttendedToday, setHasAttendedToday] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check attendance status and time validation on component mount
  useEffect(() => {
    const checkAttendanceStatus = async () => {
      if (!student?.id) return;
      
      try {
        setLoading(true);
        
        // Check if already attended today
        const existingAttendance = await getAttendanceByStudentAndDate(student.id, getToday());
        setHasAttendedToday(!!existingAttendance);
        
        // Validate current time
        const validation = validateAttendanceTime();
        setTimeValidation(validation);
      } catch (error) {
        console.error('Error checking attendance status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAttendanceStatus();
  }, [student?.id]);

  const handleSubmit = async () => {
    try {
      if (!student?.id) {
        Alert.alert('Error', 'Data mahasiswa tidak valid. Mohon login ulang.');
        return;
      }

      // Check if already attended today
      if (hasAttendedToday) {
        Alert.alert('Informasi', 'Anda sudah melakukan absensi hari ini.');
        return;
      }

      // Validate time (except for IZIN and SAKIT which can be done anytime)
      if (selectedStatus === 'HADIR' && timeValidation && !timeValidation.isValid) {
        Alert.alert(
          'Waktu Absen Tidak Valid',
          timeValidation.message || 'Absen hanya diperbolehkan pada jam yang telah ditentukan.',
          [{ text: 'OK' }]
        );
        return;
      }

      const record = student.markAttendance(selectedStatus, getToday(), reason || undefined);
      await saveAttendanceRecord(record);
      
      setReason('');
      setHasAttendedToday(true);
      Alert.alert('Sukses', 'Absensi berhasil tersimpan.');
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      Alert.alert('Error', `Gagal menyimpan absensi: ${(error as Error).message}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Memuat...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Halo, {student?.name}! 👋</Text>
        <Text style={styles.date}>Hari ini: {getToday()}</Text>

        {/* Already attended today info */}
        {hasAttendedToday && (
          <View style={[styles.timeInfo, { backgroundColor: COLORS.success }]}>
            <Text style={[styles.timeText, { fontWeight: 'bold' }]}>
              ✅ Anda sudah absen hari ini
            </Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Status Kehadiran</Text>
        <Text style={styles.sectionSubtitle}>Pilih status kehadiran Anda hari ini</Text>
        
        <View style={styles.statusGrid}>
          {ATTENDANCE_STATUSES.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusChip, 
                selectedStatus === status && styles.statusChipActive,
                { backgroundColor: selectedStatus === status ? COLORS.status[status] : COLORS.surface }
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.statusText,
                selectedStatus === status && styles.statusTextActive
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {(selectedStatus === 'IZIN' || selectedStatus === 'SAKIT') && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Alasan</Text>
          <Text style={styles.sectionSubtitle}>Jelaskan alasan {selectedStatus.toLowerCase()} Anda</Text>
          <TextInput
            style={styles.input}
            placeholder={`Masukkan alasan ${selectedStatus.toLowerCase()}...`}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.submitButton,
          { 
            backgroundColor: hasAttendedToday ? COLORS.secondary : COLORS.status[selectedStatus],
            opacity: hasAttendedToday ? 0.6 : 1
          }
        ]} 
        onPress={handleSubmit}
        disabled={hasAttendedToday}
      >
        <Text style={styles.submitButtonText}>
          {hasAttendedToday ? '✅ Sudah Absen Hari Ini' : '✓ Simpan Absensi'}
        </Text>
      </TouchableOpacity>

   
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: getResponsivePadding(),
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  date: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  timeInfo: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.warning,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.text.white,
    textAlign: 'center',
    marginBottom: 2,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: responsive({
      mobile: 'center',
      tablet: 'space-between',
      desktop: 'flex-start',
      default: 'center',
    }),
  },
  statusChip: {
    borderWidth: 2,
    borderColor: COLORS.border.light,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: isDesktopScreen() ? 150 : isTabletScreen() ? '22%' : '45%',
    flex: isTabletScreen() && !isDesktopScreen() ? 1 : 0,
  },
  statusChipActive: {
    borderColor: 'transparent',
    elevation: 3,
    shadowOpacity: 0.2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  statusTextActive: {
    color: COLORS.text.white,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 16,
    backgroundColor: COLORS.background,
    color: COLORS.text.primary,
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitButtonText: {
    color: COLORS.text.white,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  info: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
});

export default StudentHomeScreen;
