import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import ProfileScreen from '../modules/profile/ProfileScreen';
import NotificationsScreen from '../modules/profile/NotificationsScreen';
import AchievementScreen from '../modules/profile/AchievementScreen';
import SecurityScreen from '../modules/profile/SecurityScreen';
import PrivacyPolicyScreen from '../modules/profile/PrivacyPolicyScreen';



const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' // User asked for 'slide' for Profile/Settings
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Achievement" component={AchievementScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
}
