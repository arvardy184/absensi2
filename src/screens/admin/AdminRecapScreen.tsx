import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, RefreshControl, TouchableOpacity, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ATTENDANCE_STATUSES, AttendanceStatus, COLORS, SPACING, RADIUS, CLASS_OPTIONS } from '@/constants';
import { getAttendanceAggregation } from '@/services/AttendanceService';
import { AggregatedAttendanceRow } from '@/services/AttendanceService';
import Dropdown from '@/components/Dropdown';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getResponsivePadding, responsive, isMobileScreen } from '@/utils/responsive';

const AdminRecapScreen: React.FC = () => {
  const { logout } = useAdminAuth();
  const [filter, setFilter] = useState<{ nim?: string; className?: string; status?: AttendanceStatus; date?: string }>({});
  const [data, setData] = useState<AggregatedAttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getAttendanceAggregation(filter);
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const clearFilters = () => {
    setFilter({});
  };

  const getStatusColor = (status: string) => {
    return COLORS.status[status as keyof typeof COLORS.status] || COLORS.secondary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleLogout = () => {
    console.log('🔧 Admin RecapScreen logout button pressed'); // Debug log
    
    // Web-compatible logout confirmation
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
      if (confirmed) {
        console.log('🔧 Admin RecapScreen logout confirmed (web), calling logout function');
        logout().catch(error => console.error('🔧 Admin RecapScreen logout error:', error));
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
              console.log('🔧 Admin RecapScreen logout confirmed, calling logout function');
              try {
                await logout();
                console.log('🔧 Admin RecapScreen logout successful');
              } catch (error) {
                console.error('🔧 Admin RecapScreen logout error:', error);
              }
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Rekapitulasi Absensi 📋</Text>
            <Text style={styles.subtitle}>Total: {data.length} record</Text>
          </View>
         
        </View>
      </View>

      <View style={styles.filtersCard}>
        <View style={styles.filtersHeader}>
          <Text style={styles.filtersTitle}>Filter Data</Text>
          <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>NIM</Text>
            <TextInput
              placeholder="Cari berdasarkan NIM"
              value={filter.nim ?? ''}
              onChangeText={(value) => setFilter((prev) => ({ ...prev, nim: value || undefined }))}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kelas</Text>
            <Dropdown
              options={[
                { label: 'Semua Kelas', value: '' },
                ...CLASS_OPTIONS.map(classOption => ({ label: classOption.label, value: classOption.value }))
              ]}
              value={filter.className ?? ''}
              placeholder="Pilih kelas"
              onSelect={(value) => setFilter((prev) => ({ ...prev, className: value === '' ? undefined : value }))}
            />
          </View>
        </View>
        
       
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.student_id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.student_name}</Text>
                <Text style={styles.studentDetails}>
                  {item.student_nim} • {item.student_class || 'Kelas tidak diketahui'}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) }
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            
            <View style={styles.cardBody}>
              <Text style={styles.dateText}>
                📅 {formatDate(item.date)}
              </Text>
              {item.reason && (
                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonLabel}>Alasan:</Text>
                  <Text style={styles.reasonText}>{item.reason}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>Tidak Ada Data</Text>
            <Text style={styles.emptyText}>
              {Object.keys(filter).length > 0 
                ? 'Tidak ada data yang sesuai dengan filter yang dipilih.'
                : 'Belum ada data absensi yang tersedia.'
              }
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={data.length === 0 ? styles.emptyList : { paddingBottom: SPACING.xxl }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: getResponsivePadding(),
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error,
  },
  filtersCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.error + '20',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.error,
  },
  filterRow: {
    flexDirection: responsive({
      mobile: 'column',
      tablet: 'row',
      desktop: 'row',
      default: 'column',
    }),
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontSize: 14,
    backgroundColor: COLORS.background,
    color: COLORS.text.primary,
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
    marginBottom: SPACING.md,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  studentDetails: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginLeft: SPACING.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.white,
  },
  cardBody: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  reasonContainer: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  reasonText: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontStyle: 'italic',
    lineHeight: 18,
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

export default AdminRecapScreen;
