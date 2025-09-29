import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { COLORS, SPACING, RADIUS } from '@/constants';
import { getResponsivePadding, responsive, isDesktopScreen, isTabletScreen } from '@/utils/responsive';

const RoleSelectionScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'RoleSelection'>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Sistem Absensi Kelas</Text>
          <Text style={styles.subtitle}>Pilih peran Anda untuk melanjutkan</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StudentFlow')}>
            <Text style={styles.buttonIcon}>👨‍🎓</Text>
            <Text style={styles.buttonText}>Masuk sebagai Mahasiswa</Text>
            <Text style={styles.buttonDescription}>Absensi harian dan lihat riwayat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminFlow')}>
            <Text style={styles.buttonIcon}>👨‍💼</Text>
            <Text style={styles.buttonText}>Masuk sebagai Admin</Text>
            <Text style={styles.buttonDescription}>Kelola data dan rekapitulasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getResponsivePadding(),
  },
  content: {
    width: '100%',
    maxWidth: isDesktopScreen() ? 600 : isTabletScreen() ? 500 : '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  title: {
    fontSize: responsive({
      mobile: 28,
      tablet: 32,
      desktop: 36,
      default: 28,
    }),
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: responsive({
      mobile: 16,
      tablet: 18,
      desktop: 20,
      default: 16,
    }),
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    minHeight: responsive({
      mobile: 120,
      tablet: 140,
      desktop: 160,
      default: 120,
    }),
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: responsive({
      mobile: 32,
      tablet: 40,
      desktop: 48,
      default: 32,
    }),
    marginBottom: SPACING.sm,
  },
  buttonText: {
    fontSize: responsive({
      mobile: 18,
      tablet: 20,
      desktop: 22,
      default: 18,
    }),
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  buttonDescription: {
    fontSize: responsive({
      mobile: 14,
      tablet: 15,
      desktop: 16,
      default: 14,
    }),
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RoleSelectionScreen;
