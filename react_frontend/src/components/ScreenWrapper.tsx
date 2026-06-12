import React from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../utils/cn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  useSafeArea?: boolean;
}

export function ScreenWrapper({
  children,
  className,
  useSafeArea = true,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = useSafeArea && Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

  return (
    <LinearGradient
      colors={['#07101F', '#0D1B34', '#111F34']}
      style={styles.container}
    >
      <View
        className={cn('flex-1 bg-transparent', className)}
        style={{
          paddingTop: useSafeArea ? insets.top ?? paddingTop : 0,
          paddingBottom: useSafeArea ? insets.bottom : 0,
        }}
      >
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07101F',
  },
});
