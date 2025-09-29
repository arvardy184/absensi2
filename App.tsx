import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { StudentAuthProvider } from './src/context/StudentAuthContext';
import { AdminAuthProvider } from './src/context/AdminAuthContext';
import { initializeDatabase } from './src/database';

const LoadingGate: React.FC = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

export default function App(): JSX.Element {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => setReady(true))
      .catch((error) => {
        console.error('Failed to initialize database', error);
      });
  }, []);

  if (!ready) {
    return <LoadingGate />;
  }

  return (
    <SafeAreaProvider>
      <AdminAuthProvider>
        <StudentAuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </StudentAuthProvider>
      </AdminAuthProvider>
    </SafeAreaProvider>
  );
}
