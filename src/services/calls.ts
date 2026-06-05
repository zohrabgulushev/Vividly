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

// Check if student has enough minutes for a call type
export async function checkMinutesBalance(
  studentId: string,
  type: CallType,
  estimatedMinutes = 1
): Promise<{ hasBalance: boolean; balance: number }> {
  const { data } = await supabase
    .from('profiles')
    .select('minutes_balance')
    .eq('id', studentId)
    .single();

  const balance = data?.minutes_balance ?? 0;
  // Private calls cost 2x
  const cost = type === 'private' ? estimatedMinutes * 2 : estimatedMinutes;

  return { hasBalance: balance >= cost, balance };
}

// Create a call record (does NOT deduct minutes — deducted on endCall)
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
      duration_seconds: 0,
      billed_minutes: 0,
    })
    .select()
    .single();

  return { data, error };
}

// End a call, bill the student, and deduct minutes from profile
export async function endCall(
  callId: string,
  studentId: string,
  durationSeconds: number,
  billingMultiplier: number
) {
  const billedMinutes = Math.ceil((durationSeconds / 60) * billingMultiplier);

  // Update the call record
  const { error: callError } = await supabase
    .from('calls')
    .update({
      status: 'completed',
      ended_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      billed_minutes: billedMinutes,
    })
    .eq('id', callId);

  if (callError) return { error: callError, billedMinutes: 0 };

  // Deduct minutes from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('minutes_balance')
    .eq('id', studentId)
    .single();

  const currentBalance = profile?.minutes_balance ?? 0;
  const newBalance = Math.max(0, currentBalance - billedMinutes);

  await supabase
    .from('profiles')
    .update({
      minutes_balance: newBalance,
      updated_at: new Date().toISOString(),
    })
    .eq('id', studentId);

  return { error: null, billedMinutes };
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
