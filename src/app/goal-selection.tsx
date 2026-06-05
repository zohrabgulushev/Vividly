import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { saveOnboardingData } from '@/services/profiles';

type Goal = 'career' | 'travel' | 'brain' | 'social';

export default function GoalSelectionScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level?: string }>();
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<Goal>('travel');
  const [saving, setSaving] = useState(false);

  const GOAL_LABELS: Record<Goal, string> = {
    career: 'Career Advancement',
    travel: 'Travel & Culture',
    brain: 'Cognitive Health',
    social: 'Social Connection',
  };

  const handleContinue = async () => {
    if (user?.id) {
      setSaving(true);
      await saveOnboardingData(user.id, level ?? 'B1', selectedGoal);
      setSaving(false);
    }
    router.push('/processing' as any);
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
            <View style={[styles.progressBarFill, { width: '66%' }]} />
          </View>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Headline Section */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>What's your focus?</Text>
          <Text style={styles.subtitle}>Choose the path that best aligns with your current ambitions. You can always adjust this later.</Text>
        </View>

        {/* Goal Selection List */}
        <View style={styles.goalsList}>
          
          {/* Career Card */}
          <TouchableOpacity 
            style={[styles.goalCard, selectedGoal === 'career' && styles.goalCardActive]}
            onPress={() => setSelectedGoal('career')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, selectedGoal === 'career' && styles.iconWrapperActive]}>
              <MaterialIcons name="work" size={28} color={selectedGoal === 'career' ? "#ffffff" : "#004ac6"} />
            </View>
            <View style={styles.cardTextContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>Career Advancement</Text>
                {selectedGoal === 'career' && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>POPULAR</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardSubtitle}>Professional terminology and business etiquette.</Text>
            </View>
            <View style={[styles.radioCircle, selectedGoal === 'career' && styles.radioCircleActive]}>
              {selectedGoal === 'career' && <MaterialIcons name="check" size={16} color="#ffffff" />}
            </View>
          </TouchableOpacity>

          {/* Travel Card */}
          <TouchableOpacity 
            style={[styles.goalCard, selectedGoal === 'travel' && styles.goalCardActive]}
            onPress={() => setSelectedGoal('travel')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, selectedGoal === 'travel' && styles.iconWrapperActive]}>
              <MaterialIcons name="flight-takeoff" size={28} color={selectedGoal === 'travel' ? "#ffffff" : "#004ac6"} />
            </View>
            <View style={styles.cardTextContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>Travel & Culture</Text>
                {selectedGoal === 'travel' && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>POPULAR</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardSubtitle}>Navigate new cities and connect with locals.</Text>
            </View>
            <View style={[styles.radioCircle, selectedGoal === 'travel' && styles.radioCircleActive]}>
              {selectedGoal === 'travel' && <MaterialIcons name="check" size={16} color="#ffffff" />}
            </View>
          </TouchableOpacity>

          {/* Brain Training Card */}
          <TouchableOpacity 
            style={[styles.goalCard, selectedGoal === 'brain' && styles.goalCardActive]}
            onPress={() => setSelectedGoal('brain')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, selectedGoal === 'brain' && styles.iconWrapperActive]}>
              <MaterialIcons name="psychology" size={28} color={selectedGoal === 'brain' ? "#ffffff" : "#004ac6"} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Cognitive Health</Text>
              <Text style={styles.cardSubtitle}>Improve memory and sharpen focus through language.</Text>
            </View>
            <View style={[styles.radioCircle, selectedGoal === 'brain' && styles.radioCircleActive]}>
              {selectedGoal === 'brain' && <MaterialIcons name="check" size={16} color="#ffffff" />}
            </View>
          </TouchableOpacity>

          {/* Social Card */}
          <TouchableOpacity 
            style={[styles.goalCard, selectedGoal === 'social' && styles.goalCardActive]}
            onPress={() => setSelectedGoal('social')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, selectedGoal === 'social' && styles.iconWrapperActive]}>
              <MaterialIcons name="forum" size={28} color={selectedGoal === 'social' ? "#ffffff" : "#004ac6"} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Social Connection</Text>
              <Text style={styles.cardSubtitle}>Conversational fluency for family and friends.</Text>
            </View>
            <View style={[styles.radioCircle, selectedGoal === 'social' && styles.radioCircleActive]}>
              {selectedGoal === 'social' && <MaterialIcons name="check" size={16} color="#ffffff" />}
            </View>
          </TouchableOpacity>

        </View>

        {/* Decorative Element */}
        {selectedGoal === 'travel' && (
          <View style={styles.decorativeContainer}>
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmYS1kQjmLpAZafc_E2dZwus6NAfSat-s4i1kgLUyWUieh9NVw2ntgPU4T-nuKV08qUE_2oPAiA6U0DzjytWxPqaCEiWDUdga1J9wdd5oUx-Ox9aj7tapD-qarMigBuTiY6hUzzcto67i1CD73rNMhoo2IKGZ7iOkG8e_hWhLIj2AEZ3HZl6DLjlq0Ph6XRxUQ3U2o4VS3HvwbIwbtiyQHR_KtWKegFhbn2_3RKJBPjcoYUGJZQd2Ag6WMFMnrQa4PopUvihjyn5w' }}
                style={styles.image}
              />
            </View>
            <View style={styles.decorativeTextContainer}>
              <Text style={styles.decorativeTitle}>Your "Travel" Journey</Text>
              <Text style={styles.decorativeSubtitle}>Focusing on practical phrases for dining, navigation, and local customs in over 25 languages.</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.continueButton, saving && { opacity: 0.7 }]} onPress={handleContinue} disabled={saving} activeOpacity={0.9}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.continueButtonText}>Continue</Text>}
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
    alignItems: 'center',
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#737686',
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 24,
    elevation: 2,
  },
  goalCardActive: {
    borderColor: '#004ac6',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
  },
  iconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: '#f0f3ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconWrapperActive: {
    backgroundColor: '#004ac6',
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#151c27',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#6ffbbe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#002113',
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#737686',
    lineHeight: 20,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c3c6d6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    backgroundColor: '#004ac6',
    borderColor: '#004ac6',
    borderWidth: 0,
  },
  decorativeContainer: {
    marginTop: 32,
    backgroundColor: '#f0f3ff',
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  imageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  decorativeTextContainer: {
    flex: 1,
  },
  decorativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004ac6',
    marginBottom: 6,
  },
  decorativeSubtitle: {
    fontSize: 14,
    color: '#737686',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 249, 255, 0.85)',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  continueButton: {
    backgroundColor: '#004ac6',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
