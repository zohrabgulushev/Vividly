import { useEffect, useState, useCallback, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { getProfile } from '@/services/profiles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  // Track whether we just came from processing (to avoid premature redirect)
  const comingFromProcessing = useRef(false);

  // Fetch onboarding status whenever user changes
  const fetchOnboardingStatus = useCallback(async (userId: string) => {
    setProfileLoading(true);
    try {
      const localOnboarded = await AsyncStorage.getItem(`vividly_onboarded_${userId}`);
      const globalOnboarded = await AsyncStorage.getItem('vividly_onboarded_global');
      if (localOnboarded === 'true' || globalOnboarded === 'true') {
        setIsOnboarded(true);
        setProfileLoading(false);
        return;
      }

      const { data } = await getProfile(userId);
      if (data?.is_onboarded) {
        setIsOnboarded(true);
        await AsyncStorage.setItem(`vividly_onboarded_${userId}`, 'true');
      } else {
        setIsOnboarded(false);
      }
    } catch (e) {
      console.warn('Error fetching onboarding status:', e);
      setIsOnboarded(false);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setIsOnboarded(null);
      return;
    }
    fetchOnboardingStatus(session.user.id);
  }, [session?.user?.id]);

  // When we enter the processing screen, mark the flag
  useEffect(() => {
    if (segments[0] === 'processing') {
      comingFromProcessing.current = true;
    }
  }, [segments]);

  useEffect(() => {
    // Wait for all async data to resolve
    if (loading || profileLoading) return;
    // Still fetching profile after login
    if (session && isOnboarded === null) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingFlow =
      segments[0] === 'onboarding' ||
      segments[0] === 'goal-selection' ||
      segments[0] === 'processing';
    const inTabs = segments[0] === '(tabs)';

    if (!session && !inAuthGroup) {
      // Not logged in → login
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Just logged in → check if onboarding is done
      if (isOnboarded) {
        router.replace('/(tabs)/learn');
      } else {
        router.replace('/onboarding');
      }
    } else if (session && !isOnboarded && !inOnboardingFlow) {
      // If user came from processing or is inside tabs, ensure they aren't trapped
      if (comingFromProcessing.current || inTabs) {
        comingFromProcessing.current = false;
        setIsOnboarded(true);
        if (session.user?.id) {
          AsyncStorage.setItem(`vividly_onboarded_${session.user.id}`, 'true').catch(() => {});
        }
      } else {
        router.replace('/onboarding');
      }
    }
  }, [session, loading, isOnboarded, profileLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="goal-selection" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="lesson-player" />
      <Stack.Screen name="lesson-complete" />
      <Stack.Screen name="store" />
      <Stack.Screen name="top-up" />
      <Stack.Screen name="book-session" />
      <Stack.Screen name="active-call" />
      <Stack.Screen name="tutor-profile" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="language" />
      <Stack.Screen name="help-center" />
      <Stack.Screen name="session-history" />
      <Stack.Screen name="practice-prompts" />
      <Stack.Screen name="rival-profile" />
    </Stack>
  );
}
