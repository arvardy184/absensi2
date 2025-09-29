import React from 'react';
import { Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, StudentStackParamList, AdminStackParamList, StudentTabParamList } from './types';
import { COLORS } from '@/constants';
import { useStudentAuth } from '@/context/StudentAuthContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import RoleSelectionScreen from '@/screens/RoleSelectionScreen';
import StudentAuthScreen from '@/screens/student/StudentAuthScreen';
import StudentRegisterScreen from '@/screens/student/StudentRegisterScreen';
import StudentHomeScreen from '@/screens/student/StudentHomeScreen';
import StudentHistoryScreen from '@/screens/student/StudentHistoryScreen';
import AdminLoginScreen from '@/screens/admin/AdminLoginScreen';
import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';
import AdminRecapScreen from '@/screens/admin/AdminRecapScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const StudentStack = createStackNavigator<StudentStackParamList>();
const AdminStack = createStackNavigator<AdminStackParamList>();
const StudentTabs = createBottomTabNavigator<StudentTabParamList>();

const StudentTabNavigator = (): JSX.Element => {
  const {  logout } = useStudentAuth();
  
  const handleLogout = () => {
    console.log('🔧 Logout button pressed'); // Debug log
    
    // Web-compatible logout confirmation
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
      if (confirmed) {
        console.log('🔧 Logout confirmed (web), calling logout function');
        logout().catch(error => console.error('🔧 Logout error:', error));
      }
    } else {
      Alert.alert(
        'Konfirmasi Logout',
        'Apakah Anda yakin ingin keluar?',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Logout', 
            style: 'destructive',
            onPress: async () => {
              console.log('🔧 Logout confirmed, calling logout function');
              try {
                await logout();
                console.log('🔧 Logout successful');
              } catch (error) {
                console.error('🔧 Logout error:', error);
              }
            }
          }
        ]
      );
    }
  };

  const LogoutButton = () => (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        minHeight: 32, // Ensure clickable area
        ...(Platform.OS === 'web' && { cursor: 'pointer' }), // Web cursor
      }}
      activeOpacity={0.7}
    >
      <Text style={{ fontSize: 14, marginRight: 4 }}>🚪</Text>
      <Text style={{ 
        color: COLORS.text.white, 
        fontSize: 12, 
        fontWeight: '600',
        ...(Platform.OS === 'web' && { userSelect: 'none' }), // Prevent text selection on web
      }}>
        Logout
      </Text>
    </TouchableOpacity>
  );

  return (
    <StudentTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border.light,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.text.white,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerRight: () => <LogoutButton />,
      }}
    >
      <StudentTabs.Screen 
        name="StudentHome" 
        component={StudentHomeScreen} 
        options={{ 
          title: 'Absensi',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '✅' : '📝'}</Text>
          ),
        }} 
      />
      <StudentTabs.Screen 
        name="StudentHistory" 
        component={StudentHistoryScreen} 
        options={{ 
          title: 'Riwayat',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📊' : '📋'}</Text>
          ),
        }} 
      />
    </StudentTabs.Navigator>
  );
};

const StudentStackNavigator = (): JSX.Element => {
  const { student } = useStudentAuth();
  

  const navigatorKey = React.useMemo(() => {
    return student ? `student-stack-${student.id}` : 'student-stack-guest';
  }, [student]);
  
  return (
    <StudentStack.Navigator key={navigatorKey}>
      {student ? (
        // Jika sudah login, langsung ke tabs
        <StudentStack.Screen name="StudentTabs" component={StudentTabNavigator} options={{ headerShown: false }} />
      ) : (
        // Jika belum login, tampilkan auth screens
        <>
          <StudentStack.Screen name="StudentAuth" component={StudentAuthScreen} options={{ headerShown: false }} />
          <StudentStack.Screen name="StudentRegister" component={StudentRegisterScreen} options={{ title: 'Registrasi Mahasiswa' }} />
          <StudentStack.Screen name="StudentTabs" component={StudentTabNavigator} options={{ headerShown: false }} />
        </>
      )}
    </StudentStack.Navigator>
  );
};

const AdminStackNavigator = (): JSX.Element => {
  const { admin } = useAdminAuth();
  
  // Generate key to force navigator reset on auth state change
  const navigatorKey = React.useMemo(() => {
    return admin ? `admin-stack-${admin.id}` : 'admin-stack-guest';
  }, [admin]);
  
  return (
    <AdminStack.Navigator
      key={navigatorKey}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.text.white,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      {admin ? (
        // Jika sudah login, langsung ke dashboard
        <>
          <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard Admin' }} />
          <AdminStack.Screen name="AdminRecap" component={AdminRecapScreen} options={{ title: 'Rekap Absensi' }} />
        </>
      ) : (
        // Jika belum login, tampilkan login screen
        <>
          <AdminStack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }} />
          <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard Admin' }} />
          <AdminStack.Screen name="AdminRecap" component={AdminRecapScreen} options={{ title: 'Rekap Absensi' }} />
        </>
      )}
    </AdminStack.Navigator>
  );
};

const RootNavigator = (): JSX.Element => {
  const { student } = useStudentAuth();
  const { admin } = useAdminAuth();

  // Generate key based on auth state to force navigator reset on logout
  const navigatorKey = React.useMemo(() => {
    if (student) return `student-${student.id}`;
    if (admin) return `admin-${admin.id}`;
    return 'guest';
  }, [student, admin]);

  // Render different navigators based on auth state to ensure clean logout
  if (student) {
    return (
      <RootStack.Navigator key={navigatorKey} screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="StudentFlow" component={StudentStackNavigator} />
      </RootStack.Navigator>
    );
  }
  
  if (admin) {
    return (
      <RootStack.Navigator key={navigatorKey} screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="AdminFlow" component={AdminStackNavigator} />
      </RootStack.Navigator>
    );
  }
  
  return (
    <RootStack.Navigator key={navigatorKey} screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <RootStack.Screen name="StudentFlow" component={StudentStackNavigator} />
      <RootStack.Screen name="AdminFlow" component={AdminStackNavigator} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
