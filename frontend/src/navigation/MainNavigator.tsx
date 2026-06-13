import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import AssessmentNavigator from './AssessmentNavigator';
import LearningNavigator from './LearningNavigator';
import ProfileNavigator from './ProfileNavigator';
import ChatbotNavigator from './ChatbotNavigator';
import { Home, MessageCircle, BookOpen, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#07101F',
          borderTopColor: '#15263C',
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 20,
          elevation: 20,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 4,
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, React.ReactNode> = {
            HomeTab: <Home color={color} size={size} />,
            AssistantTab: <MessageCircle color={color} size={size} />,
            LearnTab: <BookOpen color={color} size={size} />,
            ProfileTab: <User color={color} size={size} />,
          };
          return icons[route.name] ?? null;
        },
        tabBarActiveBackgroundColor: '#0F172A',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={AssessmentNavigator} 
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="AssistantTab" 
        component={ChatbotNavigator} 
        options={{
          tabBarLabel: 'Assistant',
        }}
      />
      <Tab.Screen 
        name="LearnTab" 
        component={LearningNavigator} 
        options={{
          tabBarLabel: 'Learn',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileNavigator} 
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
