import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useStudentAuth } from '@/context/StudentAuthContext';
import { AttendanceRecord } from '@/models/AttendanceRecord';
import { listAttendance } from '@/services/AttendanceService';
import { COLORS, SPACING, RADIUS } from '@/constants';

const StudentHistoryScreen: React.FC = () => {
  const { student } = useStudentAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAttendance = useCallback(async () => {
    if (!student?.id) return;
    
    try {
      const result = await listAttendance(student.id);
      setRecords(result);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  }, [student?.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAttendance();
    setRefreshing(false);
  }, [loadAttendance]);

  useFocusEffect(
    useCallback(() => {
      loadAttendance();
    }, [loadAttendance])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HADIR': return '✅';
      case 'IZIN': return '📝';
      case 'SAKIT': return '🏥';
      case 'ALFA': return '❌';
      default: return '❓';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Absensi</Text>
        <Text style={styles.subtitle}>
          Total: {records.length} hari tercatat
        </Text>
      </View>
      
      <FlatList
        data={records}
        keyExtractor={(item) => item.id ? String(item.id) : `${item.date}-${item.status}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.dateContainer}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <Text style={styles.dateShort}>{item.date}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: COLORS.status[item.status as keyof typeof COLORS.status] }
              ]}>
                <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            {item.reason && (
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Alasan:</Text>
                <Text style={styles.reason}>{item.reason}</Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
            <Text style={styles.emptyText}>
              Riwayat absensi Anda akan muncul di sini setelah Anda melakukan absensi pertama.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={records.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  dateShort: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginLeft: SPACING.md,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.white,
  },
  reasonContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  reason: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});

export default StudentHistoryScreen;
