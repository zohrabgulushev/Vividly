import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';

export default function LearnTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>A2</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 14 Days</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.greetingTitle}>Ready to learn?</Text>
        <Text style={styles.greetingSubtitle}>Your next lesson is waiting.</Text>

        <View style={styles.lessonCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.cardImage}
          />
          <View style={styles.cardOverlay}>
            <View style={styles.cardTag}>
              <Text style={styles.cardTagText}>Daily Review</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Airport Conversation</Text>
              <Text style={styles.cardDescription}>Practice listening to common airport phrases and test your memory.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Lesson</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  levelBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  levelText: { fontSize: 14, fontWeight: '700', color: '#374151' },
  streakBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  streakText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
  cardContainer: { flex: 1, paddingHorizontal: 24 },
  greetingTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 4 },
  greetingSubtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  lessonCard: { width: '100%', height: 380, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, marginBottom: 32 },
  cardImage: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between', padding: 24 },
  cardTag: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  cardTagText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  cardContent: { gap: 8 },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  cardDescription: { fontSize: 14, color: '#E5E7EB', lineHeight: 20 },
  startButton: { backgroundColor: '#2563EB', paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  startButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
