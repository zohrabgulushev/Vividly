import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Image,
  TouchableOpacity, Switch, Platform, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getCallHistory } from '@/services/calls';
import type { Call } from '@/types/database';

// ─── helpers ──────────────────────────────────────────────────────────────────
function buildWeekDays() {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return { label: labels[d.getDay()], date: d, isToday: i === 6 };
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

// ─── component ────────────────────────────────────────────────────────────────
export default function ProfileTab() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [calls, setCalls] = useState<Call[]>([]);
  const [callsLoading, setCallsLoading] = useState(true);
  const [callsExpanded, setCallsExpanded] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);
  const weekDays = buildWeekDays();

  useEffect(() => {
    if (!user?.id) { setCallsLoading(false); return; }
    getCallHistory(user.id).then(({ data }) => {
      setCalls((data as unknown as Call[]) ?? []);
      setCallsLoading(false);
    });
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const streak = profile?.current_streak ?? 0;
  const hasStreak = streak > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Profile Header ─────────────────────────────────────────── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name ?? 'User')}&background=004ac6&color=fff&size=200` }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8} onPress={() => router.push('/edit-profile' as any)}>
              <MaterialIcons name="edit" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile?.full_name ?? user?.email?.split('@')[0] ?? 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.8} onPress={() => router.push('/edit-profile' as any)}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Streak Card ────────────────────────────────────────────── */}
        <View style={styles.streakCard}>
          <View style={styles.streakAccentLine} />
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>
              Current Streak:{' '}
              <Text style={styles.streakCount}>🔥 {streak} Days</Text>
            </Text>
            <MaterialIcons name="local-fire-department" size={24} color="#f97316" />
          </View>

          {/* 7-Day Calendar */}
          <View style={styles.calendarRow}>
            {weekDays.map((day, i) => {
              const isStreakDay = !day.isToday && i < 6;
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
            onPress={() => router.push('/store' as any)}
          >
            <Text style={styles.freezeText}>❄️ Streak Freeze available</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#004ac6" />
          </TouchableOpacity>
        </View>

        {/* ── Stats Grid — Total XP + Lessons ────────────────────────── */}
        <View style={styles.statsGrid}>
          {/* Total XP */}
          <TouchableOpacity style={[styles.statCard, { borderColor: 'rgba(254,166,25,0.2)' }]} activeOpacity={0.8} onPress={() => router.push('/store' as any)}>
            <View style={styles.statBgIcon}>
              <MaterialIcons name="star" size={100} color="rgba(254,166,25,0.1)" />
            </View>
            <Text style={styles.statLabel}>TOTAL XP</Text>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>{(profile?.xp_balance ?? 0).toLocaleString()}</Text>
          </TouchableOpacity>

          {/* Minutes Balance */}
          <TouchableOpacity style={[styles.statCard, { borderColor: 'rgba(0,74,198,0.1)' }]} activeOpacity={0.8} onPress={() => router.push('/top-up' as any)}>
            <View style={styles.statBgIcon}>
              <MaterialIcons name="hourglass-empty" size={100} color="rgba(0,74,198,0.05)" />
            </View>
            <Text style={styles.statLabel}>MINUTES</Text>
            <Text style={[styles.statValue, { color: '#004ac6' }]}>{profile?.minutes_balance ?? 0}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Recent Calls (collapsible) ──────────────────────────────── */}
        <View style={styles.callsSection}>
          {/* Header row — tap to expand/collapse */}
          <TouchableOpacity style={styles.callsHeader} activeOpacity={0.7} onPress={() => setCallsExpanded(v => !v)}>
            <Text style={styles.callsTitle}>Recent Calls</Text>
            <View style={styles.callsHeaderRight}>
              <View style={styles.balanceBadge}>
                <MaterialIcons name="hourglass-empty" size={14} color="#004ac6" />
                <Text style={styles.balanceText}>Balance: {profile?.minutes_balance ?? 0} mins</Text>
              </View>
              <MaterialIcons
                name={callsExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={22}
                color="#737686"
              />
            </View>
          </TouchableOpacity>

          {/* Expanded list */}
          {callsExpanded && (
            <View style={styles.callsList}>
              {callsLoading ? (
                <ActivityIndicator size="small" color="#004ac6" style={{ marginVertical: 16 }} />
              ) : calls.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="record-voice-over" size={36} color="#c3c6d6" />
                  <Text style={styles.emptyText}>No sessions yet</Text>
                  <Text style={styles.emptySubtext}>Book your first speaking session!</Text>
                </View>
              ) : (
                calls.slice(0, 8).map((call, index) => (
                  <TouchableOpacity
                    key={call.id}
                    style={[styles.callRow, index !== Math.min(calls.length, 8) - 1 && styles.callRowBorder]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.callIconWrapper}>
                      <MaterialIcons name="record-voice-over" size={24} color="#004ac6" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.callRowTitle}>{call.type === 'private' ? '1-on-1 Session' : 'Group Session'}</Text>
                      <Text style={styles.callRowSub}>{formatCallDate(call.created_at)} • {call.billed_minutes} mins</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="#c3c6d6" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>

        {/* ── Settings ───────────────────────────────────────────────── */}
        <View style={styles.settingsContainer}>

          {/* Account */}
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>ACCOUNT</Text>
            <View style={styles.groupCard}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/personal-info' as any)}>
                <View style={styles.settingIconWrapper}><MaterialIcons name="person" size={22} color="#004ac6" /></View>
                <Text style={styles.settingText}>Personal Information</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/payment-methods' as any)}>
                <View style={styles.settingIconWrapper}><MaterialIcons name="credit-card" size={22} color="#004ac6" /></View>
                <Text style={styles.settingText}>Payment Methods</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>PREFERENCES</Text>
            <View style={styles.groupCard}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/notifications' as any)}>
                <View style={styles.settingIconWrapper}><MaterialIcons name="notifications" size={22} color="#004ac6" /></View>
                <Text style={styles.settingText}>Notifications</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/language' as any)}>
                <View style={styles.settingIconWrapper}><MaterialIcons name="language" size={22} color="#004ac6" /></View>
                <Text style={styles.settingText}>App Language</Text>
                <Text style={styles.settingValue}>English</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingIconWrapper}><MaterialIcons name="dark-mode" size={22} color="#004ac6" /></View>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: '#e2e2ec', true: '#004ac6' }} thumbColor="#ffffff" />
              </View>
            </View>
          </View>

          {/* Support */}
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>SUPPORT</Text>
            <View style={styles.groupCard}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/help-center' as any)}>
                <View style={styles.settingIconWrapper}><MaterialIcons name="help" size={22} color="#004ac6" /></View>
                <Text style={styles.settingText}>Help Center</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                <View style={styles.settingIconWrapper}><MaterialIcons name="shield" size={22} color="#004ac6" /></View>
                <Text style={styles.settingText}>Privacy Policy</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Log Out */}
          <View style={[styles.groupCard, styles.logoutCard]}>
            <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
              <View style={styles.logoutIconWrapper}><MaterialIcons name="logout" size={22} color="#dc2626" /></View>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },

  appBar: {
    paddingHorizontal: 24,
    height: 60,
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  appBarTitle: { fontSize: 24, fontWeight: '700', color: '#151c27', letterSpacing: -0.5 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 110, paddingTop: 16 },

  // Profile header
  profileHeader: { alignItems: 'center', marginBottom: 28 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#ffffff' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#004ac6', width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#ffffff',
  },
  userName: { fontSize: 24, fontWeight: '700', color: '#151c27', marginBottom: 4 },
  userEmail: { fontSize: 15, color: '#737686', marginBottom: 16 },
  editProfileBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#c3c6d6' },
  editProfileText: { fontSize: 14, fontWeight: '600', color: '#434655' },

  // Streak card
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
  streakTitle: { fontSize: 18, fontWeight: '600', color: '#151c27' },
  streakCount: { color: '#f97316', fontWeight: '700' },

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

  // Stats grid
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 24, padding: 20, minHeight: 120,
    justifyContent: 'center', shadowColor: '#004ac6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, borderWidth: 1, overflow: 'hidden',
  },
  statBgIcon: { position: 'absolute', right: -20, top: -20 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#737686', letterSpacing: 0.5, marginBottom: 8 },
  statValue: { fontSize: 32, fontWeight: '700', letterSpacing: -1 },

  // Recent calls (collapsible)
  callsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  callsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  callsHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  callsTitle: { fontSize: 18, fontWeight: '700', color: '#151c27' },
  balanceBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f0f3ff', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, gap: 4, borderWidth: 1, borderColor: '#dbe1ff',
  },
  balanceText: { fontSize: 12, fontWeight: '600', color: '#004ac6' },
  callsList: { borderTopWidth: 1, borderTopColor: '#f0f3ff' },
  callRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#ffffff', gap: 14,
  },
  callRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f3ff' },
  callIconWrapper: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#f0f3ff', alignItems: 'center', justifyContent: 'center',
  },
  callRowTitle: { fontSize: 15, fontWeight: '600', color: '#151c27', marginBottom: 3 },
  callRowSub: { fontSize: 13, color: '#737686' },
  emptyState: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#737686' },
  emptySubtext: { fontSize: 13, color: '#c3c6d6' },

  // Settings
  settingsContainer: { gap: 24 },
  settingsGroup: {},
  groupTitle: { fontSize: 12, fontWeight: '600', color: '#737686', letterSpacing: 1, marginBottom: 8, marginLeft: 16 },
  groupCard: {
    backgroundColor: '#ffffff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)',
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#ffffff' },
  settingIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f3ff', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingText: { flex: 1, fontSize: 16, color: '#151c27' },
  settingValue: { fontSize: 16, color: '#737686', marginRight: 8 },
  divider: { height: 1, backgroundColor: '#f0f3ff', marginLeft: 72 },

  logoutCard: { marginTop: 16 },
  logoutRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#ffffff' },
  logoutIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  logoutText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#dc2626' },
});
