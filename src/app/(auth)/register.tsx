import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signUp } from '@/services/auth';
import { signInWithGoogle } from '@/services/oauth';
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !fullName) return Alert.alert('Missing Info', 'Please fill in all fields to create your account.');
    if (password.length < 8) return Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
    
    setLoading(true);
    const { data, error } = await signUp(email, password, fullName);
    setLoading(false);
    
    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else if (data?.user && !data?.session) {
      Alert.alert(
        'Verify Your Email 📩',
        `We've sent a verification link to ${email}. Please check your inbox and click the link to confirm your account, then sign in.`,
        [{ text: 'Sign In', onPress: () => router.push('/(auth)/login') }]
      );
    } else {
      router.replace('/onboarding' as any);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) Alert.alert('Google Sign-In Failed', error.message);
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
          {/* Top Header with Back Button and Logo */}
          <View style={styles.topHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={18} color="#004ac6" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <MaterialIcons name="language" size={24} color="#004ac6" />
              <Text style={styles.logoText}>Vividly</Text>
            </View>
            
            {/* Spacer to balance the back button */}
            <View style={{ width: 36 }} />
          </View>

          {/* Hero Header */}
          <View style={styles.heroHeader}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your English learning journey today.</Text>
          </View>

          {/* Registration Form Card */}
          <View style={styles.card}>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputContainer, nameFocused && styles.inputFocused]}>
                <Feather name="user" size={18} color={nameFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#737686"
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
                <Feather name="mail" size={18} color={emailFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
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
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
                <Feather name="lock" size={18} color={passwordFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="•••••••• (min 8 chars)"
                  placeholderTextColor="#737686"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#737686" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleRegister} 
              disabled={loading} 
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Create Account'}</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign-In */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} disabled={googleLoading} activeOpacity={0.8}>
              {googleLoading ? (
                <ActivityIndicator size="small" color="#151c27" />
              ) : (
                <>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }} style={styles.googleIcon} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Footer Inside Card */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.footerBold}>Sign In</Text>
              </TouchableOpacity>
            </View>
            
          </View>

          {/* External Terms */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsBold}>Terms of Service</Text> and{' '}
              <Text style={styles.termsBold}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <MaterialIcons name="verified-user" size={13} color="#737686" />
            <Text style={styles.securityText}>END-TO-END ENCRYPTION</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff', overflow: 'hidden' },
  keyboardView: { flex: 1 },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bgBlob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.4,
  },
  bgBlobTop: { top: -60, left: -60, backgroundColor: 'rgba(0, 53, 148, 0.08)' },
  bgBlobBottom: { bottom: -60, right: -60, backgroundColor: 'rgba(117, 31, 0, 0.05)' },

  topHeader: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    marginTop: Platform.OS === 'android' ? 6 : 0,
    marginBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 20, fontWeight: '700', color: '#004ac6' },

  heroHeader: { alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#151c27', marginBottom: 2, letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#434655', textAlign: 'center' },

  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.3)',
  },

  formGroup: { marginBottom: 8 },
  label: { fontSize: 11, fontWeight: '600', color: '#434655', marginBottom: 3, marginLeft: 2 },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f3ff',
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#004ac6',
    backgroundColor: '#ffffff',
  },
  inputIcon: { marginRight: 8 },
  eyeIcon: { padding: 4 },
  input: { flex: 1, fontSize: 14, color: '#151c27' },

  button: {
    backgroundColor: '#004ac6',
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 2,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#c3c6d6' },
  dividerText: { marginHorizontal: 8, fontSize: 10, fontWeight: '600', color: '#737686' },

  googleButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 42, 
    backgroundColor: '#f0f3ff', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: 'rgba(195, 198, 215, 0.3)', 
    gap: 8 
  },
  googleIcon: { width: 18, height: 18 },
  googleButtonText: { fontSize: 13, fontWeight: '600', color: '#151c27' },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#e7eefe',
  },
  footerText: { fontSize: 12, color: '#434655' },
  footerBold: { color: '#004ac6', fontWeight: '700', fontSize: 12 },

  termsContainer: { marginTop: 8, paddingHorizontal: 12, alignItems: 'center' },
  termsText: { fontSize: 10, color: '#737686', textAlign: 'center', lineHeight: 14 },
  termsBold: { fontWeight: '700', color: '#434655' },

  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
    opacity: 0.7,
  },
  securityText: { fontSize: 9, fontWeight: '600', color: '#737686', letterSpacing: 0.8 },
});
