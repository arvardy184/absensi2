import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StudentStackParamList } from '@/navigation/types';
import { useStudentAuth } from '@/context/StudentAuthContext';
import { COLORS, SPACING, RADIUS } from '@/constants';

const StudentAuthScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<StudentStackParamList, 'StudentAuth'>>();
  const { login, loading, student } = useStudentAuth();
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      navigation.replace('StudentTabs');
    }
  }, [navigation, student]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleLogin = async () => {
    if (!nim || !password) {
      Alert.alert('Validasi', 'Mohon isi NIM dan password.');
      return;
    }
    setSubmitting(true);
    const success = await login(nim, password);
    setSubmitting(false);
    if (!success) {
      Alert.alert('Gagal', 'NIM atau password salah.');
    }
  };

  const goBackToRoleSelection = () => {
    // Navigate back to root and reset to role selection
    navigation.getParent()?.navigate('RoleSelection');
  };

  return (
    <View style={styles.container}>
      {/* Back to Role Selection Button */}
      <TouchableOpacity style={styles.backButton} onPress={goBackToRoleSelection}>
        <Text style={styles.backButtonText}>← Pilih Role Lain</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Login Mahasiswa</Text>
        <Text style={styles.subtitle}>Masuk dengan NIM dan password Anda</Text>
        
        <TextInput
          placeholder="NIM"
          value={nim}
          onChangeText={setNim}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={submitting}>
          <Text style={styles.primaryButtonText}>{submitting ? 'Memuat...' : 'Masuk'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StudentRegister')}>
          <Text style={styles.link}>Belum punya akun? Registrasi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    marginTop: 50,
    marginLeft: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xxl,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  },
  link: {
    color: '#2563eb',
    textAlign: 'center'
  }
});

export default StudentAuthScreen;
