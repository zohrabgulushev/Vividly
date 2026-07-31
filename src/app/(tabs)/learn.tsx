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
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface LevelMeta {
  code: string;
  name: string;
  desc: string;
  color: string;
}

const LEVEL_META: Record<string, LevelMeta> = {
  A1: { code: 'A1', name: 'Beginner', desc: 'Basics & everyday phrases', color: '#0284c7' },
  A2: { code: 'A2', name: 'Elementary', desc: 'Family, food & simple topics', color: '#059669' },
  B1: { code: 'B1', name: 'Intermediate', desc: 'Conversations & travel fluency', color: '#d97706' },
  B2: { code: 'B2', name: 'Upper-Intermediate', desc: 'Complex debates & business', color: '#ea580c' },
  C1: { code: 'C1', name: 'Advanced', desc: 'Academic & fluent nuances', color: '#7c3aed' },
  C2: { code: 'C2', name: 'Mastery', desc: 'Native eloquence & idioms', color: '#4e00ae' },
};

const MOCK_LESSONS: Record<string, Array<{ id: string; title: string; question: string; correct_answer: string; options: string[]; xp_reward: number }>> = {
  A1: [
    { id: 'mock-a1-1', title: 'Basics & Greetings', question: 'Translate: "Hello, how are you?"', correct_answer: 'Salam, necəsən?', options: ['Salam, necəsən?', 'Sağ olun.', 'Mənim adım Əlidir.', 'Sabahınız xeyir.'], xp_reward: 10 },
    { id: 'mock-a1-2', title: 'Daily Routine', question: 'Translate: "Good morning!"', correct_answer: 'Sabahınız xeyir!', options: ['Sabahınız xeyir!', 'Axşamınız xeyir!', 'Gecəniz xeyirə qalsın!', 'Hələlik!'], xp_reward: 10 },
    { id: 'mock-a1-3', title: 'Numbers & Time', question: 'What is the number "three" in Azerbaijani?', correct_answer: 'Üç', options: ['Bir', 'İki', 'Üç', 'Dörd'], xp_reward: 15 },
    { id: 'mock-a1-4', title: 'Simple Objects', question: 'Translate: "Book"', correct_answer: 'Kitab', options: ['Kitab', 'Qələm', 'Dəftər', 'Masa'], xp_reward: 15 },
    { id: 'mock-a1-5', title: 'Colors & Shapes', question: 'What color is "Red"?', correct_answer: 'Qırmızı', options: ['Mavi', 'Yaşıl', 'Qırmızı', 'Sarı'], xp_reward: 15 },
  ],
  A2: [
    { id: 'mock-a2-1', title: 'Family & Friends', question: 'Translate: "My brother works here."', correct_answer: 'Qardaşım burada işləyir.', options: ['Qardaşım burada işləyir.', 'Mən evdəyəm.', 'Bacım məktəbə gedir.', 'Dostum gəlir.'], xp_reward: 15 },
    { id: 'mock-a2-2', title: 'Food & Dining', question: 'Translate: "Can I have the menu?"', correct_answer: 'Menyunu ala bilərəm?', options: ['Menyunu ala bilərəm?', 'Hesabı verin.', 'Su verin.', 'Yemək ləzzətlidir.'], xp_reward: 15 },
    { id: 'mock-a2-3', title: 'Travel & Places', question: 'Where is the nearest bus station?', correct_answer: 'Ən yaxın avtobus dayanacağı haradadır?', options: ['Ən yaxın avtobus dayanacağı haradadır?', 'Mən taksi istəyirəm.', 'Hava limanı uzaqdır.', 'Bilet neçəyədir?'], xp_reward: 20 },
    { id: 'mock-a2-4', title: 'Shopping Essentials', question: 'How much does this cost?', correct_answer: 'Bu neçəyədir?', options: ['Bu neçəyədir?', 'Çox baha.', 'Endirim var?', 'Alıram.'], xp_reward: 20 },
    { id: 'mock-a2-5', title: 'Hobbies & Sports', question: 'Translate: "I love swimming."', correct_answer: 'Mən üzməyi sevirəm.', options: ['Mən üzməyi sevirəm.', 'Mən qaçıram.', 'Futbol oynayırıq.', 'Musiqi dinləyirəm.'], xp_reward: 20 },
  ],
  B1: [
    { id: 'mock-b1-1', title: 'Career & Work', question: 'Complete the sentence: "If I _____ you, I would take that offer."', correct_answer: 'were', options: ['am', 'was', 'were', 'would be'], xp_reward: 15 },
    { id: 'mock-b1-2', title: 'Ordering & Cafes', question: 'Select the correct phrase for: "Zəhmət olmasa bir qəhvə verin."', correct_answer: 'A coffee, please.', options: ['A coffee, please.', 'Where is the coffee?', 'I hate coffee.', 'Thank you for coffee.'], xp_reward: 15 },
    { id: 'mock-b1-3', title: 'Expressing Opinions', question: 'Translate: "In my opinion, this plan is great."', correct_answer: 'Məncə bu plan əladır.', options: ['Məncə bu plan əladır.', 'Plan pisdir.', 'Mən bilmirəm.', 'Razı deyiləm.'], xp_reward: 15 },
    { id: 'mock-b1-4', title: 'Future Goals', question: 'How do you say "fifteen"?', correct_answer: 'On beş', options: ['On dörd', 'On beş', 'On altı', 'On yeddi'], xp_reward: 15 },
    { id: 'mock-b1-5', title: 'Bonus: Culture', question: 'Which city is famous for Big Ben?', correct_answer: 'London', options: ['New York', 'London', 'Paris', 'Baku'], xp_reward: 20 },
  ],
  B2: [
    { id: 'mock-b2-1', title: 'Debates & Discussions', question: 'Choose the best transition: "_____ the weather was poor, we went hiking."', correct_answer: 'Although', options: ['Although', 'Because', 'Therefore', 'Despite of'], xp_reward: 20 },
    { id: 'mock-b2-2', title: 'Media & Technology', question: 'What does "cutting-edge" mean?', correct_answer: 'most advanced', options: ['sharp knife', 'most advanced', 'old-fashioned', 'cheap'], xp_reward: 20 },
    { id: 'mock-b2-3', title: 'Environmental Issues', question: 'Translate: "Decarbonization is vital."', correct_answer: 'Karbonsuzlaşdırma həyati vacibdir.', options: ['Karbonsuzlaşdırma həyati vacibdir.', 'Təbiət gözəldir.', 'Hava soyuqdur.', 'Su təmizdir.'], xp_reward: 20 },
    { id: 'mock-b2-4', title: 'Business Communication', question: 'Complete: "I look forward to _____ from you."', correct_answer: 'hearing', options: ['hear', 'hearing', 'heard', 'listened'], xp_reward: 20 },
    { id: 'mock-b2-5', title: 'Advanced Grammar', question: 'Had I known, I _____ called you.', correct_answer: 'would have', options: ['will have', 'would have', 'have', 'had'], xp_reward: 25 },
  ],
  C1: [
    { id: 'mock-c1-1', title: 'Academic English', question: 'Choose the synonym of "meticulous":', correct_answer: 'thorough', options: ['careless', 'thorough', 'fast', 'sluggish'], xp_reward: 20 },
    { id: 'mock-c1-2', title: 'Idioms & Nuances', question: 'What does "break a leg" mean?', correct_answer: 'good luck', options: ['get hurt', 'good luck', 'run fast', 'work hard'], xp_reward: 20 },
    { id: 'mock-c1-3', title: 'Advanced Expressions', question: 'Complete: "He decided to play it by _____."', correct_answer: 'ear', options: ['eye', 'ear', 'mouth', 'hand'], xp_reward: 20 },
    { id: 'mock-c1-4', title: 'Formal Writing', question: 'Translate: "Bu layihənin uğuru komanda işindən asılıdır."', correct_answer: 'The success of this project depends on teamwork.', options: ['The success of this project depends on teamwork.', 'Project success is teamwork.', 'We must work in team.', 'Teamwork is good.'], xp_reward: 20 },
    { id: 'mock-c1-5', title: 'Bonus: Culture', question: 'What is the capital of Australia?', correct_answer: 'Canberra', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], xp_reward: 25 },
  ],
  C2: [
    { id: 'mock-c2-1', title: 'Mastery & Rhetoric', question: 'Identify the rhetorical figure: "Time is a thief."', correct_answer: 'Metaphor', options: ['Metaphor', 'Simile', 'Oxymoron', 'Hyperbole'], xp_reward: 25 },
    { id: 'mock-c2-2', title: 'Subtle Distinctions', question: 'Which word implies subtle difference?', correct_answer: 'Nuance', options: ['Nuance', 'Clarity', 'Noise', 'Contrast'], xp_reward: 25 },
    { id: 'mock-c2-3', title: 'Literary Analysis', question: 'What is an "allusion"?', correct_answer: 'An indirect reference', options: ['An optical trick', 'An indirect reference', 'A falsehood', 'A direct quote'], xp_reward: 30 },
    { id: 'mock-c2-4', title: 'Native Eloquence', question: 'Choose the most natural phrasing:', correct_answer: 'It goes without saying that efficiency matters.', options: ['It goes without saying that efficiency matters.', 'It says without going that efficiency is big.', 'Without saying goes efficiency.', 'Saying goes efficiency.'], xp_reward: 30 },
    { id: 'mock-c2-5', title: 'Capron Mastery', question: 'Congratulations on reaching C2 Mastery!', correct_answer: 'Mastered', options: ['Mastered', 'Passed', 'Completed', 'Excelled'], xp_reward: 50 },
  ],
};

