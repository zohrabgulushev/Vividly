import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const LEADERBOARD = [
  { rank: 4, name: 'Emma Watson', xp: '9,450', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnbMIaV4uCttqDhcsX_g8-rC1aC4qgdhnHu9QxgDPxKiAnce_7MFYbwrTJEMZTMINZ4r6qP7PhRE6nUXtmT0FpOvXOTa2YGh6AvGUlBxdwTJB535SOmhFwn9-ynAEhsO5TMtIzYzLi0mPfiInKzA7qfcLixD3_wZxVD6iDcD0y5tZYawlnbLDyniLA7oe-bUxqLrqrZOozDFkoL0wPSB2750GQMpIHJEtPhPjI7iSa_gTdQGAdpmk8trI9fx-mOtiQigmbiywnE4k' },
  { rank: 5, name: 'Alex River', xp: '8,900', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgA62Aa_GPr0V5Pk0iHuTaSF90bA9H-GBca0ZSQizxyOaXSySjpCznFXVX0bWqXyRvLWFvZswkBvK77wxYbUE24eG8hMELaJ6INMSOiFRIf2Rp8QvpfSq-1iERILKzgYoRAgcK8p5EITcTVGWaNqwX92SzHnlfJh4XB4qfIeFtDSynfXot9vNTNQJ4LYSU4cGQbZBy6veV2vgbsKPguCaU9aMXPE00kR402CV4r6mnxaMkjSI_kSheyjSf7rMCHb-gmDXQHVXvXGc' },
  { rank: 6, name: 'Elena Sofia', xp: '8,210', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_7MpKVEX9bCglgydT3uHWmamYFTH_b2kyYU071WRa0Y_0BXa5kku3IMt8XNBangZ6r9drYTw0HPD3EC6qOQUAjQEAr3beF4jLD6B16oPykrL3cc_S3SgKqb1NMx0IX5BJANy2U8ezGTlM2FPbeuDWqSGhtbV2vSEijihY9N75ubEK26uspDwt08SeresRLz1Hi1JQnpeV3zB_w5H7o1A30RT9bia8Pwa35bBSjAHpAqT4MmOQqmBI0iyp2MCD1aez0Ww5oWTA7NA' },
  { rank: 7, name: 'John Smith', xp: '7,900', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPPjFRiwJwNglhWll6StA0S84JRiw-5e8EEdtnIcBB9vpc0bC1Kzp4Sixga14X-V_leZcBq4oAViM2catniLUj5C0Eoz_5EaYNVmwLaGpSbRFlleuzh6TEKtXNwMZaCm5TjqFgZRskgrdJsD8PGQvxTh6R6QCE6dwRNtiQjMh3Nxatm8OHv-wnDzallZY5PZCZn8WBlrNruFyfK1EdTSzf22Dzm7lEgWDGIK9LASvB9Pi5AR0uJcjY3_PzuGcdZBK-EK374L7IRnQ' },
];

export default function LeagueTab() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);
  const myXP = profile?.xp_balance ?? 0;
  const myAvatar = profile?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name ?? 'You')}&background=004ac6&color=fff&size=200`;
  const myName = profile?.full_name?.split(' ')[0] ?? 'You';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Weekly League</Text>
        <MaterialIcons name="info-outline" size={24} color="#004ac6" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* League Info */}
        <View style={styles.leagueInfo}>
          <Text style={styles.divisionTitle}>Diamond Division</Text>
          <Text style={styles.divisionSubtitle}>Top 10 players advance to Obsidian League</Text>
        </View>

        {/* Podium */}
        <View style={styles.podiumContainer}>
          
          {/* 2nd Place */}
          <View style={[styles.podiumColumn, { height: 180 }]}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY_18eXmJI3V3gVn_eHFCuZo-tjnOeteEqual5-r4v0am_NAsKLdvgE0DOg85BghcJVFPt_QVboO-J1_g49DwFetkD2QgFeSPHC3C0_FPsyE7KSeq2XSo73PXolNTqPuawABLzRaXxMgKEz8AvSHeITeibtFUYzm_4kPAjam-GZ0jX-Kli31WrXRni87svlI9L02lkLdo4iEO2vyfeMnMyjNbz_p6EXi_9Wbk9qf0N6tp1tNTjiOshygSiEvqkHttF0wy8xkdPtLQ' }} 
                style={[styles.avatar, { borderColor: '#cbd5e1' }]} 
              />
              <View style={[styles.rankBadge, { backgroundColor: '#cbd5e1' }]}>
                <Text style={styles.rankBadgeText}>2nd</Text>
              </View>
            </View>
            <LinearGradient colors={['#e2e8f0', '#cbd5e1']} style={styles.podiumBlock}>
              <Text style={styles.podiumName}>Marco</Text>
              <Text style={styles.podiumXP}>12,450</Text>
            </LinearGradient>
          </View>

          {/* 1st Place */}
          <View style={[styles.podiumColumn, { height: 230, zIndex: 10 }]}>
            <View style={styles.avatarWrapper}>
              <View style={styles.crownContainer}>
                <MaterialIcons name="star" size={32} color="#f59e0b" />
              </View>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFvb4mVu8cwT3V_dvHpEabryPIKKwLmQAJgjAYI1AZBfL3rW6hSYd4BxqmzC3SvoWTp2tC1L5bs8fPvEzgF2AGD0g36B1oavibzvmoYB374U8CbqaN8g5cyW4C6Z_QjCnaYvs_k3UOhuU17kQviB1RACLqBlQJUBDMSJBIgYOAqHBHIm9KcJ5Cg9E1CERiGUzhIxd7T48lHP-6tcNW3iVqnrB3gEG69iXj2ogad3bKmKaxtROrJb2J1jNaOH5zgK-iNdMTuVqxWpw' }} 
                style={[styles.avatar, styles.avatarLarge, { borderColor: '#f59e0b' }]} 
              />
              <View style={[styles.rankBadge, { backgroundColor: '#f59e0b' }]}>
                <Text style={[styles.rankBadgeText, { color: '#ffffff' }]}>1st</Text>
              </View>
            </View>
            <LinearGradient colors={['#fde047', '#f59e0b']} style={[styles.podiumBlock, styles.podiumBlockGold]}>
              <Text style={[styles.podiumName, { color: '#78350f' }]}>Sarah J.</Text>
              <Text style={[styles.podiumXP, { color: '#92400e' }]}>15,820</Text>
            </LinearGradient>
          </View>

          {/* 3rd Place */}
          <View style={[styles.podiumColumn, { height: 160 }]}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIKgtYq6Ks3ShJme-2crCDMzf1x-zziTXpttzmTXvAudzDxICp448emxmy5rFcCDHuyJB54YiIuUadByYTRjuadvpa-ErPLSoWO9aJMaMixBEl43tJPCR05yuJJFFMDnrPPc6UbgI0AgqF0PQtLV2X6_juMsPA6XpLrFVkv-rjh5B3GjGPvuWD8VzSCWeGxsYRZZSeeYCqVPvyyjOWTbYseZt0SyksXw7BimM5hBu0Q3BtN_QxB5_XQBTDLRYAKK-4Dcp17_E_gSg' }} 
                style={[styles.avatar, { borderColor: '#fdba74' }]} 
              />
              <View style={[styles.rankBadge, { backgroundColor: '#fdba74' }]}>
                <Text style={styles.rankBadgeText}>3rd</Text>
              </View>
            </View>
            <LinearGradient colors={['#fed7aa', '#fb923c']} style={styles.podiumBlock}>
              <Text style={styles.podiumName}>David L.</Text>
              <Text style={styles.podiumXP}>11,200</Text>
            </LinearGradient>
          </View>

        </View>

        {/* Leaderboard List */}
        <View style={styles.listContainer}>
          {LEADERBOARD.map((user, index) => (
            <View key={user.rank} style={[styles.listRow, index !== LEADERBOARD.length - 1 && styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <Text style={styles.rankNumber}>{user.rank}</Text>
                <Image source={{ uri: user.image }} style={styles.rowAvatar} />
                <Text style={styles.rowName}>{user.name}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowXP}>{user.xp}</Text>
                <MaterialIcons name="bolt" size={16} color="#004ac6" />
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Sticky You Row */}
      <View style={styles.stickyRowContainer}>
        <View style={styles.stickyRow}>
          <View style={styles.rowLeft}>
            <Text style={[styles.rankNumber, { color: '#ffffff', width: 24 }]}>12</Text>
            <Image
              source={{ uri: myAvatar }}
              style={[styles.rowAvatar, { borderWidth: 2, borderColor: '#ffffff' }]}
            />
            <View>
              <Text style={[styles.rowName, { color: '#ffffff' }]}>{myName}</Text>
              <Text style={styles.stickySubtitle}>Weekly ranking</Text>
            </View>
          </View>
          <View style={styles.rowRight}>
            <Text style={[styles.rowXP, { color: '#ffffff' }]}>{myXP.toLocaleString()}</Text>
            <MaterialIcons name="bolt" size={20} color="#f59e0b" />
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 60,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  headerSpacer: { width: 24 }, // Balances the right icon
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#004ac6', letterSpacing: -0.5 },

  scrollContent: { paddingBottom: 120 },

  leagueInfo: { alignItems: 'center', marginTop: 16, marginBottom: 32 },
  divisionTitle: { fontSize: 24, fontWeight: '700', color: '#151c27', marginBottom: 4 },
  divisionSubtitle: { fontSize: 14, color: '#737686' },

  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 8,
  },
  podiumColumn: { flex: 1, maxWidth: 110, alignItems: 'center' },
  
  avatarWrapper: { position: 'relative', marginBottom: 8, alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 4 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40 },
  
  crownContainer: { position: 'absolute', top: -30 },
  rankBadge: {
    position: 'absolute',
    bottom: -8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  rankBadgeText: { fontSize: 10, fontWeight: '700', color: '#151c27' },

  podiumBlock: {
    width: '100%',
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    paddingTop: 16,
  },
  podiumBlockGold: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  podiumName: { fontSize: 14, fontWeight: '600', color: '#151c27', marginBottom: 2 },
  podiumXP: { fontSize: 12, fontWeight: '500', color: '#434654' },

  listContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e2ec',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#f0f3ff' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankNumber: { width: 20, fontSize: 14, fontWeight: '600', color: '#737686', textAlign: 'center' },
  rowAvatar: { width: 40, height: 40, borderRadius: 20 },
  rowName: { fontSize: 16, fontWeight: '500', color: '#151c27' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowXP: { fontSize: 16, fontWeight: '600', color: '#151c27' },

  stickyRowContainer: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
  },
  stickyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#004ac6',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  stickySubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
});
