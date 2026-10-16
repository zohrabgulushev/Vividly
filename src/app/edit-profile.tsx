import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { updateProfile } from '@/services/profiles';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id ?? null);
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setUsername(profile.email ? profile.email.split('@')[0] : '');
      setEmail(profile.email || '');
      setBio(profile.goal || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const { error } = await updateProfile(user.id, {
        full_name: name,
        email: email,
        goal: bio
      });

      if (error) throw error;
      setSaving(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile') }
      ]);
      if (Platform.OS === 'web') {
        setTimeout(() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/profile');
        }, 1200);
      }
    } catch (err: any) {
      setSaving(false);
      console.error('Error saving profile:', err);
      Alert.alert('Error', err.message || 'Failed to update profile.');
    }
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#003594" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile')} style={styles.headerButton} disabled={saving}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vividly Profile</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#003594" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkSq04rsTgnmiXolrMBhPOKXmLbbhFEI0wS-JknZdodcU2Jmgh6wgO8NKiy5CyVxcGoml27VPt0_KqrZloRojiqNiBbydTNtOy6AM1ZOvBlzz8Loe5ykFbswooFUj-ov4gq60ol3wmNdw8wGqrIGwrDAXOUO9oiODi67tAgij5xPnkYmFVeV3q-Hx9fzTyIRSI-2zu0vQP9ZgDxoQwij1de_ISodBv5kruqc2tJQoFKqEZDeWtfToV1QprGpN9w4ASqNJwKXxH1HnL' }}
              style={styles.avatar}
            />
            <View style={styles.cameraOverlay}>
              <MaterialIcons name="photo-camera" size={32} color="#ffffff" />
            </View>
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>CHANGE PROFILE PICTURE</Text>
        </View>

        {/* Unified Form Card */}
        <View style={styles.formCard}>
          {/* Field: Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#c3c6d6"
            />
          </View>
          <View style={styles.divider} />

          {/* Field: Username */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Username</Text>
            <View style={styles.usernameRow}>
              <Text style={styles.usernameAt}>@</Text>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                value={username}
                onChangeText={setUsername}
                placeholder="username"
                placeholderTextColor="#c3c6d6"
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={styles.divider} />

          {/* Field: Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="#c3c6d6"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.divider} />

          {/* Field: Bio */}
          <View style={[styles.fieldContainer, { paddingBottom: 16 }]}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about your learning journey..."
              placeholderTextColor="#c3c6d6"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Learning Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <MaterialIcons name="local-fire-department" size={24} color="#003594" style={styles.statIcon} />
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialIcons name="workspace-premium" size={24} color="#003594" style={styles.statIcon} />
            <Text style={styles.statValue}>Gold</Text>
            <Text style={styles.statLabel}>Current League</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.deleteButton}>
            <MaterialIcons name="delete-forever" size={20} color="#ba1a1a" />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
          <Text style={styles.dangerText}>Once deleted, your progress and data cannot be recovered.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: 'rgba(249, 249, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 198, 214, 0.4)',
    zIndex: 10,
  },
  headerButton: {
    padding: 8,
    minWidth: 64,
  },
  cancelText: {
    fontSize: 16,
    color: '#434654',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003594',
    textAlign: 'right',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003594',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: '#e7eefe',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(21, 28, 39, 0.3)',
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0, // Would need animated state for hover, keeping static hidden for mobile
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#003594',
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f9f9ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  changePhotoText: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  fieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#003594',
    marginBottom: 4,
  },
  textInput: {
    fontSize: 16,
    color: '#151c27',
    padding: 0, // Remove default padding on Android
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameAt: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 2,
  },
  textArea: {
    minHeight: 60,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(195, 198, 214, 0.2)',
    marginHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f0f3ff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.2)',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  dangerZone: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 198, 214, 0.2)',
    paddingTop: 24,
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 8,
  },
  deleteButtonText: {
    color: '#ba1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerText: {
    fontSize: 12,
    color: '#737685',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
