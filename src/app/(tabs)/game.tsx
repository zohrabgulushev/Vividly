import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const UPCOMING_FEATURES = [
  { icon: 'flip', label: 'Flashcards', desc: 'Memorize words with smart spaced repetition' },
  { icon: 'translate', label: 'Translation Drill', desc: 'Translate phrases under time pressure' },
  { icon: 'extension', label: 'Word Match', desc: 'Match English words to their meanings' },
  { icon: 'record-voice-over', label: 'Pronunciation Game', desc: 'Speak and score your accent accuracy' },
];

export default function GameTab() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Game</Text>
      </View>

      <View style={styles.content}>
        {/* Hero Card */}
        <LinearGradient
          colors={['#004ac6', '#6d28d9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {/* Decorative circles */}
          <View style={[styles.decorCircle, { top: -40, right: -40, width: 150, height: 150, opacity: 0.12 }]} />
          <View style={[styles.decorCircle, { bottom: -20, left: -20, width: 100, height: 100, opacity: 0.08 }]} />

          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonBadgeText}>COMING SOON</Text>
          </View>

          <Text style={styles.heroEmoji}>🎮</Text>
          <Text style={styles.heroTitle}>Game Center</Text>
          <Text style={styles.heroSubtitle}>
            Learn English through fun mini-games. Practice vocabulary, translation, and pronunciation while having fun.
          </Text>
        </LinearGradient>

        {/* Upcoming features */}
        <Text style={styles.sectionTitle}>PLAYABLE MINI-GAMES & PRACTICE</Text>
        <View style={styles.featuresCard}>
          {UPCOMING_FEATURES.map((f, i) => (
            <TouchableOpacity 
              key={f.label}
              style={styles.featureRow}
              activeOpacity={0.7}
              onPress={() => {
                if (f.label === 'Flashcards') {
                  router.push({ pathname: '/lesson-player', params: { lessonId: '1', mode: 'vocabulary' } });
                } else if (f.label === 'Translation Drill') {
                  router.push({ pathname: '/lesson-player', params: { lessonId: '1', mode: 'exercise' } });
                } else if (f.label === 'Word Match') {
                  router.push({ pathname: '/lesson-player', params: { lessonId: '2', mode: 'exercise' } });
                } else {
                  router.push('/practice-prompts');
                }
              }}
            >
              <View style={styles.featureIconWrapper}>
                <MaterialIcons name={f.icon as any} size={22} color="#004ac6" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
              <View style={styles.playBadge}>
                <MaterialIcons name="play-arrow" size={18} color="#004ac6" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.learnBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/learn' as any)}
        >
          <MaterialIcons name="menu-book" size={20} color="#004ac6" />
          <Text style={styles.learnBtnText}>Continue Learning</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#151c27', letterSpacing: -0.5 },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },

  heroCard: {
    borderRadius: 28,
    padding: 28,
    marginBottom: 28,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#ffffff',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  comingSoonBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  heroEmoji: { fontSize: 52, marginBottom: 12 },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737686',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  featuresCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  featureIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureText: { flex: 1 },
  featureLabel: { fontSize: 16, fontWeight: '600', color: '#151c27', marginBottom: 2 },
  featureDesc: { fontSize: 13, color: '#737686' },
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f3fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 74, 198, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: '#f0f3ff', marginLeft: 74 },

  learnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0f3ff',
    borderRadius: 100,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#dbe1ff',
  },
  learnBtnText: { fontSize: 16, fontWeight: '700', color: '#004ac6' },
});
