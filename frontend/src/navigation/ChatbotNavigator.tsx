import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatbotStackParamList } from './types';
import ChatbotHomeScreen from '../modules/chatbot/ChatbotHomeScreen';
import ChatbotConversationScreen from '../modules/chatbot/ChatbotConversationScreen';

const Stack = createNativeStackNavigator<ChatbotStackParamList>();

export default function ChatbotNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' // User asked for 'slide' for Chatbot
      }}
    >
      <Stack.Screen name="ChatbotHome" component={ChatbotHomeScreen} />
      <Stack.Screen name="ChatbotConversation" component={ChatbotConversationScreen} />
    </Stack.Navigator>
  );
}
