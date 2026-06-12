import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

export default function LiteracyQuestionCard({ text, onPress, selected }: any) {
  const opacity = React.useRef(new Animated.Value(1)).current;
  const handle = () => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0.6, duration: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onPress && onPress();
  };

  return (
    <Animated.View style={{ opacity }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handle}
        className={`bg-surface rounded-2xl p-4 ${selected ? 'border-2 border-primary' : 'border border-white/6'}`}
      >
        <Text className="text-text font-bold text-base">{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
