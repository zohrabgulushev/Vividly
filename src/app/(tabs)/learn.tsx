import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';

const MOCK_LESSONS: Record<string, Array<{ id: string; title: string; question: string; correct_answer: string; options: string[]; xp_reward: number }>> = {
  A1: [
    { id: 'mock-a1-1', title: 'Introduction', question: 'Translate: "Hello, how are you?"', correct_answer: 'Salam, necəsən?', options: ['Salam, necəsən?', 'Sağ olun.', 'Mənim adım Əlidir.', 'Sabahınız xeyir.'], xp_reward: 10 },
    { id: 'mock-a1-2', title: 'Daily Greetings', question: 'Translate: "Good morning!"', correct_answer: 'Sabahınız xeyir!', options: ['Sabahınız xeyir!', 'Axşamınız xeyir!', 'Gecəniz xeyirə qalsın!', 'Hələlik!'], xp_reward: 10 },
    { id: 'mock-a1-3', title: 'Numbers 1-10', question: 'What is the number "three" in Azerbaijani?', correct_answer: 'Üç', options: ['Bir', 'İki', 'Üç', 'Dörd'], xp_reward: 15 },
    { id: 'mock-a1-4', title: 'Simple Objects', question: 'Translate: "Book"', correct_answer: 'Kitab', options: ['Kitab', 'Qələm', 'Dəftər', 'Masa'], xp_reward: 15 },
    { id: 'mock-a1-5', title: 'Colors', question: 'What color is "Red"?', correct_answer: 'Qırmızı', options: ['Mavi', 'Yaşıl', 'Qırmızı', 'Sarı'], xp_reward: 15 },
  ],
  B1: [
    { id: 'mock-b1-1', title: 'Introduction', question: 'Complete the sentence: "If I _____ you, I would take that offer."', correct_answer: 'were', options: ['am', 'was', 'were', 'would be'], xp_reward: 15 },
    { id: 'mock-b1-2', title: 'Daily Greetings', question: 'Select the correct phrase for: "Zəhmət olmasa bir qəhvə verin."', correct_answer: 'A coffee, please.', options: ['A coffee, please.', 'Where is the coffee?', 'I hate coffee.', 'Thank you for coffee.'], xp_reward: 15 },
    { id: 'mock-b1-3', title: 'Ordering Coffee', question: 'Translate: "I would like to order a coffee, please."', correct_answer: 'Zəhmət olmasa bir qəhvə sifariş etmək istərdim.', options: ['Zəhmət olmasa bir qəhvə sifariş etmək istərdim.', 'Mən çay içmək istəyirəm.', 'Hesabı gətirin, zəhmət olmasa.', 'Mənə su verin.'], xp_reward: 15 },
    { id: 'mock-b1-4', title: 'Numbers 1-20', question: 'How do you say "fifteen"?', correct_answer: 'On beş', options: ['On dörd', 'On beş', 'On altı', 'On yeddi'], xp_reward: 15 },
    { id: 'mock-b1-5', title: 'Bonus: Culture', question: 'Which city is famous for Big Ben?', correct_answer: 'London', options: ['New York', 'London', 'Paris', 'Baku'], xp_reward: 20 },
  ],
  C1: [
    { id: 'mock-c1-1', title: 'Introduction', question: 'Choose the synonym of "meticulous":', correct_answer: 'thorough', options: ['careless', 'thorough', 'fast', 'sluggish'], xp_reward: 20 },
    { id: 'mock-c1-2', title: 'Daily Greetings', question: 'What does "break a leg" mean?', correct_answer: 'good luck', options: ['get hurt', 'good luck', 'run fast', 'work hard'], xp_reward: 20 },
    { id: 'mock-c1-3', title: 'Advanced Idioms', question: 'Complete: "He decided to play it by _____."', correct_answer: 'ear', options: ['eye', 'ear', 'mouth', 'hand'], xp_reward: 20 },
    { id: 'mock-c1-4', title: 'Formal Writing', question: 'Translate: "Bu layihənin uğuru komanda işindən asılıdır."', correct_answer: 'The success of this project depends on teamwork.', options: ['The success of this project depends on teamwork.', 'Project success is teamwork.', 'We must work in team.', 'Teamwork is good.'], xp_reward: 20 },
    { id: 'mock-c1-5', title: 'Bonus: Culture', question: 'What is the capital of Australia?', correct_answer: 'Canberra', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], xp_reward: 25 },
  ]
};

