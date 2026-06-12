import React, { useEffect } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export default function SplashScreen({ navigation }: any) {
  const scale = new Animated.Value(0);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to next screen after delay
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper className="flex-1 bg-background items-center justify-center">
      <Animated.View 
        style={{ transform: [{ scale }], opacity }}
        className="items-center"
      >
        <View className="w-32 h-32 bg-primary/20 rounded-full items-center justify-center mb-6">
          <Text className="text-6xl">🦷</Text>
        </View>
        <Text className="text-4xl font-black text-text tracking-widest">DENTURA</Text>
        <Text className="text-textMuted tracking-widest mt-2">ORAL HEALTH LITERACY</Text>
      </Animated.View>
    </ScreenWrapper>
  );
}
