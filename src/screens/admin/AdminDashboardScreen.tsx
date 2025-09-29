import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AdminStackParamList } from '@/navigation/types';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getAttendanceTimeInfo } from '@/utils/attendanceTime';

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AdminStackParamList, 'AdminDashboard'>>();
  const { admin, logout } = useAdminAuth();
  const timeInfo = getAttendanceTimeInfo();

  const handleLogout = () => {
    console.log('🔧 Admin logout button pressed'); // Debug log
    
    // Web-compatible logout confirmation
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
      if (confirmed) {
        console.log('🔧 Admin logout confirmed (web), calling logout function');
        logout().catch(error => console.error('🔧 Admin logout error:', error));
      }
    } else {
      Alert.alert(
        'Logout',
        'Apakah Anda yakin ingin keluar?',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Logout', 
            onPress: async () => {
              console.log('🔧 Admin logout confirmed, calling logout function');
              try {
                await logout();
                console.log('🔧 Admin logout successful');
              } catch (error) {
                console.error('🔧 Admin logout error:', error);
              }
            }, 
            style: 'destructive' 
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.welcome}>Selamat datang, Admin! 👋</Text>
            <Text style={styles.subtitle}>Kelola sistem absensi mahasiswa</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>🚪 Logout</Text>
            </TouchableOpacity>
         
          </View>
        </View>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.cardTitle}>Menu Admin</Text>
        <Text style={styles.cardSubtitle}>
          Pilih menu untuk mengelola sistem absensi
        </Text>
        
         <TouchableOpacity 
           style={styles.primaryButton} 
           onPress={() => navigation.navigate('AdminRecap')}
         >
           <Text style={styles.primaryButtonIcon}>📈</Text>
           <Text style={styles.primaryButtonText}>Lihat Data Absensi</Text>
         </TouchableOpacity>
      </View>

      
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Informasi Sistem</Text>
        <Text style={styles.infoText}>
          • Mahasiswa dapat melakukan registrasi mandiri
        </Text>
        <Text style={styles.infoText}>
          • Absen HADIR hanya bisa dilakukan pada jam {timeInfo.displayText}
        </Text>
        <Text style={styles.infoText}>
          • Absen IZIN/SAKIT dapat dilakukan kapan saja
        </Text>
        <Text style={styles.infoText}>
          • Setiap mahasiswa hanya bisa absen 1x per hari
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
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
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  logoutButtonText: {
    color: COLORS.text.white,
    fontWeight: '600',
  },
  mainCard: {
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  primaryButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  primaryButtonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
   
  },
  secondaryButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  secondaryButtonText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  timeCard: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  timeLabel: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  testModeText: {
    fontSize: 14,
    color: COLORS.warning,
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.status + '10',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.background,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
});

export default AdminDashboardScreen;
