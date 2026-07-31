import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView, Image, Alert, ActivityIndicator, StatusBar, Modal } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { getStructuredLessonData, StructuredLesson, LessonSection, awardXP, awardXPFallback, updateLessonProgress } from '@/services/lessons';

export default function LessonPlayerScreen() {
  const router = useRouter();
  const { lessonId, mode } = useLocalSearchParams<{ lessonId?: string; mode?: string }>();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? null);

  const [lessonData, setLessonData] = useState<StructuredLesson | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
  const [stage, setStage] = useState<'learning' | 'exercising'>('learning'); // 'learning' = flashcards/video/grammar, 'exercising' = quiz questions

  // Transition Modal between Sections
  const [transitionModal, setTransitionModal] = useState<{
    completedSection: LessonSection;
    nextSection: LessonSection;
  } | null>(null);

  // Question State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [hearts, setHearts] = useState(5);

  useEffect(() => {
    const rawId = lessonId ? String(lessonId).replace(/\D/g, '') : '1';
    const numericId = parseInt(rawId, 10) || 1;

    const loadedData = getStructuredLessonData(numericId);
    setLessonData(loadedData);

    if (loadedData && loadedData.sections.length > 0) {
      setCurrentSectionIndex(0);
      setCurrentExerciseIndex(0);
      setCurrentVocabIndex(0);
      setTransitionModal(null);
      
      if (mode) {
        const matchingSecIdx = loadedData.sections.findIndex(s => s.source_type.toLowerCase() === mode.toLowerCase());
        if (matchingSecIdx !== -1) {
          setCurrentSectionIndex(matchingSecIdx);
        }
      }

      const firstSec = loadedData.sections[0];
      if (firstSec.source_type === 'exercise' || (firstSec.vocabulary.length === 0 && firstSec.grammar.length === 0 && firstSec.source_type !== 'dialogue')) {
        setStage('exercising');
      } else {
        setStage('learning');
      }
    }
  }, [lessonId, mode]);

  if (!lessonData || lessonData.sections.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003594" />
        <Text style={styles.loadingText}>Preparing lesson materials...</Text>
      </SafeAreaView>
    );
  }

  const currentSection: LessonSection = lessonData.sections[currentSectionIndex] || lessonData.sections[0];
  const currentExercise = currentSection.exercises[currentExerciseIndex];

  // Compute overall progress bar percent
  const totalSections = lessonData.sections.length;
  const progressPercent = Math.min(100, Math.round(((currentSectionIndex + 1) / totalSections) * 100));

  const handleStartExercisesForSection = () => {
    if (currentSection.exercises && currentSection.exercises.length > 0) {
      setCurrentExerciseIndex(0);
      setSelectedOption(null);
      setHasChecked(false);
      setStage('exercising');
    } else {
      handleNextSection();
    }
  };

  const handleCheckAnswer = () => {
    if (!currentExercise || !selectedOption) return;

    const correctAns = String(currentExercise.Answer || '').trim().toLowerCase();
    const chosenAns = String(selectedOption || '').trim().toLowerCase();
    const correct = chosenAns === correctAns;

    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      setTotalXpEarned(prev => prev + (currentExercise.Xp || 5));
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHasChecked(false);

    if (currentExerciseIndex + 1 < currentSection.exercises.length) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // Finished exercises for this section -> show transition modal or finish
      handleNextSection();
    }
  };

  const handleNextSection = () => {
    setSelectedOption(null);
    setHasChecked(false);
    setCurrentExerciseIndex(0);
    setCurrentVocabIndex(0);

    if (currentSectionIndex + 1 < lessonData.sections.length) {
      const nextIndex = currentSectionIndex + 1;
      const completedSec = lessonData.sections[currentSectionIndex];
      const nextSec = lessonData.sections[nextIndex];

      // Show Section Completed Transition Modal!
      setTransitionModal({
        completedSection: completedSec,
        nextSection: nextSec,
      });
    } else {
      // Completed all sections in lesson!
      finishLesson();
    }
  };

  const handleProceedToNextSection = () => {
    if (!transitionModal) return;
    const nextIndex = currentSectionIndex + 1;
    setTransitionModal(null);
    setCurrentSectionIndex(nextIndex);

    const nextSec = lessonData.sections[nextIndex];
    if (nextSec.source_type === 'exercise' || (nextSec.vocabulary.length === 0 && nextSec.grammar.length === 0 && nextSec.source_type !== 'dialogue')) {
      setStage('exercising');
    } else {
      setStage('learning');
    }
  };

  const finishLesson = async () => {
    const finalXp = totalXpEarned > 0 ? totalXpEarned : 50;
    if (user?.id) {
      try {
        await awardXP(user.id, finalXp);
      } catch (e) {
        await awardXPFallback(user.id, finalXp);
      }
      await updateLessonProgress(user.id, String(lessonData.lesson_id), true);
    }

    router.replace({
      pathname: '/lesson-complete',
      params: { xpEarned: finalXp, streak: (profile?.current_streak ?? 0) + 1, accuracy: 100 }
    });
  };

  const handleSafeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/learn');
    }
  };

  // Options list for current exercise
  const optionsList = currentExercise ? [
    currentExercise.Option1 || currentExercise.Answer,
    currentExercise.Option2,
    currentExercise.Option3,
    currentExercise.Answer
  ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i) : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleSafeBack}>
          <MaterialIcons name="close" size={24} color="#0f172a" />
        </TouchableOpacity>

        {/* Lesson Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressSubtext}>Section {currentSectionIndex + 1} of {totalSections}</Text>
        </View>

        {/* Hearts */}
        <View style={styles.heartsContainer}>
          <Text style={styles.heartText}>❤️ {hearts}</Text>
        </View>
      </View>

      {/* SECTION HEADER CARD */}
      <View style={styles.sectionHeaderCard}>
        <View style={styles.sectionTagRow}>
          <Text style={styles.sectionTag}>LESSON {lessonData.lesson_id} • SECTION {currentSection.order} OF {totalSections}</Text>
          <View style={styles.stageTag}>
            <Text style={styles.stageTagText}>
              {stage === 'learning' ? '📖 LEARN PHASE' : '✍️ PRACTICE PHASE'}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>{currentSection.title_en} ({currentSection.title_az})</Text>
      </View>

      {/* CONTENT AREA BASED ON STAGE */}
      <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
        
        {/* STAGE 1: LEARNING CONTENT (Dialogue Video, Vocabulary Flashcards, or Grammar Rules) */}
        {stage === 'learning' && (
          <View style={styles.learningStageWrapper}>
            
            {/* 1. DIALOGUE VIEW */}
            {currentSection.source_type === 'dialogue' && (
              <View style={styles.dialogueCard}>
                <View style={styles.videoPlaceholder}>
                  <MaterialIcons name="play-circle-fill" size={64} color="#ffffff" />
                  <Text style={styles.videoTitle}>Lesson Video: {currentSection.title_en}</Text>
                  <Text style={styles.videoSubtitle}>Watch short dialogue scene to prepare for exercises</Text>
                </View>

                <View style={styles.dialogueNotice}>
                  <MaterialIcons name="info-outline" size={20} color="#003594" />
                  <Text style={styles.dialogueNoticeText}>
                    After watching the dialogue, answer 2 quick comprehension questions.
                  </Text>
                </View>

                <TouchableOpacity style={styles.primaryActionButton} onPress={handleStartExercisesForSection}>
                  <Text style={styles.primaryActionButtonText}>Start Questions ({currentSection.exercises.length})</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}

            {/* 2. VOCABULARY FLASHCARDS VIEW */}
            {currentSection.source_type === 'vocabulary' && currentSection.vocabulary.length > 0 && (
              <View style={styles.vocabStage}>
                <Text style={styles.vocabInstruction}>Learn vocabulary words ({currentVocabIndex + 1} of {currentSection.vocabulary.length}):</Text>

                <View style={styles.flashcard}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{currentSection.vocabulary[currentVocabIndex].Category}</Text>
                  </View>

                  <Text style={styles.flashcardEn}>{currentSection.vocabulary[currentVocabIndex].Word_en}</Text>
                  <Text style={styles.flashcardAz}>🇦🇿 {currentSection.vocabulary[currentVocabIndex].Word_az}</Text>
                </View>

                <View style={styles.vocabNavRow}>
                  <TouchableOpacity
                    style={[styles.vocabNavBtn, currentVocabIndex === 0 && styles.disabledBtn]}
                    disabled={currentVocabIndex === 0}
                    onPress={() => setCurrentVocabIndex(prev => prev - 1)}
                  >
                    <MaterialIcons name="arrow-back" size={20} color="#003594" />
                    <Text style={styles.vocabNavBtnText}>Previous</Text>
                  </TouchableOpacity>

                  {currentVocabIndex + 1 < currentSection.vocabulary.length ? (
                    <TouchableOpacity
                      style={styles.vocabNavBtn}
                      onPress={() => setCurrentVocabIndex(prev => prev + 1)}
                    >
                      <Text style={styles.vocabNavBtnText}>Next Word</Text>
                      <MaterialIcons name="arrow-forward" size={20} color="#003594" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.startExerciseBtn}
                      onPress={handleStartExercisesForSection}
                    >
                      <Text style={styles.startExerciseBtnText}>Practice Words ({currentSection.exercises.length} Questions)</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* 3. GRAMMAR RULES VIEW */}
            {currentSection.source_type === 'grammar' && currentSection.grammar.length > 0 && (
              <View style={styles.grammarStage}>
                <Text style={styles.grammarInstruction}>Grammar Rule Explanations:</Text>

                {currentSection.grammar.map((gItem, idx) => (
                  <View key={gItem.Grammar_id || idx} style={styles.grammarCard}>
                    <View style={styles.grammarTopicRow}>
                      <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#003594" />
                      <Text style={styles.grammarTopicTitle}>{gItem.Topic_en} ({gItem.Topic_az})</Text>
                    </View>
                    <Text style={styles.grammarExplanation}>{gItem.Explanation_en}</Text>
                    <Text style={styles.grammarExplanationAz}>🇦🇿 {gItem.Explanation_az}</Text>

                    <View style={styles.exampleBox}>
                      <Text style={styles.exampleEn}>💡 "{gItem.Example_en}"</Text>
                      <Text style={styles.exampleAz}>"{gItem.Example_az}"</Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity style={styles.primaryActionButton} onPress={handleStartExercisesForSection}>
                  <Text style={styles.primaryActionButtonText}>Practice Grammar ({currentSection.exercises.length} Questions)</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}

          </View>
        )}

        {/* STAGE 2: EXERCISES / QUIZ QUESTIONS */}
        {stage === 'exercising' && currentExercise && (
          <View style={styles.quizWrapper}>
            {/* Section & Question Progress Header */}
            <View style={styles.quizHeaderBadgeRow}>
              <View style={styles.quizSectionBadge}>
                <Text style={styles.quizSectionBadgeText}>
                  SECTION {currentSectionIndex + 1}: {currentSection.title_en}
                </Text>
              </View>
              <Text style={styles.questionCounterText}>
                Question {currentExerciseIndex + 1} of {currentSection.exercises.length}
              </Text>
            </View>

            <View style={styles.instructionBox}>
              <Text style={styles.instructionText}>
                {currentExercise.Instruction_en || currentExercise.Instruction_az}
              </Text>
            </View>

            <Text style={styles.questionText}>
              {currentExercise.question_en || currentExercise.question_az}
            </Text>

            <View style={styles.optionsGrid}>
              {optionsList.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                let cardStyle: any = styles.optionCard;

                if (hasChecked) {
                  if (opt === currentExercise.Answer) {
                    cardStyle = [styles.optionCard, styles.optionCorrect];
                  } else if (isSelected && !isCorrect) {
                    cardStyle = [styles.optionCard, styles.optionWrong];
                  }
                } else if (isSelected) {
                  cardStyle = [styles.optionCard, styles.optionSelected];
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={cardStyle}
                    disabled={hasChecked}
                    activeOpacity={0.8}
                    onPress={() => setSelectedOption(opt)}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                    {hasChecked && opt === currentExercise.Answer && (
                      <MaterialIcons name="check-circle" size={22} color="#059669" />
                    )}
                    {hasChecked && isSelected && !isCorrect && (
                      <MaterialIcons name="cancel" size={22} color="#dc2626" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {hasChecked && (
              <View style={[styles.resultBanner, isCorrect ? styles.resultBannerSuccess : styles.resultBannerError]}>
                <MaterialIcons name={isCorrect ? "check-circle" : "error"} size={24} color={isCorrect ? "#059669" : "#dc2626"} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resultBannerTitle, { color: isCorrect ? "#059669" : "#dc2626" }]}>
                    {isCorrect ? "Excellent!" : "Not quite right"}
                  </Text>
                  <Text style={styles.resultBannerSub}>
                    {currentExercise.Result_az || `Correct answer: ${currentExercise.Answer}`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      {/* SECTION COMPLETED TRANSITION POPUP MODAL */}
      <Modal
        visible={transitionModal !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setTransitionModal(null)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.transitionCard}>
            <View style={styles.transitionIconWrapper}>
              <MaterialIcons name="check-circle-outline" size={54} color="#059669" />
            </View>

            <Text style={styles.transitionTitle}>Section Completed! 🎉</Text>
            <Text style={styles.transitionCompletedName}>
              {transitionModal?.completedSection.title_en} ({transitionModal?.completedSection.title_az})
            </Text>

            <View style={styles.upNextBox}>
              <Text style={styles.upNextLabel}>UP NEXT • SECTION {transitionModal?.nextSection.order}:</Text>
              <Text style={styles.upNextTitle}>
                {transitionModal?.nextSection.title_en} ({transitionModal?.nextSection.title_az})
              </Text>
            </View>

            <TouchableOpacity
              style={styles.transitionPrimaryBtn}
              activeOpacity={0.9}
              onPress={handleProceedToNextSection}
            >
              <Text style={styles.transitionPrimaryBtnText}>Continue to Next Section</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BOTTOM FOOTER CONTROLS FOR EXERCISES */}
      {stage === 'exercising' && (
        <View style={styles.footer}>
          {!hasChecked ? (
            <TouchableOpacity
              style={[styles.actionBtn, !selectedOption && styles.actionBtnDisabled]}
              disabled={!selectedOption}
              onPress={handleCheckAnswer}
            >
              <Text style={styles.actionBtnText}>Check Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, isCorrect ? { backgroundColor: '#059669' } : { backgroundColor: '#003594' }]}
              onPress={handleNextQuestion}
            >
              <Text style={styles.actionBtnText}>
                {currentExerciseIndex + 1 === currentSection.exercises.length ? "Finish Section" : "Next Question"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#003594',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  closeButton: {
    padding: 6,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#003594',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 3,
    textAlign: 'center',
  },
  heartsContainer: {
    paddingHorizontal: 8,
  },
  heartText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#dc2626',
  },
  sectionHeaderCard: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d7ee',
  },
  sectionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003594',
    letterSpacing: 1,
  },
  stageTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stageTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3730a3',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  contentScroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  learningStageWrapper: {
    gap: 16,
  },
  dialogueCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  videoPlaceholder: {
    height: 180,
    backgroundColor: '#003594',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  videoSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  dialogueNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 14,
    gap: 10,
    marginBottom: 16,
  },
  dialogueNoticeText: {
    color: '#0284c7',
    fontSize: 13,
    flex: 1,
  },
  primaryActionButton: {
    height: 52,
    backgroundColor: '#003594',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  vocabStage: {
    gap: 16,
  },
  vocabInstruction: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  flashcard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#003594',
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  categoryBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryBadgeText: {
    color: '#0284c7',
    fontSize: 12,
    fontWeight: '800',
  },
  flashcardEn: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  flashcardAz: {
    fontSize: 22,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  vocabNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  vocabNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    gap: 6,
  },
  vocabNavBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003594',
  },
  startExerciseBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#059669',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startExerciseBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  grammarStage: {
    gap: 16,
  },
  grammarInstruction: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  grammarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  grammarTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  grammarTopicTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  grammarExplanation: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  grammarExplanationAz: {
    fontSize: 13,
    color: '#64748b',
  },
  exampleBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 14,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#003594',
  },
  exampleEn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  exampleAz: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  quizWrapper: {
    gap: 14,
  },
  quizHeaderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  quizSectionBadge: {
    backgroundColor: '#003594',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  quizSectionBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  questionCounterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#003594',
  },
  instructionBox: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  instructionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284c7',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 30,
  },
  optionsGrid: {
    gap: 12,
    marginTop: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
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
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    gap: 12,
    marginTop: 12,
  },
  resultBannerSuccess: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  resultBannerError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  resultBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  resultBannerSub: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  transitionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  transitionIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  transitionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  transitionCompletedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  upNextBox: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    width: '100%',
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#003594',
  },
  upNextLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003594',
    letterSpacing: 1,
  },
  upNextTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  transitionPrimaryBtn: {
    height: 52,
    backgroundColor: '#003594',
    borderRadius: 26,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  transitionPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionBtn: {
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
  actionBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
