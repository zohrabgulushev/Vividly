import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/services/profiles';

type LevelCode = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface LevelOption {
  code: LevelCode;
  title: string;
  subtitle: string;
  iconName: any;
  color: string;
}

const LEVEL_OPTIONS: LevelOption[] = [
  { code: 'A1', title: 'A1 • Beginner', subtitle: 'Just starting my English journey', iconName: 'seed-outline', color: '#0284c7' },
  { code: 'A2', title: 'A2 • Elementary', subtitle: 'Can understand basic everyday phrases', iconName: 'sprout-outline', color: '#059669' },
  { code: 'B1', title: 'B1 • Intermediate', subtitle: 'Can hold simple conversations & travel', iconName: 'local-fire-department', color: '#d97706' },
  { code: 'B2', title: 'B2 • Upper-Intermediate', subtitle: 'Can speak confidently on complex topics', iconName: 'lightning-bolt', color: '#ea580c' },
  { code: 'C1', title: 'C1 • Advanced', subtitle: 'Fluent & professional communication', iconName: 'rocket-launch', color: '#7c3aed' },
  { code: 'C2', title: 'C2 • Native / Mastery', subtitle: 'Complete mastery of nuances & idioms', iconName: 'crown', color: '#4e00ae' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<LevelCode>('B1');
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (user?.id) {
      setSaving(true);
      await updateProfile(user.id, { level: selectedLevel } as any);
      setSaving(false);
    }
    router.push({ pathname: '/goal-selection' as any, params: { level: selectedLevel } });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar with Progress */}
      <View style={styles.header}>
        <View style={styles.spacer} />
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
          <Text style={styles.headline}>Select Your English Level</Text>
          <Text style={styles.subtitle}>
            Choose your starting level. All levels up to your selection will be unlocked immediately!
          </Text>
        </View>

        {/* Levels List */}
        <View style={styles.levelsList}>
          {LEVEL_OPTIONS.map((opt) => {
            const isSelected = selectedLevel === opt.code;
            return (
              <TouchableOpacity 
                key={opt.code}
                style={[styles.levelCard, isSelected && { borderColor: opt.color, backgroundColor: '#f0f4ff' }]}
                onPress={() => setSelectedLevel(opt.code)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrapper, { backgroundColor: '#f0f3ff' }, isSelected && { backgroundColor: `${opt.color}20` }]}>
                  <MaterialCommunityIcons name={opt.iconName} size={28} color={opt.color} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{opt.title}</Text>
                  <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
                </View>
                {isSelected && (
                  <MaterialIcons name="check-circle" size={24} color={opt.color} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.9} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Continue with Level {selectedLevel}</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </>
          )}
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
    paddingTop: 24,
    paddingBottom: 120,
  },
  headlineSection: {
    marginBottom: 24,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#151c27',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#737686',
    lineHeight: 22,
  },
  levelsList: {
    gap: 12,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e8ecf8',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#737686',
  },
  checkIcon: {
    marginLeft: 8,
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
    borderTopColor: 'rgba(0,0,0,0.04)',
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
    fontSize: 17,
    fontWeight: '700',
  },
});
