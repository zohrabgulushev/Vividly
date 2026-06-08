import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput, Platform, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getActiveTutors } from '@/services/calls';
import { useRouter } from 'expo-router';
import type { TutorWithProfile } from '@/types/database';

const FILTERS = ['Top Rated', 'Native Speakers', 'Business English', 'IELTS'];


export default function SpeakTab() {
  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);
  const [tutors, setTutors] = useState<TutorWithProfile[]>([]);
  const [tutorsLoading, setTutorsLoading] = useState(true);

  useEffect(() => {
    getActiveTutors().then(({ data }) => {
      setTutors((data as unknown as TutorWithProfile[]) ?? []);
      setTutorsLoading(false);
    });
  }, []);

  const hasMinutes = (profile?.minutes_balance ?? 0) > 0;

  const handleCallNow = (tutorId: string) => {
    if (!hasMinutes) {
      Alert.alert(
        'No Minutes Available',
        'You need to buy a minutes package to start a session.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy Minutes', style: 'default', onPress: () => router.push('/top-up' as any) },
        ]
      );
      return;
    }
    router.push({ pathname: '/book-session' as any, params: { tutorId } });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice Speaking</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => searchInputRef.current?.focus()}>
          <Feather name="search" size={24} color="#004ac6" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
          {/* Search & Context */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#737686" style={styles.searchIcon} />
            <TextInput 
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search tutors by name or skill..."
              placeholderTextColor="#737686"
              value={searchQuery}
              onChangeText={setSearchQuery}
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
        {tutorsLoading ? (
          <ActivityIndicator size="large" color="#004ac6" style={{ marginTop: 40 }} />
        ) : tutors.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="person-search" size={48} color="#c3c6d6" />
            <Text style={styles.emptyStateText}>No tutors available</Text>
            <Text style={styles.emptyStateSubtext}>Check back soon!</Text>
          </View>
        ) : (
        <View style={styles.tutorsContainer}>
          {tutors
            .filter(t =>
              searchQuery.trim() === '' ||
              t.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (t.bio ?? '').toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((tutor) => (
            <View key={tutor.tutor_id} style={styles.tutorCard}>
              <View style={styles.tutorImageContainer}>
                <Image 
                  source={{ uri: tutor.profile.avatar_url ?? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tutor.profile.full_name) + '&background=004ac6&color=fff&size=300' }}
                  style={styles.tutorImage}
                />
                
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
                      <Text style={styles.tutorName}>{tutor.profile.full_name}</Text>
                      <Text style={styles.tutorTitle}>{tutor.bio ?? tutor.tags.join(', ')}</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <MaterialIcons name="star" size={16} color="#fea619" />
                      <Text style={styles.ratingText}>{tutor.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={[styles.callButton, !hasMinutes && styles.callButtonDisabled]}
                  activeOpacity={0.8}
                  onPress={() => handleCallNow(tutor.tutor_id)}
                >
                  <MaterialIcons name="call" size={20} color="#ffffff" />
                  <Text style={styles.callButtonText}>{hasMinutes ? 'Call Now' : 'Buy Minutes'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.scheduleButton} activeOpacity={0.8} onPress={() => router.push({ pathname: '/book-session' as any, params: { tutorId: tutor.tutor_id } })}>
                  <MaterialIcons name="calendar-today" size={20} color="#004ac6" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        )}

        {/* Quick Links */}
        <View style={styles.quickLinksGrid}>
          <TouchableOpacity style={[styles.quickLinkCard, { backgroundColor: 'rgba(219, 225, 255, 0.4)', borderColor: 'rgba(0, 74, 198, 0.05)' }]} activeOpacity={0.8} onPress={() => router.push('/session-history')}>
            <View style={[styles.quickLinkIconWrapper, { backgroundColor: '#004ac6' }]}>
              <MaterialIcons name="history" size={24} color="#ffffff" />
            </View>
            <Text style={[styles.quickLinkText, { color: '#004ac6' }]}>Session History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickLinkCard, { backgroundColor: 'rgba(127, 252, 151, 0.2)', borderColor: 'rgba(0, 72, 27, 0.05)' }]} activeOpacity={0.8} onPress={() => router.push('/practice-prompts')}>
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
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyStateText: { fontSize: 16, fontWeight: '600', color: '#737686' },
  emptyStateSubtext: { fontSize: 13, color: '#c3c6d6' },
  callButtonDisabled: { backgroundColor: '#737686' },
  
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
