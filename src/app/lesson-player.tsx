import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { updateLessonProgress, awardXP, awardXPFallback } from '@/services/lessons';

const MOCK_LESSONS: Record<
  string,
  Array<{
    id: string;
    title: string;
    lesson_type?: 'quiz' | 'reading' | 'speaking';
    passage_text?: string;
    prompt_text?: string;
    question: string;
    correct_answer: string;
    options: string[];
    xp_reward: number;
    video_clip_url?: string;
  }>
> = {
  A1: [
    { id: 'mock-a1-1', title: 'Introduction', lesson_type: 'quiz', question: 'Translate: "Hello, how are you?"', correct_answer: 'Salam, necəsən?', options: ['Salam, necəsən?', 'Sağ olun.', 'Mənim adım Əlidir.', 'Sabahınız xeyir.'], xp_reward: 10 },
    { id: 'mock-a1-2', title: 'Daily Greetings', lesson_type: 'quiz', question: 'Translate: "Good morning!"', correct_answer: 'Sabahınız xeyir!', options: ['Sabahınız xeyir!', 'Axşamınız xeyir!', 'Gecəniz xeyirə qalsın!', 'Hələlik!'], xp_reward: 10 },
    { id: 'mock-a1-3', title: 'Reading Time', lesson_type: 'reading', passage_text: 'The weather is very warm today. Mark is going to the park. He wants to read a book under a big tree. Later, he will meet his friend Sarah.', question: 'Where is Mark going today?', correct_answer: 'To the park', options: ['To the park', 'To school', 'To a restaurant', 'To the hospital'], xp_reward: 15 },
    { id: 'mock-a1-4', title: 'Speaking Practice', lesson_type: 'speaking', prompt_text: 'Please say: "Nice to meet you!"', question: 'Pronounce the phrase', correct_answer: 'Nice to meet you!', options: ['Nice to meet you!', 'Hello!', 'Goodbye', 'Thank you'], xp_reward: 15, video_clip_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 'mock-a1-5', title: 'Colors', lesson_type: 'quiz', question: 'What color is "Red"?', correct_answer: 'Qırmızı', options: ['Mavi', 'Yaşıl', 'Qırmızı', 'Sarı'], xp_reward: 15 },
  ],
  B1: [
    { id: 'mock-b1-1', title: 'Introduction', lesson_type: 'quiz', question: 'Complete the sentence: "If I _____ you, I would take that offer."', correct_answer: 'were', options: ['am', 'was', 'were', 'would be'], xp_reward: 15 },
    { id: 'mock-b1-2', title: 'Reading Comprehension', lesson_type: 'reading', passage_text: 'Laptops are essential tools for modern employees. They allow people to work remotely from coffee shops or while traveling. However, working out of the office requires high self-discipline and reliable internet connections.', question: 'What does remote work require?', correct_answer: 'Self-discipline and good internet', options: ['Self-discipline and good internet', 'A powerful CPU', 'Free coffee', 'A large desktop screen'], xp_reward: 15 },
    { id: 'mock-b1-3', title: 'Speaking Coffee Order', lesson_type: 'speaking', prompt_text: 'Say this out loud: "I would like to order a coffee, please."', question: 'Order a coffee', correct_answer: 'I would like to order a coffee, please.', options: ['I would like to order a coffee, please.', 'Give me some tea.', 'Where is the menu?', 'No coffee for me.'], xp_reward: 15, video_clip_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 'mock-b1-4', title: 'Numbers 1-20', lesson_type: 'quiz', question: 'How do you say "fifteen"?', correct_answer: 'On beş', options: ['On dörd', 'On beş', 'On altı', 'On yeddi'], xp_reward: 15 },
    { id: 'mock-b1-5', title: 'Bonus: Culture', lesson_type: 'quiz', question: 'Which city is famous for Big Ben?', correct_answer: 'London', options: ['New York', 'London', 'Paris', 'Baku'], xp_reward: 20 },
  ],
  C1: [
    { id: 'mock-c1-1', title: 'Introduction', lesson_type: 'quiz', question: 'Choose the synonym of "meticulous":', correct_answer: 'thorough', options: ['careless', 'thorough', 'fast', 'sluggish'], xp_reward: 20 },
    { id: 'mock-c1-2', title: 'Reading Challenge', lesson_type: 'reading', passage_text: 'The transition to renewable energy sources, such as wind and solar power, has accelerated over the past decade. Nevertheless, fossil fuels still dominate the energy mix in major industrial sectors. Overcoming battery storage constraints remains a significant hurdle.', question: 'What is a major hurdle for decarbonization?', correct_answer: 'Battery storage constraints', options: ['Battery storage constraints', 'Cost of solar panels', 'Lack of wind turbines', 'Public opinion'], xp_reward: 20 },
    { id: 'mock-c1-3', title: 'Speaking Idiom', lesson_type: 'speaking', prompt_text: 'Express this idiom: "He decided to play it by ear."', question: 'Say the idiom', correct_answer: 'He decided to play it by ear.', options: ['He decided to play it by ear.', 'Let us check the map.', 'I want some food.', 'Listen to music.'], xp_reward: 20, video_clip_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 'mock-c1-4', title: 'Formal Writing', lesson_type: 'quiz', question: 'Translate: "Bu layihənin uğuru komanda işindən asılıdır."', correct_answer: 'The success of this project depends on teamwork.', options: ['The success of this project depends on teamwork.', 'Project success is teamwork.', 'We must work in team.', 'Teamwork is good.'], xp_reward: 20 },
    { id: 'mock-c1-5', title: 'Bonus: Culture', lesson_type: 'quiz', question: 'What is the capital of Australia?', correct_answer: 'Canberra', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], xp_reward: 25 },
  ]
};

