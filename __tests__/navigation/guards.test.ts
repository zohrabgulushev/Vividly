// __tests__/navigation/guards.test.ts
// Unit tests for _layout.tsx navigation guard logic

// ─── Mirror the guard decision logic from _layout.tsx ─────────────────────────
interface GuardState {
  session: boolean;
  isOnboarded: boolean | null;
  loading: boolean;
  profileLoading: boolean;
  segment: string;
  comingFromProcessing: boolean;
}

type RouteDecision = 'login' | 'onboarding' | 'learn' | 'stay' | 'refetch';

function decideRoute(state: GuardState): RouteDecision {
  const { session, isOnboarded, loading, profileLoading, segment, comingFromProcessing } = state;

  // Still loading — do nothing
  if (loading || profileLoading) return 'stay';

  // Waiting for profile fetch after login
  if (session && isOnboarded === null) return 'stay';

  const inAuthGroup = segment === '(auth)';
  const inOnboardingFlow = segment === 'onboarding' || segment === 'goal-selection' || segment === 'processing';
  const inTabs = segment === '(tabs)';

  if (!session && !inAuthGroup) return 'login';

  if (session && inAuthGroup) {
    return isOnboarded ? 'learn' : 'onboarding';
  }

  if (session && !isOnboarded && !inOnboardingFlow) {
    if (comingFromProcessing && inTabs) return 'refetch';
    if (!comingFromProcessing) return 'onboarding';
  }

  return 'stay';
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Navigation Guards (_layout.tsx)', () => {

  describe('Unauthenticated user', () => {
    it('redirects to login if not in auth group', () => {
      expect(decideRoute({
        session: false, isOnboarded: null, loading: false,
        profileLoading: false, segment: '(tabs)', comingFromProcessing: false,
      })).toBe('login');
    });

    it('redirects to login from onboarding if no session', () => {
      expect(decideRoute({
        session: false, isOnboarded: null, loading: false,
        profileLoading: false, segment: 'onboarding', comingFromProcessing: false,
      })).toBe('login');
    });

    it('stays on auth screen if already there', () => {
      expect(decideRoute({
        session: false, isOnboarded: null, loading: false,
        profileLoading: false, segment: '(auth)', comingFromProcessing: false,
      })).toBe('stay');
    });
  });

  describe('Loading states', () => {
    it('stays during auth loading', () => {
      expect(decideRoute({
        session: true, isOnboarded: true, loading: true,
        profileLoading: false, segment: '(tabs)', comingFromProcessing: false,
      })).toBe('stay');
    });

    it('stays during profile loading', () => {
      expect(decideRoute({
        session: true, isOnboarded: null, loading: false,
        profileLoading: true, segment: '(tabs)', comingFromProcessing: false,
      })).toBe('stay');
    });

    it('stays when session exists but isOnboarded not fetched yet', () => {
      expect(decideRoute({
        session: true, isOnboarded: null, loading: false,
        profileLoading: false, segment: '(tabs)', comingFromProcessing: false,
      })).toBe('stay');
    });
  });

  describe('Authenticated + onboarded user', () => {
    it('redirects to learn when in auth group (just logged in)', () => {
      expect(decideRoute({
        session: true, isOnboarded: true, loading: false,
        profileLoading: false, segment: '(auth)', comingFromProcessing: false,
      })).toBe('learn');
    });

    it('stays in tabs when navigating normally', () => {
      expect(decideRoute({
        session: true, isOnboarded: true, loading: false,
        profileLoading: false, segment: '(tabs)', comingFromProcessing: false,
      })).toBe('stay');
    });
  });

  describe('Authenticated + NOT onboarded', () => {
    it('redirects to onboarding from auth (just registered)', () => {
      expect(decideRoute({
        session: true, isOnboarded: false, loading: false,
        profileLoading: false, segment: '(auth)', comingFromProcessing: false,
      })).toBe('onboarding');
    });

    it('stays in onboarding flow screens', () => {
      for (const seg of ['onboarding', 'goal-selection', 'processing']) {
        expect(decideRoute({
          session: true, isOnboarded: false, loading: false,
          profileLoading: false, segment: seg, comingFromProcessing: false,
        })).toBe('stay');
      }
    });

    it('redirects back to onboarding if wandered to tabs (normal case)', () => {
      expect(decideRoute({
        session: true, isOnboarded: false, loading: false,
        profileLoading: false, segment: '(tabs)', comingFromProcessing: false,
      })).toBe('onboarding');
    });
  });

  describe('Post-processing race condition fix', () => {
    it('refetches instead of redirecting when coming from processing', () => {
      // This is the KEY fix: after processing → learn, _layout sees isOnboarded=false
      // (stale cache) but should refetch, not redirect to onboarding
      expect(decideRoute({
        session: true, isOnboarded: false, loading: false,
        profileLoading: false, segment: '(tabs)', comingFromProcessing: true,
      })).toBe('refetch'); // NOT 'onboarding'
    });

    it('after refetch succeeds (isOnboarded=true), stays in tabs', () => {
      expect(decideRoute({
        session: true, isOnboarded: true, loading: false,
        profileLoading: false, segment: '(tabs)', comingFromProcessing: false,
      })).toBe('stay');
    });
  });
});
