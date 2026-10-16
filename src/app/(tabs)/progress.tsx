import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getCallHistory } from '@/services/calls';
import type { Call } from '@/types/database';

// Build last 7 days for streak calendar
function buildWeekDays() {
  const days = ['S','M','T','W','T','F','S'];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return { label: days[d.getDay()], date: d, isToday: i === 6 };
  });
}

function formatCallDate(isoString: string): string {
  const d = new Date(isoString);
  const now = new Date();
  const diff = now.getDate() - d.getDate();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
}

export default function ProgressTab() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id ?? null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [callsLoading, setCallsLoading] = useState(true);
  const weekDays = buildWeekDays();

  useEffect(() => {
    if (!user?.id) { setCallsLoading(false); return; }
    getCallHistory(user.id).then(({ data }) => {
      setCalls((data as unknown as Call[]) ?? []);
      setCallsLoading(false);
    });
  }, [user?.id]);

  const isLoading = profileLoading;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#004ac6" />
          </View>
        )}

        {/* Streak Calendar Card */}
        {!isLoading && (
        <View style={styles.streakCard}>
          <View style={styles.streakAccentLine} />
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>Current Streak: <Text style={styles.streakCount}>🔥 {profile?.current_streak ?? 0} Days</Text></Text>
            <MaterialIcons name="local-fire-department" size={24} color="#f97316" />
          </View>

          {/* 7-Day Dynamic Calendar */}
          <View style={styles.calendarRow}>
            {weekDays.map((day, i) => {
              const isStreakDay = !day.isToday && i < 6;
              const hasStreak = (profile?.current_streak ?? 0) > 0;
              return (
                <View key={i} style={styles.calendarDay}>
                  <Text style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}>{day.label}</Text>
                  {day.isToday ? (
                    <View style={[styles.dayCircle, styles.dayCircleToday]}>
                      <MaterialIcons name="fiber-manual-record" size={16} color="#004ac6" />
                    </View>
                  ) : hasStreak && isStreakDay ? (
                    <View style={[styles.dayCircle, styles.dayCircleActive]}>
                      <MaterialIcons name="local-fire-department" size={20} color="#ffffff" />
                    </View>
                  ) : (
                    <View style={[styles.dayCircle, styles.dayCircleFuture]}>
                      <MaterialIcons name="fiber-manual-record" size={16} color="#c3c6d6" />
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <TouchableOpacity 
            style={styles.freezeBtn} 
            activeOpacity={0.8}
            onPress={() => router.push('/store')}
          >
            <Text style={styles.freezeText}>❄️ Streak Freeze available</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#004ac6" />
          </TouchableOpacity>
        </View>
        )}

        {/* Learning Stats Grid */}
        {!isLoading && (
        <View style={styles.statsGrid}>
          {/* Total XP */}
          <TouchableOpacity 
            style={[styles.statCard, { borderColor: 'rgba(254, 166, 25, 0.2)' }]}
            activeOpacity={0.8}
            onPress={() => router.push('/store')}
          >
            <View style={styles.statBgIcon}>
              <MaterialIcons name="star" size={100} color="rgba(254, 166, 25, 0.1)" />
            </View>
            <Text style={styles.statLabel}>TOTAL XP</Text>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>{(profile?.xp_balance ?? 0).toLocaleString()}</Text>
          </TouchableOpacity>

          {/* Minutes Balance */}
          <TouchableOpacity 
            style={[styles.statCard, { borderColor: 'rgba(0, 74, 198, 0.1)' }]}
            activeOpacity={0.8}
            onPress={() => router.push('/top-up')}
          >
            <View style={styles.statBgIcon}>
              <MaterialIcons name="hourglass-empty" size={100} color="rgba(0, 74, 198, 0.05)" />
            </View>
            <Text style={styles.statLabel}>MINUTES</Text>
            <Text style={[styles.statValue, { color: '#004ac6' }]}>{profile?.minutes_balance ?? 0}</Text>
          </TouchableOpacity>
        </View>
        )}

        {/* Speaking History */}
        <View style={styles.historySection}>
          <TouchableOpacity 
            style={styles.historyHeader}
            activeOpacity={0.8}
            onPress={() => router.push('/session-history')}
          >
            <Text style={styles.historyTitle}>Recent Calls</Text>
            <View style={styles.balanceBadge}>
              <MaterialIcons name="hourglass-empty" size={14} color="#004ac6" />
              <Text style={styles.balanceText}>Balance: {profile?.minutes_balance ?? 0} mins</Text>
            </View>
          </TouchableOpacity>

          {callsLoading ? (
            <ActivityIndicator size="small" color="#004ac6" style={{ marginTop: 16 }} />
          ) : calls.length === 0 ? (
            <TouchableOpacity 
              style={styles.emptyState}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/speak')}
            >
              <MaterialIcons name="record-voice-over" size={40} color="#c3c6d6" />
              <Text style={styles.emptyStateText}>No sessions yet</Text>
              <Text style={styles.emptySubtext}>Book your first speaking session!</Text>
            </TouchableOpacity>
          ) : (
          <View style={styles.historyList}>
            {calls.slice(0, 10).map((call, index) => (
              <TouchableOpacity 
                key={call.id} 
                style={[styles.historyRow, index !== Math.min(calls.length, 10) - 1 && styles.historyRowBorder]}
                activeOpacity={0.7}
                onPress={() => router.push('/session-history')}
              >
                <View style={styles.historyRowLeft}>
                  <View style={styles.historyIconWrapper}>
                    <MaterialIcons name="record-voice-over" size={24} color="#004ac6" />
                  </View>
                  <View>
                    <Text style={styles.historyRowTitle}>{call.type === 'private' ? '1-on-1 Session' : 'Group Session'}</Text>
                    <Text style={styles.historyRowSubtitle}>{formatCallDate(call.created_at)} • {call.billed_minutes} mins</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
            ))}
          </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyStateText: { fontSize: 16, fontWeight: '600', color: '#737686' },
  emptyStateSubtext: { fontSize: 13, color: '#c3c6d6' },
  
  header: {
    paddingHorizontal: 24,
    height: 60,
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#151c27', letterSpacing: -0.5 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 16 },

  streakCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    overflow: 'hidden',
  },
  streakAccentLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: '#f97316' },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  streakTitle: { fontSize: 20, fontWeight: '600', color: '#151c27' },
  streakCount: { color: '#f97316' },

  calendarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  calendarDay: { alignItems: 'center' },
  dayLabel: { fontSize: 13, fontWeight: '500', color: '#737686', marginBottom: 8 },
  dayLabelToday: { color: '#004ac6', fontWeight: '700' },
  dayCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dayCircleActive: { backgroundColor: '#f97316' },
  dayCircleToday: { backgroundColor: '#f0f3ff', borderWidth: 2, borderColor: '#004ac6' },
  dayCircleFuture: { backgroundColor: '#f3f3fd' },

  freezeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  freezeText: { fontSize: 15, fontWeight: '600', color: '#004ac6' },

  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statBgIcon: { position: 'absolute', right: -20, top: -20 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#737686', letterSpacing: 0.5, marginBottom: 8 },
  statValue: { fontSize: 32, fontWeight: '700', letterSpacing: -1 },

  historySection: {},
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  historyTitle: { fontSize: 20, fontWeight: '700', color: '#151c27' },
  balanceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f3ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4, borderWidth: 1, borderColor: '#dbe1ff' },
  balanceText: { fontSize: 12, fontWeight: '600', color: '#004ac6' },

  historyList: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e2ec',
  },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff' },
  historyRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f3ff' },
  historyRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  historyIconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f0f3ff', alignItems: 'center', justifyContent: 'center' },
  historyRowTitle: { fontSize: 16, fontWeight: '600', color: '#151c27', marginBottom: 4 },
  historyRowSubtitle: { fontSize: 13, color: '#737686' },
});
