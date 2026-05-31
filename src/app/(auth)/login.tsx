import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signIn } from '@/services/auth';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Focus states for premium UI feel
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Wait a second', 'Please fill in all fields before continuing.');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) Alert.alert('Login Failed', error.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={styles.keyboardView} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            
            {/* Header / Logo Area */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Feather name="globe" size={32} color="#2563EB" />
              </View>
              <Text style={styles.logo}>Vividly</Text>
              <Text style={styles.subtitle}>Welcome back. Ready to learn?</Text>
            </View>

            {/* Form Area */}
            <View style={styles.form}>
              
              {/* Email Input */}
              <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
                <Feather name="mail" size={20} color={emailFocused ? "#2563EB" : "#9CA3AF"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>

              {/* Password Input */}
              <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
                <Feather name="lock" size={20} color={passwordFocused ? "#2563EB" : "#9CA3AF"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Primary Action */}
              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin} 
                disabled={loading} 
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
              </TouchableOpacity>

              {/* Secondary Action */}
              <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link} activeOpacity={0.6}>
                <Text style={styles.linkText}>New to Vividly? <Text style={styles.linkBold}>Create an account</Text></Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  iconContainer: { 
    width: 64, 
    height: 64, 
    borderRadius: 20, 
    backgroundColor: '#EFF6FF', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 24 
  },
  logo: { fontSize: 32, fontWeight: '800', color: '#111827', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  form: { gap: 16 },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    height: 60,
  },
  inputFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputIcon: { marginRight: 12 },
  eyeIcon: { padding: 4 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  
  forgotPassword: { alignSelf: 'flex-end', paddingVertical: 8 },
  forgotPasswordText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  
  button: {
    backgroundColor: '#2563EB',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  
  link: { alignItems: 'center', marginTop: 24, paddingVertical: 8 },
  linkText: { fontSize: 15, color: '#6B7280' },
  linkBold: { color: '#2563EB', fontWeight: '700' },
});
