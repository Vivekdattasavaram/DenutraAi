import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';

export default function ImageQuestionCard({ image, prompt, onSelect, selected }: any) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.98, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onSelect && onSelect();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        className={`bg-surface rounded-2xl p-3 items-center ${selected ? 'border-2 border-primary' : 'border border-white/6'}`}
      >
        {image ? (
          <Image 
            source={image} 
            defaultSource={require('../../assets/healthy_tooth.png')}
            style={{ width: 144, height: 112, borderRadius: 12 }} 
            resizeMode="cover" 
          />
        ) : (
          <View className="w-36 h-28 rounded-xl bg-background items-center justify-center">
            <Text className="text-textMuted text-sm">Image</Text>
          </View>
        )}
        <Text className="text-text font-semibold text-sm text-center mt-3">{prompt}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
