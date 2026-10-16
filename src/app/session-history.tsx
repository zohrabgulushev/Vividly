import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

interface SessionItem {
  id: string;
  tutorName: string;
  tutorAvatar?: string;
  initials?: string;
  date: string;
  topic: string;
  type: 'private' | 'group';
  durationMins: number;
  audioDurationSecs: number;
  notes: string;
  vocabulary: string[];
}

const SESSIONS: SessionItem[] = [
  {
    id: 's-1',
    tutorName: 'Emma Watson',
    tutorAvatar: 'https://lh3.googleusercontent.com/aida/AP1WRLuiQwZU8XPEwcJCGu2caQWDvXy0X47fpdErBGFeaFjb-r4j16ic3VQht_RYRJbi-umGuG_OqF4g8AAVgJVJ9mZAiDzdZuuFoFJC8PKI_hxa6Oq_B3eenmL-P8N6QYAxCLS1UiucRZpuL_jpRz3BQILUS--Rkow4n7j8DyA903qtOZzAMDH1rYqip_I91QGSMPS6Wr2p0q4TOHMNHWA8bRpHDJS0yBdrXLirbt6jFyPyBRglkMXBCYjoh-0',
    date: 'Oct 24 • Advanced Conversation',
    topic: 'Business Negotiations & Phrasal Verbs',
    type: 'private',
    durationMins: 45,
    audioDurationSecs: 2700,
    notes: 'Excellent pronunciation today! We focused on idiomatic expressions related to business negotiations. Remember to practice the "th" sound and voicing on voiced consonants.',
    vocabulary: ['Leverage', 'Synergy', 'Bottom line', 'Counteroffer', 'Touch base'],
  },
  {
    id: 's-2',
    tutorName: 'Michael Johnson',
    initials: 'MJ',
    date: 'Oct 18 • Grammar Focus',
    topic: 'Mastering Past Perfect & Conditionals',
    type: 'private',
    durationMins: 30,
    audioDurationSecs: 1800,
    notes: 'Good progress on past perfect tense. Review the worksheet sent after class before our next session. Great confidence when expressing past hypotheses.',
    vocabulary: ['Had known', 'Would have been', 'Provided that', 'In retrospect'],
  },
  {
    id: 's-3',
    tutorName: 'Sarah Jenkins',
    initials: 'SJ',
    date: 'Oct 12 • Group Discussion',
    topic: 'Future of AI in Workplace',
    type: 'group',
    durationMins: 60,
    audioDurationSecs: 3600,
    notes: 'Great active listening and turn-taking during the team debate. You successfully defended your argument regarding productivity automation.',
    vocabulary: ['Automation', 'Disruption', 'Ethical dilemma', 'Consensus'],
  },
];

