import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupabaseService } from '@/services/SupabaseService';
import { Student } from '@/models/Student';


export interface RegisterStudentPayload {
  name: string;
  username: string;
  nim: string;
  password: string;
  className: string;
}

interface StudentAuthContextValue {
  student: Student | null;
  loading: boolean;
  login: (nim: string, password: string) => Promise<boolean>;
  register: (payload: RegisterStudentPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'absensi.student.session';

/**
 * Provides authentication state management for students.
 */
export const StudentAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setLoading(false);
        return;
      }
      const parsed = JSON.parse(stored) as { username: string, password: string };
      const found = await SupabaseService.authenticateUser(parsed.username, parsed.password);
      if (found && found instanceof Student) {
        setStudent(found);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (nim: string, password: string) => {
    // For student login, we use NIM as username
    const found = await SupabaseService.authenticateUser(nim, password);
    if (!found || !(found instanceof Student)) {
      return false;
    }
    setStudent(found);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ username: nim, password }));
    return true;
  }, []);

  const registerHandler = useCallback(async (payload: RegisterStudentPayload) => {
    try {
      // Check if username (NIM) already exists
      const nimExists = await SupabaseService.checkNimExists(payload.nim);
      if (nimExists) {
        throw new Error('NIM already exists');
      }

      const usernameExists = await SupabaseService.checkUsernameExists(payload.username);
      if (usernameExists) {
        throw new Error('Username already exists');
      }

      const created = await SupabaseService.registerStudent(
        payload.name,
        payload.nim, 
        payload.nim,
        payload.password,
        payload.className
      );
      
      if (!created) {
        throw new Error('Failed to create student');
      }

      setStudent(created);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ username: payload.nim, password: payload.password }));
      return true;
    } catch (error) {
      console.error('Failed to register student', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setStudent(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <StudentAuthContext.Provider value={{ student, loading, login, register: registerHandler, logout }}>
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = (): StudentAuthContextValue => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within StudentAuthProvider');
  }
  return context;
};