export default function LessonPlayerScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(5);
  const [speakingState, setSpeakingState] = useState<'idle' | 'recording' | 'analyzing' | 'success'>('idle');

  useEffect(() => {
    if (!lessonId) {
      setLoading(false);
      return;
    }

    if (lessonId.startsWith('mock-')) {
      let found = null;
      for (const level of Object.keys(MOCK_LESSONS)) {
        found = MOCK_LESSONS[level].find(l => l.id === lessonId);
        if (found) break;
      }
      setLesson(found || MOCK_LESSONS.B1[2]);
      setLoading(false);
    } else {
      setLoading(true);
      supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching lesson:', error);
            setLesson(MOCK_LESSONS.B1[2]); // Fallback
          } else if (data) {
            setLesson(data);
          } else {
            setLesson(MOCK_LESSONS.B1[2]); // Fallback
          }
          setLoading(false);
        });
    }
  }, [lessonId]);

  useEffect(() => {
    setSpeakingState('idle');
    setSelectedAnswer(null);
    setHasChecked(false);
    setIsCorrect(false);
  }, [lesson]);

  const handleMicPress = () => {
    if (speakingState !== 'idle' || !lesson) return;

    setSpeakingState('recording');

    // After 2.5s, switch to analyzing
    setTimeout(() => {
      setSpeakingState('analyzing');

      // After 1.5s, finish analyzing, auto-select correct option and check
      setTimeout(() => {
        setSpeakingState('success');
        setIsCorrect(true);
        setHasChecked(true);
        // Find correct answer index
        const correctIdx = lesson.options.indexOf(lesson.correct_answer);
        setSelectedAnswer(correctIdx >= 0 ? correctIdx : 0);
      }, 1500);
    }, 2500);
  };

  const handleCheck = () => {
    if (selectedAnswer === null || !lesson) return;

    const chosen = lesson.options[selectedAnswer];
    const correct = chosen === lesson.correct_answer;
    
    setIsCorrect(correct);
    setHasChecked(true);

    if (!correct) {
      setLives(prev => Math.max(prev - 1, 0));
    }
  };

  const handleContinue = async () => {
    if (!lesson) return;

    if (!isCorrect && lives === 0) {
      // Out of lives flow
      const xpBalance = profile?.xp_balance ?? 0;
      if (xpBalance >= 200) {
        Alert.alert(
          'No Hearts Left!',
          'Refill your hearts for 200 XP to keep playing?',
          [
            {
              text: 'Exit Lesson',
              style: 'cancel',
              onPress: () => router.replace('/(tabs)/learn'),
            },
            {
              text: 'Refill (200 XP)',
              onPress: async () => {
                if (user?.id) {
                  await awardXPFallback(user.id, -200);
                  setLives(5);
                  setSelectedAnswer(null);
                  setHasChecked(false);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'No Hearts Left!',
          'Get more XP by studying later!',
          [{ text: 'Exit', onPress: () => router.replace('/(tabs)/learn') }]
        );
      }
      return;
    }

    // Complete lesson logic
    if (user?.id) {
      const xpReward = lesson.xp_reward ?? 15;
      
      // Update DB progress (only if real lesson)
      if (!lesson.id.startsWith('mock-')) {
        await updateLessonProgress(user.id, lesson.id, isCorrect);
      }

      // Award XP
      try {
        await awardXP(user.id, xpReward);
      } catch (err) {
        await awardXPFallback(user.id, xpReward);
      }
    }

    // Navigate to complete screen
    const accuracy = Math.round((lives / 5) * 100);
    const xpReward = lesson.xp_reward ?? 15;
    router.replace({
      pathname: '/lesson-complete',
      params: {
        xpEarned: xpReward,
        accuracy,
        streak: profile?.current_streak ?? 0,
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#004ac6" />
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Lesson not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const progressPercent = hasChecked ? '100%' : '50%';

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header & Progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#737685" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: progressPercent }]} />
          </View>
        </View>

        <View style={styles.healthContainer}>
          <Text style={styles.healthText}>{lives}</Text>
          <MaterialIcons name="favorite" size={20} color="#ba1a1a" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Reading Passage if type is reading */}
        {lesson.lesson_type === 'reading' && lesson.passage_text && (
          <View style={styles.passageContainer}>
            <ScrollView style={styles.passageScroll} nestedScrollEnabled>
              <Text style={styles.passageText}>{lesson.passage_text}</Text>
            </ScrollView>
          </View>
        )}

        {/* Question Area */}
        <Text style={styles.questionTitle}>
          {lesson.lesson_type === 'reading' ? 'Read the passage and answer' :
           lesson.lesson_type === 'speaking' ? 'Speaking Practice' :
           'Translate this sentence'}
        </Text>
        
        <View style={styles.chatSection}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida/AP1WRLv37KfiLe1QoipvZkTiV2ggv8s-3GlLsr3k8EiEC27QuLUkDK8P1zJk2RY2avHJcQL_KUuRxbNELQLknzRixSFVYD1ZTjZakQGVle4UBeAf4PhUuHLVqzZgXMq-Bs2FYEhqLvUdBUT8Tu--nNh2geyLA_DdTdkgBTjBaAfVLELP7RMVBnzLDao8fiblgG99TMTsoyKmsrcnVkR2pZIBEs58d6-dWwvPUCCTuXwfMzpKLkl7lJXJrYeoJQ' }}
            style={styles.avatar}
          />
          <View style={styles.bubbleContainer}>
            <View style={styles.bubbleTail} />
            <Text style={styles.bubbleText}>{lesson.question}</Text>
          </View>
        </View>

        {/* Dynamic Options or Speaking Interface */}
        {lesson.lesson_type === 'speaking' ? (
          <View style={styles.speakingContainer}>
            <Text style={styles.speakingPromptLabel}>PROMPT</Text>
            <View style={styles.promptCard}>
              <MaterialIcons name="volume-up" size={24} color="#004ac6" style={styles.volumeIcon} />
              <Text style={styles.speakingPromptText}>{lesson.prompt_text || lesson.question}</Text>
            </View>

            <View style={styles.microphoneWrapper}>
              <TouchableOpacity 
                style={[
                  styles.micButton, 
                  speakingState === 'recording' && styles.micButtonRecording,
                  speakingState === 'analyzing' && styles.micButtonAnalyzing,
                  speakingState === 'success' && styles.micButtonSuccess,
                ]}
                onPress={handleMicPress}
                disabled={hasChecked || speakingState === 'analyzing'}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name={
                    speakingState === 'idle' ? 'mic' :
                    speakingState === 'recording' ? 'radio-button-checked' :
                    speakingState === 'analyzing' ? 'hourglass-empty' : 'check'
                  } 
                  size={40} 
                  color="#ffffff" 
                />
              </TouchableOpacity>
              <Text style={styles.micStatusText}>
                {speakingState === 'idle' && 'Tap mic to start speaking'}
                {speakingState === 'recording' && 'Listening... (Speak now)'}
                {speakingState === 'analyzing' && 'Analyzing pronunciation...'}
                {speakingState === 'success' && 'Perfect! Audio recorded.'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.optionsContainer}>
            {lesson.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index;
              return (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.optionCard, 
                    isSelected && styles.optionCardSelected,
                    hasChecked && option === lesson.correct_answer && styles.optionCardCorrect,
                    hasChecked && isSelected && option !== lesson.correct_answer && styles.optionCardWrong,
                  ]}
                  onPress={() => !hasChecked && setSelectedAnswer(index)}
                  disabled={hasChecked}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <Text style={[
                      styles.optionText, 
                      isSelected && styles.optionTextSelected,
                      hasChecked && option === lesson.correct_answer && styles.optionTextCorrect,
                      hasChecked && isSelected && option !== lesson.correct_answer && styles.optionTextWrong,
                    ]}>
                      {option}
                    </Text>
                    {isSelected && !hasChecked && (
                      <MaterialIcons name="check-circle" size={24} color="#004ac6" />
                    )}
                    {hasChecked && option === lesson.correct_answer && (
                      <MaterialIcons name="check-circle" size={24} color="#2e7d32" />
                    )}
                    {hasChecked && isSelected && option !== lesson.correct_answer && (
                      <MaterialIcons name="cancel" size={24} color="#c62828" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Slide-Up Bottom Banner or Static Footer */}
      {hasChecked ? (
        <View style={[
          styles.bannerContainer,
          isCorrect ? styles.bannerCorrect : styles.bannerWrong
        ]}>
          <View style={styles.bannerHeader}>
            <MaterialIcons 
              name={isCorrect ? 'check-circle' : 'error'} 
              size={32} 
              color={isCorrect ? '#2e7d32' : '#c62828'} 
            />
            <Text style={[
              styles.bannerTitle,
              { color: isCorrect ? '#2e7d32' : '#c62828' }
            ]}>
              {isCorrect ? 'Awesome! You are correct.' : 'Correct answer:'}
            </Text>
          </View>
          {!isCorrect && (
            <Text style={styles.bannerCorrectionText}>
              {lesson.correct_answer}
            </Text>
          )}
          <TouchableOpacity 
            style={[
              styles.bannerButton,
              { backgroundColor: isCorrect ? '#2e7d32' : '#c62828' }
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.bannerButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Hide footer check button if speaking since mic press handles checking automatically */
        lesson.lesson_type !== 'speaking' && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.checkButton,
                selectedAnswer === null && styles.checkButtonDisabled
              ]}
              onPress={handleCheck}
              disabled={selectedAnswer === null}
              activeOpacity={0.9}
            >
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          </View>
        )
      )}
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
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressBarBg: {
    height: 16,
    backgroundColor: '#e7e7f2',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#004ac6',
    borderRadius: 8,
    shadowColor: '#1b55d0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004ac6',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004ac6',
    marginBottom: 32,
  },
  chatSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  bubbleContainer: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    left: -10,
    top: '50%',
    marginTop: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 14,
    borderRightColor: '#ffffff',
  },
  bubbleText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#151c27',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: '#004ac6',
    backgroundColor: '#f3f3fd',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#434654',
  },
  optionTextSelected: {
    color: '#151c27',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 249, 255, 0.9)',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 198, 214, 0.4)',
  },
  checkButton: {
    backgroundColor: '#004ac6',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  checkButtonDisabled: {
    backgroundColor: '#c3c6d6',
    shadowOpacity: 0,
    elevation: 0,
  },
  checkButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ba1a1a',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#004ac6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionCardCorrect: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
  optionCardWrong: {
    borderColor: '#c62828',
    backgroundColor: '#ffebee',
  },
  optionTextCorrect: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  optionTextWrong: {
    color: '#c62828',
    fontWeight: '600',
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 38 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  bannerCorrect: {
    backgroundColor: '#e8f5e9',
    borderColor: 'rgba(46, 125, 50, 0.2)',
  },
  bannerWrong: {
    backgroundColor: '#ffebee',
    borderColor: 'rgba(198, 40, 40, 0.2)',
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  bannerCorrectionText: {
    fontSize: 16,
    color: '#c62828',
    fontWeight: '500',
    marginBottom: 16,
    paddingLeft: 44,
  },
  bannerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 8,
  },
  bannerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  passageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    marginBottom: 24,
    maxHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  passageScroll: {
    flexGrow: 0,
  },
  passageText: {
    fontSize: 16,
    color: '#434654',
    lineHeight: 24,
  },
  speakingContainer: {
    gap: 16,
  },
  speakingPromptLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004ac6',
    letterSpacing: 1,
    marginBottom: 4,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  volumeIcon: {
    backgroundColor: '#e7eefe',
    padding: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  speakingPromptText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#151c27',
  },
  microphoneWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
  },
  micButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#004ac6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  micButtonRecording: {
    backgroundColor: '#ba1a1a',
    shadowColor: '#ba1a1a',
  },
  micButtonAnalyzing: {
    backgroundColor: '#fea619',
    shadowColor: '#fea619',
  },
  micButtonSuccess: {
    backgroundColor: '#2e7d32',
    shadowColor: '#2e7d32',
  },
  micStatusText: {
    fontSize: 14,
    color: '#737685',
    fontWeight: '500',
  },
});
