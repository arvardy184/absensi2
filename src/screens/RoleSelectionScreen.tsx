import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';

const RoleSelectionScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'RoleSelection'>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistem Absensi Kelas</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StudentFlow')}>
        <Text style={styles.buttonText}>Masuk sebagai Mahasiswa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminFlow')}>
        <Text style={styles.buttonText}>Masuk sebagai Admin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f7f7ff'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center'
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#1d4ed8',
    marginBottom: 16
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500'
  }
});

export default RoleSelectionScreen;
