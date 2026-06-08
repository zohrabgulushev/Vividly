import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Switch, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getCallHistory } from '@/services/calls';
import type { Call } from '@/types/database';

function formatCallDate(isoString: string): string {
  const d = new Date(isoString);
  const now = new Date();
  const diff = now.getDate() - d.getDate();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
}

export default function ProfileTab() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [calls, setCalls] = useState<Call[]>([]);
  const [callsLoading, setCallsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar - Simple Title */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
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

        {/* Stats Row — XP, Minutes, Streak */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statChip} activeOpacity={0.8} onPress={() => router.push('/top-up' as any)}>
            <LinearGradient colors={['#004ac6', '#1d4ed8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statChipGrad}>
              <MaterialIcons name="hourglass-empty" size={22} color="#ffffff" />
              <Text style={styles.statChipValue}>{profile?.minutes_balance ?? 0}</Text>
              <Text style={styles.statChipLabel}>mins</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statChip} activeOpacity={0.8} onPress={() => router.push('/store' as any)}>
            <LinearGradient colors={['#f59e0b', '#d97706']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statChipGrad}>
              <MaterialIcons name="star" size={22} color="#ffffff" />
              <Text style={styles.statChipValue}>{(profile?.xp_balance ?? 0).toLocaleString()}</Text>
              <Text style={styles.statChipLabel}>XP</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.statChip}>
            <LinearGradient colors={['#f97316', '#ea580c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statChipGrad}>
              <MaterialIcons name="local-fire-department" size={22} color="#ffffff" />
              <Text style={styles.statChipValue}>{profile?.current_streak ?? 0}</Text>
              <Text style={styles.statChipLabel}>streak</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Recent Calls mini-section */}
        <View style={styles.callsSectionWrapper}>
          <View style={styles.callsSectionHeader}>
            <Text style={styles.callsSectionTitle}>Recent Calls</Text>
            <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
              <Text style={styles.callsSeeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {callsLoading ? (
            <ActivityIndicator size="small" color="#004ac6" style={{ marginVertical: 12 }} />
          ) : calls.length === 0 ? (
            <View style={styles.callsEmpty}>
              <MaterialIcons name="record-voice-over" size={28} color="#c3c6d6" />
              <Text style={styles.callsEmptyText}>No sessions yet — book your first one!</Text>
            </View>
          ) : (
            <View style={styles.callsCard}>
              {calls.slice(0, 3).map((call, index) => (
                <View key={call.id}>
                  <View style={styles.callRow}>
                    <View style={styles.callIconWrapper}>
                      <MaterialIcons name="record-voice-over" size={20} color="#004ac6" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.callRowTitle}>{call.type === 'private' ? '1-on-1 Session' : 'Group Session'}</Text>
                      <Text style={styles.callRowSub}>{formatCallDate(call.created_at)} • {call.billed_minutes} mins</Text>
                    </View>
                  </View>
                  {index < Math.min(calls.length, 3) - 1 && <View style={styles.callDivider} />}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Settings Groups */}
        <View style={styles.settingsContainer}>
          
          {/* Group 1: Account */}
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>ACCOUNT</Text>
            <View style={styles.groupCard}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/personal-info' as any)}>
                <View style={styles.settingIconWrapper}>
                  <MaterialIcons name="person" size={22} color="#004ac6" />
                </View>
                <Text style={styles.settingText}>Personal Information</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/payment-methods' as any)}>
                <View style={styles.settingIconWrapper}>
                  <MaterialIcons name="credit-card" size={22} color="#004ac6" />
                </View>
                <Text style={styles.settingText}>Payment Methods</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Group 2: Preferences */}
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>PREFERENCES</Text>
            <View style={styles.groupCard}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/notifications' as any)}>
                <View style={styles.settingIconWrapper}>
                  <MaterialIcons name="notifications" size={22} color="#004ac6" />
                </View>
                <Text style={styles.settingText}>Notifications</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/language' as any)}>
                <View style={styles.settingIconWrapper}>
                  <MaterialIcons name="language" size={22} color="#004ac6" />
                </View>
                <Text style={styles.settingText}>App Language</Text>
                <Text style={styles.settingValue}>English</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingIconWrapper}>
                  <MaterialIcons name="dark-mode" size={22} color="#004ac6" />
                </View>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: '#e2e2ec', true: '#004ac6' }}
                  thumbColor={'#ffffff'}
                />
              </View>
            </View>
          </View>

          {/* Group 3: Support */}
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>SUPPORT</Text>
            <View style={styles.groupCard}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => router.push('/help-center' as any)}>
                <View style={styles.settingIconWrapper}>
                  <MaterialIcons name="help" size={22} color="#004ac6" />
                </View>
                <Text style={styles.settingText}>Help Center</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                <View style={styles.settingIconWrapper}>
                  <MaterialIcons name="shield" size={22} color="#004ac6" />
                </View>
                <Text style={styles.settingText}>Privacy Policy</Text>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Log Out */}
          <View style={[styles.groupCard, styles.logoutCard]}>
            <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
              <View style={styles.logoutIconWrapper}>
                <MaterialIcons name="logout" size={22} color="#dc2626" />
              </View>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },
  
  appBar: {
    paddingHorizontal: 24,
    height: 60,
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  appBarTitle: { fontSize: 24, fontWeight: '700', color: '#151c27', letterSpacing: -0.5 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 16 },

  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#004ac6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  userName: { fontSize: 24, fontWeight: '700', color: '#151c27', marginBottom: 4 },
  userEmail: { fontSize: 16, color: '#737686', marginBottom: 16 },
  editProfileBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c3c6d6',
  },
  editProfileText: { fontSize: 14, fontWeight: '600', color: '#434655' },

  // Stats row
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statChip: { flex: 1, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  statChipGrad: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 2 },
  statChipValue: { fontSize: 20, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 },
  statChipLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },

  // Recent calls
  callsSectionWrapper: { marginBottom: 28 },
  callsSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  callsSectionTitle: { fontSize: 18, fontWeight: '700', color: '#151c27' },
  callsSeeAll: { fontSize: 14, fontWeight: '600', color: '#004ac6' },
  callsEmpty: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f0f3ff' },
  callsEmptyText: { fontSize: 14, color: '#737686', flex: 1 },
  callsCard: { backgroundColor: '#ffffff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  callRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14 },
  callIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f3ff', alignItems: 'center', justifyContent: 'center' },
  callRowTitle: { fontSize: 15, fontWeight: '600', color: '#151c27', marginBottom: 2 },
  callRowSub: { fontSize: 12, color: '#737686' },
  callDivider: { height: 1, backgroundColor: '#f0f3ff', marginLeft: 68 },

  settingsContainer: { gap: 24 },
  settingsGroup: {},
  groupTitle: { fontSize: 12, fontWeight: '600', color: '#737686', letterSpacing: 1, marginBottom: 8, marginLeft: 16 },
  groupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
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
