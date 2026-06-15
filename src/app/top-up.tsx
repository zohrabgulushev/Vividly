import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Platform, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';

export default function TopUpScreen() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState(2); // 1 = 1 Hour, 2 = 5 Hours, 3 = 10 Hours
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vividly</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7hd8Gm4Y_IZEYRuxgTetxQPnUxqobGLq5w0-QRveBRIgAWbkUWfclKVXJbK30gzXa7Af9vBC5Y2LJ1twEjtl5HT35bVm9CQy7oyoRQvNh905c7Z8ozBJ3BWBn5cD-F9IOyG7cwNpuyFwC1eY77MdN3W6CMv07BJTj591MPqJaC6ShqSur2wIMA1SnkDROlGYyRevP19q4-aMSgS-bJMdv3UamReTb86m9J_Lir--Yg-m5_YB5wxy9WWe7LxdYNhtKCRbyLNJUqoDP' }}
            style={styles.heroImage}
            imageStyle={{ borderRadius: 64 }}
          >
            <View style={styles.heroImageOverlay} />
          </ImageBackground>
          <Text style={styles.heroTitle}>Unlock Fluency</Text>
          <Text style={styles.heroSubtitle}>Accelerate your learning journey with premium tutoring hours. Reward yourself today.</Text>
        </View>

        {/* Pricing Tiers */}
        <View style={styles.pricingSection}>
          {/* Tier 1 */}
          <TouchableOpacity 
            style={[styles.tierCard, selectedTier === 1 && styles.tierCardActive]}
            activeOpacity={0.8}
            onPress={() => setSelectedTier(1)}
          >
            <View style={[styles.tierIconBox, selectedTier === 1 && styles.tierIconBoxActive]}>
              <MaterialIcons name="local-fire-department" size={24} color={selectedTier === 1 ? "#ffffff" : "#434654"} />
            </View>
            <View style={styles.tierInfo}>
              <Text style={[styles.tierTitle, selectedTier === 1 && styles.tierTitleActive]}>60 Minutes</Text>
              <Text style={[styles.tierSubtitle, selectedTier === 1 && styles.tierSubtitleActive]}>Group conversation minutes</Text>
            </View>
            <Text style={[styles.tierPrice, selectedTier === 1 && styles.tierPriceActive]}>15 ₼</Text>
          </TouchableOpacity>

          {/* Tier 2 */}
          <TouchableOpacity 
            style={[styles.tierCard, selectedTier === 2 && styles.tierCardActive, { marginTop: 8 }]}
            activeOpacity={0.8}
            onPress={() => setSelectedTier(2)}
          >
            {selectedTier === 2 && (
              <LinearGradient
                colors={['#0055e6', '#004ac6']}
                style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
              />
            )}
            
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 20%</Text>
            </View>

            <View style={[styles.tierIconBox, selectedTier === 2 ? styles.tierIconBoxActiveDark : { backgroundColor: '#f0f3ff' }]}>
              <MaterialIcons name="star" size={24} color={selectedTier === 2 ? "#ffffff" : "#003594"} />
            </View>
            <View style={styles.tierInfo}>
              <Text style={[styles.tierTitle, selectedTier === 2 && styles.tierTitleActive]}>300 Minutes</Text>
              <Text style={[styles.tierSubtitle, selectedTier === 2 && styles.tierSubtitleActive]}>Group conversation minutes</Text>
            </View>
            <Text style={[styles.tierPrice, selectedTier === 2 && styles.tierPriceActive]}>60 ₼</Text>
          </TouchableOpacity>

          {/* Tier 3 */}
          <TouchableOpacity 
            style={[styles.tierCard, selectedTier === 3 && styles.tierCardActive, { marginTop: 20, overflow: 'visible' }]}
            activeOpacity={0.8}
            onPress={() => setSelectedTier(3)}
          >
            <View style={styles.eliteBadge}>
              <Text style={styles.eliteBadgeText}>ELITE CHOICE</Text>
            </View>
            <View style={[styles.tierIconBox, selectedTier === 3 && styles.tierIconBoxActive]}>
              <MaterialIcons name="workspace-premium" size={24} color={selectedTier === 3 ? "#ffffff" : "#855300"} />
            </View>
            <View style={styles.tierInfo}>
              <Text style={[styles.tierTitle, selectedTier === 3 && styles.tierTitleActive]}>600 Minutes</Text>
              <Text style={[styles.tierSubtitle, selectedTier === 3 && styles.tierSubtitleActive]}>Group conversation minutes</Text>
            </View>
            <Text style={[styles.tierPrice, selectedTier === 3 && styles.tierPriceActive]}>100 ₼</Text>
          </TouchableOpacity>

          {/* Disclaimer Text */}
          <View style={styles.disclaimerContainer}>
            <MaterialIcons name="info-outline" size={16} color="#737685" style={{ marginTop: 2 }} />
            <Text style={styles.disclaimerText}>
              Minutes are displayed for Group Conversation classes. Private 1-on-1 sessions consume minutes at a 2x rate.
            </Text>
          </View>
        </View>

        {/* Trust Section */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>WHAT'S INCLUDED</Text>
          <View style={styles.trustList}>
            <View style={styles.trustItem}>
              <MaterialIcons name="check-circle" size={20} color="#004ac6" />
              <Text style={styles.trustText}>Priority booking access</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialIcons name="check-circle" size={20} color="#004ac6" />
              <Text style={styles.trustText}>Exclusive study materials</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialIcons name="check-circle" size={20} color="#004ac6" />
              <Text style={styles.trustText}>Cancel anytime guarantee</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Checkout Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.disabledButton]} 
          onPress={() => !loading && handleCheckout(false)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Complete Purchase</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.applePayButton, loading && styles.disabledButton]} 
          onPress={() => !loading && handleCheckout(true)}
          disabled={loading}
        >
          <MaterialIcons name="payments" size={20} color="#ffffff" />
          <Text style={styles.applePayText}>Pay with Apple Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

  const handleCheckout = async (isApplePay = false) => {
    if (!user?.id) {
      Alert.alert('Authentication Required', 'Please log in to make a purchase.');
      return;
    }

    setLoading(true);

    // Get package details
    let packageId = 'pkg-60';
    let name = '60 Minutes';
    let minutesToCredit = 60;
    let priceAzn = 15;

    if (selectedTier === 2) {
      packageId = 'pkg-300';
      name = '300 Minutes';
      minutesToCredit = 300;
      priceAzn = 60;
    } else if (selectedTier === 3) {
      packageId = 'pkg-600';
      name = '600 Minutes';
      minutesToCredit = 600;
      priceAzn = 100;
    }

    // Simulate Payment Gateway processing (2 seconds)
    setTimeout(async () => {
      try {
        // 1. Credit profile balance
        const currentBalance = profile?.minutes_balance ?? 0;
        const newBalance = currentBalance + minutesToCredit;

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            minutes_balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        // 2. Insert transaction log
        const usdRate = 0.59;
        const amountUsd = Math.round(priceAzn * usdRate * 100) / 100;

        // Ensure minute_package exists
        const { data: pkgData, error: pkgError } = await supabase
          .from('minute_packages')
          .select('id')
          .eq('id', packageId)
          .maybeSingle();

        if (!pkgData) {
          await supabase
            .from('minute_packages')
            .upsert({
              id: packageId,
              name,
              group_minutes: minutesToCredit,
              private_minutes: Math.floor(minutesToCredit / 2),
              price_usd: amountUsd,
              is_popular: selectedTier === 2,
              is_active: true
            }, { onConflict: 'id' });
        }

        // Insert the transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            package_id: packageId,
            amount_usd: amountUsd,
            minutes_credited: minutesToCredit,
            payment_provider: isApplePay ? 'apple_pay' : 'acquiring_bank',
            payment_id: `sim_txn_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString()
          });

        setLoading(false);
        Alert.alert(
          'Purchase Successful!',
          `Successfully credited ${minutesToCredit} minutes to your balance.`,
          [{ text: 'Great!', onPress: () => router.back() }]
        );
      } catch (err: any) {
        setLoading(false);
        console.error('Simulated checkout database error:', err);
        Alert.alert('Database Connection Issue', 'Simulated payment succeeded, but we failed to update database balance. Please check your Supabase connection.');
      }
    }, 2000);
  };

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
    backgroundColor: 'rgba(249, 249, 255, 0.9)',
    zIndex: 10,
  },
  closeButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#003594',
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 200, // Space for footer
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroImage: {
    width: 128,
    height: 128,
    marginBottom: 24,
    borderRadius: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  heroImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 74, 198, 0.1)',
    borderRadius: 64,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#151c27',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
  pricingSection: {
    marginBottom: 32,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dce2f3',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    position: 'relative',
    marginBottom: 12,
  },
  tierCardActive: {
    backgroundColor: '#004ac6',
    borderColor: '#004ac6',
    shadowColor: '#004ac6',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  tierIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e7eefe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    zIndex: 10,
  },
  tierIconBoxActive: {
    backgroundColor: '#004ac6', // If active but not tier 2
  },
  tierIconBoxActiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tierInfo: {
    flex: 1,
    zIndex: 10,
  },
  tierTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 2,
  },
  tierTitleActive: {
    color: '#ffffff',
  },
  tierSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  tierSubtitleActive: {
    color: '#b8c8ff',
  },
  tierPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#151c27',
    zIndex: 10,
  },
  tierPriceActive: {
    color: '#ffffff',
  },
  saveBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fea619',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 20,
  },
  saveBadgeText: {
    color: '#684000',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  eliteBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: '#855300',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 20,
  },
  eliteBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  trustSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#dce2f3',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 16,
    letterSpacing: 1,
  },
  trustList: {
    gap: 12,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustText: {
    fontSize: 16,
    color: '#434654',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: '#dce2f3',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004ac6',
    paddingVertical: 16,
    borderRadius: 24,
    marginBottom: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  applePayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151c27',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  applePayText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#737685',
    flex: 1,
    lineHeight: 18,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
