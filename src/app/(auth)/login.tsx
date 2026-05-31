import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signIn } from '@/services/auth';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter your email and password.');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) Alert.alert('Login Failed', error.message);
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be available soon.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative Background Elements */}
      <View style={[styles.bgBlob, styles.bgBlobTop]} />
      <View style={[styles.bgBlob, styles.bgBlobBottom]} />

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header */}
          <View style={styles.topHeader}>
            <MaterialIcons name="language" size={32} color="#004ac6" />
            <Text style={styles.logoText}>Vividly</Text>
          </View>

          {/* Hero Header */}
          <View style={styles.heroHeader}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Learn English with the world's best.</Text>
          </View>

          {/* Login Form Card */}
          <View style={styles.card}>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
                <Feather name="mail" size={20} color={emailFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#737686"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
                <Feather name="lock" size={20} color={passwordFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#737686"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#737686" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin} 
              disabled={loading} 
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Google')}>
                <FontAwesome5 name="google" size={18} color="#151c27" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Apple')}>
                <FontAwesome5 name="apple" size={22} color="#151c27" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
            
          </View>

          {/* Footer Link */}
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.footerLink}>
            <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerBold}>Create an account</Text></Text>
          </TouchableOpacity>

          {/* Social Proof */}
          <View style={styles.socialProof}>
            <View style={styles.avatarGroup}>
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoKl3VnTuZpgi_WMzRAYJpOw_ygZuV-LMQMWYakKJI78OTIa-n4cASrUWrShAcE95A-eUeXdC-vfYP2AOOmhQvp-D018WgNgdsLDBxI6jnZnpVMElfmVVTFZBkoz_0_UDdHWF9uUppmnqW8Zgv07-FxfxWvimL2H_crdUkMRhiULrFs7jscl0yR0Y0-Rfe5F1Lyw0OTdJ6hMuvirgbaYKvyFcQMezPqTZKjy8LLjwMemsNClgHH1rRiigydbINfreMHwV7mIdL0n8' }} style={[styles.avatar, { zIndex: 3 }]} />
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOM5Bb1eIzxk5nre8-8xM5dQ89Ac58LeRpKk5JwOPY97XF5X9D-bbLimW4Zsduam-vV2vrObIsmlOFjUpLMoxMS4BqS0GviWPaZ3Z-bMlrxW9uWuKX3chrTILhBNisj7JQDxEMnhOfFRmuAD932YWYgLzXIP5aSIh0ZzkY-lEu3AD7Xsn_OyIX04hqbDfsIWxhazuz1TR2X02PUZuK_dp6HdoLaKRMuxxQFhxxQv9U-iCspweCENH-KzYUN6piVS6NunQ8SxlLOj8' }} style={[styles.avatar, styles.avatarOverlap, { zIndex: 2 }]} />
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-suB2Rrh7c51upjwHCzsa6E0UmV0VldQCe5VYRbxhJzwFzi0G2kXRywDz3xLByOA1eaS2JsPGnFs2O6g6HXVRBkucQEY2-pdmBaOwmr28R5qBVhRMeW4PABqYyGDezYq7qLnDC_O34Y6OCieqZcXogBQUUqjzvGOlEzkLXyJvX-PKtLps5q9FX2aVRCccPEbdfHBPr14veHh7-kYye2Sp5UCI9x_MgyME1CkRCzZhyOA7IvTXH9MApYL72pfYWmGZYoti9IIudrI' }} style={[styles.avatar, styles.avatarOverlap, { zIndex: 1 }]} />
            </View>
            <View style={styles.starsContainer}>
              {[1,2,3,4,5].map(i => <MaterialIcons key={i} name="star" size={18} color="#bc4800" />)}
              <Text style={styles.socialProofText}>Joined by 2M+ learners worldwide</Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff', overflow: 'hidden' },
  keyboardView: { flex: 1 },
  
  bgBlob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  bgBlobTop: { top: -50, right: -50, backgroundColor: 'rgba(37, 99, 235, 0.08)' },
  bgBlobBottom: { bottom: -50, left: -50, backgroundColor: 'rgba(148, 55, 0, 0.05)' },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 80,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    marginBottom: 16,
  },
  logoText: { fontSize: 24, fontWeight: '700', color: '#004ac6' },

  heroHeader: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '700', color: '#151c27', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#434655', textAlign: 'center' },

  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.3)',
  },

  formGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#434655', marginBottom: 8, marginLeft: 4 },
  
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgotPassword: { fontSize: 12, fontWeight: '600', color: '#004ac6' },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f3ff',
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#004ac6',
    backgroundColor: '#ffffff',
  },
  inputIcon: { marginRight: 12 },
  eyeIcon: { padding: 4 },
  input: { flex: 1, fontSize: 16, color: '#151c27' },

  button: {
    backgroundColor: '#004ac6',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#c3c6d7' },
  dividerText: { marginHorizontal: 16, fontSize: 12, fontWeight: '600', color: '#737686' },

  socialContainer: { flexDirection: 'row', gap: 16 },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#f0f3ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.3)',
    gap: 12,
  },
  socialButtonText: { fontSize: 14, fontWeight: '500', color: '#151c27' },

  footerLink: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 16, color: '#434655' },
  footerBold: { color: '#004ac6', fontWeight: '700' },

  socialProof: { marginTop: 48, alignItems: 'center', opacity: 0.8 },
  avatarGroup: { flexDirection: 'row', marginBottom: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#f9f9ff' },
  avatarOverlap: { marginLeft: -12 },
  starsContainer: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  socialProofText: { fontSize: 12, fontWeight: '600', color: '#5c6274', marginLeft: 6 },
});
