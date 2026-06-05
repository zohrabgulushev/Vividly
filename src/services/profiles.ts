import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

export async function getProfile(userId: string) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}

export async function updateProfile(userId: string, data: Partial<Profile>) {
  return supabase
    .from('profiles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', userId);
}

export async function saveOnboardingData(userId: string, level: string, goal: string) {
  return supabase
    .from('profiles')
    .update({
      level,
      goal,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}
