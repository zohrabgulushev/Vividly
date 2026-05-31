import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RECENT_CALLS = [
  { id: '1', title: 'Conversation Practice', subtitle: 'Today, 10:00 AM • 15 mins' },
  { id: '2', title: 'Pronunciation Drill', subtitle: 'Yesterday, 4:30 PM • 30 mins' },
  { id: '3', title: 'Grammar Q&A', subtitle: 'Oct 24, 2:00 PM • 15 mins' },
];

export default function ProgressTab() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Streak Calendar Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakAccentLine} />
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>Current Streak: <Text style={styles.streakCount}>🔥 14 Days</Text></Text>
            <MaterialIcons name="local-fire-department" size={24} color="#f97316" />
          </View>

          {/* 7-Day Mini Calendar */}
          <View style={styles.calendarRow}>
            {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
              <View key={i} style={styles.calendarDay}>
                <Text style={styles.dayLabel}>{day}</Text>
                <View style={[styles.dayCircle, styles.dayCircleActive]}>
                  <MaterialIcons name="local-fire-department" size={20} color="#ffffff" />
                </View>
              </View>
            ))}
            {/* Today */}
            <View style={styles.calendarDay}>
              <Text style={[styles.dayLabel, styles.dayLabelToday]}>S</Text>
              <View style={[styles.dayCircle, styles.dayCircleToday]}>
                <MaterialIcons name="fiber-manual-record" size={16} color="#004ac6" />
              </View>
            </View>
            {/* Tomorrow */}
            <View style={styles.calendarDay}>
              <Text style={styles.dayLabel}>S</Text>
              <View style={[styles.dayCircle, styles.dayCircleFuture]}>
                <MaterialIcons name="fiber-manual-record" size={16} color="#c3c6d6" />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.freezeBtn} activeOpacity={0.8}>
            <Text style={styles.freezeText}>❄️ Streak Freeze available</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#004ac6" />
          </TouchableOpacity>
        </View>

        {/* Learning Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Total XP */}
          <View style={[styles.statCard, { borderColor: 'rgba(254, 166, 25, 0.2)' }]}>
            <View style={styles.statBgIcon}>
              <MaterialIcons name="star" size={100} color="rgba(254, 166, 25, 0.1)" />
            </View>
            <Text style={styles.statLabel}>TOTAL XP</Text>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>12,450</Text>
          </View>

          {/* Lessons Completed */}
          <View style={[styles.statCard, { borderColor: 'rgba(0, 74, 198, 0.1)' }]}>
            <View style={styles.statBgIcon}>
              <MaterialIcons name="menu-book" size={100} color="rgba(0, 74, 198, 0.05)" />
            </View>
            <Text style={styles.statLabel}>LESSONS</Text>
            <Text style={[styles.statValue, { color: '#004ac6' }]}>342</Text>
          </View>
        </View>

        {/* Speaking History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Calls</Text>
            <View style={styles.balanceBadge}>
              <MaterialIcons name="hourglass-empty" size={14} color="#004ac6" />
              <Text style={styles.balanceText}>Balance: 120 mins</Text>
            </View>
          </View>

          <View style={styles.historyList}>
            {RECENT_CALLS.map((call, index) => (
              <TouchableOpacity 
                key={call.id} 
                style={[styles.historyRow, index !== RECENT_CALLS.length - 1 && styles.historyRowBorder]}
                activeOpacity={0.7}
              >
                <View style={styles.historyRowLeft}>
                  <View style={styles.historyIconWrapper}>
                    <MaterialIcons name="record-voice-over" size={24} color="#004ac6" />
                  </View>
                  <View>
                    <Text style={styles.historyRowTitle}>{call.title}</Text>
                    <Text style={styles.historyRowSubtitle}>{call.subtitle}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },
  
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