const NODE_POSITIONS = [
  { top: -20, left: 180 },
  { top: 180, left: 40 },
  { top: 380, left: 180 },
  { top: 580, left: 40 },
  { top: 780, left: 140 },
];

export default function LearnScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);

  const [lessons, setLessons] = useState<any[]>([]);
  const [userLessons, setUserLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  // Pulse animation for the active node
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Floating bounce animation for the character
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user?.id || !profile?.level) return;

    setLoadingLessons(true);
    // Fetch all lessons for user's level
    supabase
      .from('lessons')
      .select('*')
      .eq('level', profile.level)
      .order('created_at', { ascending: true })
      .then(({ data: lData, error: lErr }) => {
        if (lErr) console.error('Error fetching lessons:', lErr);
        
        // Fetch student's lesson progress
        supabase
          .from('user_lessons')
          .select('*')
          .eq('student_id', user.id)
          .then(({ data: ulData, error: ulErr }) => {
            if (ulErr) console.error('Error fetching user lessons:', ulErr);
            
            setLessons(lData || []);
            setUserLessons(ulData || []);
            setLoadingLessons(false);
          });
      });
  }, [user?.id, profile?.level]);

  useEffect(() => {
    // Start pulsing loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start bouncing loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleNodePress = (lessonId: string, isLocked: boolean) => {
    if (isLocked) {
      return;
    }
    router.push({
      pathname: '/lesson-player',
      params: { lessonId }
    });
  };

  // Determine lessons to display (Supabase or local mock fallback)
  const currentLevel = profile?.level || 'B1';
  const displayLessons = lessons.length > 0 ? lessons : (MOCK_LESSONS[currentLevel as keyof typeof MOCK_LESSONS] || MOCK_LESSONS.B1);

  // Find active node index
  let activeIndex = 0;
  if (userLessons.length > 0) {
    const completedSet = new Set(userLessons.map(ul => ul.lesson_id));
    activeIndex = displayLessons.findIndex(l => !completedSet.has(l.id));
    if (activeIndex === -1) {
      activeIndex = displayLessons.length; // all completed
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Floating Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Logo & Flag */}
          <View style={styles.logoContainer}>
            <View style={styles.flagWrapper}>
              <Image
                source={{
                  uri: 'https://flagcdn.com/w80/gb.png',
                }}
                style={styles.flagImage}
              />
            </View>
            <Text style={styles.logoText}>Vividly</Text>
          </View>

          {/* Stat Badges */}
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={[styles.statBadge, styles.minutesBadge]} 
              activeOpacity={0.7}
              onPress={() => router.push('/top-up')}
            >
              <Text style={styles.statEmoji}>📞</Text>
              <Text style={[styles.statText, styles.minutesText]}>{profile?.minutes_balance ?? 0}m</Text>
            </TouchableOpacity>
            <View style={styles.statBadge}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statText}>{profile?.current_streak ?? 0}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statEmoji}>💎</Text>
              <Text style={styles.statText}>{profile?.xp_balance ?? 0}</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar under Header */}
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={['#003594', '#4e00ae']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: '45%' }]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Unit 1 Hero Card */}
        <View style={styles.heroCard}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr3N4dIwqnha8AcJ0A4Vs9KSFm7aYhXEnCDeaJwVJxeN1G4mxRHuUl1PCl1rCPZbm1_KqPuphCv5RGnmpWca1DaTYDbqSYUWlxwJO9K4vjX9QK95UbuK-UNbEAsi8pv078KCpPls3Kga2vNC7f3reAF9VtTClxsikrUYbFWwT0xioGIbTb2iTUicoxuv90vxYjwrFc6_1cMAJG-MJigjCnDKyR0LRDhGz24dVr93NHz8dfufkTX3PDkwvIdpvF9KgHm0gVS5Waxrxs',
            }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['rgba(0, 53, 148, 0.95)', 'rgba(0, 53, 148, 0.4)', 'transparent']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.heroGradient}
          />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTag}>UNIT 1</Text>
            <Text style={styles.heroTitle}>Basics & Greetings</Text>
            <Text style={styles.heroSubtitle}>
              Start your journey through the bustling streets of London.
            </Text>
          </View>
        </View>

        {/* Learning Pathway Map Area */}
        <View style={styles.pathwayMapContainer}>
          {/* SVG Connector Lines */}
          <View style={styles.svgContainer}>
            <Svg width="360" height="950" viewBox="0 0 360 950">
              <Defs>
                <SvgLinearGradient id="pathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#003594" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#4e00ae" stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              {/* Background dashed route */}
              <Path
                d="M 180 50 Q 280 150 180 250 T 180 450 T 180 650 T 180 850"
                fill="none"
                stroke="rgba(0, 53, 148, 0.1)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="8 8"
              />
              {/* Active colored route progress */}
              <Path
                d="M 180 50 Q 280 150 180 250 T 180 450"
                fill="none"
                stroke="url(#pathGrad)"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* Dynamic Nodes Mapping */}
          {displayLessons.slice(0, 5).map((lesson, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;
            const isLocked = index > activeIndex;
            const pos = NODE_POSITIONS[index] || NODE_POSITIONS[0];
            const isBonus = index === 4; // Node 5 is bonus chest

            return (
              <View key={lesson.id} style={[styles.nodeContainer, { top: pos.top, left: pos.left }]}>
                {isActive && (
                  <Animated.View
                    style={[
                      styles.activeOuterPulse,
                      {
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  />
                )}

                {isBonus ? (
                  <TouchableOpacity
                    activeOpacity={isLocked ? 1.0 : 0.8}
                    onPress={() => handleNodePress(lesson.id, isLocked)}
                    disabled={isLocked}
                  >
                    <LinearGradient
                      colors={isLocked ? ['#c3c6d6', '#a1a4b5'] : ['#4e00ae', '#003594']}
                      style={[styles.bonusChest, isLocked && { opacity: 0.6 }]}
                    >
                      <MaterialIcons name={isLocked ? "lock" : "card-giftcard"} size={36} color="#ffffff" />
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.nodeButton,
                      isCompleted && styles.nodeCompleted,
                      isActive && styles.nodeActive,
                      isLocked && styles.nodeLocked,
                    ]}
                    activeOpacity={isLocked ? 1.0 : 0.8}
                    onPress={() => handleNodePress(lesson.id, isLocked)}
                    disabled={isLocked}
                  >
                    {isCompleted && <MaterialIcons name="check" size={32} color="#ffffff" />}
                    {isActive && <MaterialIcons name="play-arrow" size={44} color="#ffffff" />}
                    {isLocked && <MaterialIcons name="lock" size={28} color="#737685" />}
                  </TouchableOpacity>
                )}

                <View style={[
                  styles.nodeLabelCard, 
                  isActive && styles.nodeLabelActive,
                  isLocked && styles.nodeLabelCardSimple
                ]}>
                  <Text style={[
                    isCompleted && styles.nodeLabelTextCompleted,
                    isActive && styles.nodeLabelTextActive,
                    isLocked && styles.nodeLabelTextLocked,
                  ]}>
                    {lesson.title || `Lesson ${index + 1}`}
                  </Text>
                </View>

                {isActive && !isBonus && (
                  <View style={styles.newTopicBadge}>
                    <Text style={styles.newTopicText}>START!</Text>
                  </View>
                )}
              </View>
            );
          })}

          {/* Floating Character */}
          <Animated.View
            style={[
              styles.characterWrapper,
              {
                top: 260,
                left: 110,
                transform: [{ translateY: bounceAnim }],
              },
            ]}
          >
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNMUBbFz9h70diJukPV9wsev6EtkcuOI747CSILLzRZ6dCl_MZWvvE_YJOVNX5FdlQL2Wje3qq1oiNvkhPhKZbyUj34x0XwvWQ43UdSHjeqokebUp632nfgkuwhayRbAd3-8Iy23VkpG45T3-Ths41OyZysCt2XBZwHMItdCcb7NPdDWjRUJcj4sDlhHP5A1HntVnHTnpW7DJQJZxq8-b5En0CWQQ45BrrFeGQhKgrMy2RlIzjUy9ezL0D6xZ8hatuMVqyvGGWS0eG',
              }}
              style={styles.characterAvatar}
            />
          </Animated.View>
        </View>

        {/* Unit 2: Locked Section */}
        <View style={styles.unit2Section}>
          <LinearGradient
            colors={['#003594', '#4e00ae']}
            style={styles.unit2Card}
          >
            {/* Locked Overlay Effect */}
            <View style={styles.unit2Overlay} />

            <View style={styles.lockCircle}>
              <MaterialIcons name="lock" size={28} color="#ffffff" />
            </View>

            <View style={styles.unit2Content}>
              <Text style={styles.unit2Tag}>UNIT 2</Text>
              <Text style={styles.unit2Title}>Everyday Conversations</Text>
              <Text style={styles.unit2Subtitle}>
                Unlock this unit by completing all lessons in Unit 1.
              </Text>
            </View>

            <TouchableOpacity style={styles.lockedBtn} activeOpacity={1.0}>
              <Text style={styles.lockedBtnText}>Locked</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Contextual FAB - Vocabulary/Phrase book */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => router.push('/practice-prompts')}>
        <MaterialIcons name="auto-stories" size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fe',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.4)',
    zIndex: 100,
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e2ea',
  },
  flagImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003594',
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecedf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statEmoji: {
    fontSize: 14,
  },
  statText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003594',
  },
  minutesBadge: {
    backgroundColor: '#e7eefe',
    borderWidth: 1,
    borderColor: '#004ac6',
  },
  minutesText: {
    color: '#004ac6',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#e1e2ea',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  scrollContent: {
    paddingTop: 66,
    paddingBottom: 120,
  },
  heroCard: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  heroTag: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    lineHeight: 20,
  },
  pathwayMapContainer: {
    width: 360,
    height: 950,
    alignSelf: 'center',
    position: 'relative',
    marginVertical: 16,
    backgroundColor: '#f0f3ff',
    borderRadius: 32,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  nodeContainer: {
    position: 'absolute',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  nodeCompleted: {
    backgroundColor: '#003594',
  },
  nodeActive: {
    backgroundColor: '#f97316',
    width: 90,
    height: 90,
    borderRadius: 45,
    shadowColor: '#f97316',
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  activeOuterPulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    zIndex: -1,
  },
  nodeLocked: {
    backgroundColor: '#d8dae1',
    opacity: 0.8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
  },
  bonusChest: {
    width: 84,
    height: 84,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4e00ae',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ rotate: '8deg' }],
  },
  nodeLabelCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(195,198,214,0.3)',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nodeLabelCardSimple: {
    marginTop: 8,
  },
  nodeLabelActive: {
    borderColor: '#f97316',
    borderWidth: 1.5,
  },
  nodeLabelTextCompleted: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003594',
  },
  nodeLabelTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f97316',
  },
  nodeLabelTextLocked: {
    fontSize: 12,
    fontWeight: '700',
    color: '#737685',
    textAlign: 'center',
  },
  nodeLabelTextBonus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4e00ae',
    textAlign: 'center',
  },
  newTopicBadge: {
    position: 'absolute',
    top: 5,
    right: -25,
    backgroundColor: '#4e00ae',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#4e00ae',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    transform: [{ rotate: '12deg' }],
  },
  newTopicText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  characterWrapper: {
    position: 'absolute',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  characterAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  unit2Section: {
    marginTop: 24,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  unit2Card: {
    position: 'relative',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  unit2Overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  lockCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  unit2Content: {
    alignItems: 'center',
    marginBottom: 16,
  },
  unit2Tag: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  unit2Title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  unit2Subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  lockedBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
    opacity: 0.6,
  },
  lockedBtnText: {
    color: '#003594',
    fontSize: 13,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 90,
  },
});
