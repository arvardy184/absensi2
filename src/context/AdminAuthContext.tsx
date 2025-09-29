import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupabaseService } from '@/services/SupabaseService';
import { Admin } from '@/models/Admin';

interface AdminAuthContextValue {
  admin: Admin | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'absensi.admin.session';

/**
 * Provides authentication state management for administrators.
 */
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setLoading(false);
        return;
      }
      const parsed = JSON.parse(stored) as { username: string, password: string };
      const authenticated = await SupabaseService.authenticateUser(parsed.username, parsed.password);
      if (authenticated && authenticated instanceof Admin) {
        setAdmin(authenticated);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const authenticated = await SupabaseService.authenticateUser(username, password);
    if (!authenticated || !(authenticated instanceof Admin)) {
      return false;
    }
    setAdmin(authenticated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ username, password }));
    return true;
  }, []);

  const logout = useCallback(async () => {
    setAdmin(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextValue => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
