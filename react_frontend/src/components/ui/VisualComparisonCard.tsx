import React from 'react';
import { View, Text, Image, Animated } from 'react-native';

export default function VisualComparisonCard({ left, right, leftLabel, rightLabel }: any) {
  const fade = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fade }}>
      <View className="bg-surface rounded-2xl p-3 border border-white/6 flex-row items-center justify-between gap-3">
        <View className="flex-1 items-center">
          {left ? (
            <Image 
              source={left} 
              defaultSource={require('../../assets/healthy_tooth.png')}
              style={{ width: 120, height: 90, borderRadius: 10 }} 
              resizeMode="cover" 
            />
          ) : (
            <View className="w-28 h-24 rounded-xl bg-background items-center justify-center">
              <Text className="text-textMuted">Left</Text>
            </View>
          )}
          <Text className="text-textMuted text-sm mt-2">{leftLabel}</Text>
        </View>
        <View className="flex-1 items-center">
          {right ? (
            <Image 
              source={right} 
              defaultSource={require('../../assets/cavity.png')}
              style={{ width: 120, height: 90, borderRadius: 10 }} 
              resizeMode="cover" 
            />
          ) : (
            <View className="w-28 h-24 rounded-xl bg-background items-center justify-center">
              <Text className="text-textMuted">Right</Text>
            </View>
          )}
          <Text className="text-textMuted text-sm mt-2">{rightLabel}</Text>
        </View>
      </View>
    </Animated.View>
  );
}
