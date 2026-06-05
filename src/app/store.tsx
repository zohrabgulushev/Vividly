import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { awardXP, awardXPFallback } from '@/services/lessons';

export default function StoreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);

  const [freezeCount, setFreezeCount] = useState(0);
  const [doubleXPActive, setDoubleXPActive] = useState(false);
  const [amuletActive, setAmuletActive] = useState(false);

  // Load local power-up states
  useEffect(() => {
    AsyncStorage.getItem('vividly_streak_freeze').then(val => {
      if (val) setFreezeCount(parseInt(val, 10));
    });
    AsyncStorage.getItem('vividly_double_xp').then(val => {
      if (val === 'true') setDoubleXPActive(true);
    });
    AsyncStorage.getItem('vividly_weekend_amulet').then(val => {
      if (val === 'true') setAmuletActive(true);
    });
  }, []);

  const handlePurchaseFreeze = async () => {
    if (!user?.id || !profile) return;
    const cost = 200;
    if (profile.xp_balance < cost) {
      Alert.alert('Not enough XP', `You need ${cost} XP to purchase a Streak Freeze. Complete lessons to earn more!`);
      return;
    }

    if (freezeCount >= 2) {
      Alert.alert('Equipped Limit Reached', 'You can equip a maximum of 2 Streak Freezes at once.');
      return;
    }

    try {
      try {
        await awardXP(user.id, -cost);
      } catch (err) {
        await awardXPFallback(user.id, -cost);
      }
      const newCount = freezeCount + 1;
      setFreezeCount(newCount);
      await AsyncStorage.setItem('vividly_streak_freeze', newCount.toString());
      Alert.alert('Streak Freeze Equipped!', 'Your streak will be protected automatically if you miss a day of practice.');
    } catch (e) {
      console.error(e);
      Alert.alert('Purchase failed', 'An error occurred during the transaction.');
    }
  };

  const handlePurchaseDoubleXP = async () => {
    if (!user?.id || !profile) return;
    const cost = 100;
    if (profile.xp_balance < cost) {
      Alert.alert('Not enough XP', `You need ${cost} XP to purchase a Double XP Boost. Complete lessons to earn more!`);
      return;
    }

    if (doubleXPActive) {
      Alert.alert('Already Active', 'Double XP Boost is already active for the next 15 minutes.');
      return;
    }

    try {
      try {
        await awardXP(user.id, -cost);
      } catch (err) {
        await awardXPFallback(user.id, -cost);
      }
      setDoubleXPActive(true);
      await AsyncStorage.setItem('vividly_double_xp', 'true');
      Alert.alert('Double XP Boost Activated!', 'You will earn double XP for the next 15 minutes.');
    } catch (e) {
      console.error(e);
      Alert.alert('Purchase failed', 'An error occurred during the transaction.');
    }
  };

  const handlePurchaseAmulet = async () => {
    if (!user?.id || !profile) return;
    const cost = 500;
    if (profile.xp_balance < cost) {
      Alert.alert('Not enough XP', `You need ${cost} XP to purchase a Weekend Amulet. Complete lessons to earn more!`);
      return;
    }

    if (amuletActive) {
      Alert.alert('Already Active', 'Weekend Amulet is already active for this coming weekend.');
      return;
    }

    try {
      try {
        await awardXP(user.id, -cost);
      } catch (err) {
        await awardXPFallback(user.id, -cost);
      }
      setAmuletActive(true);
      await AsyncStorage.setItem('vividly_weekend_amulet', 'true');
      Alert.alert('Weekend Amulet Activated!', 'Your streak is protected over the weekend.');
    } catch (e) {
      console.error(e);
      Alert.alert('Purchase failed', 'An error occurred during the transaction.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="close" size={24} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store</Text>
        <View style={styles.balanceBadge}>
          <MaterialIcons name="diamond" size={16} color="#00a3ff" />
          <Text style={styles.balanceText}>{profile?.xp_balance ?? 0}</Text>
        </View>
      </View>
 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Vividly Pro Section */}
        <LinearGradient
          colors={['#004ac6', '#39b8fd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.proSection}
        >
          {/* Abstract background element */}
          <View style={styles.proBgCircle} />
          
          <View style={styles.proHeader}>
            <MaterialIcons name="auto-awesome" size={16} color="#ffddb8" />
            <Text style={styles.proBadgeText}>PREMIUM</Text>
          </View>
          
          <Text style={styles.proTitle}>Vividly Pro</Text>
          
          <View style={styles.proFeaturesList}>
            <View style={styles.proFeatureItem}>
              <MaterialIcons name="all-inclusive" size={20} color="#c9e6ff" />
              <Text style={styles.proFeatureText}>Unlimited Hearts</Text>
            </View>
            <View style={styles.proFeatureItem}>
              <MaterialIcons name="verified" size={20} color="#c9e6ff" />
              <Text style={styles.proFeatureText}>No ads, pure focus</Text>
            </View>
            <View style={styles.proFeatureItem}>
              <MaterialIcons name="school" size={20} color="#c9e6ff" />
              <Text style={styles.proFeatureText}>Personalized Practice</Text>
            </View>
          </View>
 
          <TouchableOpacity style={styles.proButton}>
            <Text style={styles.proButtonText}>Try 2 Weeks Free</Text>
          </TouchableOpacity>
        </LinearGradient>
 
        {/* Power-Ups Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Power-Ups</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Learn More</Text>
            </TouchableOpacity>
          </View>
 
          <View style={styles.itemsList}>
            {/* Streak Freeze */}
            <TouchableOpacity style={styles.itemCard} activeOpacity={0.7} onPress={handlePurchaseFreeze}>
              <View style={[styles.itemIconContainer, { backgroundColor: 'rgba(0, 101, 145, 0.1)' }]}>
                <MaterialIcons name="ac-unit" size={32} color="#006591" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>Streak Freeze</Text>
                <Text style={styles.itemSubtitle}>Keep your streak alive if you miss a day.</Text>
              </View>
              <View style={styles.itemAction}>
                <View style={styles.priceBadge}>
                  <MaterialIcons name="diamond" size={14} color="#00a3ff" />
                  <Text style={styles.priceText}>200</Text>
                </View>
                <Text style={styles.equippedText}>{freezeCount}/2 equipped</Text>
              </View>
            </TouchableOpacity>
 
            {/* Double XP Boost */}
            <TouchableOpacity style={styles.itemCard} activeOpacity={0.7} onPress={handlePurchaseDoubleXP}>
              <View style={[styles.itemIconContainer, { backgroundColor: 'rgba(89, 54, 0, 0.1)' }]}>
                <MaterialIcons name="bolt" size={32} color="#593600" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>Double XP Boost</Text>
                <Text style={styles.itemSubtitle}>Earn 2x XP for the next 15 minutes.</Text>
              </View>
              <View style={styles.itemAction}>
                {doubleXPActive ? (
                  <View style={[styles.priceBadge, { backgroundColor: '#e2f0d9' }]}>
                    <Text style={[styles.priceText, { color: '#385723' }]}>ACTIVE</Text>
                  </View>
                ) : (
                  <View style={styles.priceBadge}>
                    <MaterialIcons name="diamond" size={14} color="#00a3ff" />
                    <Text style={styles.priceText}>100</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
 
            {/* Weekend Amulet */}
            <TouchableOpacity style={styles.itemCard} activeOpacity={0.7} onPress={handlePurchaseAmulet}>
              <View style={[styles.itemIconContainer, { backgroundColor: 'rgba(0, 53, 148, 0.1)' }]}>
                <MaterialIcons name="pentagon" size={32} color="#003594" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>Weekend Amulet</Text>
                <Text style={styles.itemSubtitle}>Protect your streak over the weekend.</Text>
              </View>
              <View style={styles.itemAction}>
                {amuletActive ? (
                  <View style={[styles.priceBadge, { backgroundColor: '#e2f0d9' }]}>
                    <Text style={[styles.priceText, { color: '#385723' }]}>ACTIVE</Text>
                  </View>
                ) : (
                  <View style={styles.priceBadge}>
                    <MaterialIcons name="diamond" size={14} color="#00a3ff" />
                    <Text style={styles.priceText}>500</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gem Store Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Gem Store</Text>
          <View style={styles.gemGrid}>
            
            {/* Gem Pack 1 */}
            <TouchableOpacity style={styles.gemCard} activeOpacity={0.7}>
              <View style={styles.gemImageContainer}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbUXKPsO1tV0688kMovjrcdEmgmhFLTo49dhQdEgYfWYBVu0a40SLScaT7axkcxyD-ark3mlkhRU4GSVZkrEw5PT0v-Zne40DHb1WJJUXcnx0ImUtP4pFExLJ9Fe5XOksVc01QQ1LMoaZb3vqF3nKg5DgPO1Q9pleL67n6EOKPbakr1Y3X63IH2-ac0okz2vTrce44lmwllbdrL-5IJBgKaelavzQuAEPdUc3gCCEf3MsPvo07wBn2tOy5HDerYZpz-r-uAZfxbL0' }}
                  style={styles.gemImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.gemAmount}>500 Gems</Text>
              <Text style={styles.gemPrice}>$4.99</Text>
            </TouchableOpacity>

            {/* Gem Pack 2 */}
            <TouchableOpacity style={styles.gemCard} activeOpacity={0.7}>
              <View style={styles.gemImageContainer}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs9vLLBCFpADJKxjGzcOM80VemXBRWyzkKGi-0yEDY1_A_T-yQ41ObpGjXI4qSA3Q0-UnntHZexya4JuXNjYudctevbKOEa6cj5hfzyn9fOjosQqpBeLStDhESuSYBwhfO8H_nv3dviMpjVyP6t3ISgpjqNSQL8bbkDbnaHltBMfGgHDa8BbVGiHEaJLRS8X6GN3FihuPyxz85OdLKtnOYl2UeQhyTnGIXV0r01psI8IAZxJlOJdB3y_D4vZfY2meWsU3S9TSSxx5t' }}
                  style={styles.gemImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.gemAmount}>1200 Gems</Text>
              <Text style={styles.gemPrice}>$9.99</Text>
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
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
    backgroundColor: '#f9f9ff',
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
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151c27',
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#151c27',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  proSection: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  proBgCircle: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  proHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  proBadgeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  proTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  proFeaturesList: {
    gap: 12,
    marginBottom: 24,
  },
  proFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  proFeatureText: {
    color: '#ffffff',
    fontSize: 16,
  },
  proButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  proButtonText: {
    color: '#003594',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151c27',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003594',
  },
  itemsList: {
    gap: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f8',
    borderRadius: 24,
    padding: 16,
    gap: 16,
  },
  itemIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#434654',
  },
  itemAction: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7eefe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#151c27',
  },
  equippedText: {
    fontSize: 12,
    color: '#434654',
  },
  gemGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  gemCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f8',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  gemImageContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gemImage: {
    width: 64,
    height: 64,
  },
  gemAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 4,
  },
  gemPrice: {
    fontSize: 16,
    color: '#434654',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#784b00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  bestValueText: {
    color: '#ffbd6b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});
