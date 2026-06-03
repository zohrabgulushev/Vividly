import { View, Text, StyleSheet, SafeAreaView, Animated, Platform, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProcessingScreen() {
  const router = useRouter();
  
  const [progressText, setProgressText] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Listener for text update
    const listener = progressAnim.addListener(({ value }) => {
      setProgressText(Math.floor(value));
      if (value === 100) {
        // Navigate when done
        setTimeout(() => {
          router.replace('/(tabs)/learn' as any); // Replace with actual path later
        }, 500);
      }
    });

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();

    return () => {
      progressAnim.removeListener(listener);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#004ac6', '#003ea8', '#002a78']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Background Decorative Blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="language" size={24} color="#a6e6ff" />
          <Text style={styles.headerTitle}>Vividly AI</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PROCESSING</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        
        {/* Intro */}
        <View style={styles.introContainer}>
          <Text style={styles.title}>Building your curriculum...</Text>
          <Text style={styles.subtitle}>Our AI is personalizing your learning path based on your professional goals and current proficiency.</Text>
        </View>

        {/* Floating Card */}
        <Animated.View style={[styles.card, { transform: [{ translateY: floatAnim }] }]}>
          
          <View style={styles.taskItem}>
            <View style={styles.taskLeft}>
              <View style={styles.taskIconWrapperDone}>
                <MaterialIcons name="check-circle" size={16} color="#14d1ff" />
              </View>
              <Text style={styles.taskTextDone}>Checking language level...</Text>
            </View>
            <Text style={styles.taskStatusDone}>COMPLETE</Text>
          </View>

          <View style={styles.taskItem}>
            <View style={styles.taskLeft}>
              <View style={styles.taskIconWrapperDone}>
                <MaterialIcons name="check-circle" size={16} color="#14d1ff" />
              </View>
              <Text style={styles.taskTextDone}>Mapping 'Career' vocabulary...</Text>
            </View>
            <Text style={styles.taskStatusDone}>COMPLETE</Text>
          </View>

          <View style={[styles.taskItem, { marginBottom: 0 }]}>
            <View style={styles.taskLeft}>
              <View style={styles.activeIconContainer}>
                <Animated.View style={[styles.pulseRing, { opacity: pulseAnim, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0.3, 1], outputRange: [1, 1.5] }) }] }]} />
                <View style={styles.taskIconWrapperActive}>
                  <MaterialIcons name="auto-awesome" size={16} color="#14d1ff" />
                </View>
              </View>
              <Text style={styles.taskTextActive}>Generating AI tutors...</Text>
            </View>
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={[styles.dot, { opacity: 0.6 }]} />
              <View style={[styles.dot, { opacity: 0.3 }]} />
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>SYSTEM PROGRESS</Text>
              <Text style={styles.progressValue}>{progressText}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
            </View>
          </View>
        </Animated.View>

        {/* Decorative Element */}
        <View style={styles.decorativeSection}>
          <View style={styles.avatarsContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHawpq_O_1Ss2J0Cfd0p_PvH-qVCTuYWIMem2_RIN-aCqI2Ry_ld4Z52zENFTRKBZBd3J7PZ6TVlupuqusk06BxoqtAvdlq7LonhppIhRYhlhHSG4ov9G9p2VLzgC0lywsujodP9y6881g7_kEVKSdDyPkAzCISOEBQ6t9VrOr4NTf9KsfNGK_oSXO4OIf3kTfurzdP_vkioNH5mtl6lukXpEL0u0EpMgXfkED8IW3Oc5pEpD5KYswZx2aUwvRCntwTFaeCedJSqw' }} 
              style={[styles.avatar, { zIndex: 3 }]} 
            />
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_cvIM7loJqg1-w8B9fDt9G76GOLvH7VkZma2hyWslygGCa_KBmhc6JyvAuyqXaA_JQgc_wkCFpS_L-FwR9roP3IbgvVoquStSE8Mxen-3QHH_sAO6ejPpJJgU4KZIkL6QEnmurjHf4df3v_m8EGAaBZqrg8AKDeyx4C-d-XqCDyNBRkNKdt6m3aseSJvTwbf_qKcHBcuer_viGjMI4C9eQmKwzijGgWzJg2UJ1seYMyj7veooyJLsv0BU0bU6_-l5AP5mJAQsIHA' }} 
              style={[styles.avatar, styles.avatarOverlap, { zIndex: 2 }]} 
            />
            <View style={[styles.avatar, styles.avatarMore, styles.avatarOverlap, { zIndex: 1 }]}>
              <Text style={styles.avatarMoreText}>+4</Text>
            </View>
          </View>
          <Text style={styles.engineText}>GLOBAL LANGUAGE ENGINE ACTIVE</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004ac6',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.2,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: '#a6e6ff',
    top: -100,
    left: -100,
  },
  blob2: {
    width: 400,
    height: 400,
    backgroundColor: '#ffffff',
    bottom: -150,
    right: -150,
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 64,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0, 74, 198, 0.4)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#b8c8ff',
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a6e6ff',
    letterSpacing: 1,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  introContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 24,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIconWrapperDone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(20, 209, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(20, 209, 255, 0.3)',
    marginRight: 16,
  },
  taskIconWrapperActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(20, 209, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#14d1ff',
    position: 'absolute',
  },
  activeIconContainer: {
    width: 32,
    height: 32,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#14d1ff',
    position: 'absolute',
  },
  taskTextDone: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  taskTextActive: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  taskStatusDone: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(20, 209, 255, 0.6)',
    letterSpacing: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#14d1ff',
  },
  progressContainer: {
    marginTop: 40,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#14d1ff',
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#14d1ff',
    borderRadius: 6,
  },
  decorativeSection: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#004ac6',
    backgroundColor: '#333535',
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  avatarMore: {
    backgroundColor: '#a6e6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#003543',
  },
  engineText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },
});
