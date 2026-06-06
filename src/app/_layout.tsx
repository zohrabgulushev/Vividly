import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { getProfile } from '@/services/profiles';

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch onboarding status whenever session changes
  useEffect(() => {
    if (!session?.user?.id) {
      setIsOnboarded(null);
      return;
    }
    setProfileLoading(true);
    getProfile(session.user.id).then(({ data }) => {
      setIsOnboarded(data?.is_onboarded ?? false);
      setProfileLoading(false);
    });
  }, [session?.user?.id]);

  useEffect(() => {
    if (loading || profileLoading) return;
    // Still waiting for profile fetch after login
    if (session && isOnboarded === null) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding' || segments[0] === 'goal-selection' || segments[0] === 'processing';

    if (!session && !inAuthGroup) {
      // Not logged in → login screen
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Just logged in → check if onboarding is done
      if (isOnboarded) {
        router.replace('/(tabs)/learn');
      } else {
        router.replace('/onboarding');
      }
    } else if (session && !isOnboarded && !inOnboarding) {
      // Logged in but hasn't done onboarding and navigated elsewhere
      router.replace('/onboarding');
    }
  }, [session, loading, isOnboarded, profileLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="goal-selection" />
      <Stack.Screen name="processing" />
    </Stack>
  );
}