// PLACEMENT TEST QUESTIONS (5 Questions per Level)
const PLACEMENT_TEST_QUESTIONS: Record<string, Array<{ q: string; ans: string; opts: string[] }>> = {
  B2: [
    { q: 'Choose the correct form: "If she _____ harder, she would have passed the exam."', ans: 'had studied', opts: ['studied', 'had studied', 'would study', 'studies'] },
    { q: 'What does "to cut corners" mean?', ans: 'Do something perfunctorily to save time/money', opts: ['Do something perfunctorily to save time/money', 'Take a sharp turn while driving', 'Cut paper into square shapes', 'Work extra hours'] },
    { q: 'Select the synonym for "resilient":', ans: 'adaptable', opts: ['fragile', 'adaptable', 'stubborn', 'ignorant'] },
    { q: 'Complete: "The project was delayed _____ unexpected supply chain issues."', ans: 'due to', opts: ['because', 'due to', 'owing', 'despite'] },
    { q: 'Translate: "He insisted on paying for dinner."', ans: 'O, şam yeməyinin pulunu ödəməkdə təkid etdi.', opts: ['O, şam yeməyinin pulunu ödəməkdə təkid etdi.', 'O, şam yeməyi bişirdi.', 'O, hesabı ödəməkdən imtina etdi.', 'O, restorana getdi.'] },
  ],
  C1: [
    { q: 'Identify the correct idiom: "She decided to _____ and tell the truth."', ans: 'bite the bullet', opts: ['bite the bullet', 'hit the sack', 'spill the tea', 'burn the midnight oil'] },
    { q: 'Choose the correct word: "The manager\'s decision was purely _____ and lacked evidence."', ans: 'arbitrary', opts: ['arbitrary', 'meticulous', 'stringent', 'empirical'] },
    { q: 'Complete: "No sooner had we arrived _____ the thunderstorm started."', ans: 'than', opts: ['when', 'than', 'then', 'before'] },
    { q: 'What does "ubiquitous" mean?', ans: 'Present everywhere', opts: ['Rarely found', 'Present everywhere', 'Highly dangerous', 'Very expensive'] },
    { q: 'Select the appropriate formal transition: "_____, we must evaluate the environmental costs."', ans: 'Furthermore', opts: ['Furthermore', 'Anyway', 'Besides that', 'So then'] },
  ],
  C2: [
    { q: 'Choose the correct word: "His speech was full of subtle _____ that only experts noticed."', ans: 'nuances', opts: ['nuances', 'clichés', 'platitudes', 'jargon'] },
    { q: 'Identify the inverted structure: "Seldom _____ such an inspiring performance."', ans: 'have I witnessed', opts: ['I have witnessed', 'have I witnessed', 'I witnessed', 'witnessed I'] },
    { q: 'What is the meaning of "obfuscate"?', ans: 'To render obscure or unintelligible', opts: ['To clarify details', 'To render obscure or unintelligible', 'To celebrate publicly', 'To remove obstacles'] },
    { q: 'Complete: "His arguments were so _____ that nobody could refute them."', ans: 'cogent', opts: ['cogent', 'flimsy', 'ambiguous', 'obtuse'] },
    { q: 'Select the phrase for "an insurmountable obstacle":', ans: 'An insuperable hurdle', opts: ['An insuperable hurdle', 'A minor inconvenience', 'A temporary delay', 'A simple task'] },
  ],
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

  const [selectedLevel, setSelectedLevel] = useState<string>('B1');
  const [userProfileLevel, setUserProfileLevel] = useState<string>('B1');
  const [lessons, setLessons] = useState<any[]>([]);
  const [userLessons, setUserLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  // Modals
  const [selectedNodeModal, setSelectedNodeModal] = useState<any | null>(null);
  const [levelRoadmapModalVisible, setLevelRoadmapModalVisible] = useState(false);
  const [lockedLevelModal, setLockedLevelModal] = useState<string | null>(null);

  // PLACEMENT TEST QUIZ STATE
  const [placementQuizActive, setPlacementQuizActive] = useState(false);
  const [placementQuizLevel, setPlacementQuizLevel] = useState<string>('B2');
  const [placementQuestionIndex, setPlacementQuestionIndex] = useState(0);
  const [placementHearts, setPlacementHearts] = useState(3);
  const [placementScore, setPlacementScore] = useState(0);
  const [placementSelectedOption, setPlacementSelectedOption] = useState<string | null>(null);
  const [placementAnswerChecked, setPlacementAnswerChecked] = useState(false);
  const [placementResultState, setPlacementResultState] = useState<'success' | 'fail' | null>(null);

  // 24-Hour Cooldown Timestamps per level Code
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (profile?.level && LEVELS.includes(profile.level)) {
      setUserProfileLevel(profile.level);
      setSelectedLevel(profile.level);
    }
  }, [profile?.level]);

  useEffect(() => {
    if (!user?.id) return;

    setLoadingLessons(true);
    supabase
      .from('lessons')
      .select('*')
      .eq('level', selectedLevel)
      .order('created_at', { ascending: true })
      .then(({ data: lData, error: lErr }) => {
        if (lErr) console.error('Error fetching lessons:', lErr);
        
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
  }, [user?.id, selectedLevel]);

  useEffect(() => {
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

  const getLevelIndex = (code: string) => LEVELS.indexOf(code);
  const isLevelUnlocked = (code: string) => getLevelIndex(code) <= getLevelIndex(userProfileLevel);

  const getCooldownRemaining = (code: string) => {
    const end = cooldowns[code];
    if (!end) return null;
    const diff = end - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const handleSelectLevelFromRoadmap = (code: string) => {
    if (isLevelUnlocked(code)) {
      setSelectedLevel(code);
      setLevelRoadmapModalVisible(false);
    } else {
      setLevelRoadmapModalVisible(false);
      setLockedLevelModal(code);
    }
  };

  const handleOpenPlacementTestModal = (levelCode: string) => {
    const remaining = getCooldownRemaining(levelCode);
    if (remaining) {
      Alert.alert(
        '🔒 Cooldown Active',
        `You must wait ${remaining} before trying the Level ${levelCode} Placement Test again. Keep practicing your current level!`
      );
      return;
    }
    setLockedLevelModal(null);
    // Initialize test runner
    setPlacementQuizLevel(levelCode);
    setPlacementQuestionIndex(0);
    setPlacementHearts(3);
    setPlacementScore(0);
    setPlacementSelectedOption(null);
    setPlacementAnswerChecked(false);
    setPlacementResultState(null);
    setPlacementQuizActive(true);
  };

  const handleCheckPlacementAnswer = () => {
    const questions = PLACEMENT_TEST_QUESTIONS[placementQuizLevel] || PLACEMENT_TEST_QUESTIONS.B2;
    const currentQ = questions[placementQuestionIndex];

    setPlacementAnswerChecked(true);
    const isCorrect = placementSelectedOption === currentQ.ans;

    if (isCorrect) {
      setPlacementScore(prev => prev + 1);
    } else {
      const newHearts = placementHearts - 1;
      setPlacementHearts(newHearts);
      if (newHearts <= 0) {
        // Immediate Fail due to 0 hearts
        setTimeout(() => {
          triggerPlacementFail();
        }, 1200);
        return;
      }
    }
  };

  const handleNextPlacementQuestion = () => {
    const questions = PLACEMENT_TEST_QUESTIONS[placementQuizLevel] || PLACEMENT_TEST_QUESTIONS.B2;
    if (placementQuestionIndex + 1 < questions.length) {
      setPlacementQuestionIndex(prev => prev + 1);
      setPlacementSelectedOption(null);
      setPlacementAnswerChecked(false);
    } else {
      // Calculate final score
      const finalScore = placementScore + (placementSelectedOption === questions[placementQuestionIndex].ans ? 1 : 0);
      const scorePercent = (finalScore / questions.length) * 100;

      if (scorePercent >= 90 && placementHearts > 0) {
        // PASS! (>= 90%)
        triggerPlacementSuccess();
      } else {
        // FAIL (< 90%)
        triggerPlacementFail();
      }
    }
  };

  const triggerPlacementSuccess = () => {
    setPlacementResultState('success');
    if (user?.id) {
      supabase.from('profiles').update({ level: placementQuizLevel }).eq('id', user.id);
    }
    setUserProfileLevel(placementQuizLevel);
    setSelectedLevel(placementQuizLevel);
  };

  const triggerPlacementFail = () => {
    setPlacementResultState('fail');
    // Set 24-hour cooldown penalty
    const cooldownEndTime = Date.now() + 24 * 60 * 60 * 1000;
    setCooldowns(prev => ({ ...prev, [placementQuizLevel]: cooldownEndTime }));
  };

  const handleNodePress = (lesson: any, isLocked: boolean, index: number) => {
    if (isLocked) {
      return;
    }
    setSelectedNodeModal({
      lesson,
      unitNumber: index + 1,
      title: lesson.title || `Unit ${index + 1}: Core Skills`,
    });
  };

  const handleStartModule = (mode: 'grammar' | 'dialogue' | 'vocabulary' | 'exercise') => {
    if (!selectedNodeModal) return;
    const lessonId = selectedNodeModal.lesson?.id || selectedNodeModal.unitNumber || 1;
    setSelectedNodeModal(null);

    router.push({
      pathname: '/lesson-player',
      params: { lessonId: String(lessonId), mode }
    });
  };

  const displayLessons = lessons.length > 0 
    ? lessons 
    : (MOCK_LESSONS[selectedLevel as keyof typeof MOCK_LESSONS] || MOCK_LESSONS.A1);

  let activeIndex = 0;
  let completedCount = 0;
  if (userLessons.length > 0) {
    const completedSet = new Set(userLessons.map(ul => ul.lesson_id));
    completedCount = displayLessons.filter(l => completedSet.has(l.id)).length;
    activeIndex = displayLessons.findIndex(l => !completedSet.has(l.id));
    if (activeIndex === -1) {
      activeIndex = displayLessons.length;
    }
  }

  const progressPercent = displayLessons.length > 0 
    ? (completedCount / displayLessons.length) * 100 
    : 0;

  const activeMeta = LEVEL_META[selectedLevel] || LEVEL_META.B1;
  const currentPlacementQuestions = PLACEMENT_TEST_QUESTIONS[placementQuizLevel] || PLACEMENT_TEST_QUESTIONS.B2;
  const currentPlacementQ = currentPlacementQuestions[placementQuestionIndex];

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

        {/* Premium Level Selector Banner */}
        <TouchableOpacity
          style={styles.levelBanner}
          activeOpacity={0.85}
          onPress={() => setLevelRoadmapModalVisible(true)}
        >
          <View style={[styles.levelBadgeDot, { backgroundColor: activeMeta.color }]} />
          <View style={styles.levelBannerTextWrapper}>
            <Text style={styles.levelBannerTitle}>
              LEVEL {selectedLevel} • {activeMeta.name}
            </Text>
            <Text style={styles.levelBannerSubtitle}>{activeMeta.desc}</Text>
          </View>
          <View style={styles.levelBannerSwitchTextWrapper}>
            <Text style={styles.levelBannerSwitchText}>Roadmap</Text>
            <MaterialIcons name="unfold-more" size={20} color="#003594" />
          </View>
        </TouchableOpacity>

        {/* Progress Bar under Header */}
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={[activeMeta.color, '#003594']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Level Hero Banner Card */}
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
            <Text style={styles.heroTag}>PATHWAY • LEVEL {selectedLevel}</Text>
            <Text style={styles.heroTitle}>{activeMeta.name} Journey</Text>
            <Text style={styles.heroSubtitle}>
              Tap any unlocked unit to study Grammar, Dialogue, Vocabulary & Exercises.
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
                  <Stop offset="0%" stopColor={activeMeta.color} stopOpacity="1" />
                  <Stop offset="100%" stopColor="#003594" stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              <Path
                d="M 180 50 Q 280 150 180 250 T 180 450 T 180 650 T 180 850"
                fill="none"
                stroke="rgba(0, 53, 148, 0.1)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="8 8"
              />
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
            const isBonus = index === 4;

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
                    onPress={() => handleNodePress(lesson, isLocked, index)}
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
                      isActive && [styles.nodeActive, { backgroundColor: activeMeta.color }],
                      isLocked && styles.nodeLocked,
                    ]}
                    activeOpacity={isLocked ? 1.0 : 0.8}
                    onPress={() => handleNodePress(lesson, isLocked, index)}
                    disabled={isLocked}
                  >
                    {isCompleted && <MaterialIcons name="check" size={32} color="#ffffff" />}
                    {isActive && <MaterialIcons name="menu-book" size={38} color="#ffffff" />}
                    {isLocked && <MaterialIcons name="lock" size={28} color="#737685" />}
                  </TouchableOpacity>
                )}

                <View style={[
                  styles.nodeLabelCard, 
                  isActive && { borderColor: activeMeta.color, borderWidth: 1.5 },
                  isLocked && styles.nodeLabelCardSimple
                ]}>
                  <Text style={[
                    isCompleted && styles.nodeLabelTextCompleted,
                    isActive && { color: activeMeta.color, fontWeight: '700' },
                    isLocked && styles.nodeLabelTextLocked,
                  ]}>
                    {lesson.title || `Unit ${index + 1}`}
                  </Text>
                </View>

                {isActive && !isBonus && (
                  <View style={[styles.newTopicBadge, { backgroundColor: activeMeta.color }]}>
                    <Text style={styles.newTopicText}>OPEN UNIT</Text>
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
      </ScrollView>

      {/* Contextual FAB - Vocabulary/Phrase book */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => router.push('/practice-prompts')}>
        <MaterialIcons name="auto-stories" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* UNIT BREAKDOWN MODAL */}
      <Modal
        visible={selectedNodeModal !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedNodeModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderInfo}>
                <View style={[styles.sheetBadge, { backgroundColor: `${activeMeta.color}20` }]}>
                  <Text style={[styles.sheetBadgeText, { color: activeMeta.color }]}>LEVEL {selectedLevel}</Text>
                </View>
                <Text style={styles.sheetTitle}>{selectedNodeModal?.title}</Text>
                <Text style={styles.sheetSubtitle}>Select a learning section to begin</Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedNodeModal(null)}
                style={styles.sheetCloseButton}
              >
                <MaterialIcons name="close" size={22} color="#003594" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modulesGrid} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.moduleCard, { borderColor: '#0284c7' }]}
                activeOpacity={0.8}
                onPress={() => handleStartModule('grammar')}
              >
                <View style={[styles.moduleIconWrapper, { backgroundColor: '#e0f2fe' }]}>
                  <MaterialIcons name="menu-book" size={28} color="#0284c7" />
                </View>
                <View style={styles.moduleTextContainer}>
                  <Text style={styles.moduleTitle}>1. Grammar (Грамматика)</Text>
                  <Text style={styles.moduleDesc}>Master core sentence rules & structures</Text>
                </View>
                <View style={styles.moduleBadge}>
                  <Text style={styles.moduleBadgeText}>+5 XP</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.moduleCard, { borderColor: '#7c3aed' }]}
                activeOpacity={0.8}
                onPress={() => handleStartModule('dialogue')}
              >
                <View style={[styles.moduleIconWrapper, { backgroundColor: '#f3e8ff' }]}>
                  <MaterialIcons name="forum" size={28} color="#7c3aed" />
                </View>
                <View style={styles.moduleTextContainer}>
                  <Text style={styles.moduleTitle}>2. Dialogue (Диалог)</Text>
                  <Text style={styles.moduleDesc}>Listen & practice real conversational scripts</Text>
                </View>
                <View style={styles.moduleBadge}>
                  <Text style={styles.moduleBadgeText}>+5 XP</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.moduleCard, { borderColor: '#db2777' }]}
                activeOpacity={0.8}
                onPress={() => handleStartModule('vocabulary')}
              >
                <View style={[styles.moduleIconWrapper, { backgroundColor: '#fce7f3' }]}>
                  <MaterialIcons name="translate" size={28} color="#db2777" />
                </View>
                <View style={styles.moduleTextContainer}>
                  <Text style={styles.moduleTitle}>3. Vocabulary (Словарь)</Text>
                  <Text style={styles.moduleDesc}>Learn key words & phrases for this topic</Text>
                </View>
                <View style={styles.moduleBadge}>
                  <Text style={styles.moduleBadgeText}>+5 XP</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.moduleCard, { borderColor: '#ea580c' }]}
                activeOpacity={0.8}
                onPress={() => handleStartModule('exercise')}
              >
                <View style={[styles.moduleIconWrapper, { backgroundColor: '#ffedd5' }]}>
                  <MaterialIcons name="assignment-turned-in" size={28} color="#ea580c" />
                </View>
                <View style={styles.moduleTextContainer}>
                  <Text style={styles.moduleTitle}>4. Exercise (Упражнения)</Text>
                  <Text style={styles.moduleDesc}>Interactive quiz to test & solidify knowledge</Text>
                </View>
                <View style={[styles.moduleBadge, { backgroundColor: '#ffedd5' }]}>
                  <Text style={[styles.moduleBadgeText, { color: '#ea580c' }]}>+10 XP</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* LEVEL ROADMAP SELECTOR MODAL */}
      <Modal
        visible={levelRoadmapModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLevelRoadmapModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '88%' }]}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderInfo}>
                <Text style={styles.sheetTitle}>Level Roadmap (A1 - C2)</Text>
                <Text style={styles.sheetSubtitle}>
                  Your active proficiency level is <Text style={{ fontWeight: '800', color: activeMeta.color }}>Level {userProfileLevel}</Text>.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setLevelRoadmapModalVisible(false)}
                style={styles.sheetCloseButton}
              >
                <MaterialIcons name="close" size={22} color="#003594" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.roadmapList} showsVerticalScrollIndicator={false}>
              {LEVELS.map((code) => {
                const meta = LEVEL_META[code];
                const unlocked = isLevelUnlocked(code);
                const isCurrent = code === userProfileLevel;
                const isViewing = code === selectedLevel;
                const cooldownText = getCooldownRemaining(code);

                return (
                  <TouchableOpacity
                    key={code}
                    style={[
                      styles.roadmapCard,
                      isViewing && { borderColor: meta.color, borderWidth: 2 },
                      !unlocked && styles.roadmapCardLocked,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleSelectLevelFromRoadmap(code)}
                  >
                    <View style={[styles.roadmapBadge, { backgroundColor: `${meta.color}20` }]}>
                      <Text style={[styles.roadmapBadgeText, { color: meta.color }]}>{code}</Text>
                    </View>

                    <View style={styles.roadmapTextContainer}>
                      <View style={styles.roadmapTitleRow}>
                        <Text style={styles.roadmapTitle}>{meta.name}</Text>
                        {isCurrent && (
                          <View style={styles.currentTag}>
                            <Text style={styles.currentTagText}>ACTIVE</Text>
                          </View>
                        )}
                        {cooldownText && (
                          <View style={styles.cooldownTag}>
                            <Text style={styles.cooldownTagText}>🔒 {cooldownText}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.roadmapDesc}>{meta.desc}</Text>
                    </View>

                    <View style={styles.roadmapStatusWrapper}>
                      {unlocked ? (
                        <View style={styles.unlockedIconCircle}>
                          <MaterialIcons name="check-circle" size={24} color="#059669" />
                        </View>
                      ) : (
                        <View style={styles.lockedIconCircle}>
                          <MaterialIcons name="lock" size={20} color="#737685" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* LOCKED LEVEL MODAL (Clean & Professional) */}
      <Modal
        visible={lockedLevelModal !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setLockedLevelModal(null)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.placementCard}>
            <View style={styles.placementIconCircle}>
              <MaterialIcons name="lock-outline" size={32} color="#003594" />
            </View>
            <Text style={styles.placementTitle}>Level {lockedLevelModal}</Text>
            <Text style={styles.placementDesc}>
              Pass the assessment test to unlock {LEVEL_META[lockedLevelModal || 'B2']?.name}.
            </Text>

            <TouchableOpacity
              style={styles.placementBtnPrimary}
              activeOpacity={0.9}
              onPress={() => lockedLevelModal && handleOpenPlacementTestModal(lockedLevelModal)}
            >
              <Text style={styles.placementBtnPrimaryText}>Start Assessment Test</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.placementBtnSecondary}
              onPress={() => setLockedLevelModal(null)}
            >
              <Text style={styles.placementBtnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* INTERACTIVE PLACEMENT TEST QUIZ RUNNER MODAL */}
      <Modal
        visible={placementQuizActive}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setPlacementQuizActive(false)}
      >
        <SafeAreaView style={styles.testContainer}>
          {/* Header with Progress & Hearts */}
          <View style={styles.testHeader}>
            <TouchableOpacity onPress={() => setPlacementQuizActive(false)} style={styles.testCloseBtn}>
              <MaterialIcons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>

            <View style={styles.testProgressWrapper}>
              <View style={styles.testProgressBarBg}>
                <View style={[styles.testProgressBarFill, { width: `${((placementQuestionIndex + 1) / currentPlacementQuestions.length) * 100}%` }]} />
              </View>
              <Text style={styles.testProgressText}>{placementQuestionIndex + 1} of {currentPlacementQuestions.length}</Text>
            </View>

            {/* Hearts Display */}
            <View style={styles.heartsContainer}>
              {[1, 2, 3].map((hIndex) => (
                <Text key={hIndex} style={styles.heartIcon}>
                  {hIndex <= placementHearts ? '❤️' : '🖤'}
                </Text>
              ))}
            </View>
          </View>

          {/* Test Main Content */}
          {placementResultState === null ? (
            <View style={styles.testBody}>
              <View style={styles.testTagBox}>
                <Text style={styles.testTagText}>LEVEL {placementQuizLevel} ASSESSMENT</Text>
              </View>

              <Text style={styles.testQuestionText}>{currentPlacementQ?.q}</Text>

              {/* Options List */}
              <View style={styles.optionsList}>
                {currentPlacementQ?.opts.map((option, idx) => {
                  const isSelected = placementSelectedOption === option;
                  const isCorrect = option === currentPlacementQ.ans;
                  
                  let optionStyle: any = styles.optionCard;
                  if (placementAnswerChecked) {
                    if (isCorrect) {
                      optionStyle = [styles.optionCard, styles.optionCorrect];
                    } else if (isSelected && !isCorrect) {
                      optionStyle = [styles.optionCard, styles.optionWrong];
                    }
                  } else if (isSelected) {
                    optionStyle = [styles.optionCard, styles.optionSelected];
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={optionStyle}
                      disabled={placementAnswerChecked}
                      activeOpacity={0.8}
                      onPress={() => setPlacementSelectedOption(option)}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                      {placementAnswerChecked && isCorrect && (
                        <MaterialIcons name="check-circle" size={22} color="#059669" />
                      )}
                      {placementAnswerChecked && isSelected && !isCorrect && (
                        <MaterialIcons name="cancel" size={22} color="#dc2626" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : placementResultState === 'success' ? (
            /* SUCCESS RESULT */
            <View style={styles.resultContainer}>
              <View style={styles.resultIconWrapper}>
                <MaterialIcons name="emoji-events" size={48} color="#059669" />
              </View>
              <Text style={styles.resultTitle}>Level Unlocked!</Text>
              <Text style={styles.resultSubtitle}>
                You passed the Level {placementQuizLevel} Assessment.
              </Text>
              <Text style={styles.resultDesc}>Level {placementQuizLevel} is now available on your profile.</Text>

              <TouchableOpacity
                style={styles.resultActionBtn}
                onPress={() => setPlacementQuizActive(false)}
              >
                <Text style={styles.resultActionBtnText}>Start Level {placementQuizLevel}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* FAIL RESULT */
            <View style={styles.resultContainer}>
              <View style={[styles.resultIconWrapper, { backgroundColor: '#fef2f2' }]}>
                <MaterialIcons name="lock" size={48} color="#dc2626" />
              </View>
              <Text style={[styles.resultTitle, { color: '#0f172a' }]}>Test Complete</Text>
              <Text style={styles.resultSubtitle}>
                Score did not meet the requirement to unlock Level {placementQuizLevel}.
              </Text>

              <View style={styles.cooldownNoticeBox}>
                <MaterialIcons name="schedule" size={20} color="#ea580c" />
                <Text style={styles.cooldownNoticeText}>
                  Next attempt available in 24 hours.
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.resultActionBtn, { backgroundColor: '#003594' }]}
                onPress={() => setPlacementQuizActive(false)}
              >
                <Text style={styles.resultActionBtnText}>Continue Level {userProfileLevel}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Test Footer Check/Next Button */}
          {placementResultState === null && (
            <View style={styles.testFooter}>
              {!placementAnswerChecked ? (
                <TouchableOpacity
                  style={[styles.testCheckBtn, !placementSelectedOption && styles.testCheckBtnDisabled]}
                  disabled={!placementSelectedOption}
                  onPress={handleCheckPlacementAnswer}
                >
                  <Text style={styles.testCheckBtnText}>Check Answer</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.testCheckBtn}
                  onPress={handleNextPlacementQuestion}
                >
                  <Text style={styles.testCheckBtnText}>
                    {placementQuestionIndex + 1 === currentPlacementQuestions.length ? 'Finish Test' : 'Next Question'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </SafeAreaView>
      </Modal>
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
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(235, 238, 252, 0.8)',
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
    height: 52,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 13,
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
  levelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 53, 148, 0.12)',
  },
  levelBadgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  levelBannerTextWrapper: {
    flex: 1,
  },
  levelBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  levelBannerSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  levelBannerSwitchTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
    borderWidth: 1,
    borderColor: '#d0d7ee',
  },
  levelBannerSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#003594',
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: '#e1e2ea',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  scrollContent: {
    paddingTop: 122,
    paddingBottom: 120,
  },
  heroCard: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
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
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTag: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    lineHeight: 18,
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
    width: 88,
    height: 88,
    borderRadius: 44,
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  activeOuterPulse: {
    position: 'absolute',
    width: 102,
    height: 102,
    borderRadius: 51,
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
  nodeLabelTextCompleted: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003594',
  },
  nodeLabelTextLocked: {
    fontSize: 12,
    fontWeight: '700',
    color: '#737685',
    textAlign: 'center',
  },
  newTopicBadge: {
    position: 'absolute',
    top: 5,
    right: -25,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
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

  /* MODAL / SHEET STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 30, 80, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '82%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3fa',
  },
  sheetHeaderInfo: {
    flex: 1,
    marginRight: 12,
  },
  sheetBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  sheetBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  sheetCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modulesGrid: {
    gap: 12,
    paddingBottom: 12,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  moduleIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  moduleTextContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  moduleDesc: {
    fontSize: 12,
    color: '#64748b',
  },
  moduleBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 8,
  },
  moduleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284c7',
  },

  /* ROADMAP MODAL STYLES */
  roadmapList: {
    gap: 12,
    paddingBottom: 16,
  },
  roadmapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  roadmapCardLocked: {
    opacity: 0.7,
    backgroundColor: '#f1f5f9',
  },
  roadmapBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  roadmapBadgeText: {
    fontSize: 15,
    fontWeight: '800',
  },
  roadmapTextContainer: {
    flex: 1,
  },
  roadmapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roadmapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  roadmapDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  currentTag: {
    backgroundColor: '#003594',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  cooldownTag: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cooldownTagText: {
    color: '#ea580c',
    fontSize: 9,
    fontWeight: '800',
  },
  roadmapStatusWrapper: {
    marginLeft: 8,
  },
  unlockedIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* CENTER PLACEMENT MODAL */
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 20, 60, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  placementCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  placementIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placementTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  placementDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  placementRulesBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 16,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleEmoji: {
    fontSize: 16,
  },
  ruleText: {
    fontSize: 13,
    color: '#334155',
  },
  placementBtnPrimary: {
    width: '100%',
    height: 52,
    backgroundColor: '#003594',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  placementBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  placementBtnSecondary: {
    paddingVertical: 10,
  },
  placementBtnSecondaryText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },

  /* TEST RUNNER MODAL STYLES */
  testContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  testCloseBtn: {
    padding: 4,
  },
  testProgressWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  testProgressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  testProgressBarFill: {
    height: '100%',
    backgroundColor: '#003594',
    borderRadius: 4,
  },
  testProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 4,
  },
  heartsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  heartIcon: {
    fontSize: 18,
  },
  testBody: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  testTagBox: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  testTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: 0.5,
  },
  testQuestionText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 30,
    marginBottom: 28,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  optionSelected: {
    borderColor: '#003594',
    backgroundColor: '#f0f4ff',
  },
  optionCorrect: {
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
  },
  optionWrong: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  testFooter: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  testCheckBtn: {
    height: 56,
    backgroundColor: '#003594',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  testCheckBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  testCheckBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  resultIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  resultDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  resultActionBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#059669',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  resultActionBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  cooldownNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 10,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  cooldownNoticeText: {
    fontSize: 13,
    color: '#9a3412',
    flex: 1,
    lineHeight: 18,
  },
});
