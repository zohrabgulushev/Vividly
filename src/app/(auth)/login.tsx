import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, Image, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signIn } from '@/services/auth';
import { signInWithGoogle, resetPasswordForEmail, updatePassword } from '@/services/oauth';
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Modal
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [fpStep, setFpStep] = useState<'email' | 'newpass'>('email');
  const [fpEmail, setFpEmail] = useState('');
  const [fpNewPass, setFpNewPass] = useState('');
  const [fpConfirmPass, setFpConfirmPass] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpShowPass, setFpShowPass] = useState(false);
  const [fpShowConfirm, setFpShowConfirm] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter your email and password.');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) Alert.alert('Login Failed', error.message);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) Alert.alert('Google Sign-In Failed', error.message);
  };

  const handleSendResetEmail = async () => {
    if (!fpEmail) return Alert.alert('Error', 'Please enter your email address.');
    setFpLoading(true);
    const { error } = await resetPasswordForEmail(fpEmail);
    setFpLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Email Sent! 📧',
        `We sent a password reset link to ${fpEmail}. Click the link in the email, then return to the app to enter your new password.`,
        [{ text: 'I clicked the link', onPress: () => setFpStep('newpass') }]
      );
    }
  };

  const handleUpdatePassword = async () => {
    if (!fpNewPass || !fpConfirmPass) return Alert.alert('Error', 'Please fill in both password fields.');
    if (fpNewPass.length < 8) return Alert.alert('Weak Password', 'Password must be at least 8 characters.');
    if (fpNewPass !== fpConfirmPass) return Alert.alert('Error', 'Passwords do not match.');
    
    setFpLoading(true);
    const { error } = await updatePassword(fpNewPass);
    setFpLoading(false);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Password Updated! ✅', 'Your password has been changed. Please sign in with your new password.', [
        { text: 'Sign In', onPress: () => {
          setForgotModalVisible(false);
          setFpStep('email');
          setFpEmail('');
          setFpNewPass('');
          setFpConfirmPass('');
        }}
      ]);
    }
  };

  const closeForgotModal = () => {
    setForgotModalVisible(false);
    setFpStep('email');
    setFpEmail('');
    setFpNewPass('');
    setFpConfirmPass('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Blobs */}
      <View style={[styles.bgBlob, styles.bgBlobTop]} />
      <View style={[styles.bgBlob, styles.bgBlobBottom]} />

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.topHeader}>
            <MaterialIcons name="language" size={32} color="#004ac6" />
            <Text style={styles.logoText}>Vividly</Text>
          </View>

          {/* Hero */}
          <View style={styles.heroHeader}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Learn English with the world's best.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
                <Feather name="mail" size={20} color={emailFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="name@example.com" placeholderTextColor="#737686" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} />
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
                <Feather name="lock" size={20} color={passwordFocused ? "#004ac6" : "#737686"} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#737686" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#737686" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
              <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Only */}
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

          </View>

          {/* Footer */}
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

      {/* ===== FORGOT PASSWORD MODAL ===== */}
      <Modal visible={forgotModalVisible} animationType="slide" transparent statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Feather name={fpStep === 'email' ? 'mail' : 'lock'} size={28} color="#004ac6" />
              </View>
              <TouchableOpacity onPress={closeForgotModal} style={styles.modalCloseButton}>
                <Feather name="x" size={22} color="#737686" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>
              {fpStep === 'email' ? 'Reset Password' : 'New Password'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {fpStep === 'email'
                ? 'Enter your email and we\'ll send you a reset link.'
                : 'Enter your new password below.'}
            </Text>

            {fpStep === 'email' ? (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="mail" size={20} color="#737686" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="name@example.com"
                      placeholderTextColor="#737686"
                      value={fpEmail}
                      onChangeText={setFpEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <TouchableOpacity style={[styles.button, fpLoading && styles.buttonDisabled]} onPress={handleSendResetEmail} disabled={fpLoading} activeOpacity={0.8}>
                  {fpLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSecondaryButton} onPress={() => setFpStep('newpass')}>
                  <Text style={styles.modalSecondaryText}>I already have a reset link</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color="#737686" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#737686"
                      value={fpNewPass}
                      onChangeText={setFpNewPass}
                      secureTextEntry={!fpShowPass}
                    />
                    <TouchableOpacity onPress={() => setFpShowPass(!fpShowPass)} style={styles.eyeIcon}>
                      <Feather name={fpShowPass ? "eye-off" : "eye"} size={20} color="#737686" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color="#737686" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#737686"
                      value={fpConfirmPass}
                      onChangeText={setFpConfirmPass}
                      secureTextEntry={!fpShowConfirm}
                    />
                    <TouchableOpacity onPress={() => setFpShowConfirm(!fpShowConfirm)} style={styles.eyeIcon}>
                      <Feather name={fpShowConfirm ? "eye-off" : "eye"} size={20} color="#737686" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Match indicator */}
                {fpNewPass.length > 0 && fpConfirmPass.length > 0 && (
                  <View style={styles.matchIndicator}>
                    <Feather name={fpNewPass === fpConfirmPass ? "check-circle" : "x-circle"} size={16} color={fpNewPass === fpConfirmPass ? "#16a34a" : "#dc2626"} />
                    <Text style={[styles.matchText, { color: fpNewPass === fpConfirmPass ? "#16a34a" : "#dc2626" }]}>
                      {fpNewPass === fpConfirmPass ? 'Passwords match' : 'Passwords do not match'}
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={[styles.button, fpLoading && styles.buttonDisabled]} onPress={handleUpdatePassword} disabled={fpLoading} activeOpacity={0.8}>
                  {fpLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Password</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSecondaryButton} onPress={() => setFpStep('email')}>
                  <Text style={styles.modalSecondaryText}>← Back to email</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff', overflow: 'hidden' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 48, alignItems: 'center', justifyContent: 'center' },

  bgBlob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.5 },
  bgBlobTop: { top: -50, right: -50, backgroundColor: 'rgba(37, 99, 235, 0.08)' },
  bgBlobBottom: { bottom: -50, left: -50, backgroundColor: 'rgba(148, 55, 0, 0.05)' },

  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 80, marginTop: Platform.OS === 'android' ? 24 : 0, marginBottom: 16 },
  logoText: { fontSize: 24, fontWeight: '700', color: '#004ac6' },

  heroHeader: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '700', color: '#151c27', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#434655', textAlign: 'center' },

  card: { width: '100%', maxWidth: 480, backgroundColor: '#ffffff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8, borderWidth: 1, borderColor: 'rgba(195, 198, 215, 0.3)' },

  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#434655', marginBottom: 8, marginLeft: 4 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgotPassword: { fontSize: 12, fontWeight: '600', color: '#004ac6' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f3ff', borderRadius: 16, height: 60, paddingHorizontal: 16, borderWidth: 2, borderColor: 'transparent' },
  inputFocused: { borderColor: '#004ac6', backgroundColor: '#ffffff' },
  inputIcon: { marginRight: 12 },
  eyeIcon: { padding: 4 },
  input: { flex: 1, fontSize: 16, color: '#151c27' },

  button: { backgroundColor: '#004ac6', height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#003594', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6, marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#c3c6d6' },
  dividerText: { marginHorizontal: 16, fontSize: 12, fontWeight: '600', color: '#737686' },

  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, backgroundColor: '#f0f3ff', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(195, 198, 215, 0.3)', gap: 12 },
  googleIcon: { width: 22, height: 22 },
  googleButtonText: { fontSize: 16, fontWeight: '600', color: '#151c27' },

  footerLink: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 15, color: '#434655' },
  footerBold: { color: '#004ac6', fontWeight: '700' },

  socialProof: { marginTop: 40, alignItems: 'center', opacity: 0.8 },
  avatarGroup: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#f9f9ff' },
  avatarOverlap: { marginLeft: -12 },
  starsContainer: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  socialProofText: { fontSize: 12, fontWeight: '600', color: '#5c6274', marginLeft: 6 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: Platform.OS === 'ios' ? 48 : 32, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  modalIconContainer: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  modalCloseButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f3ff', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 26, fontWeight: '800', color: '#151c27', marginBottom: 8, letterSpacing: -0.5 },
  modalSubtitle: { fontSize: 15, color: '#434655', marginBottom: 28, lineHeight: 22 },
  modalSecondaryButton: { alignItems: 'center', marginTop: 20, paddingVertical: 8 },
  modalSecondaryText: { fontSize: 14, color: '#737686', fontWeight: '500' },
  matchIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, paddingLeft: 4 },
  matchText: { fontSize: 13, fontWeight: '500' },
});
