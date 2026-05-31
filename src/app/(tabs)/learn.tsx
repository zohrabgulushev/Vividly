import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Mesh (Approximation using absolute views) */}
      <View style={[styles.meshBlob, styles.meshTopLeft]} />
      <View style={[styles.meshBlob, styles.meshBottomRight]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="school" size={24} color="#004ac6" />
          <Text style={styles.logoText}>Vividly</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <MaterialIcons name="local-fire-department" size={20} color="#f97316" />
            <Text style={styles.streakText}>14</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb1VtLkCoV7TmLWDxLDDVrsY0wfNMO--Ux29S3AqxZL3MCUV9mM9ZsZiCTdCf7z-qldonWC8dL_n3yTdCmCfYeRKeMa4SONV81NqSzJHgi03Vaew5KWTk0aqSjVhbGecz-UTxVyqa6VtFFiJEB298W6nGP5tFUfkPrG1nRsVePTsOApqILNuO8jCniucwrUccnpSctaN-L5YLMyYDEIFtrg6qKdRTPrS1JJO5wpc5FKNg-P-3NY-bKgffeTKkaSprF-_TrGgOAw2M' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Morning, Alex!</Text>
          <Text style={styles.welcomeSubtitle}>Continue your Spanish journey.</Text>
        </View>

        {/* Daily Goal & Current Unit Row/Column */}
        <View style={styles.bentoContainer}>
          
          {/* Daily Goal Ring */}
          <View style={[styles.glassCard, styles.dailyGoalCard]}>
            <View style={styles.ringContainer}>
              <Svg width={120} height={120} viewBox="0 0 120 120" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Defs>
                  <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#1b55d0" />
                    <Stop offset="100%" stopColor="#b4c5ff" />
                  </SvgLinearGradient>
                </Defs>
                <Circle cx="60" cy="60" r="54" stroke="rgba(0, 74, 198, 0.1)" strokeWidth="8" fill="transparent" />
                <Circle 
                  cx="60" cy="60" r="54" 
                  stroke="url(#grad)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 54} 
                  strokeDashoffset={2 * Math.PI * 54 * (1 - 0.75)} 
                  strokeLinecap="round" 
                />
              </Svg>
              <View style={styles.ringTextContainer}>
                <Text style={styles.ringPercent}>75%</Text>
                <Text style={styles.ringLabel}>OF GOAL</Text>
              </View>
            </View>
            <Text style={styles.goalTitle}>Daily Goal</Text>
            <Text style={styles.goalSubtitle}>15 / 20 XP</Text>
          </View>

          {/* Current Unit Card */}
          <View style={[styles.glassCard, styles.unitCard]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop' }} 
              style={styles.unitImageBg} 
            />
            <LinearGradient
              colors={['rgba(249, 249, 255, 0.95)', 'rgba(249, 249, 255, 0.6)', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.unitGradientOverlay}
            />
            <View style={styles.unitContent}>
              <View>
                <View style={styles.unitTag}>
                  <Text style={styles.unitTagText}>UNIT 4</Text>
                </View>
                <Text style={styles.unitTitle}>Navigating the City</Text>
                <Text style={styles.unitSubtitle}>Learn to ask for directions and use public transit.</Text>
              </View>
              <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
                <Text style={styles.startBtnText}>Start Lesson</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeader}>BOOST YOUR FLUENCY</Text>
        <View style={styles.gridContainer}>
          
          <TouchableOpacity style={[styles.glassCard, styles.gridCard]} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
              <MaterialIcons name="record-voice-over" size={24} color="#ea580c" />
            </View>
            <Text style={styles.gridCardText}>Speak</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.glassCard, styles.gridCard]} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(0, 74, 198, 0.1)' }]}>
              <MaterialIcons name="history-edu" size={24} color="#004ac6" />
            </View>
            <Text style={styles.gridCardText}>Review</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.glassCard, styles.gridCard]} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(156, 46, 2, 0.1)' }]}>
              <MaterialIcons name="auto-stories" size={24} color="#9c2e02" />
            </View>
            <Text style={styles.gridCardText}>Stories</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.glassCard, styles.gridCard]} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: '#e2e2ec' }]}>
              <MaterialIcons name="groups" size={24} color="#737686" />
            </View>
            <Text style={styles.gridCardText}>Practice</Text>
          </TouchableOpacity>

        </View>

        {/* Your Pathway */}
        <Text style={styles.sectionHeader}>YOUR PATHWAY</Text>
        <View style={styles.pathwayContainer}>
          
          <View style={[styles.glassCard, styles.pathCard, styles.pathCardActive]}>
            <View style={[styles.pathIconWrapper, { backgroundColor: 'rgba(0, 74, 198, 0.1)' }]}>
              <MaterialIcons name="play-circle-filled" size={28} color="#004ac6" />
            </View>
            <View style={styles.pathTextContent}>
              <Text style={styles.pathTitle}>At the Coffee Shop</Text>
              <Text style={styles.pathSubtitle}>Lesson 3 of 5 • 5 min</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
          </View>

          <View style={[styles.glassCard, styles.pathCard, { opacity: 0.7 }]}>
            <View style={[styles.pathIconWrapper, { backgroundColor: '#ededf8' }]}>
              <MaterialIcons name="lock" size={22} color="#737686" />
            </View>
            <View style={styles.pathTextContent}>
              <Text style={styles.pathTitle}>Ordering Food</Text>
              <Text style={styles.pathSubtitle}>Lesson 4 of 5 • 8 min</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
          </View>

        </View>

      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <MaterialIcons name="bolt" size={32} color="#ffffff" />
      </TouchableOpacity>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ff' },
  
  meshBlob: { position: 'absolute', width: 400, height: 400, borderRadius: 200, opacity: 0.4 },
  meshTopLeft: { top: -100, left: -100, backgroundColor: 'rgba(180, 197, 255, 0.3)' },
  meshBottomRight: { bottom: 0, right: -100, backgroundColor: 'rgba(253, 118, 26, 0.1)' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    zIndex: 10,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 22, fontWeight: '700', color: '#004ac6', letterSpacing: -0.5 },
  
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  streakText: { fontSize: 14, fontWeight: '600', color: '#151c27', marginLeft: 4 },
  profileBtn: {},
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'rgba(0, 74, 198, 0.2)' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  welcomeSection: { marginTop: 16, marginBottom: 24 },
  welcomeTitle: { fontSize: 28, fontWeight: '700', color: '#004ac6', letterSpacing: -0.5, marginBottom: 4 },
  welcomeSubtitle: { fontSize: 16, color: '#434655' },

  bentoContainer: { gap: 16, marginBottom: 32 },
  
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  dailyGoalCard: { padding: 24, alignItems: 'center' },
  ringContainer: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  ringTextContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringPercent: { fontSize: 24, fontWeight: '700', color: '#004ac6' },
  ringLabel: { fontSize: 10, fontWeight: '600', color: '#737686', marginTop: 2, letterSpacing: 0.5 },
  goalTitle: { fontSize: 14, fontWeight: '600', color: '#151c27' },
  goalSubtitle: { fontSize: 12, color: '#737686', marginTop: 2 },

  unitCard: { minHeight: 180, overflow: 'hidden' },
  unitImageBg: { ...StyleSheet.absoluteFillObject, opacity: 0.25 },
  unitGradientOverlay: { ...StyleSheet.absoluteFillObject },
  unitContent: { padding: 24, flex: 1, justifyContent: 'space-between' },
  unitTag: { backgroundColor: 'rgba(0, 74, 198, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  unitTagText: { fontSize: 12, fontWeight: '700', color: '#004ac6' },
  unitTitle: { fontSize: 24, fontWeight: '700', color: '#151c27', marginBottom: 4, letterSpacing: -0.5 },
  unitSubtitle: { fontSize: 14, color: '#434655', maxWidth: '75%', marginBottom: 20 },
  startBtn: { backgroundColor: '#004ac6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, alignSelf: 'flex-start', shadowColor: '#004ac6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  startBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },

  sectionHeader: { fontSize: 13, fontWeight: '600', color: '#737686', letterSpacing: 1, marginBottom: 16, marginLeft: 4 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  gridCard: { width: '48%', padding: 16, alignItems: 'center', gap: 12 },
  iconWrapper: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  gridCardText: { fontSize: 14, fontWeight: '600', color: '#151c27' },

  pathwayContainer: { gap: 12 },
  pathCard: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  pathCardActive: { borderLeftWidth: 4, borderLeftColor: '#004ac6' },
  pathIconWrapper: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  pathTextContent: { flex: 1 },
  pathTitle: { fontSize: 14, fontWeight: '600', color: '#151c27', marginBottom: 4 },
  pathSubtitle: { fontSize: 12, color: '#737686' },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#004ac6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  }
});
