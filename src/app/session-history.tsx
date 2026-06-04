import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SessionHistoryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color="#434654" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session History</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="filter-list" size={24} color="#434654" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Session List */}
        <View style={styles.sessionList}>
          
          {/* Session Card 1 */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida/AP1WRLuiQwZU8XPEwcJCGu2caQWDvXy0X47fpdErBGFeaFjb-r4j16ic3VQht_RYRJbi-umGuG_OqF4g8AAVgJVJ9mZAiDzdZuuFoFJC8PKI_hxa6Oq_B3eenmL-P8N6QYAxCLS1UiucRZpuL_jpRz3BQILUS--Rkow4n7j8DyA903qtOZzAMDH1rYqip_I91QGSMPS6Wr2p0q4TOHMNHWA8bRpHDJS0yBdrXLirbt6jFyPyBRglkMXBCYjoh-0' }}
                  style={styles.tutorAvatar}
                />
                <View>
                  <Text style={styles.tutorName}>Emma Watson</Text>
                  <Text style={styles.sessionDate}>Oct 24 • Advanced Conversation</Text>
                </View>
              </View>
              <View style={styles.completedBadge}>
                <MaterialIcons name="check-circle" size={14} color="#006e2d" style={{marginRight: 4}} />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            </View>

            {/* Audio Player */}
            <View style={styles.audioPlayer}>
              <TouchableOpacity style={styles.playButton}>
                <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.playerRight}>
                <View style={styles.waveformContainer}>
                  <View style={styles.waveformProgress} />
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>12:34</Text>
                  <Text style={styles.timeText}>45:00</Text>
                </View>
              </View>
            </View>

            {/* Notes Snippet */}
            <View style={styles.notesContainer}>
              <Text style={styles.notesText} numberOfLines={2}>
                Excellent pronunciation today! We focused on idiomatic expressions related to business negotiations. Remember to practice the 'th' sound...
              </Text>
              <TouchableOpacity style={{marginTop: 8}}>
                <Text style={styles.viewNotesText}>View Full Notes</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Session Card 2 */}
          <View style={[styles.card, { opacity: 0.8 }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.tutorAvatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>MJ</Text>
                </View>
                <View>
                  <Text style={styles.tutorName}>Michael Johnson</Text>
                  <Text style={styles.sessionDate}>Oct 18 • Grammar Focus</Text>
                </View>
              </View>
              <View style={styles.completedBadge}>
                <MaterialIcons name="check-circle" size={14} color="#006e2d" style={{marginRight: 4}} />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            </View>

            {/* Notes Snippet */}
            <View style={[styles.notesContainer, { marginTop: 12 }]}>
              <Text style={styles.notesText} numberOfLines={2}>
                Good progress on past perfect tense. Review the worksheet sent after class before our next session.
              </Text>
              <TouchableOpacity style={{marginTop: 8}}>
                <Text style={styles.viewNotesText}>View Full Notes</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: '#faf8ff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 198, 214, 0.4)',
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003594',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#003594',
  },
  statLabel: {
    fontSize: 14,
    color: '#434654',
    marginTop: 4,
  },
  sessionList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tutorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
  },
  avatarPlaceholder: {
    backgroundColor: '#e7e7f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#434654',
  },
  tutorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#006e2d',
  },
  audioPlayer: {
    backgroundColor: '#ededf8',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#004ac6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerRight: {
    flex: 1,
  },
  waveformContainer: {
    height: 24,
    backgroundColor: 'rgba(184, 200, 255, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  waveformProgress: {
    width: '40%',
    height: '100%',
    backgroundColor: '#b4c5ff',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#434654',
  },
  notesContainer: {
    backgroundColor: '#f3f3fd',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.3)',
  },
  notesText: {
    fontSize: 14,
    color: '#434654',
    lineHeight: 20,
  },
  viewNotesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003594',
  }
});
