import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function NotificationsScreen() {
  const router = useRouter();

  // State for toggles
  const [dailyReminders, setDailyReminders] = useState(true);
  const [leagueUpdates, setLeagueUpdates] = useState(true);
  const [tutorMessages, setTutorMessages] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialIcons name="info" size={20} color="#004ac6" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Customizing your alerts ensures you stay updated on your learning goals without being overwhelmed.
          </Text>
        </View>

        {/* Push Notifications Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>PUSH NOTIFICATIONS</Text>
          
          <View style={styles.cardGroup}>
            {/* Daily Reminders */}
            <View style={styles.settingCard}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 53, 148, 0.1)' }]}>
                  <MaterialIcons name="alarm" size={24} color="#003594" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Daily Reminders</Text>
                  <Text style={styles.cardSubtitle}>Time to practice your daily lesson</Text>
                </View>
              </View>
              <Switch
                value={dailyReminders}
                onValueChange={setDailyReminders}
                trackColor={{ false: '#dce3f2', true: '#003594' }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#dce3f2"
              />
            </View>

            {/* League Updates */}
            <View style={styles.settingCard}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(117, 31, 0, 0.1)' }]}>
                  <MaterialIcons name="leaderboard" size={24} color="#751f00" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>League Updates</Text>
                  <Text style={styles.cardSubtitle}>Stay on top of the leaderboard</Text>
                </View>
              </View>
              <Switch
                value={leagueUpdates}
                onValueChange={setLeagueUpdates}
                trackColor={{ false: '#dce3f2', true: '#003594' }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#dce3f2"
              />
            </View>

            {/* Tutor Messages */}
            <View style={styles.settingCard}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(87, 95, 107, 0.1)' }]}>
                  <MaterialIcons name="forum" size={24} color="#575f6b" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Tutor Messages</Text>
                  <Text style={styles.cardSubtitle}>Immediate alerts for new messages</Text>
                </View>
              </View>
              <Switch
                value={tutorMessages}
                onValueChange={setTutorMessages}
                trackColor={{ false: '#dce3f2', true: '#003594' }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#dce3f2"
              />
            </View>
          </View>
        </View>

        {/* Email Notifications Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>EMAIL NOTIFICATIONS</Text>
          
          <View style={styles.cardGroup}>
            {/* Promotions & Offers */}
            <View style={styles.settingCard}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#ededf8' }]}>
                  <MaterialIcons name="local-offer" size={24} color="#575f6b" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Promotions & Offers</Text>
                  <Text style={styles.cardSubtitle}>Exclusive deals and new courses</Text>
                </View>
              </View>
              <Switch
                value={promotions}
                onValueChange={setPromotions}
                trackColor={{ false: '#dce3f2', true: '#003594' }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#dce3f2"
              />
            </View>

            {/* Weekly Progress Report */}
            <View style={styles.settingCard}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 62, 168, 0.1)' }]}>
                  <MaterialIcons name="insights" size={24} color="#003ea8" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Weekly Progress Report</Text>
                  <Text style={styles.cardSubtitle}>Review your achievements every Monday</Text>
                </View>
              </View>
              <Switch
                value={weeklyReport}
                onValueChange={setWeeklyReport}
                trackColor={{ false: '#dce3f2', true: '#003594' }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#dce3f2"
              />
            </View>
          </View>
        </View>

        {/* Focus Mode CTA */}
        <View style={styles.focusModeCard}>
          <View style={styles.focusModeGlow} />
          <View style={styles.focusModeContent}>
            <Text style={styles.focusModeTitle}>Focus Mode</Text>
            <Text style={styles.focusModeSubtitle}>Pause all notifications for 2 hours with a single tap.</Text>
            <TouchableOpacity style={styles.focusModeButton}>
              <Text style={styles.focusModeButtonText}>Enable Now</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f3ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: 'rgba(240, 243, 255, 0.9)',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    width: 40,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#151c27',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(220, 227, 242, 0.3)',
    borderColor: '#dce3f2',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#5d6571',
    lineHeight: 20,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#575f6b',
    letterSpacing: 0.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  cardGroup: {
    gap: 16,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    paddingRight: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#575f6b',
  },
  focusModeCard: {
    backgroundColor: '#003594',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  focusModeGlow: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 192,
    height: 192,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 96,
  },
  focusModeContent: {
    zIndex: 10,
  },
  focusModeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  focusModeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    lineHeight: 20,
  },
  focusModeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  focusModeButtonText: {
    color: '#003594',
    fontSize: 14,
    fontWeight: '600',
  }
});
