import { supabase } from '@/lib/supabase';

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
  return supabase
    .from('lessons')
    .select('*')
    .eq('level', level)
    .not('id', 'in', `(${excludeIds.join(',')})`)
    .limit(limit);
}

// After answering: update SRS box and next review date
// Leitner System: correct = move to next box, wrong = back to box 1
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
    .single();

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
  });
}

// Award XP to a student after completing a lesson
// Uses a direct increment — no separate RPC needed
export async function awardXP(studentId: string, xpAmount: number) {
  // First get current balance, then increment
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
