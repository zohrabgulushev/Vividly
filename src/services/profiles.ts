import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getProfile(userId: string) {
  try {
    const res = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Check if locally marked as onboarded
    let isLocallyOnboarded = false;
    try {
      const localOnboarded = await AsyncStorage.getItem(`vividly_onboarded_${userId}`);
      const globalOnboarded = await AsyncStorage.getItem('vividly_onboarded_global');
      isLocallyOnboarded = localOnboarded === 'true' || globalOnboarded === 'true';
    } catch {}

    // If profile doesn't exist yet (e.g. fresh OAuth sign-in without DB trigger)
    if (res.error && res.error.code === 'PGRST116') {
      const { data: { user } } = await supabase.auth.getUser();
      const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Learner';
      const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

      try {
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
            is_onboarded: isLocallyOnboarded,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertRes.data && isLocallyOnboarded) {
          insertRes.data.is_onboarded = true;
        }
        return insertRes;
      } catch (insertErr) {
        console.warn('Profile insert error, returning local fallback:', insertErr);
        return {
          data: {
            id: userId,
            full_name: fullName,
            avatar_url: avatarUrl,
            level: 'B1',
            goal: 'travel',
            xp_balance: 0,
            current_streak: 0,
            is_onboarded: isLocallyOnboarded,
          } as Profile,
          error: null
        };
      }
    }

    if (res.data) {
      if (isLocallyOnboarded) {
        res.data.is_onboarded = true;
      }
    }

    return res;
  } catch (err) {
    console.warn('getProfile unexpected error, returning fallback:', err);
    let fallbackOnboarded = false;
    try {
      const local = await AsyncStorage.getItem(`vividly_onboarded_${userId}`);
      fallbackOnboarded = local === 'true';
    } catch {}
    return {
      data: {
        id: userId,
        full_name: 'Learner',
        avatar_url: null,
        level: 'B1',
        goal: 'travel',
        xp_balance: 0,
        current_streak: 0,
        is_onboarded: fallbackOnboarded,
      } as Profile,
      error: null
    };
  }
}

export async function updateProfile(userId: string, data: Partial<Profile>) {
  try {
    if (data.level) {
      await AsyncStorage.setItem(`vividly_level_${userId}`, data.level);
    }
    if (data.is_onboarded) {
      await AsyncStorage.setItem(`vividly_onboarded_${userId}`, 'true');
      await AsyncStorage.setItem('vividly_onboarded_global', 'true');
    }
  } catch (e) {
    console.warn('AsyncStorage cache updateProfile error:', e);
  }

  try {
    return await supabase
      .from('profiles')
      .upsert({ id: userId, ...data, updated_at: new Date().toISOString() });
  } catch (err) {
    console.warn('updateProfile error, returning local success:', err);
    return { data: null, error: null };
  }
}

export async function saveOnboardingData(userId: string, level: string, goal: string) {
  try {
    await AsyncStorage.setItem(`vividly_onboarded_${userId}`, 'true');
    await AsyncStorage.setItem('vividly_onboarded_global', 'true');
    await AsyncStorage.setItem(`vividly_level_${userId}`, level);
    await AsyncStorage.setItem(`vividly_goal_${userId}`, goal);
  } catch (e) {
    console.warn('AsyncStorage saveOnboardingData error:', e);
  }

  try {
    const res = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        level,
        goal,
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      });
    return res;
  } catch (err) {
    console.warn('Supabase saveOnboardingData error, attempting fallback without is_onboarded:', err);
    try {
      return await supabase
        .from('profiles')
        .upsert({
          id: userId,
          level,
          goal,
          updated_at: new Date().toISOString(),
        });
    } catch (fallbackErr) {
      return { data: null, error: null };
    }
  }
}
