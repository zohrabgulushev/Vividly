import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

type Level = 'beginner' | 'intermediate' | 'advanced';

export default function OnboardingScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<Level>('intermediate');

  const handleContinue = () => {
    // In a real app, save this selection to Supabase user profile
    router.push('/goal-selection' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar with Progress */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#004ac6" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '33%' }]} />
          </View>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Headline Section */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>What's your English level?</Text>
          <Text style={styles.subtitle}>We'll tailor your learning journey based on your current proficiency.</Text>
        </View>

        {/* Levels List */}
        <View style={styles.levelsList}>
          
          {/* Beginner Card */}
          <TouchableOpacity 
            style={[styles.levelCard, selectedLevel === 'beginner' && styles.levelCardActive]}
            onPress={() => setSelectedLevel('beginner')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, selectedLevel === 'beginner' && styles.iconWrapperActive]}>
              <MaterialCommunityIcons name="seed-outline" size={32} color="#004ac6" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Beginner</Text>
              <Text style={styles.cardSubtitle}>I'm just starting out</Text>
            </View>
            {selectedLevel === 'beginner' && (
              <MaterialIcons name="check-circle" size={24} color="#004ac6" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          {/* Intermediate Card */}
          <TouchableOpacity 
            style={[styles.levelCard, selectedLevel === 'intermediate' && styles.levelCardActive]}
            onPress={() => setSelectedLevel('intermediate')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, selectedLevel === 'intermediate' && styles.iconWrapperActive]}>
              <MaterialIcons name="local-fire-department" size={32} color="#004ac6" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Intermediate</Text>
              <Text style={styles.cardSubtitle}>I can hold basic conversations</Text>
            </View>
            {selectedLevel === 'intermediate' && (
              <MaterialIcons name="check-circle" size={24} color="#004ac6" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          {/* Advanced Card */}
          <TouchableOpacity 
            style={[styles.levelCard, selectedLevel === 'advanced' && styles.levelCardActive]}
            onPress={() => setSelectedLevel('advanced')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, selectedLevel === 'advanced' && styles.iconWrapperActive]}>
              <MaterialIcons name="rocket-launch" size={32} color="#004ac6" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Advanced</Text>
              <Text style={styles.cardSubtitle}>I speak fluently and professionally</Text>
            </View>
            {selectedLevel === 'advanced' && (
              <MaterialIcons name="check-circle" size={24} color="#004ac6" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Bottom Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.9}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(0, 74, 198, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#004ac6',
    borderRadius: 4,
  },
  spacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 120,
  },
  headlineSection: {
    marginBottom: 40,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#737686',
    lineHeight: 26,
  },
  levelsList: {
    gap: 16,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  levelCardActive: {
    borderColor: '#004ac6',
    backgroundColor: '#f0f3ff',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
  },
  iconWrapper: {
    width: 56,
    height: 56,
    backgroundColor: '#f0f3ff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(0, 74, 198, 0.15)',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#737686',
  },
  checkIcon: {
    marginLeft: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f9f9ff',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.02)',
  },
  continueButton: {
    backgroundColor: '#004ac6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    gap: 8,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
