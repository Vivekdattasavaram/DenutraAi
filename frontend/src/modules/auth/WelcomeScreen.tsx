import React from 'react';
import { View, Text } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <ScreenWrapper className="flex-1 bg-background justify-center items-center px-6">
      <View className="w-32 h-32 bg-secondary/20 rounded-full items-center justify-center mb-8 border-4 border-secondary/30">
        <Text className="text-6xl">🎉</Text>
      </View>
      <Text className="text-3xl font-bold text-text mb-4 text-center">Account Created!</Text>
      <Text className="text-textMuted text-center text-lg leading-7 mb-10">
        You are now ready to start your journey to better oral health.
      </Text>
      <Button 
        title="Go to Dashboard" 
        onPress={() => navigation.replace('Dashboard')} 
        size="lg"
        className="w-full"
      />
    </ScreenWrapper>
  );
}
