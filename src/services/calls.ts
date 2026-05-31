import { supabase } from '@/lib/supabase';
import type { CallType } from '@/types/database';

// Get all active tutors for the catalog
export async function getActiveTutors() {
  return supabase
    .from('tutor_profiles')
    .select('*, profile:profiles(id, full_name, avatar_url)')
    .eq('is_active', true)
    .order('rating', { ascending: false });
}

// Create a call record and deduct minutes
export async function startCall(
  studentId: string,
  tutorId: string,
  type: CallType
) {
  const multiplier = type === 'private' ? 2.0 : 1.0;

  const { data, error } = await supabase
    .from('calls')
    .insert({
      student_id: studentId,
      tutor_id: tutorId,
      type,
      status: 'ongoing',
      started_at: new Date().toISOString(),
      billing_multiplier: multiplier,
    })
    .select()
    .single();

  return { data, error };
}

// End a call and bill the student
export async function endCall(callId: string, durationSeconds: number, billingMultiplier: number) {
  const billedMinutes = Math.ceil((durationSeconds / 60) * billingMultiplier);

  // Update the call record
  await supabase
    .from('calls')
    .update({
      status: 'completed',
      ended_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      billed_minutes: billedMinutes,
    })
    .eq('id', callId);

  return billedMinutes;
}

// Get call history for a user
export async function getCallHistory(userId: string) {
  return supabase
    .from('calls')
    .select('*, tutor:tutor_profiles(tutor_id, profile:profiles(full_name, avatar_url))')
    .eq('student_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false });
}
