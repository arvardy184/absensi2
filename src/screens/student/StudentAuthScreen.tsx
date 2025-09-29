import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StudentStackParamList } from '@/navigation/types';
import { useStudentAuth } from '@/context/StudentAuthContext';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mahasiswa</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24
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
