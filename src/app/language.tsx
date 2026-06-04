import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'ru', label: 'Русский (Russian)' },
    { id: 'az', label: 'Azərbaycan (Azerbaijani)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Language</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Language Selection Card */}
        <View style={styles.cardContainer}>
          {languages.map((lang, index) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <View key={lang.id}>
                <TouchableOpacity
                  style={[styles.row, isSelected && styles.rowSelected]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedLanguage(lang.id)}
                >
                  <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>
                    {lang.label}
                  </Text>
                  {isSelected && (
                    <MaterialIcons name="check" size={24} color="#003594" />
                  )}
                </TouchableOpacity>
                {index < languages.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        {/* Footnote */}
        <View style={styles.footnoteContainer}>
          <Text style={styles.footnoteText}>
            Changing the app language will not change your learning language (English).
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f3ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: 'rgba(240, 243, 255, 0.9)',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    width: 40,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#151c27',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 16,
    paddingTop: 32,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    overflow: 'hidden',
    shadowColor: '#151c27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 56,
    backgroundColor: '#ffffff',
  },
  rowSelected: {
    backgroundColor: 'rgba(0, 53, 148, 0.05)',
  },
  rowText: {
    fontSize: 16,
    color: '#151c27',
  },
  rowTextSelected: {
    color: '#003594',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(195, 198, 214, 0.3)',
    marginLeft: 16,
  },
  footnoteContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  footnoteText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  }
});
