import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signUp } from '@/services/auth';
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !fullName) return Alert.alert('Missing Info', 'Please fill in all fields to create your account.');
    if (password.length < 8) return Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
    
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    
    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert('Welcome to Vividly!', 'Please check your email to confirm your account.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    }
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
              <Feather name="arrow-left" size={24} color="#004ac6" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <MaterialIcons name="language" size={28} color="#004ac6" />
              <Text style={styles.logoText}>Vividly</Text>
            </View>
            
            {/* Spacer to balance the back button */}
            <View style={{ width: 44 }} />
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
                <Feather name="user" size={20} color={nameFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
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
              <Text style={styles.label}>Password</Text>
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
              <Text style={styles.hintText}>Hint: (min 8 chars)</Text>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleRegister} 
              disabled={loading} 
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Create Account'}</Text>
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
              By creating an account, you agree to our{'\n'}
              <Text style={styles.termsBold}>Terms of Service</Text> and{' '}
              <Text style={styles.termsBold}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <MaterialIcons name="verified-user" size={16} color="#737686" />
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
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
});
