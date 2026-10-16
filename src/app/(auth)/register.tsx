import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signUp } from '@/services/auth';
import { signInWithGoogle } from '@/services/oauth';
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const { height, width } = useWindowDimensions();
  const isCompact = height < 820 || width < 500;

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
          contentContainerStyle={[styles.scrollContent, isCompact && styles.scrollContentCompact]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={[styles.topHeader, isCompact && styles.topHeaderCompact]}>
              <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isCompact && styles.backButtonCompact]}>
                <Feather name="arrow-left" size={isCompact ? 20 : 24} color="#004ac6" />
              </TouchableOpacity>
              
              <View style={styles.logoContainer}>
                <MaterialIcons name="language" size={isCompact ? 26 : 28} color="#004ac6" />
                <Text style={[styles.logoText, isCompact && styles.logoTextCompact]}>Vividly</Text>
              </View>
              
              {/* Spacer to balance the back button */}
              <View style={{ width: isCompact ? 38 : 44 }} />
            </View>

            {/* Hero Header */}
            <View style={[styles.heroHeader, isCompact && styles.heroHeaderCompact]}>
              <Text style={[styles.title, isCompact && styles.titleCompact]}>Create Account</Text>
              <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>Start your English learning journey today.</Text>
            </View>
          </View>

          {/* Registration Form Card */}
          <View style={[styles.card, isCompact && styles.cardCompact]}>
            
            <View style={[styles.formGroup, isCompact && styles.formGroupCompact]}>
              <Text style={[styles.label, isCompact && styles.labelCompact]}>Full Name</Text>
              <View style={[styles.inputContainer, isCompact && styles.inputContainerCompact, nameFocused && styles.inputFocused]}>
                <Feather name="user" size={isCompact ? 18 : 20} color={nameFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isCompact && styles.inputCompactText]}
                  placeholder="John Doe"
                  placeholderTextColor="#737686"
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            <View style={[styles.formGroup, isCompact && styles.formGroupCompact]}>
              <Text style={[styles.label, isCompact && styles.labelCompact]}>Email Address</Text>
              <View style={[styles.inputContainer, isCompact && styles.inputContainerCompact, emailFocused && styles.inputFocused]}>
                <Feather name="mail" size={isCompact ? 18 : 20} color={emailFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isCompact && styles.inputCompactText]}
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

            <View style={[styles.formGroup, isCompact && styles.formGroupCompact]}>
              <Text style={[styles.label, isCompact && styles.labelCompact]}>Password</Text>
              <View style={[styles.inputContainer, isCompact && styles.inputContainerCompact, passwordFocused && styles.inputFocused]}>
                <Feather name="lock" size={isCompact ? 18 : 20} color={passwordFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isCompact && styles.inputCompactText]}
                  placeholder="••••••••"
                  placeholderTextColor="#737686"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={isCompact ? 18 : 20} color="#737686" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, isCompact && styles.buttonCompact, loading && styles.buttonDisabled]} 
              onPress={handleRegister} 
              disabled={loading} 
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, isCompact && styles.buttonTextCompact]}>{loading ? 'Processing...' : 'Create Account'}</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={[styles.dividerContainer, isCompact && styles.dividerContainerCompact]}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, isCompact && styles.dividerTextCompact]}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign-In */}
            <TouchableOpacity style={[styles.googleButton, isCompact && styles.googleButtonCompact]} onPress={handleGoogleLogin} disabled={googleLoading} activeOpacity={0.8}>
              {googleLoading ? (
                <ActivityIndicator size="small" color="#151c27" />
              ) : (
                <>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }} style={[styles.googleIcon, isCompact && styles.googleIconCompact]} />
                  <Text style={[styles.googleButtonText, isCompact && styles.googleButtonTextCompact]}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Footer Inside Card */}
            <View style={[styles.cardFooter, isCompact && styles.cardFooterCompact]}>
              <Text style={[styles.footerText, isCompact && styles.footerTextCompact]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={[styles.footerBold, isCompact && styles.footerBoldCompact]}>Sign In</Text>
              </TouchableOpacity>
            </View>
            
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            {/* External Terms */}
            <View style={[styles.termsContainer, isCompact && styles.termsContainerCompact]}>
              <Text style={[styles.termsText, isCompact && styles.termsTextCompact]}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsBold}>Terms</Text> and{' '}
                <Text style={styles.termsBold}>Privacy Policy</Text>.
              </Text>
            </View>

            {/* Security Badge */}
            <View style={[styles.securityBadge, isCompact && styles.securityBadgeCompact]}>
              <MaterialIcons name="verified-user" size={isCompact ? 13 : 16} color="#737686" />
              <Text style={[styles.securityText, isCompact && styles.securityTextCompact]}>END-TO-END ENCRYPTION</Text>
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
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topSection: { width: '100%', alignItems: 'center', marginBottom: 10 },
  bottomSection: { width: '100%', alignItems: 'center', marginTop: 10 },

  bgBlob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  bgBlobTop: { top: -50, left: -50, backgroundColor: 'rgba(0, 53, 148, 0.08)' },
  bgBlobBottom: { bottom: -50, right: -50, backgroundColor: 'rgba(117, 31, 0, 0.05)' },

  topHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 22, fontWeight: '700', color: '#004ac6' },

  heroHeader: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '700', color: '#151c27', marginBottom: 8, letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#434655', textAlign: 'center' },

  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#434655', marginBottom: 8, marginLeft: 4 },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#c3c6d6',
  },
  inputFocused: {
    borderColor: '#004ac6',
    borderWidth: 2,
    backgroundColor: '#f9f9ff',
  },
  inputIcon: { marginRight: 12 },
  eyeIcon: { padding: 4 },
  input: { flex: 1, fontSize: 16, color: '#151c27' },
  
  hintText: { fontSize: 12, color: '#737686', marginTop: 6, marginLeft: 4 },

  button: {
    backgroundColor: '#004ac6',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003594',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#c3c6d6' },
  dividerText: { marginHorizontal: 16, fontSize: 12, fontWeight: '600', color: '#737686' },

  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(195, 198, 215, 0.5)', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  googleIcon: { width: 22, height: 22 },
  googleButtonText: { fontSize: 16, fontWeight: '600', color: '#151c27' },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderColor: '#e7eefe',
  },
  footerText: { fontSize: 16, color: '#434655' },
  footerBold: { color: '#004ac6', fontWeight: '700', fontSize: 16 },

  termsContainer: { marginTop: 32, paddingHorizontal: 16, alignItems: 'center' },
  termsText: { fontSize: 12, color: '#434655', textAlign: 'center', lineHeight: 20 },
  termsBold: { fontWeight: '700', color: '#151c27' },

  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    opacity: 0.6,
  },
  securityText: { fontSize: 12, fontWeight: '600', color: '#737686', letterSpacing: 1 },

  // Responsive Compact Styles for Mobile
  scrollContentCompact: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  topHeaderCompact: {
    height: 40,
    marginTop: 0,
    marginBottom: 2,
  },
  backButtonCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  logoTextCompact: {
    fontSize: 22,
  },
  heroHeaderCompact: {
    marginBottom: 6,
  },
  titleCompact: {
    fontSize: 24,
    marginBottom: 2,
  },
  subtitleCompact: {
    fontSize: 13,
  },
  cardCompact: {
    padding: 16,
    borderRadius: 18,
  },
  formGroupCompact: {
    marginBottom: 6,
  },
  labelCompact: {
    fontSize: 12,
    marginBottom: 3,
  },
  inputContainerCompact: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputCompactText: {
    fontSize: 14,
  },
  buttonCompact: {
    height: 42,
    borderRadius: 10,
    marginTop: 4,
  },
  buttonTextCompact: {
    fontSize: 15,
  },
  dividerContainerCompact: {
    marginVertical: 6,
  },
  dividerTextCompact: {
    fontSize: 10,
    marginHorizontal: 8,
  },
  googleButtonCompact: {
    height: 42,
    borderRadius: 10,
    gap: 8,
  },
  googleIconCompact: {
    width: 18,
    height: 18,
  },
  googleButtonTextCompact: {
    fontSize: 14,
  },
  cardFooterCompact: {
    marginTop: 8,
    paddingTop: 6,
  },
  footerTextCompact: {
    fontSize: 13,
  },
  footerBoldCompact: {
    fontSize: 13,
  },
  termsContainerCompact: {
    marginTop: 6,
    paddingHorizontal: 8,
  },
  termsTextCompact: {
    fontSize: 11,
    lineHeight: 15,
  },
  securityBadgeCompact: {
    marginTop: 6,
    gap: 5,
  },
  securityTextCompact: {
    fontSize: 10,
  },
});
