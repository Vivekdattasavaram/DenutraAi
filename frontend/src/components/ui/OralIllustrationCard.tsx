import React from 'react';
import { View, Text, Image, Animated } from 'react-native';

export default function OralIllustrationCard({ image, title, caption }: any) {
  const translateY = React.useRef(new Animated.Value(6)).current;
  React.useEffect(() => {
    Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <View className="bg-surface rounded-3xl p-4 border border-white/6 shadow-soft">
        {image ? (
          <Image 
            source={image} 
            defaultSource={require('../../assets/healthy_tooth.png')}
            style={{ width: '100%', height: 140, borderRadius: 14 }} 
            resizeMode="contain" 
          />
        ) : (
          <View className="w-full h-36 rounded-2xl bg-background items-center justify-center mb-4">
            <Text className="text-textMuted">Illustration</Text>
          </View>
        )}
        <Text className="text-text font-semibold text-base mt-3">{title}</Text>
        <Text className="text-textMuted text-sm mt-1">{caption}</Text>
      </View>
    </Animated.View>
  );
}
