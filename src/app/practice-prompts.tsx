import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function PracticePromptsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Business', 'Travel', 'Casual', 'Debate'];

  const topics = [
    {
      id: 1,
      icon: '☕',
      title: 'Ordering at a Cafe',
      subtitle: 'Casual • Beginner',
      color: '#dbe1ff', // secondary-container
    },
    {
      id: 2,
      icon: '💼',
      title: 'Small Talk at Work',
      subtitle: 'Business • Intermediate',
      color: '#dbe1ff', // primary-fixed
    },
    {
      id: 3,
      icon: '🌍',
      title: 'Cultural Nuances',
      subtitle: 'Travel • Advanced',
      color: '#caead6', // tertiary-fixed
    },
    {
      id: 4,
      icon: '🌱',
      title: 'Debate: Climate Change',
      subtitle: 'Debate • Expert',
      color: '#ffdad6', // error-container
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversation Topics</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="search" size={24} color="#003594" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7RxW7IucjTR1Jj7WPoFFR4iiFdc0tcLjF5TJLQfeq4oK58UEX3RT-bH4Gmke16l3ZFNKDHrfGEL8bC3vxZ8bDoSaIBFUd_9u8cbtiWTYEx5JlihERhXH98YOkVFSoprEM5ZyLz3-H2SUQ0HzalImGAmw1lmUfwZQb4iM7v15XVFZOtt_sVZVv2GbXDMholGe_EyqWc37g3qk7o640SjZIgb7Mcrx2EY518N1XVKJXiunTCeRxu9de1Z1yksQk4xrUdJPX0p8fB5Cb' }}
            style={styles.heroImage}
            imageStyle={{ opacity: 0.8 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0, 74, 198, 0.9)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroBadges}>
                <View style={styles.badgeSolid}>
                  <Text style={styles.badgeSolidText}>ADVANCED</Text>
                </View>
                <View style={styles.badgeGlass}>
                  <Text style={styles.badgeGlassText}>15-20 Mins</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>Tech Job Interview</Text>
              <Text style={styles.heroSubtitle}>Master high-stakes technical dialogues and soft-skill articulation in English.</Text>
            </View>
            <TouchableOpacity style={styles.playButton} activeOpacity={0.9}>
              <MaterialIcons name="play-arrow" size={28} color="#004ac6" />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {filters.map((filter, index) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Topics List */}
        <View style={styles.topicsList}>
          {topics.map((topic) => (
            <TouchableOpacity key={topic.id} style={styles.topicCard} activeOpacity={0.7}>
              <View style={[styles.topicIconContainer, { backgroundColor: topic.color }]}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
            </TouchableOpacity>
          ))}
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
    paddingBottom: 40,
  },
  heroContainer: {
    height: 320,
    width: '100%',
    backgroundColor: '#004ac6',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    padding: 24,
    zIndex: 10,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badgeSolid: {
    backgroundColor: '#caead6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeSolidText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#042014',
    letterSpacing: 1,
  },
  badgeGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeGlassText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '85%',
    lineHeight: 20,
  },
  playButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 20,
  },
  filtersSection: {
    paddingVertical: 24,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    backgroundColor: '#e7e7f2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  filterChipActive: {
    backgroundColor: '#003594',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434654',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  topicsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  topicIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topicIcon: {
    fontSize: 28,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 4,
  },
  topicSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  }
});
