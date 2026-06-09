import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const MOCK_LEAGUE_PLAYERS = [
  { name: 'Sarah J.', xp: 180, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFvb4mVu8cwT3V_dvHpEabryPIKKwLmQAJgjAYI1AZBfL3rW6hSYd4BxqmzC3SvoWTp2tC1L5bs8fPvEzgF2AGD0g36B1oavibzvmoYB374U8CbqaN8g5cyW4C6Z_QjCnaYvs_k3UOhuU17kQviB1RACLqBlQJUBDMSJBIgYOAqHBHIm9KcJ5Cg9E1CERiGUzhIxd7T48lHP-6tcNW3iVqnrB3gEG69iXj2ogad3bKmKaxtROrJb2J1jNaOH5zgK-iNdMTuVqxWpw' },
  { name: 'Marco', xp: 140, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY_18eXmJI3V3gVn_eHFCuZo-tjnOeteEqual5-r4v0am_NAsKLdvgE0DOg85BghcJVFPt_QVboO-J1_g49DwFetkD2QgFeSPHC3C0_FPsyE7KSeq2XSo73PXolNTqPuawABLzRaXxMgKEz8AvSHeITeibtFUYzm_4kPAjam-GZ0jX-Kli31WrXRni87svlI9L02lkLdo4iEO2vyfeMnMyjNbz_p6EXi_9Wbk9qf0N6tp1tNTjiOshygSiEvqkHttF0wy8xkdPtLQ' },
  { name: 'David L.', xp: 120, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIKgtYq6Ks3ShJme-2crCDMzf1x-zziTXpttzmTXvAudzDxICp448emxmy5rFcCDHuyJB54YiIuUadByYTRjuadvpa-ErPLSoWO9aJMaMixBEl43tJPCR05yuJJFFMDnrPPc6UbgI0AgqF0PQtLV2X6_juMsPA6XpLrFVkv-rjh5B3GjGPvuWD8VzSCWeGxsYRZZSeeYCqVPvyyjOWTbYseZt0SyksXw7BimM5hBu0Q3BtN_QxB5_XQBTDLRYAKK-4Dcp17_E_gSg' },
  { name: 'Emma Watson', xp: 95, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnbMIaV4uCttqDhcsX_g8-rC1aC4qgdhnHu9QxgDPxKiAnce_7MFYbwrTJEMZTMINZ4r6qP7PhRE6nUXtmT0FpOvXOTa2YGh6AvGUlBxdwTJB535SOmhFwn9-ynAEhsO5TMtIzYzLi0mPfiInKzA7qfcLixD3_wZxVD6iDcD0y5tZYawlnbLDyniLA7oe-bUxqLrqrZOozDFkoL0wPSB2750GQMpIHJEtPhPjI7iSa_gTdQGAdpmk8trI9fx-mOtiQigmbiywnE4k' },
  { name: 'Alex River', xp: 70, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgA62Aa_GPr0V5Pk0iHuTaSF90bA9H-GBca0ZSQizxyOaXSySjpCznFXVX0bWqXyRvLWFvZswkBvK77wxYbUE24eG8hMELaJ6INMSOiFRIf2Rp8QvpfSq-1iERILKzgYoRAgcK8p5EITcTVGWaNqwX92SzHnlfJh4XB4qfIeFtDSynfXot9vNTNQJ4LYSU4cGQbZBy6veV2vgbsKPguCaU9aMXPE00kR402CV4r6mnxaMkjSI_kSheyjSf7rMCHb-gmDXQHVXvXGc' },
  { name: 'Elena Sofia', xp: 50, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_7MpKVEX9bCglgydT3uHWmamYFTH_b2kyYU071WRa0Y_0BXa5kku3IMt8XNBangZ6r9drYTw0HPD3EC6qOQUAjQEAr3beF4jLD6B16oPykrL3cc_S3SgKqb1NMx0IX5BJANy2U8ezGTlM2FPbeuDWqSGhtbV2vSEijihY9N75ubEK26uspDwt08SeresRLz1Hi1JQnpeV3zB_w5H7o1A30RT9bia8Pwa35bBSjAHpAqT4MmOQqmBI0iyp2MCD1aez0Ww5oWTA7NA' },
  { name: 'John Smith', xp: 30, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPPjFRiwJwNglhWll6StA0S84JRiw-5e8EEdtnIcBB9vpc0bC1Kzp4Sixga14X-V_leZcBq4oAViM2catniLUj5C0Eoz_5EaYNVmwLaGpSbRFlleuzh6TEKtXNwMZaCm5TjqFgZRskgrdJsD8PGQvxTh6R6QCE6dwRNtiQjMh3Nxatm8OHv-wnDzallZY5PZCZn8WBlrNruFyfK1EdTSzf22Dzm7lEgWDGIK9LASvB9Pi5AR0uJcjY3_PzuGcdZBK-EK374L7IRnQ' },
];

export default function LeagueTab() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);
  const myXP = profile?.xp_balance ?? 0;
  const myAvatar = profile?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name ?? 'You')}&background=004ac6&color=fff&size=200`;
  const myName = profile?.full_name?.split(' ')[0] ?? 'You';

  // Merge current user dynamically into leaderboard
  const allPlayers = [
    ...MOCK_LEAGUE_PLAYERS.map(p => ({ ...p, isCurrentUser: false })),
    {
      name: myName,
      xp: myXP,
      image: myAvatar,
      isCurrentUser: true,
    }
  ];

  // Sort by XP descending
  allPlayers.sort((a, b) => b.xp - a.xp);

  // Assign ranks
  const rankedPlayers = allPlayers.map((player, index) => ({
    ...player,
    rank: index + 1,
  }));

  const myRank = rankedPlayers.find(p => p.isCurrentUser)?.rank ?? (rankedPlayers.length + 1);

  // Extract top 3 for podium
  const firstPlace = rankedPlayers[0];
  const secondPlace = rankedPlayers[1];
  const thirdPlace = rankedPlayers[2];

  // Remaining list players (rank 4+)
  const listPlayers = rankedPlayers.slice(3);

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
          <View style={styles.demoBadge}>
            <MaterialIcons name="science" size={14} color="#004ac6" style={{ marginRight: 4 }} />
            <Text style={styles.demoBadgeText}>PRACTICE SEASON DEMO</Text>
          </View>
          <Text style={styles.divisionSubtitle}>Top 10 players advance to Obsidian League</Text>
        </View>

        {/* Podium */}
        <View style={styles.podiumContainer}>
          
          {/* 2nd Place */}
          {secondPlace && (
            <View style={[styles.podiumColumn, { height: 180 }]}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: secondPlace.image }} 
                  style={[
                    styles.avatar, 
                    { borderColor: secondPlace.isCurrentUser ? '#004ac6' : '#cbd5e1' }
                  ]} 
                />
                <View style={[styles.rankBadge, { backgroundColor: secondPlace.isCurrentUser ? '#004ac6' : '#cbd5e1' }]}>
                  <Text style={[styles.rankBadgeText, secondPlace.isCurrentUser && { color: '#ffffff' }]}>2nd</Text>
                </View>
              </View>
              <LinearGradient 
                colors={secondPlace.isCurrentUser ? ['#e0ebff', '#cbdcff'] : ['#e2e8f0', '#cbd5e1']} 
                style={[styles.podiumBlock, secondPlace.isCurrentUser && styles.podiumBlockMe]}
              >
                <Text style={[styles.podiumName, secondPlace.isCurrentUser && { color: '#004ac6', fontWeight: '700' }]}>
                  {secondPlace.name}
                </Text>
                <Text style={[styles.podiumXP, secondPlace.isCurrentUser && { color: '#004ac6' }]}>
                  {secondPlace.xp.toLocaleString()}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* 1st Place */}
          {firstPlace && (
            <View style={[styles.podiumColumn, { height: 230, zIndex: 10 }]}>
              <View style={styles.avatarWrapper}>
                <View style={styles.crownContainer}>
                  <MaterialIcons name="star" size={32} color="#f59e0b" />
                </View>
                <Image 
                  source={{ uri: firstPlace.image }} 
                  style={[
                    styles.avatar, 
                    styles.avatarLarge, 
                    { borderColor: firstPlace.isCurrentUser ? '#004ac6' : '#f59e0b' }
                  ]} 
                />
                <View style={[styles.rankBadge, { backgroundColor: firstPlace.isCurrentUser ? '#004ac6' : '#f59e0b' }]}>
                  <Text style={[styles.rankBadgeText, { color: '#ffffff' }]}>1st</Text>
                </View>
              </View>
              <LinearGradient 
                colors={firstPlace.isCurrentUser ? ['#e0ebff', '#cbdcff'] : ['#fde047', '#f59e0b']} 
                style={[
                  styles.podiumBlock, 
                  styles.podiumBlockGold, 
                  firstPlace.isCurrentUser && styles.podiumBlockMe
                ]}
              >
                <Text style={[
                  styles.podiumName, 
                  { color: firstPlace.isCurrentUser ? '#004ac6' : '#78350f' },
                  firstPlace.isCurrentUser && { fontWeight: '700' }
                ]}>
                  {firstPlace.name}
                </Text>
                <Text style={[
                  styles.podiumXP, 
                  { color: firstPlace.isCurrentUser ? '#004ac6' : '#92400e' }
                ]}>
                  {firstPlace.xp.toLocaleString()}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* 3rd Place */}
          {thirdPlace && (
            <View style={[styles.podiumColumn, { height: 160 }]}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: thirdPlace.image }} 
                  style={[
                    styles.avatar, 
                    { borderColor: thirdPlace.isCurrentUser ? '#004ac6' : '#fdba74' }
                  ]} 
                />
                <View style={[styles.rankBadge, { backgroundColor: thirdPlace.isCurrentUser ? '#004ac6' : '#fdba74' }]}>
                  <Text style={[styles.rankBadgeText, thirdPlace.isCurrentUser && { color: '#ffffff' }]}>3rd</Text>
                </View>
              </View>
              <LinearGradient 
                colors={thirdPlace.isCurrentUser ? ['#e0ebff', '#cbdcff'] : ['#fed7aa', '#fb923c']} 
                style={[styles.podiumBlock, thirdPlace.isCurrentUser && styles.podiumBlockMe]}
              >
                <Text style={[styles.podiumName, thirdPlace.isCurrentUser && { color: '#004ac6', fontWeight: '700' }]}>
                  {thirdPlace.name}
                </Text>
                <Text style={[styles.podiumXP, thirdPlace.isCurrentUser && { color: '#004ac6' }]}>
                  {thirdPlace.xp.toLocaleString()}
                </Text>
              </LinearGradient>
            </View>
          )}

        </View>

        {/* Leaderboard List */}
        <View style={styles.listContainer}>
          {listPlayers.map((player, index) => {
            const isMe = player.isCurrentUser;
            return (
              <View 
                key={player.name + '-' + player.rank} 
                style={[
                  styles.listRow, 
                  isMe && styles.listRowMe,
                  index !== listPlayers.length - 1 && styles.borderBottom
                ]}
              >
                <View style={styles.rowLeft}>
                  <Text style={[styles.rankNumber, isMe && { color: '#004ac6', fontWeight: '700' }]}>{player.rank}</Text>
                  <Image source={{ uri: player.image }} style={styles.rowAvatar} />
                  <Text style={[styles.rowName, isMe && { color: '#004ac6', fontWeight: '700' }]}>
                    {player.name} {isMe && '(You)'}
                  </Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={[styles.rowXP, isMe && { color: '#004ac6', fontWeight: '700' }]}>
                    {player.xp.toLocaleString()}
                  </Text>
                  <MaterialIcons name="bolt" size={16} color={isMe ? '#f59e0b' : '#004ac6'} />
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* Sticky You Row */}
      <View style={styles.stickyRowContainer}>
        <View style={styles.stickyRow}>
          <View style={styles.rowLeft}>
            <Text style={[styles.rankNumber, { color: '#ffffff', width: 24 }]}>{myRank}</Text>
            <Image
              source={{ uri: myAvatar }}
              style={[styles.rowAvatar, { borderWidth: 2, borderColor: '#ffffff' }]}
            />
            <View>
              <Text style={[styles.rowName, { color: '#ffffff', fontWeight: '700' }]}>{myName} (You)</Text>
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

  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 74, 198, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#004ac6',
    letterSpacing: 0.5,
  },

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
  podiumBlockMe: {
    borderWidth: 2.5,
    borderColor: 'rgba(0, 74, 198, 0.4)',
  },
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
  listRowMe: {
    backgroundColor: '#f0f3ff',
  },
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
