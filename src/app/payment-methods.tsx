import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, ImageBackground, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'visa' | 'apple'>('visa');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment & Billing</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Current Subscription Card */}
        <View style={styles.subscriptionCard}>
          <View style={styles.activePlanBadge}>
            <Text style={styles.activePlanText}>Active Plan</Text>
          </View>
          <View style={styles.subscriptionRow}>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.planTitle}>Vividly Master Premium</Text>
              <Text style={styles.planSubtitle}>
                Next billing date: <Text style={{ fontWeight: '600' }}>Oct 12, 2024</Text>
              </Text>
            </View>
            <View style={styles.subscriptionAction}>
              <Text style={styles.planPrice}>$29.99/mo</Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => router.push('/top-up')}
              >
                <Text style={styles.switchPlanText}>Switch Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity 
              style={styles.addPaymentButton}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Add Payment Method', 'Select Credit/Debit Card or Apple Pay.')}
            >
              <MaterialIcons name="add" size={18} color="#003594" />
              <Text style={styles.addPaymentText}>Add Method</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardGroup}>
            {/* Default Card (Visa) */}
            <TouchableOpacity 
              style={[styles.paymentMethodCard, selectedMethod === 'visa' && styles.defaultCardBorder]}
              activeOpacity={0.7}
              onPress={() => setSelectedMethod('visa')}
            >
              <View style={styles.paymentLeft}>
                <View style={styles.paymentIconBox}>
                  <MaterialIcons name="credit-card" size={24} color="#003594" />
                </View>
                <View>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.paymentTitle}>Visa ending in 4242</Text>
                    {selectedMethod === 'visa' && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.paymentSubtitle}>Expires 12/26</Text>
                </View>
              </View>
              <View style={styles.paymentRight}>
                {selectedMethod === 'visa' ? (
                  <View style={styles.radioSelected}>
                    <View style={styles.radioInner} />
                  </View>
                ) : (
                  <View style={styles.radioUnselected} />
                )}
              </View>
            </TouchableOpacity>

            {/* Apple Pay Card */}
            <TouchableOpacity 
              style={[styles.paymentMethodCard, selectedMethod === 'apple' && styles.defaultCardBorder]}
              activeOpacity={0.7}
              onPress={() => setSelectedMethod('apple')}
            >
              <View style={styles.paymentLeft}>
                <View style={styles.paymentIconBox}>
                  <MaterialIcons name="account-balance-wallet" size={24} color="#3a3e47" />
                </View>
                <View>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.paymentTitle}>Apple Pay</Text>
                    {selectedMethod === 'apple' && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.paymentSubtitle}>Connected via iCloud</Text>
                </View>
              </View>
              <View style={styles.paymentRight}>
                {selectedMethod === 'apple' ? (
                  <View style={styles.radioSelected}>
                    <View style={styles.radioInner} />
                  </View>
                ) : (
                  <View style={styles.radioUnselected} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Billing History Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Billing History</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Billing History', 'All your subscription invoices are listed below.')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialIcons name="open-in-new" size={18} color="#434654" />
            </TouchableOpacity>
          </View>

          <View style={styles.billingCard}>
            {/* Invoice Item 1 */}
            <View style={styles.invoiceItem}>
              <View style={styles.invoiceLeft}>
                <View style={styles.invoiceIconBox}>
                  <MaterialIcons name="receipt-long" size={20} color="#003594" />
                </View>
                <View>
                  <Text style={styles.invoiceDate}>Sept 12, 2024</Text>
                  <Text style={styles.invoiceDesc}>Premium Monthly Subscription</Text>
                </View>
              </View>
              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>$29.99</Text>
                <TouchableOpacity 
                  style={styles.downloadButton}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Download Receipt', 'Invoice PDF for Sept 12 sent to your registered email.')}
                >
                  <MaterialIcons name="download" size={16} color="#003594" />
                  <Text style={styles.downloadText}>PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Invoice Item 2 */}
            <View style={styles.invoiceItem}>
              <View style={styles.invoiceLeft}>
                <View style={styles.invoiceIconBox}>
                  <MaterialIcons name="receipt-long" size={20} color="#003594" />
                </View>
                <View>
                  <Text style={styles.invoiceDate}>Aug 12, 2024</Text>
                  <Text style={styles.invoiceDesc}>Premium Monthly Subscription</Text>
                </View>
              </View>
              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>$29.99</Text>
                <TouchableOpacity 
                  style={styles.downloadButton}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Download Receipt', 'Invoice PDF for Aug 12 sent to your registered email.')}
                >
                  <MaterialIcons name="download" size={16} color="#003594" />
                  <Text style={styles.downloadText}>PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Invoice Item 3 (No Bottom Border) */}
            <View style={[styles.invoiceItem, { borderBottomWidth: 0 }]}>
              <View style={styles.invoiceLeft}>
                <View style={styles.invoiceIconBox}>
                  <MaterialIcons name="receipt-long" size={20} color="#003594" />
                </View>
                <View>
                  <Text style={styles.invoiceDate}>July 12, 2024</Text>
                  <Text style={styles.invoiceDesc}>Premium Monthly Subscription</Text>
                </View>
              </View>
              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>$29.99</Text>
                <TouchableOpacity 
                  style={styles.downloadButton}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Download Receipt', 'Invoice PDF for July 12 sent to your registered email.')}
                >
                  <MaterialIcons name="download" size={16} color="#003594" />
                  <Text style={styles.downloadText}>PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Promo Bento */}
        <ImageBackground 
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEzfQz7wiN45QgsUcXaQCpQRUcD43Jm0sTQlPg6EoUYxRT5jATgo_1uF8Oa6n0LLisbPaJCJSb6jU1gLwira8XvXJASlt-0UgXjnUW-PGJcWPRIlf_Sjl4GHWE84snq5bSBDB4gvUTDRaxNfEvJTwuqsyGqykXHZcw6GObYTplfIkzXxXqNIXFaE9A6Odk5n3OTxuWQXBzkTg0U1iCJ3fmFUOvmUMiZj3_CDLpTq6_ynPhk7XNfUER7jsnAgnH9U5_a1gkql86yAn3' }}
          style={styles.promoBento}
          imageStyle={{ borderRadius: 16, opacity: 0.3 }}
        >
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Invite Friends, Earn Credits</Text>
            <Text style={styles.promoSubtitle}>Share the Vividly experience and get $10 credit for every successful referral.</Text>
            <TouchableOpacity 
              style={styles.promoButton}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Referral Link Copied', 'Your referral link has been copied to your clipboard: https://vividly.app/refer/you')}
            >
              <Text style={styles.promoButtonText}>Refer Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Help/Contact */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Need assistance?</Text>
          
          <TouchableOpacity 
            style={styles.helpItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/help-center')}
          >
            <View style={[styles.helpIconBox, { backgroundColor: 'rgba(124, 249, 148, 0.2)' }]}>
              <MaterialIcons name="chat" size={24} color="#007230" />
            </View>
            <View style={styles.helpInfo}>
              <Text style={styles.helpItemTitle}>Chat with Support</Text>
              <Text style={styles.helpItemSubtitle}>Instant help available 24/7</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#737685" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.helpItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/help-center')}
          >
            <View style={[styles.helpIconBox, { backgroundColor: '#e2e8f8' }]}>
              <MaterialIcons name="help" size={24} color="#003594" />
            </View>
            <View style={styles.helpInfo}>
              <Text style={styles.helpItemTitle}>Billing FAQ</Text>
              <Text style={styles.helpItemSubtitle}>Answers to common questions</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#737685" />
          </TouchableOpacity>
        </View>

        <View style={styles.safetyRow}>
          <MaterialIcons name="verified-user" size={14} color="#737685" />
          <Text style={styles.safetyText}>SECURE SSL ENCRYPTED</Text>
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
    borderBottomColor: 'rgba(195, 198, 214, 0.4)',
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
    color: '#003594',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  subscriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    marginBottom: 24,
  },
  activePlanBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#7cf994',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  activePlanText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007230',
  },
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  subscriptionInfo: {
    flex: 1,
    minWidth: 150,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#151c27',
  },
  planSubtitle: {
    fontSize: 14,
    color: '#434654',
    marginTop: 4,
  },
  subscriptionAction: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003594',
  },
  switchPlanText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003594',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#151c27',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addPaymentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003594',
  },
  cardGroup: {
    gap: 16,
  },
  paymentMethodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  defaultCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#004ac6',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  paymentIconBox: {
    width: 56,
    height: 40,
    backgroundColor: '#e7eefe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#151c27',
  },
  defaultBadge: {
    backgroundColor: 'rgba(184, 200, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#003594',
  },
  paymentSubtitle: {
    fontSize: 11,
    color: '#434654',
  },
  paymentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#003594',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#003594',
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#c3c6d6',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#434654',
  },
  billingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    overflow: 'hidden',
  },
  invoiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 198, 214, 0.2)',
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  invoiceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#151c27',
  },
  invoiceDesc: {
    fontSize: 11,
    color: '#434654',
  },
  invoiceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  invoiceAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#151c27',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e7eefe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  downloadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003594',
  },
  promoBento: {
    backgroundColor: '#003594',
    borderRadius: 16,
    height: 240,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  promoContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#b4c5ff',
    marginBottom: 24,
  },
  promoButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  promoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003594',
  },
  helpContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 16,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  helpIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpInfo: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#151c27',
  },
  helpItemSubtitle: {
    fontSize: 11,
    color: '#434654',
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  safetyText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#737685',
    letterSpacing: 1,
  }
});
