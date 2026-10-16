import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function RivalProfileScreen() {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isChallenged, setIsChallenged] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing(prev => {
      const next = !prev;
      Alert.alert(
        next ? 'Following Alex Chen' : 'Unfollowed Alex Chen',
        next 
          ? "You will now see Alex's weekly progress and leaderboard milestones."
          : "Alex Chen has been removed from your following feed."
      );
      return next;
    });
  };

  const handleMessage = () => {
    Alert.alert(
      'Cheer Alex Chen',
      'Send a motivational shoutout to Alex!',
      [
        { text: '🔥 Great streak!', onPress: () => Alert.alert('Sent!', 'Alex received your cheer!') },
        { text: '⚡ See you at the top!', onPress: () => Alert.alert('Sent!', 'Alex received your cheer!') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleChallenge = () => {
    if (isChallenged) {
      Alert.alert('Challenge Active', 'You already challenged Alex to a 24h XP race! Current margin: Alex +265 XP.');
      return;
    }
    setIsChallenged(true);
    Alert.alert(
      '⚔️ Challenge Sent!',
      '24-Hour Duel started! Complete lessons to catch up and overtake Alex Chen for a +50 XP bonus reward.',
      [{ text: 'Start Practice Now', onPress: () => router.push('/(tabs)/learn') }, { text: 'Later' }]
    );
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'Alex Chen',
      'Select action',
      [
        { text: 'Share Profile', onPress: () => Alert.alert('Link copied to clipboard!') },
        { text: 'Report Inappropriate Name/Avatar', style: 'destructive', onPress: () => Alert.alert('Report received. Thank you.') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/league')} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#003594" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vividly Profile</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleMoreOptions}>
          <MaterialIcons name="more-vert" size={24} color="#434654" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm4MOOL6V356DDvBLrwEDi_Ot_y3q7_88Se9_I0P8oWbOuqnvEhm3DiZvmNyxE7xgK3A9iJZGeJkx5qMyolWdWV8HZ9LW-SLMd6gjJjMJPiQrxZo1bzN02-x23JeUUAlcjw5HcWHSHRHtMw3EGMUaDSbdecGcDjEHiZg9ZJhutI86B9WXCToB8gD_ZoeFJ4UDK5GcANvhUsSamm8sSmeXZ1CSjgvRHZmOUAfikdd-NdDUz9ATsR3PSZySNUrtFwyUpDZEHmHX7j469' }}
              style={styles.avatar}
            />
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={16} color="#ffffff" />
            </View>
          </View>
          
          <Text style={styles.userName}>Alex Chen</Text>
          <Text style={styles.userSubtitle}>Diamond League Champion • UX/UI Track</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#003594' }]} 
              activeOpacity={0.8}
              onPress={handleToggleFollow}
            >
              <Text style={[styles.followButtonText, isFollowing && { color: '#003594' }]}>
                {isFollowing ? '✓ Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.messageButton} 
              activeOpacity={0.8}
              onPress={handleMessage}
            >
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <MaterialIcons name="bolt" size={28} color="#003594" style={styles.statIcon} />
            <Text style={styles.statValue}>12.8k</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialIcons name="local-fire-department" size={28} color="#855300" style={styles.statIcon} />
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialIcons name="emoji-events" size={28} color="#fea619" style={styles.statIcon} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Podiums</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialIcons name="shield" size={28} color="#003594" style={styles.statIcon} />
            <Text style={styles.statValue}>Elite</Text>
            <Text style={styles.statLabel}>League</Text>
          </View>
        </View>

        {/* Head-to-Head Comparison */}
        <View style={styles.h2hSection}>
          <View style={styles.h2hHeader}>
            <Text style={styles.h2hTitle}>Head-to-Head</Text>
            <View style={styles.h2hBadge}>
              <Text style={styles.h2hBadgeText}>This Week</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {/* You */}
            <View style={styles.chartColumn}>
              <View style={styles.chartBarBg}>
                <View style={[styles.chartBarFill, styles.chartBarYou, { height: '85%' }]} />
              </View>
              <Text style={styles.chartValue}>1,840</Text>
              <Text style={styles.chartLabel}>You</Text>
            </View>

            {/* VS */}
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            {/* Alex */}
            <View style={styles.chartColumn}>
              <View style={styles.chartBarBg}>
                <View style={[styles.chartBarFill, styles.chartBarAlex, { height: '100%' }]} />
              </View>
              <Text style={styles.chartValue}>2,105</Text>
              <Text style={[styles.chartLabel, { color: '#fea619' }]}>Alex Chen</Text>
            </View>
          </View>

          <View style={styles.h2hFooter}>
            <View style={styles.h2hFooterLeft}>
              <MaterialIcons name="trending-up" size={20} color="#fea619" />
              <Text style={styles.h2hFooterText}>Alex is in the lead by 265 XP</Text>
            </View>
            <TouchableOpacity style={styles.challengeButton} activeOpacity={0.8} onPress={handleChallenge}>
              <Text style={styles.challengeButtonText}>{isChallenged ? 'Active Duel' : 'Challenge'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Learning Path (Bonus) */}
        <View style={styles.pathSection}>
          <Text style={styles.pathSectionTitle}>Learning Path</Text>
          <View style={styles.pathCard}>
            <View style={styles.pathBadge}>
              <Text style={styles.pathBadgeText}>Current Focus</Text>
            </View>
            <Text style={styles.pathTitle}>Advanced Motion Design</Text>
            <Text style={styles.pathSubtitle}>Mastering complex easing and choreography in digital products.</Text>
            
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '72%' }]} />
            </View>
            
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>72% Completed</Text>
              <Text style={styles.progressHighlight}>14/20 Lessons</Text>
            </View>
          </View>
        </View>

      </ScrollView>
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
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 198, 214, 0.4)',
    backgroundColor: '#f9f9ff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003594',
    marginLeft: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#fea619',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#151c27',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  followButton: {
    backgroundColor: '#003594',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
  },
  messageButtonText: {
    color: '#003594',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    flexBasis: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  h2hSection: {
    backgroundColor: '#151c27',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  h2hHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  h2hTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  h2hBadge: {
    backgroundColor: '#004ac6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  h2hBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    marginBottom: 24,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarBg: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(220, 227, 242, 0.1)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  chartBarFill: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  chartBarYou: {
    backgroundColor: '#003594',
  },
  chartBarAlex: {
    backgroundColor: '#fea619',
  },
  chartValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#737685',
  },
  vsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  vsText: {
    fontSize: 28,
    fontWeight: '800',
    color: 'rgba(115, 118, 133, 0.3)',
    fontStyle: 'italic',
  },
  h2hFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h2hFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  h2hFooterText: {
    color: '#737685',
    fontSize: 12,
  },
  challengeButton: {
    backgroundColor: '#855300',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  challengeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  pathSection: {
    marginBottom: 24,
  },
  pathSectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 16,
  },
  pathCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  pathBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 53, 148, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  pathBadgeText: {
    color: '#003594',
    fontSize: 12,
    fontWeight: '600',
  },
  pathTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 8,
  },
  pathSubtitle: {
    fontSize: 16,
    color: '#434654',
    marginBottom: 24,
    lineHeight: 24,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(195, 198, 214, 0.3)',
    borderRadius: 6,
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#003594',
    borderRadius: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#434654',
  },
  progressHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003594',
  }
});
