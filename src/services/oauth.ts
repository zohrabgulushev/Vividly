import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectTo = AuthSession.makeRedirectUri({
    scheme: 'vividly',
    path: 'auth/callback',
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) return { error };
  if (!data?.url) return { error: new Error('No OAuth URL returned') };

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'success' && result.url) {
    const url = new URL(result.url);
    const accessToken = url.searchParams.get('access_token');
    const refreshToken = url.searchParams.get('refresh_token');

    if (accessToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? '',
      });
      return { error: sessionError };
    }

    // Handle hash fragment (implicit flow)
    const hash = result.url.split('#')[1];
    if (hash) {
      const params = new URLSearchParams(hash);
      const at = params.get('access_token');
      const rt = params.get('refresh_token');
      if (at) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: at,
          refresh_token: rt ?? '',
        });
        return { error: sessionError };
      }
    }
  }

  if (result.type === 'cancel') {
    return { error: null }; // User cancelled — not an error
  }

  return { error: new Error('Google sign-in failed') };
}

export async function resetPasswordForEmail(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: Platform.OS === 'web'
      ? `${window.location.origin}/auth/update-password`
      : 'vividly://auth/update-password',
  });
}

export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
}