export default function SessionHistoryScreen() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<'all' | 'private' | 'group'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackSeconds, setPlaybackSeconds] = useState(754); // 12:34
  const [selectedNotesSession, setSelectedNotesSession] = useState<SessionItem | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (playingId) {
      interval = setInterval(() => {
        setPlaybackSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playingId]);

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const filteredSessions = SESSIONS.filter(s => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/speak')} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color="#434654" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session History</Text>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setFilterType(prev => prev === 'all' ? 'private' : prev === 'private' ? 'group' : 'all')}
        >
          <MaterialIcons name="filter-list" size={24} color="#003594" />
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
            <Text style={styles.statValue}>{SESSIONS.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {(['all', 'private', 'group'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, filterType === tab && styles.filterChipActive]}
              onPress={() => setFilterType(tab)}
            >
              <Text style={[styles.filterChipText, filterType === tab && styles.filterChipTextActive]}>
                {tab === 'all' ? 'All Sessions' : tab === 'private' ? '1-on-1 Calls' : 'Group Rooms'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Session List */}
        <View style={styles.sessionList}>
          {filteredSessions.map(session => {
            const isThisPlaying = playingId === session.id;
            return (
              <View key={session.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <TouchableOpacity 
                    style={styles.cardHeaderLeft}
                    activeOpacity={0.8}
                    onPress={() => router.push('/tutor-profile')}
                  >
                    {session.tutorAvatar ? (
                      <Image source={{ uri: session.tutorAvatar }} style={styles.tutorAvatar} />
                    ) : (
                      <View style={[styles.tutorAvatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarInitial}>{session.initials ?? 'T'}</Text>
                      </View>
                    )}
                    <View>
                      <Text style={styles.tutorName}>{session.tutorName}</Text>
                      <Text style={styles.sessionDate}>{session.date}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.completedBadge}>
                    <MaterialIcons name="check-circle" size={14} color="#006e2d" style={{marginRight: 4}} />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                </View>

                {/* Audio Player */}
                <View style={styles.audioPlayer}>
                  <TouchableOpacity 
                    style={[styles.playButton, isThisPlaying && { backgroundColor: '#006e2d' }]} 
                    activeOpacity={0.8}
                    onPress={() => togglePlay(session.id)}
                  >
                    <MaterialIcons name={isThisPlaying ? 'pause' : 'play-arrow'} size={24} color="#ffffff" />
                  </TouchableOpacity>
                  <View style={styles.playerRight}>
                    <View style={styles.waveformContainer}>
                      <View 
                        style={[
                          styles.waveformProgress, 
                          { width: isThisPlaying ? `${Math.min(100, Math.floor((playbackSeconds / session.audioDurationSecs) * 100))}%` : '35%' }
                        ]} 
                      />
                    </View>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeText}>
                        {isThisPlaying ? formatSeconds(playbackSeconds) : '12:34'}
                      </Text>
                      <Text style={styles.timeText}>{formatSeconds(session.audioDurationSecs)}</Text>
                    </View>
                  </View>
                </View>

                {/* Notes Snippet */}
                <View style={styles.notesContainer}>
                  <Text style={styles.notesText} numberOfLines={2}>
                    {session.notes}
                  </Text>
                  <TouchableOpacity 
                    style={{marginTop: 8}} 
                    onPress={() => setSelectedNotesSession(session)}
                  >
                    <Text style={styles.viewNotesText}>View Full Notes & Vocab →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* Full Notes Modal */}
      {selectedNotesSession && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedNotesSession(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{selectedNotesSession.tutorName}'s Feedback</Text>
                  <Text style={styles.modalSubtitle}>{selectedNotesSession.topic}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedNotesSession(null)} style={styles.modalClose}>
                  <MaterialIcons name="close" size={24} color="#151c27" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalSectionHeading}>Tutor Notes</Text>
                <Text style={styles.modalBodyText}>{selectedNotesSession.notes}</Text>

                <Text style={[styles.modalSectionHeading, { marginTop: 16 }]}>Key Vocabulary Covered</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {selectedNotesSession.vocabulary.map((word, idx) => (
                    <View key={idx} style={styles.vocabBadge}>
                      <MaterialIcons name="check" size={14} color="#003594" style={{ marginRight: 4 }} />
                      <Text style={styles.vocabBadgeText}>{word}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.bookAgainButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedNotesSession(null);
                    router.push('/book-session');
                  }}
                >
                  <MaterialIcons name="event" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.bookAgainText}>Book Next Session</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
  },
  filterChipActive: {
    backgroundColor: '#003594',
    borderColor: '#003594',
  },
  filterChipText: {
    fontSize: 13,
    color: '#434654',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3ff',
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151c27',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#737685',
    marginTop: 2,
  },
  modalClose: {
    padding: 4,
  },
  modalSectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003594',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalBodyText: {
    fontSize: 14,
    color: '#434654',
    lineHeight: 22,
    marginTop: 6,
  },
  vocabBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5f1ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  vocabBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003594',
  },
  bookAgainButton: {
    marginTop: 24,
    backgroundColor: '#004ac6',
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookAgainText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
