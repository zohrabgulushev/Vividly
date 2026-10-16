import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HelpCenterScreen() {
  const router = useRouter();

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
              placeholder="Search for guides, billing, etc."
              placeholderTextColor="#737685"
            />
          </View>
        </LinearGradient>

        {/* Quick Links / Bento Grid style */}
        <View style={styles.quickLinksContainer}>
          <TouchableOpacity style={styles.quickLinkCard} activeOpacity={0.8}>
            <View style={[styles.quickLinkIconBox, { backgroundColor: '#dbe1ff' }]}>
              <MaterialIcons name="account-circle" size={24} color="#003594" />
            </View>
            <Text style={styles.quickLinkTitle}>Account</Text>
            <Text style={styles.quickLinkSubtitle}>Profile & Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickLinkCard} activeOpacity={0.8}>
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
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.faqList}>
            {/* FAQ 1 */}
            <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
              <View style={styles.faqIconBox}>
                <MaterialIcons name="credit-card" size={20} color="#003594" />
              </View>
              <Text style={styles.faqText}>Managing Subscriptions</Text>
              <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
            </TouchableOpacity>
            
            {/* FAQ 2 */}
            <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
              <View style={styles.faqIconBox}>
                <MaterialIcons name="school" size={20} color="#003594" />
              </View>
              <Text style={styles.faqText}>Working with Tutors</Text>
              <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
            </TouchableOpacity>
            
            {/* FAQ 3 */}
            <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
              <View style={styles.faqIconBox}>
                <MaterialIcons name="leaderboard" size={20} color="#003594" />
              </View>
              <Text style={styles.faqText}>League Rankings Guide</Text>
              <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
            </TouchableOpacity>
            
            {/* FAQ 4 */}
            <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
              <View style={styles.faqIconBox}>
                <MaterialIcons name="volume-up" size={20} color="#003594" />
              </View>
              <Text style={styles.faqText}>Audio & Pronunciation issues</Text>
              <MaterialIcons name="chevron-right" size={24} color="#c3c6d6" />
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.primaryContactButton}>
              <MaterialIcons name="chat" size={20} color="#ffffff" />
              <Text style={styles.primaryContactButtonText}>Chat With Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryContactButton}>
              <Text style={styles.secondaryContactButtonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>Vividly</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLinkText}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity>
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
