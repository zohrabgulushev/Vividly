import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

export default function LessonCompleteScreen() {
  const router = useRouter();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleContinue = () => {
    // Navigate back to the home or learn tab
    router.replace('/(tabs)/learn' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Vividly</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#737685" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.mainArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Trophy Section */}
          <View style={styles.trophyContainer}>
            <Animated.View style={[styles.trophyCircle, { transform: [{ scale: scaleAnim }] }]}>
              <MaterialIcons name="emoji-events" size={80} color="#FFC107" />
            </Animated.View>
          </View>

          {/* Copy Section */}
          <View style={styles.copySection}>
            <Text style={styles.title}>Lesson Complete!</Text>
            <Text style={styles.subtitle}>Great job! You're one step closer to your goal.</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            
            {/* XP Card */}
            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: '#fef3c7' }]}>
                  <MaterialIcons name="bolt" size={24} color="#d97706" />
                </View>
                <Text style={styles.statLabel}>XP Gained</Text>
              </View>
              <Text style={styles.statValue}>+15 XP</Text>
            </View>

            {/* Accuracy Card */}
            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: '#dcfce7' }]}>
                  <MaterialIcons name="check-circle" size={24} color="#15803d" />
                </View>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <Text style={styles.statValue}>94%</Text>
            </View>

            {/* Streak Card */}
            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: '#ffedd5' }]}>
                  <MaterialIcons name="local-fire-department" size={24} color="#ea580c" />
                </View>
                <Text style={styles.statLabel}>Daily Streak</Text>
              </View>
              <Text style={styles.statValue}>7 Days</Text>
            </View>

          </View>

        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#ffffff" style={styles.continueIcon} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004ac6',
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 140,
  },
  mainArea: {
    flex: 1,
    alignItems: 'center',
  },
  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  trophyCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  copySection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#151c27',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 26,
  },
  statsContainer: {
    width: '100%',
    gap: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#151c27',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 249, 255, 0.95)',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 198, 214, 0.4)',
  },
  continueButton: {
    backgroundColor: '#004ac6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 30,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  continueIcon: {
    marginLeft: 8,
  }
});
