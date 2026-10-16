import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Image, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { startCall, endCall } from '@/services/calls';

export default function ActiveCallScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { tutorId, tutorName, callType } = useLocalSearchParams<{ tutorId: string; tutorName: string; callType: string }>();

  const activeTutorId = tutorId || 'tutor-aris';
  const activeTutorName = tutorName || 'Dr. Aris Thorne';
  const activeCallType = (callType === 'group' ? 'group' : 'private') as 'private' | 'group';

  const [seconds, setSeconds] = useState(0);
  const [callId, setCallId] = useState<string | null>(null);
  const multiplierRef = useRef(activeCallType === 'private' ? 2.0 : 1.0);

  // Start call timer and create DB log
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Start interval timer
    interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Insert call log in Supabase
    if (user?.id) {
      startCall(user.id, activeTutorId, activeCallType).then(({ data, error }) => {
        if (error) {
          console.error('Error starting database call log:', error);
        } else if (data) {
          setCallId(data.id);
        }
      });
    }

    return () => {
      clearInterval(interval);
    };
  }, [user?.id]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    if (!user?.id) {
      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)/speak');
      return;
    }

    // End call on Supabase and deduct minutes
    if (callId) {
      const { error, billedMinutes } = await endCall(
        callId,
        user.id,
        seconds,
        multiplierRef.current
      );

      if (error) {
        console.error('Error ending database call:', error);
      }

      Alert.alert(
        'Call Completed',
        `Duration: ${formatTime(seconds)}\nBilled Minutes: ${billedMinutes}m (at ${multiplierRef.current}x rate)`,
        [{ text: 'Exit Room', onPress: () => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/speak');
        }}]
      );

      if (Platform.OS === 'web') {
        setTimeout(() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/speak');
        }, 1500);
      }
    } else {
      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)/speak');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Tutor Video (Simulated) */}
      <View style={StyleSheet.absoluteFill}>
        <Image 
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXlD7ohooqyvFmJotqC9PDxqVnQyi5No2QgUVG1J1DQSwMhC5x1-7sNQ2y9CFFnjlysKaWhM296Z_0YWo0WanHj3b6PHfY6QCh6nq54iS7Z5tmanxSGmbvrNhfbQm9up5nGLMM-fKNaeSsVazVGLL57XgweUOSxB--XDedmbqoHLMQG9t_DgVjCPFRirCAN1gLwSf46Nf5dco0tqNaIDID4RWs60Po-mi4UK-L24yjVFVpwfFTOUOFwucGD5FxvDUQze55ZVZMfdA' }}
          style={styles.tutorVideo}
        />
        <LinearGradient
          colors={['rgba(11, 19, 38, 0.8)', 'transparent', 'rgba(11, 19, 38, 0.9)']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleEndCall} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#dae2fd" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{activeTutorName} • {formatTime(seconds)}</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="settings" size={24} color="#dae2fd" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* User PiP */}
          <View style={styles.pipContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGqsJmzryjwuWz6BuzMK15OT6gg7KSgIfnm-gkGHYcF6YtrNgJaFvJ0uzIJsL284oUVTln6J13vCzp3eG6ZfhaiZ9MKmRj9l1KZ41ZAoH2SiIzFx3Ip_e_p-asokAOnnOXgjU69B-WX7dMGNkjSDgBqkv7ECoM3yWGXUZKevi9V66AVzJxIjfqpuLEeNUdMC2cLzStm4cJddjKi8fCl0_sp5wxb3brOLGsyWbgT5pw8SsH5V1CkgLFnr07C6ekteNNPhfdcHSRIR8' }}
              style={styles.pipVideo}
            />
            <View style={styles.pipLabelContainer}>
              <MaterialIcons name="mic" size={14} color="#b4c5ff" />
              <Text style={styles.pipLabel}>You</Text>
            </View>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Subtitles / Translation Area */}
          <View style={styles.translationContainer}>
            <View style={styles.translationHeader}>
              <View style={styles.translationTextContainer}>
                <Text style={styles.translationLabel}>Dr. Thorne is saying...</Text>
                <Text style={styles.tutorSpeech}>"L'accentuation est cruciale pour la compréhension."</Text>
              </View>
              <TouchableOpacity style={styles.replayButton}>
                <MaterialIcons name="replay-5" size={24} color="#dae2fd" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <Text style={styles.translationSpeech}>"Accentuation is crucial for understanding."</Text>
          </View>

        </View>

        {/* Bottom Control Hub */}
        <View style={styles.bottomControls}>
          <View style={styles.controlBar}>
            <TouchableOpacity style={styles.controlButton}>
              <MaterialIcons name="mic" size={28} color="#dae2fd" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.controlButton, styles.controlButtonActive]}>
              <MaterialIcons name="videocam" size={28} color="#00174b" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <MaterialIcons name="chat" size={28} color="#dae2fd" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            
            <View style={styles.controlDivider} />
            
            <TouchableOpacity style={[styles.controlButton, styles.endCallButton]} onPress={handleEndCall}>
              <MaterialIcons name="call-end" size={28} color="#930013" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
  tutorVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.8,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 64,
    backgroundColor: 'rgba(11, 19, 38, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dae2fd',
  },
  content: {
    flex: 1,
    padding: 24,
    position: 'relative',
  },
  pipContainer: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(45, 52, 73, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#b4c5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  pipVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pipLabelContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(45, 52, 73, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pipLabel: {
    color: '#dae2fd',
    fontSize: 10,
    fontWeight: '600',
  },
  translationContainer: {
    backgroundColor: 'rgba(34, 42, 61, 0.7)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 40,
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  translationTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  translationLabel: {
    fontSize: 14,
    color: '#c3c6d6',
    marginBottom: 8,
  },
  tutorSpeech: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dae2fd',
    lineHeight: 28,
  },
  replayButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  translationSpeech: {
    fontSize: 18,
    color: '#b4c5ff',
    lineHeight: 26,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 24,
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 52, 73, 0.4)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#b4c5ff',
    shadowColor: '#b4c5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffb4ab',
  },
  controlDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  endCallButton: {
    backgroundColor: '#ffdad6',
  },
});
