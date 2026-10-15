import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

export async function getProfile(userId: string) {
  const res = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // If profile doesn't exist yet (e.g. fresh OAuth sign-in without DB trigger)
  if (res.error && res.error.code === 'PGRST116') {
    const { data: { user } } = await supabase.auth.getUser();
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Learner';
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

    const insertRes = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        avatar_url: avatarUrl,
        level: 'B1',
        goal: 'travel',
        xp_balance: 0,
        current_streak: 0,
        is_onboarded: false,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return insertRes;
  }

  return res;
}

export async function updateProfile(userId: string, data: Partial<Profile>) {
  return supabase
    .from('profiles')
    .upsert({ id: userId, ...data, updated_at: new Date().toISOString() });
}

export async function saveOnboardingData(userId: string, level: string, goal: string) {
  return supabase
    .from('profiles')
    .upsert({
      id: userId,
      level,
      goal,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    });
}
