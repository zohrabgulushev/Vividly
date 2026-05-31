import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#f0f0fb',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingHorizontal: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                <MaterialIcons name="menu-book" size={24} color={focused ? '#ffffff' : '#737686'} />
                <Text style={[styles.tabText, focused && styles.tabTextActive]}>Learn</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="speak"
        options={{
          title: 'Speak',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                <MaterialIcons name="record-voice-over" size={24} color={focused ? '#ffffff' : '#737686'} />
                <Text style={[styles.tabText, focused && styles.tabTextActive]}>Speak</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="league"
        options={{
          title: 'League',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                <MaterialIcons name="emoji-events" size={24} color={focused ? '#ffffff' : '#737686'} />
                <Text style={[styles.tabText, focused && styles.tabTextActive]}>League</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                <MaterialIcons name="calendar-today" size={24} color={focused ? '#ffffff' : '#737686'} />
                <Text style={[styles.tabText, focused && styles.tabTextActive]}>Progress</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                <MaterialIcons name="account-circle" size={24} color={focused ? '#ffffff' : '#737686'} />
                <Text style={[styles.tabText, focused && styles.tabTextActive]}>Profile</Text>
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    marginTop: Platform.OS === 'ios' ? 16 : 0, // Align properly on iOS
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    minWidth: 64,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tabItemActive: {
    backgroundColor: '#2563eb', // Matches the exact blue from the screenshot
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#737686',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: '#ffffff',
  },
});
