import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function LessonPlayerScreen() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(0);

  const options = [
    "Where is the airport?",
    "Where is the hotel?",
    "How is the weather?",
    "Is it the airport?"
  ];

  const handleCheck = () => {
    // Navigate back to learn or show success modal
    // For now, let's just go back
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header & Progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#737685" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '40%' }]} />
          </View>
        </View>

        <View style={styles.healthContainer}>
          <Text style={styles.healthText}>5</Text>
          <MaterialIcons name="favorite" size={20} color="#ba1a1a" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question Area */}
        <Text style={styles.questionTitle}>Translate this sentence</Text>
        
        <View style={styles.chatSection}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida/AP1WRLv37KfiLe1QoipvZkTiV2ggv8s-3GlLsr3k8EiEC27QuLUkDK8P1zJk2RY2avHJcQL_KUuRxbNELQLknzRixSFVYD1ZTjZakQGVle4UBeAf4PhUuHLVqzZgXMq-Bs2FYEhqLvUdBUT8Tu--nNh2geyLA_DdTdkgBTjBaAfVLELP7RMVBnzLDao8fiblgG99TMTsoyKmsrcnVkR2pZIBEs58d6-dWwvPUCCTuXwfMzpKLkl7lJXJrYeoJQ' }}
            style={styles.avatar}
          />
          <View style={styles.bubbleContainer}>
            <View style={styles.bubbleTail} />
            <Text style={styles.bubbleText}>¿Dónde está el aeropuerto?</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            return (
              <TouchableOpacity 
                key={index}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelectedAnswer(index)}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={24} color="#004ac6" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.checkButton}
          onPress={handleCheck}
          activeOpacity={0.9}
        >
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressBarBg: {
    height: 16,
    backgroundColor: '#e7e7f2',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#004ac6',
    borderRadius: 8,
    shadowColor: '#1b55d0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004ac6',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004ac6',
    marginBottom: 32,
  },
  chatSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  bubbleContainer: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    left: -10,
    top: '50%',
    marginTop: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 14,
    borderRightColor: '#ffffff',
  },
  bubbleText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#151c27',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: '#004ac6',
    backgroundColor: '#f3f3fd',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#434654',
  },
  optionTextSelected: {
    color: '#151c27',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 249, 255, 0.9)',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 198, 214, 0.4)',
  },
  checkButton: {
    backgroundColor: '#004ac6',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  checkButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
