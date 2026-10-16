import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView, Image, Dimensions, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function TutorProfileScreen() {
  const router = useRouter();
  const [bioExpanded, setBioExpanded] = useState(false);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [showIntroModal, setShowIntroModal] = useState(false);

  const timeSlots = ['10:00 AM', '1:30 PM', '4:00 PM', '5:30 PM', '7:00 PM'];

  const handleBook = () => {
    router.push({
      pathname: '/book-session' as any,
      params: { tutorName: 'Emma Watson', tutorId: 'tutor-emma', time: selectedTime }
    });
  };

  const handleMessage = () => {
    Alert.alert(
      'Message Emma Watson',
      'Send a note before your session: What specific topics or goals would you like to focus on?',
      [
        { text: 'Send Practice Request', onPress: () => Alert.alert('Sent!', 'Emma has been notified and will reply shortly.') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share Profile', 'Tutor profile link copied to clipboard!');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOmxDIMcZ_lI0isn32BjAz2c8qLf6vFeaIHg42R_JOr17Qfi47Rck0aKoNEZf-MQ6YvRnQG0Kj5tDOp9tCScZYIPF9ngYfi9sY5g4GoeKkLl1TRAfExhwzWfMNIp5Gn_iYMDfpFfzu8F0sSUHte4g2ksSKcWiGb0xEV_6w0DA9Se0fgSJxJ9kgB7ZffxZBUumPbanj6-dLVFdgWY5aPMfge4GvJPlmnAAM0Pn0E9AxCvxDg89PHMitfg4XHeVOplgguuNk_etYzNk' }} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(25, 27, 35, 0.5)']}
            style={styles.heroGradient}
          />
          
          <SafeAreaView style={styles.heroSafeArea}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/speak')}
            >
              <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          </SafeAreaView>

          <TouchableOpacity 
            style={styles.playOverlay} 
            activeOpacity={0.8}
            onPress={() => setShowIntroModal(true)}
          >
            <View style={styles.playButton}>
              <MaterialIcons name="play-arrow" size={40} color="#ffffff" />
            </View>
            <Text style={styles.playText}>Watch Intro</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Content (Overlapping) */}
        <View style={styles.profileContent}>
          
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>Emma Watson</Text>
              <MaterialIcons name="verified" size={20} color="#004ac6" style={styles.verifiedIcon} />
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.messageButton} activeOpacity={0.8} onPress={handleMessage}>
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} activeOpacity={0.8} onPress={handleShare}>
                <MaterialIcons name="share" size={20} color="#434654" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.subtitle}>Native English Speaker • London, UK</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>120 reviews</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>🗣️</Text>
              <Text style={styles.statValue}>English</Text>
              <Text style={styles.statLabel}>French</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>🎓</Text>
              <Text style={styles.statValue}>5,000+</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text 
              style={styles.bioText} 
              numberOfLines={bioExpanded ? undefined : 3}
            >
              Hello! I am Emma, a certified tutor from London with over 8 years of experience helping professionals master the nuances of Business English. I specialize in interview preparation, corporate communication, and advanced grammar for non-native speakers. My teaching philosophy is grounded in scholarly discipline and focused intelligence, ensuring that every session is productive and tailored to your specific career goals.
            </Text>
            <TouchableOpacity onPress={() => setBioExpanded(!bioExpanded)} style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>{bioExpanded ? 'Read less' : 'Read more'}</Text>
              <MaterialIcons name={bioExpanded ? 'expand-less' : 'expand-more'} size={18} color="#004ac6" />
            </TouchableOpacity>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <View style={styles.availabilityHeader}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <Text style={styles.dateLabel}>Wed, Oct 23</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeSlotsContainer}
            >
              {timeSlots.map((time, index) => {
                const isSelected = selectedTime === time;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                    onPress={() => setSelectedTime(time)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>{time}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

        </View>
      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceValue}>$15</Text>
          <Text style={styles.priceLabel}>per 30 min</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBook} activeOpacity={0.9}>
          <Text style={styles.bookButtonText}>Book Session</Text>
        </TouchableOpacity>
      </View>

      {/* Video Intro Modal */}
      {showIntroModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowIntroModal(false)}
        >
          <View style={styles.videoModalOverlay}>
            <View style={styles.videoModalCard}>
              <View style={styles.videoHeader}>
                <Text style={styles.videoTitle}>Emma's Video Introduction</Text>
                <TouchableOpacity onPress={() => setShowIntroModal(false)}>
                  <MaterialIcons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View style={styles.videoPlayerBox}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOmxDIMcZ_lI0isn32BjAz2c8qLf6vFeaIHg42R_JOr17Qfi47Rck0aKoNEZf-MQ6YvRnQG0Kj5tDOp9tCScZYIPF9ngYfi9sY5g4GoeKkLl1TRAfExhwzWfMNIp5Gn_iYMDfpFfzu8F0sSUHte4g2ksSKcWiGb0xEV_6w0DA9Se0fgSJxJ9kgB7ZffxZBUumPbanj6-dLVFdgWY5aPMfge4GvJPlmnAAM0Pn0E9AxCvxDg89PHMitfg4XHeVOplgguuNk_etYzNk' }}
                  style={styles.modalVideoImage}
                />
                <View style={styles.modalPlayButton}>
                  <MaterialIcons name="play-circle-filled" size={64} color="#ffffff" />
                </View>
              </View>

              <Text style={styles.videoCaption}>
                "Hi! I'm Emma. Over the past 8 years, I've coached students from across the globe in natural pronunciation and corporate confidence. Looking forward to our conversation!"
              </Text>

              <TouchableOpacity 
                style={styles.modalBookButton}
                activeOpacity={0.8}
                onPress={() => {
                  setShowIntroModal(false);
                  handleBook();
                }}
              >
                <Text style={styles.modalBookButtonText}>Book Session with Emma ($15)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9ff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    width: '100%',
    height: width * (4 / 3),
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  playText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  profileContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#151c27',
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#004ac6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonText: {
    color: '#004ac6',
    fontWeight: '600',
    fontSize: 14,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#434654',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f3f3fd',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.2)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151c27',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 16,
  },
  bioText: {
    fontSize: 16,
    color: '#434654',
    lineHeight: 24,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  readMoreText: {
    color: '#004ac6',
    fontWeight: '600',
    fontSize: 14,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateLabel: {
    color: '#004ac6',
    fontWeight: '600',
    fontSize: 14,
  },
  timeSlotsContainer: {
    gap: 12,
    paddingRight: 24,
  },
  timeSlot: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    backgroundColor: '#ffffff',
  },
  timeSlotSelected: {
    backgroundColor: '#004ac6',
    borderColor: '#004ac6',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434654',
  },
  timeSlotTextSelected: {
    color: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 198, 214, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#151c27',
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  bookButton: {
    backgroundColor: '#004ac6',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  videoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  videoModalCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#151c27',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  videoPlayerBox: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  modalVideoImage: {
    width: '100%',
    height: '100%',
    opacity: 0.75,
  },
  modalPlayButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCaption: {
    color: '#dae2fd',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    fontStyle: 'italic',
  },
  modalBookButton: {
    marginTop: 20,
    backgroundColor: '#004ac6',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBookButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
