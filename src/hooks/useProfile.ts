import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getProfile } from '@/services/profiles';
import type { Profile } from '@/types/database';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    getProfile(userId)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Profile fetch failed (network/unreachable):', err);
        setError('Network error');
        setLoading(false);
      });

    // Real-time updates safely
    try {
      const channel = supabase
        .channel(`profile-${userId}-${Math.random()}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        }, (payload) => {
          setProfile(payload.new as Profile);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    } catch (e) {
      console.warn('Realtime channel error:', e);
    }
  }, [userId]);

  return { profile, loading, error };
}
