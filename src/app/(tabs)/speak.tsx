import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput, Platform } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const FILTERS = ['Top Rated', 'Native Speakers', 'Business English', 'IELTS'];

const TUTORS = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    title: 'British English Expert',
    rating: '4.9',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArgtFMlGjvUgU3PGfOQDNwDVMCfsZfTW_9YesgxoijSjtVUdkjohZU2ClfDuLlUAr4ILAJCnss2-C1pGAG-UBO4Qw32ee5hW5TgaW5bmLC6L_Rlnig55Gh3ohAXA2qgLgP2jedsw9FWg8ogyGrHQdlhfsH7USxQcjcQJ6sdahnAnS3j-oL96DsxJPvTl6_1aO70wjTdUCtWM6o0wHEBAjSPl2Yg9XzWaFzZINpc3c4vR_yxfxVycXopxzDl1F0GCNKp8yzsfPIpvA',
  },
  {
    id: '2',
    name: 'Alex Carter',
    title: 'American English Specialist',
    rating: '4.8',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4xftewwCfqqLHkiIpZmVDlyFtfT30K6Wj047e59Pq3h6S2V4Rmc7UbWMDnCWDIo6dGWsgp-P05jYa8NheGPWjGk-2llsKbdmH7Friz_NPl1MW_QuqYoRSTO4o-Zcd55SqYAv8qy0zUmgMRoKTHo8vszYsX005JrFqcBBZChZD01QM9KBpGmC57kp6bUHJkNmzJ6AMIm6dB9kohg1O8YI5zmAbf2W1Qzdb5m9sAX1MT1_hfruGjKM8zTF7v3wxuQ0ZDxX9HMg13-8',
  }
];

export default function SpeakTab() {
  const [activeFilter, setActiveFilter] = useState('Top Rated');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice Speaking</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="search" size={24} color="#004ac6" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search & Context */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#737686" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search tutors by name or skill..."
              placeholderTextColor="#737686"
            />
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity 
                  key={filter} 
                  style={[styles.filterPill, isActive ? styles.filterPillActive : styles.filterPillInactive]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                >
                  {isActive && filter === 'Top Rated' && (
                    <MaterialIcons name="verified" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                  )}
                  <Text style={[styles.filterText, isActive ? styles.filterTextActive : styles.filterTextInactive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tutors List */}
        <View style={styles.tutorsContainer}>
          {TUTORS.map((tutor) => (
            <View key={tutor.id} style={styles.tutorCard}>
              <View style={styles.tutorImageContainer}>
                <Image source={{ uri: tutor.image }} style={styles.tutorImage} />
                
                {/* Online Badge */}
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>

                {/* Info Overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.tutorInfoOverlay}
                >
                  <View style={styles.tutorInfoRow}>
                    <View>
                      <Text style={styles.tutorName}>{tutor.name}</Text>
                      <Text style={styles.tutorTitle}>{tutor.title}</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <MaterialIcons name="star" size={16} color="#fea619" />
                      <Text style={styles.ratingText}>{tutor.rating}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.callButton} activeOpacity={0.8}>
                  <MaterialIcons name="call" size={20} color="#ffffff" />
                  <Text style={styles.callButtonText}>Call Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.scheduleButton} activeOpacity={0.8}>
                  <MaterialIcons name="calendar-today" size={20} color="#004ac6" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinksGrid}>
          <TouchableOpacity style={[styles.quickLinkCard, { backgroundColor: 'rgba(219, 225, 255, 0.4)', borderColor: 'rgba(0, 74, 198, 0.05)' }]} activeOpacity={0.8}>
            <View style={[styles.quickLinkIconWrapper, { backgroundColor: '#004ac6' }]}>
              <MaterialIcons name="history" size={24} color="#ffffff" />
            </View>
            <Text style={[styles.quickLinkText, { color: '#004ac6' }]}>Session History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickLinkCard, { backgroundColor: 'rgba(127, 252, 151, 0.2)', borderColor: 'rgba(0, 72, 27, 0.05)' }]} activeOpacity={0.8}>
            <View style={[styles.quickLinkIconWrapper, { backgroundColor: '#00481b' }]}>
              <MaterialIcons name="quiz" size={24} color="#ffffff" />
            </View>
            <Text style={[styles.quickLinkText, { color: '#00481b' }]}>Practice Prompts</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 60,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: 'rgba(249, 249, 255, 0.9)',
    zIndex: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#004ac6', letterSpacing: -0.5 },
  iconButton: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(0, 74, 198, 0.05)' },

  scrollContent: { paddingBottom: 100 },

  searchSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, backgroundColor: 'rgba(219, 225, 255, 0.3)' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#151c27' },

  filtersContainer: { marginTop: 24, paddingRight: 40, gap: 8 },
  filterPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  filterPillActive: { backgroundColor: '#004ac6' },
  filterPillInactive: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(195, 198, 215, 0.3)' },
  filterText: { fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#ffffff' },
  filterTextInactive: { color: '#434654' },

  tutorsContainer: { paddingHorizontal: 20, paddingTop: 24, gap: 20 },
  tutorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  tutorImageContainer: { height: 240, width: '100%' },
  tutorImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  onlineBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 6 },
  onlineText: { fontSize: 12, fontWeight: '600', color: '#151c27' },

  tutorInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
  },
  tutorInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  tutorName: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  tutorTitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fea619', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#2a1700' },

  cardActions: { flexDirection: 'row', padding: 16, gap: 12 },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004ac6',
    height: 52,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  callButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  scheduleButton: {
    width: 52,
    height: 52,
    backgroundColor: '#f0f3ff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 74, 198, 0.1)',
  },

  quickLinksGrid: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 32, gap: 16 },
  quickLinkCard: {
    flex: 1,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  quickLinkIconWrapper: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  quickLinkText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
