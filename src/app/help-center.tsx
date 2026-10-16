import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, TextInput, Alert, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

interface FAQ {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  category: 'billing' | 'tutors' | 'league' | 'audio' | 'general';
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    icon: 'credit-card',
    category: 'billing',
    title: 'Managing Subscriptions & Minutes',
    answer: 'You can purchase minute packages anytime from the Top Up screen. Minutes are automatically credited to your balance upon checkout and do not expire. To view receipts or change your payment method, visit the Payment Methods page in your Profile settings.',
  },
  {
    id: 'faq-2',
    icon: 'school',
    category: 'tutors',
    title: 'Working with Tutors & Booking',
    answer: 'Browse certified native speakers in the Speak tab. You can call available tutors instantly if you have active minutes, or schedule a custom 1-on-1 session in advance through their tutor profile calendar.',
  },
  {
    id: 'faq-3',
    icon: 'leaderboard',
    category: 'league',
    title: 'League Rankings & XP Guide',
    answer: 'Every completed lesson, practice prompt, and speaking call earns XP. The leaderboard resets weekly on Sunday at midnight UTC. The top 10 learners in each division earn promotion to the next tier and exclusive rewards.',
  },
  {
    id: 'faq-4',
    icon: 'volume-up',
    category: 'audio',
    title: 'Audio & Pronunciation Issues',
    answer: 'Ensure your microphone permissions are granted in your browser or device settings. In call rooms, you can mute/unmute your microphone using the control bar at the bottom. Use headphones for the best echo-free experience.',
  },
  {
    id: 'faq-5',
    icon: 'ac-unit',
    category: 'general',
    title: 'Streak Freezes & Double XP',
    answer: 'Protect your hard-earned daily practice streak by equipping a Streak Freeze from the Store for 200 XP. You can hold up to 2 freezes at once. Double XP boosts amplify your learning rewards for 15 minutes!',
  },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = FAQS.filter(faq => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return faq.title.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  const handleChat = () => {
    Alert.alert(
      'Live Support Agent',
      'Vividly AI Support is online 24/7. How can we help you today?',
      [
        { text: 'Billing Question', onPress: () => router.push('/payment-methods') },
        { text: 'Tutor Inquiry', onPress: () => router.push('/(tabs)/speak') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleEmail = () => {
    if (Platform.OS === 'web') {
      window.open('mailto:support@vividly.app?subject=Vividly%20Support%20Inquiry', '_blank');
    } else {
      Linking.openURL('mailto:support@vividly.app?subject=Vividly%20Support%20Inquiry').catch(() => {
        Alert.alert('Email Support', 'Contact us directly at support@vividly.app');
      });
    }
  };

  const handlePolicy = (title: string) => {
    Alert.alert(
      title,
      `Vividly is committed to protecting your learning data, speech privacy, and payment security. For our full legal documentation, contact legal@vividly.app.`,
      [{ text: 'Got it' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Search Section */}
        <LinearGradient
          colors={['#003594', '#004ac6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroGlow1} />
          <View style={styles.heroGlow2} />
          
          <Text style={styles.heroTitle}>How can we help you today?</Text>
          
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#737685" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search guides, billing, audio..."
              placeholderTextColor="#737685"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialIcons name="close" size={20} color="#737685" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Quick Links / Bento Grid style */}
        <View style={styles.quickLinksContainer}>
          <TouchableOpacity 
            style={styles.quickLinkCard} 
            activeOpacity={0.8}
            onPress={() => router.push('/edit-profile')}
          >
            <View style={[styles.quickLinkIconBox, { backgroundColor: '#dbe1ff' }]}>
              <MaterialIcons name="account-circle" size={24} color="#003594" />
            </View>
            <Text style={styles.quickLinkTitle}>Account</Text>
            <Text style={styles.quickLinkSubtitle}>Profile & Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickLinkCard} 
            activeOpacity={0.8}
            onPress={() => router.push('/payment-methods')}
          >
            <View style={[styles.quickLinkIconBox, { backgroundColor: '#e5f1ff' }]}>
              <MaterialIcons name="payments" size={24} color="#003594" />
            </View>
            <Text style={styles.quickLinkTitle}>Billing</Text>
            <Text style={styles.quickLinkSubtitle}>Plans & Receipts</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Categories */}
        <View style={styles.faqSection}>
          <View style={styles.faqHeaderRow}>
            <Text style={styles.faqSectionTitle}>Popular Topics</Text>
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.viewAllText}>Reset Filter</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.faqList}>
            {filteredFaqs.length === 0 ? (
              <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                <MaterialIcons name="search-off" size={40} color="#c3c6d6" />
                <Text style={{ marginTop: 8, color: '#737685', fontSize: 14 }}>No answers matching "{searchQuery}"</Text>
              </View>
            ) : (
              filteredFaqs.map(faq => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <View key={faq.id} style={{ marginBottom: 12 }}>
                    <TouchableOpacity 
                      style={[styles.faqItem, isExpanded && { borderColor: '#004ac6', backgroundColor: 'rgba(0, 74, 198, 0.04)' }]} 
                      activeOpacity={0.7}
                      onPress={() => toggleFaq(faq.id)}
                    >
                      <View style={[styles.faqIconBox, isExpanded && { backgroundColor: '#004ac6' }]}>
                        <MaterialIcons name={faq.icon} size={20} color={isExpanded ? '#ffffff' : '#003594'} />
                      </View>
                      <Text style={[styles.faqText, isExpanded && { color: '#004ac6', fontWeight: '700' }]}>{faq.title}</Text>
                      <MaterialIcons 
                        name={isExpanded ? 'expand-less' : 'expand-more'} 
                        size={24} 
                        color={isExpanded ? '#004ac6' : '#c3c6d6'} 
                      />
                    </TouchableOpacity>
                    {isExpanded && (
                      <View style={{ backgroundColor: '#ffffff', padding: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#004ac6', marginTop: -4 }}>
                        <Text style={{ fontSize: 14, color: '#434654', lineHeight: 22 }}>
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Still Need Help Section */}
        <View style={styles.contactSection}>
          <View style={styles.contactBackgroundGlow} />
          
          <View style={styles.supportAgentIconBox}>
            <MaterialIcons name="support-agent" size={32} color="#ffffff" />
          </View>
          
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactSubtitle}>
            Our dedicated support team is available 24/7 to help you achieve your goals.
          </Text>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.primaryContactButton} activeOpacity={0.8} onPress={handleChat}>
              <MaterialIcons name="chat" size={20} color="#ffffff" />
              <Text style={styles.primaryContactButtonText}>Chat With Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryContactButton} activeOpacity={0.8} onPress={handleEmail}>
              <Text style={styles.secondaryContactButtonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>Vividly</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => handlePolicy('Privacy Policy')}>
              <Text style={styles.footerLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePolicy('Terms of Service')}>
              <Text style={styles.footerLinkText}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePolicy('Cookie Settings')}>
              <Text style={styles.footerLinkText}>Cookies</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerCopyright}>© 2024 Vividly Language Learning</Text>
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
    backgroundColor: '#f9f9ff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 198, 214, 0.3)',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    width: 40,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#151c27',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flexGrow: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 64, // Extra padding to account for overlapping cards
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow1: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 80,
  },
  heroGlow2: {
    position: 'absolute',
    left: -40,
    bottom: 0,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(0, 74, 198, 0.3)',
    borderRadius: 64,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 24,
    lineHeight: 36,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#151c27',
  },
  quickLinksContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -32, // Negative margin to overlap hero
    gap: 16,
    zIndex: 20,
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.2)',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickLinkIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quickLinkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 4,
  },
  quickLinkSubtitle: {
    fontSize: 11,
    color: '#434654',
  },
  faqSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  faqHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  faqSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#151c27',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003594',
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.1)',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  faqIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  faqText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#151c27',
  },
  contactSection: {
    marginTop: 48,
    marginHorizontal: 20,
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.2)',
    alignItems: 'center',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  contactBackgroundGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 53, 148, 0.05)',
  },
  supportAgentIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#004ac6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 8,
    zIndex: 10,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#434654',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    zIndex: 10,
  },
  contactButtons: {
    width: '100%',
    gap: 12,
    zIndex: 10,
  },
  primaryContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003594',
    height: 56,
    borderRadius: 28,
    gap: 8,
  },
  primaryContactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryContactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#003594',
  },
  secondaryContactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003594',
  },
  footer: {
    marginTop: 48,
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 198, 214, 0.2)',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003594',
    marginBottom: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  footerLinkText: {
    fontSize: 14,
    color: '#585f6c',
  },
  footerCopyright: {
    fontSize: 14,
    color: 'rgba(88, 95, 108, 0.6)',
  }
});
