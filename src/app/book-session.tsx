import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function BookSessionScreen() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [selectedDuration, setSelectedDuration] = useState(45);

  const dates = [
    { day: 'Mon', num: 12 },
    { day: 'Tue', num: 13 },
    { day: 'Wed', num: 14 },
    { day: 'Thu', num: 15, disabled: true },
    { day: 'Fri', num: 16 },
    { day: 'Sat', num: 17 },
  ];

  const timeSlots = [
    '09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
  ];

  const durations = [45, 60, 90];

  const handleConfirm = () => {
    router.push({
      pathname: '/active-call',
      params: { tutorName: 'Emma Watson', tutorId: 'tutor-emma', callType: 'private' }
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/speak')} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#004ac6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vividly</Text>
          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida/AP1WRLuiQwZU8XPEwcJCGu2caQWDvXy0X47fpdErBGFeaFjb-r4j16ic3VQht_RYRJbi-umGuG_OqF4g8AAVgJVJ9mZAiDzdZuuFoFJC8PKI_hxa6Oq_B3eenmL-P8N6QYAxCLS1UiucRZpuL_jpRz3BQILUS--Rkow4n7j8DyA903qtOZzAMDH1rYqip_I91QGSMPS6Wr2p0q4TOHMNHWA8bRpHDJS0yBdrXLirbt6jFyPyBRglkMXBCYjoh-0' }} 
              style={styles.profileImage}
            />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Tutor Summary Card */}
        <View style={styles.tutorCard}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida/AP1WRLuiQwZU8XPEwcJCGu2caQWDvXy0X47fpdErBGFeaFjb-r4j16ic3VQht_RYRJbi-umGuG_OqF4g8AAVgJVJ9mZAiDzdZuuFoFJC8PKI_hxa6Oq_B3eenmL-P8N6QYAxCLS1UiucRZpuL_jpRz3BQILUS--Rkow4n7j8DyA903qtOZzAMDH1rYqip_I91QGSMPS6Wr2p0q4TOHMNHWA8bRpHDJS0yBdrXLirbt6jFyPyBRglkMXBCYjoh-0' }}
            style={styles.tutorAvatar}
          />
          <View style={styles.tutorInfo}>
            <View style={styles.tutorHeader}>
              <Text style={styles.tutorName}>Emma Watson</Text>
              <View style={styles.tutorBadge}>
                <Text style={styles.tutorBadgeText}>TOP TUTOR</Text>
              </View>
            </View>
            <Text style={styles.tutorSubtitle}>English Specialist • Oxford Alumna</Text>
            
            <View style={styles.tutorStats}>
              <View style={styles.statItem}>
                <MaterialIcons name="star" size={14} color="#751f00" />
                <Text style={styles.statText}>4.9 (124 sessions)</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="payments" size={14} color="#003594" />
                <Text style={styles.statText}>$45/hr</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date Selector */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <Text style={styles.sectionValue}>October 2023</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
            {dates.map((item, index) => {
              const isSelected = selectedDate === item.num;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.datePill, 
                    isSelected && styles.datePillSelected,
                    item.disabled && styles.datePillDisabled
                  ]}
                  disabled={item.disabled}
                  onPress={() => setSelectedDate(item.num)}
                >
                  <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>{item.day}</Text>
                  <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>{item.num}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Times</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time, index) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity 
                  key={index}
                  style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                  onPress={() => setSelectedTime(time)}
                >
                  {isSelected && <MaterialIcons name="schedule" size={16} color="#151c27" style={{marginRight: 4}} />}
                  <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>{time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Duration</Text>
          <View style={styles.durationToggle}>
            {durations.map((duration, index) => {
              const isSelected = selectedDuration === duration;
              return (
                <TouchableOpacity 
                  key={index}
                  style={[styles.durationItem, isSelected && styles.durationItemSelected]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text style={[styles.durationText, isSelected && styles.durationTextSelected]}>
                    {duration} Minutes
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Tip */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <View style={styles.tipCard}>
            <MaterialIcons name="lightbulb" size={24} color="#003594" style={styles.tipIcon} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Emma's Quick Tip</Text>
              <Text style={styles.tipText}>
                "For our first session, please bring a list of your specific learning goals or a piece of writing you're currently working on. It helps us maximize our time together!"
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalPrice}>$45.00</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#ffffff" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ff',
  },
  headerSafeArea: {
    backgroundColor: 'rgba(250, 248, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 198, 214, 0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004ac6',
    letterSpacing: -0.5,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(195, 198, 214, 0.3)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  tutorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.2)',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  tutorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tutorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151c27',
    marginRight: 8,
  },
  tutorBadge: {
    backgroundColor: '#dbe1ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tutorBadgeText: {
    color: '#003ea8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tutorSubtitle: {
    fontSize: 14,
    color: '#434654',
    marginBottom: 8,
  },
  tutorStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#151c27',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#151c27',
  },
  sectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004ac6',
  },
  datesRow: {
    paddingRight: 16,
    gap: 12,
  },
  datePill: {
    width: 64,
    height: 80,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
  },
  datePillSelected: {
    backgroundColor: '#004ac6',
    borderColor: '#004ac6',
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  datePillDisabled: {
    opacity: 0.5,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '700',
    color: '#434654',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateDaySelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateNum: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151c27',
  },
  dateNumSelected: {
    color: '#ffffff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.4)',
    flexBasis: '47%',
  },
  timeSlotSelected: {
    backgroundColor: '#dce2f3',
    borderColor: '#004ac6',
    borderWidth: 2,
    paddingVertical: 11, // Adjust for thicker border
    paddingHorizontal: 15,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#151c27',
  },
  timeSlotTextSelected: {
    color: '#151c27',
  },
  durationToggle: {
    flexDirection: 'row',
    backgroundColor: '#e7e7f2',
    borderRadius: 24,
    padding: 6,
    marginTop: 16,
  },
  durationItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  durationItemSelected: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434654',
  },
  durationTextSelected: {
    color: '#151c27',
  },
  tipCard: {
    backgroundColor: 'rgba(219, 225, 255, 0.3)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(180, 197, 255, 0.4)',
  },
  tipIcon: {
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003594',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#434654',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 198, 214, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  footerInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#434654',
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004ac6',
  },
  confirmButton: {
    backgroundColor: '#004ac6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    height: 56,
    borderRadius: 28,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    flex: 1.5,
    marginLeft: 16,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  }
});
