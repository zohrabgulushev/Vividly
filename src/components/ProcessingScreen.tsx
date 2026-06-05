import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Colors from tailwind config
const COLORS = {
  background: '#004ac6',
  primary: '#b4c5ff',
  onPrimary: '#002a78',
  secondary: '#a6e6ff',
  secondaryContainer: '#14d1ff',
  textWhite: '#ffffff',
  textWhite90: 'rgba(255, 255, 255, 0.9)',
  textWhite60: 'rgba(255, 255, 255, 0.6)',
  glassBackground: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glowPulse: 'rgba(0, 209, 255, 0.4)',
};

export function ProcessingScreen() {
  const insets = useSafeAreaInsets();
  
  // Spinner Animation
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Pulse Glow Animation
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  
  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.5, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Shimmer Animation for Progress Bar
  const shimmerTranslateX = useSharedValue(-width);
  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(width, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslateX.value }],
  }));

  // Loading Dots Animation
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Subtle background glow */}
      <View style={styles.backgroundGlow} />

      <View style={styles.mainContent}>
        {/* Central Animation */}
        <View style={styles.animationContainer}>
          <View style={styles.pulseContainer}>
            <Animated.View style={[styles.pulseGlow, pulseStyle]} />
            <View style={styles.iconCard}>
              <MaterialIcons name="school" size={64} color={COLORS.textWhite} />
            </View>
          </View>
          <Text style={styles.headline}>Engineering your curriculum</Text>
        </View>

        {/* Data-Centric Glassmorphic Card */}
        <View style={styles.dataCard}>
          {/* Task 1: Complete */}
          <View style={styles.taskRow}>
            <View style={styles.taskIconComplete}>
              <MaterialIcons name="check" size={16} color={COLORS.secondary} />
            </View>
            <Text style={styles.taskTextComplete}>Checking language level...</Text>
          </View>

          {/* Task 2: Complete */}
          <View style={styles.taskRow}>
            <View style={styles.taskIconComplete}>
              <MaterialIcons name="check" size={16} color={COLORS.secondary} />
            </View>
            <Text style={styles.taskTextComplete}>Mapping "Career" vocabulary...</Text>
          </View>

          {/* Task 3: In Progress */}
          <View style={styles.taskRow}>
            <View style={styles.spinnerContainer}>
              <Animated.View style={[styles.spinner, spinStyle]} />
            </View>
            <Text style={styles.taskTextActive}>
              Generating AI tutors
              <Text style={{ width: 24 }}>{dots}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Footer Progress Section */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 40) }]}>
        <View style={styles.footerHeader}>
          <Text style={styles.footerLabel}>VIVIDLY CORE ENGINE V4.2</Text>
          <Text style={styles.footerPercentage}>78% COMPLETE</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '78%' }]}>
            <Animated.View style={[styles.shimmerEffect, shimmerStyle]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundGlow: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: COLORS.secondaryContainer,
    opacity: 0.15, // Reduced slightly for RN instead of CSS blur
    // Note: To get true extreme blur in RN, you need specific native modules or just a soft gradient image.
    // A large soft opacity circle creates a similar ambient vibe.
  },
  mainContent: {
    flex: 1,
    width: '100%',
    maxWidth: 672, // max-w-2xl
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pulseContainer: {
    width: 128,
    height: 128,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 64,
    backgroundColor: COLORS.glowPulse,
  },
  iconCard: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: COLORS.glassBackground,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5,
  },
  headline: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600',
    letterSpacing: -0.32,
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  dataCard: {
    width: '100%',
    backgroundColor: COLORS.glassBackground,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 32, // md:p-8 equivalent
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 60,
    elevation: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  taskIconComplete: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(20, 209, 255, 0.2)', // secondary-container/20
    borderColor: 'rgba(20, 209, 255, 0.5)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTextComplete: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textWhite90,
  },
  taskTextActive: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: COLORS.textWhite,
  },
  spinnerContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderTopColor: 'transparent',
  },
  footer: {
    width: '100%',
    maxWidth: 672,
    paddingHorizontal: 40,
    marginTop: 'auto',
    zIndex: 10,
    gap: 8,
  },
  footerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  footerLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.96, // 0.08em
    textTransform: 'uppercase',
    color: COLORS.textWhite60,
  },
  footerPercentage: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.96,
    color: COLORS.secondary,
  },
  progressBarTrack: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
    shadowColor: COLORS.secondaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    overflow: 'hidden',
  },
  shimmerEffect: {
    width: '50%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    // In RN, an opacity block moving across works ok for shimmer
  },
});
