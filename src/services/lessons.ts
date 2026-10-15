import { supabase } from '@/lib/supabase';
import lessonsData from '@/constants/lessonsData.json';

export interface LessonSection {
  section_id: number;
  lesson_id: number;
  title_az: string;
  title_en: string;
  source_type: string;
  source_value: any;
  order: number;
  vocabulary: Array<{
    Lesson_id: number;
    Category: string;
    Word_en: string;
    Word_az: string;
    Level: string;
    Chunk: number;
  }>;
  grammar: Array<{
    Grammar_id: number;
    Lesson_id: number;
    Topic_az: string;
    Topic_en: string;
    Explanation_az: string;
    Explanation_en: string;
    Example_en: string;
    Example_az: string;
  }>;
  exercises: Array<{
    Exercise_id: number;
    Lesson_id: number;
    Section_id: number;
    Type: string;
    Instruction_az: string;
    Instruction_en: string;
    question_az: string;
    question_en: string;
    Answer: string;
    Option1: string;
    Option2: string;
    Option3: string;
    Result_az: string;
    Xp: number;
  }>;
}

export interface StructuredLesson {
  lesson_id: number;
  sections: LessonSection[];
}

// Get full structured lesson pipeline (L1 to L34)
export function getStructuredLessonData(lessonId: number | string): StructuredLesson | null {
  const numericId = typeof lessonId === 'string' ? parseInt(lessonId.replace(/\D/g, ''), 10) || 1 : lessonId;
  const data = (lessonsData as Record<string, StructuredLesson>)[String(numericId)];
  return data || (lessonsData as Record<string, StructuredLesson>)['1'] || null;
}

// Map Lesson ID to Level
export function getLevelForLesson(lessonId: number): string {
  if (lessonId <= 24) return 'A1';
  if (lessonId <= 35) return 'A2';
  if (lessonId <= 45) return 'B1';
  if (lessonId <= 55) return 'B2';
  if (lessonId <= 65) return 'C1';
  return 'C2';
}

// Get today's lessons for a student (SRS: due for review)
export async function getDueLessons(studentId: string, limit = 10) {
  return supabase
    .from('user_lessons')
    .select('*, lesson:lessons(*)')
    .eq('student_id', studentId)
    .lte('next_review_date', new Date().toISOString())
    .limit(limit);
}

// Get new lessons for a student (not started yet) based on their level
export async function getNewLessons(level: string, excludeIds: string[], limit = 5) {
  let query = supabase
    .from('lessons')
    .select('*')
    .eq('level', level)
    .limit(limit);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  return query;
}

// After answering: update SRS box and next review date
export async function updateLessonProgress(
  studentId: string,
  lessonId: string,
  wasCorrect: boolean
) {
  const { data: existing } = await supabase
    .from('user_lessons')
    .select('box')
    .eq('student_id', studentId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  const INTERVALS_DAYS = [1, 3, 7, 14, 30]; // per box
  const currentBox = existing?.box ?? 1;
  const newBox = wasCorrect ? Math.min(currentBox + 1, 5) : 1;
  const intervalDays = INTERVALS_DAYS[newBox - 1];

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return supabase.from('user_lessons').upsert({
    student_id: studentId,
    lesson_id: lessonId,
    box: newBox,
    next_review_date: nextReview.toISOString(),
    last_reviewed_at: new Date().toISOString(),
  }, {
    onConflict: 'student_id,lesson_id',
  });
}

// Award XP to a student — uses Supabase RPC for atomic increment
export async function awardXP(studentId: string, xpAmount: number) {
  return supabase.rpc('increment_xp', {
    user_id: studentId,
    amount: xpAmount,
  });
}

// Fallback XP award if RPC not available
export async function awardXPFallback(studentId: string, xpAmount: number) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp_balance')
    .eq('id', studentId)
    .single();

  const currentXP = profile?.xp_balance ?? 0;

  return supabase
    .from('profiles')
    .update({
      xp_balance: currentXP + xpAmount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', studentId);
}
