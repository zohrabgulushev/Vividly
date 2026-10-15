import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getProfile } from '@/services/profiles';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function handleAuth() {
      try {
        // Give Supabase a moment to detect and parse the session from URL hash / query code
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          // If session wasn't immediately ready, listen for auth state change
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (newSession && mounted) {
              subscription.unsubscribe();
              await checkAndNavigate(newSession.user.id);
            }
          });

          // Fallback timeout after 4 seconds
          setTimeout(() => {
            if (mounted) {
              router.replace('/(auth)/login');
            }
          }, 4000);
          return;
        }

        if (mounted) {
          await checkAndNavigate(session.user.id);
        }
      } catch (e) {
        console.error('Error handling auth callback:', e);
        if (mounted) {
          router.replace('/(auth)/login');
        }
      }
    }

    async function checkAndNavigate(userId: string) {
      try {
        const { data } = await getProfile(userId);
        if (data?.is_onboarded) {
          router.replace('/(tabs)/learn');
        } else {
          router.replace('/onboarding');
        }
      } catch {
        router.replace('/onboarding');
      }
    }

    handleAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#004ac6" />
      <Text style={styles.text}>Signing you in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9ff',
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: '#434655',
    fontWeight: '600',
  },
});
