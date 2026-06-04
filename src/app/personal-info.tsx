import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PersonalInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal info</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Introduction */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Account details</Text>
          <Text style={styles.heroSubtitle}>Manage your public profile and private security information for the Vividly platform.</Text>
        </View>

        {/* Basic Details Group */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          
          <View style={styles.cardGroup}>
            {/* Legal Name */}
            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
              <View style={styles.listIconBox}>
                <MaterialIcons name="person" size={24} color="#003594" />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listLabel}>LEGAL NAME</Text>
                <Text style={styles.listValue}>Alex Rivera</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#737685" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            {/* Email */}
            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
              <View style={styles.listIconBox}>
                <MaterialIcons name="mail" size={24} color="#003594" />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listLabel}>EMAIL ADDRESS</Text>
                <Text style={styles.listValue}>alex.rivera@vividly.app</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#737685" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            {/* Phone */}
            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
              <View style={styles.listIconBox}>
                <MaterialIcons name="call" size={24} color="#003594" />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listLabel}>PHONE NUMBER</Text>
                <Text style={styles.listValue}>+1 (555) 123-4567</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#737685" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Linked Accounts Group */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Linked Accounts</Text>
            <TouchableOpacity>
              <Text style={styles.manageAllText}>Manage all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.linkedAccountsGrid}>
            {/* Google Card */}
            <View style={styles.linkedCard}>
              <View style={styles.linkedIconBox}>
                <MaterialIcons name="person" size={24} color="#151c27" />
              </View>
              <View style={styles.linkedInfo}>
                <Text style={styles.linkedTitle}>Google</Text>
                <Text style={styles.linkedSubtitle}>Connected as alex.riv@gmail.com</Text>
              </View>
              <TouchableOpacity style={styles.disconnectButton}>
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>

            {/* Apple Card */}
            <View style={styles.linkedCard}>
              <View style={styles.linkedIconBox}>
                <MaterialIcons name="apps" size={24} color="#151c27" />
              </View>
              <View style={styles.linkedInfo}>
                <Text style={styles.linkedTitle}>Apple</Text>
                <Text style={styles.linkedSubtitle}>Securely linked with iCloud</Text>
              </View>
              <TouchableOpacity style={styles.disconnectButton}>
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Security Group */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.cardGroup}>
            {/* Password */}
            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
              <View style={[styles.listIconBox, { backgroundColor: 'rgba(186, 26, 26, 0.1)' }]}>
                <MaterialIcons name="lock" size={24} color="#ba1a1a" />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listValueStrong}>Change Password</Text>
                <Text style={styles.listSubtitle}>Last changed 4 months ago</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#737685" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            {/* 2FA */}
            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
              <View style={styles.listIconBox}>
                <MaterialIcons name="verified-user" size={24} color="#003594" />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listValueStrong}>Two-step verification</Text>
                <View style={styles.recommendedRow}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.recommendedText}>Recommended to enable</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#737685" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            {/* Deactivate */}
            <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
              <View style={[styles.listIconBox, { backgroundColor: '#ffdad6' }]}>
                <MaterialIcons name="no-accounts" size={24} color="#ba1a1a" />
              </View>
              <View style={styles.listInfo}>
                <Text style={[styles.listValueStrong, { color: '#ba1a1a' }]}>Deactivate account</Text>
                <Text style={styles.listSubtitle}>Temporary disable your profile</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#737685" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f3ff', // Slightly darker background for contrast
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: 'rgba(240, 243, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 198, 214, 0.4)',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    width: 40,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003594',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#151c27',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 17,
    color: '#434654',
    lineHeight: 24,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 16,
  },
  cardGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f8',
    overflow: 'hidden',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbe1ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listInfo: {
    flex: 1,
  },
  listLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  listValue: {
    fontSize: 17,
    color: '#151c27',
  },
  listValueStrong: {
    fontSize: 17,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 15,
    color: '#434654',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f8',
    marginLeft: 72, // Aligned with text
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  manageAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003594',
    marginBottom: 4,
  },
  linkedAccountsGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  linkedCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f8',
    alignItems: 'flex-start',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 2,
  },
  linkedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  linkedInfo: {
    marginBottom: 16,
  },
  linkedTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#151c27',
    marginBottom: 4,
  },
  linkedSubtitle: {
    fontSize: 15,
    color: '#434654',
  },
  disconnectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c3c6d6',
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#151c27',
  },
  recommendedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9c2e02',
  },
  recommendedText: {
    fontSize: 15,
    color: '#9c2e02',
  },
  saveContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#004ac6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
  }
});
