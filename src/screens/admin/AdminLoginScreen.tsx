import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AdminStackParamList } from '@/navigation/types';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { COLORS, SPACING, RADIUS } from '@/constants';

const AdminLoginScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AdminStackParamList, 'AdminLogin'>>();
  const { login, loading, admin } = useAdminAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (admin) {
      navigation.replace('AdminDashboard');
    }
  }, [admin, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleLogin = async () => {
    setSubmitting(true);
    const success = await login(username, password);
    setSubmitting(false);
    if (success) {
      navigation.replace('AdminDashboard');
    } else {
      Alert.alert('Gagal', 'Username atau password salah.');
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
        <Text style={styles.title}>Login Admin</Text>
        <Text style={styles.subtitle}>Masuk dengan kredensial admin</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput 
            style={styles.input} 
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none" 
            placeholder="admin"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="admin123"
          />
        </View>
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={submitting}>
          <Text style={styles.primaryButtonText}>{submitting ? 'Memproses...' : 'Masuk'}</Text>
        </TouchableOpacity>
        
        <View style={styles.credentialHint}>
          <Text style={styles.hintText}>Default: admin / admin123</Text>
        </View>
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
    borderRadius: 8
  },
  primaryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  credentialHint: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
  }
});

export default AdminLoginScreen;
