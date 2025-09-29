import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StudentStackParamList } from '@/navigation/types';
import { useStudentAuth } from '@/context/StudentAuthContext';
import { CLASS_OPTIONS, COLORS, SPACING, RADIUS } from '@/constants';
import Dropdown from '@/components/Dropdown';
import { getResponsivePadding, isDesktopScreen, isTabletScreen } from '@/utils/responsive';

const StudentRegisterScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<StudentStackParamList, 'StudentRegister'>>();
  const { register } = useStudentAuth();
  const [form, setForm] = useState({
    name: '',
    nim: '',
    password: '',
    className: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: 'name' | 'nim' | 'password' | 'className', value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.nim || !form.password || !form.className) {
      Alert.alert('Validasi', 'Semua field wajib diisi.');
      return;
    }
    setSubmitting(true);
    const success = await register({
      name: form.name,
      nim: form.nim,
      password: form.password,
      className: form.className,
      username: form.nim
    });
    setSubmitting(false);
    if (success) {
      navigation.reset({ index: 0, routes: [{ name: 'StudentTabs' }] });
    } else {
      Alert.alert('Gagal', 'Registrasi gagal. NIM mungkin sudah terdaftar.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Registrasi Mahasiswa</Text>
          <Text style={styles.subtitle}>Silakan lengkapi data diri Anda</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput 
              placeholder="Masukkan nama lengkap" 
              style={styles.input} 
              value={form.name} 
              onChangeText={(value) => handleChange('name', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NIM</Text>
            <TextInput 
              placeholder="Masukkan NIM" 
              style={styles.input} 
              value={form.nim} 
              onChangeText={(value) => handleChange('nim', value)} 
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kelas</Text>
            <Dropdown
              options={CLASS_OPTIONS}
              value={form.className}
              placeholder="Pilih kelas Anda"
              onSelect={(value) => handleChange('className', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              placeholder="Buat password" 
              style={styles.input} 
              value={form.password} 
              onChangeText={(value) => handleChange('password', value)} 
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, submitting && styles.buttonDisabled]} 
            onPress={handleSubmit} 
            disabled={submitting}
          >
            <Text style={styles.primaryButtonText}>
              {submitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: getResponsivePadding(),
    maxWidth: isDesktopScreen() ? 600 : isTabletScreen() ? 500 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: SPACING.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 16,
    backgroundColor: COLORS.surface,
    color: COLORS.text.primary,
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.xl,
    minHeight: 52,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: COLORS.text.light,
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: COLORS.text.white,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default StudentRegisterScreen;
