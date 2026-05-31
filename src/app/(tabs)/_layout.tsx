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
          borderTopColor: '#e2e2ec',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 72,
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
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <MaterialIcons name="menu-book" size={24} color={focused ? '#ffffff' : '#737686'} />
              <Text style={[styles.tabText, focused && styles.tabTextActive]}>Learn</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="speak"
        options={{
          title: 'Speak',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <MaterialIcons name="record-voice-over" size={24} color={focused ? '#ffffff' : '#737686'} />
              <Text style={[styles.tabText, focused && styles.tabTextActive]}>Speak</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="league"
        options={{
          title: 'League',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <MaterialIcons name="emoji-events" size={24} color={focused ? '#ffffff' : '#737686'} />
              <Text style={[styles.tabText, focused && styles.tabTextActive]}>League</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <MaterialIcons name="calendar-today" size={24} color={focused ? '#ffffff' : '#737686'} />
              <Text style={[styles.tabText, focused && styles.tabTextActive]}>Progress</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <MaterialIcons name="account-circle" size={24} color={focused ? '#ffffff' : '#737686'} />
              <Text style={[styles.tabText, focused && styles.tabTextActive]}>Profile</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: Platform.OS === 'ios' ? 12 : 8,
  },
  tabItemActive: {
    backgroundColor: '#004ac6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737686',
    marginTop: 2,
  },
  tabTextActive: {
    color: '#ffffff',
  },
});
