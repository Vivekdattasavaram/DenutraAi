import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, PlayCircle, CheckCircle } from 'lucide-react-native';

export default function LessonDetailsScreen({ navigation, route }: any) {
  const lessonId = route?.params?.lessonId;

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl flex-1">Brushing 101</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="h-64 bg-surfaceAlt w-full relative items-center justify-center mb-6">
          <Image source={require('../../assets/healthy_tooth.png')} className="w-full h-full opacity-50" resizeMode="cover" />
          <View className="absolute inset-0 bg-background/40 items-center justify-center">
            <TouchableOpacity className="w-16 h-16 bg-primary rounded-full items-center justify-center pl-1 shadow-soft">
              <PlayCircle size={32} color="#ffffff" fill="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 pb-10">
          <Text className="text-2xl font-bold text-white mb-2">The Perfect Brush</Text>
          <Text className="text-textMuted text-base mb-6 leading-relaxed">
            Follow these simple steps to ensure you are effectively removing plaque without damaging your enamel.
          </Text>

          <View className="space-y-4 mb-8">
            <StepCard step={1} text="Hold your brush at a 45-degree angle to your gums." />
            <StepCard step={2} text="Use short, tooth-wide strokes back and forth." />
            <StepCard step={3} text="Brush the outer, inner, and chewing surfaces." />
            <StepCard step={4} text="Don't forget to brush your tongue!" />
          </View>

          <Button title="Mark as Completed" onPress={() => navigation.goBack()} size="lg" />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function StepCard({ step, text }: { step: number, text: string }) {
  return (
    <View className="bg-surface p-4 rounded-2xl border border-white/5 flex-row items-start shadow-soft mb-3">
      <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-4 border border-primary/30">
        <Text className="text-primary font-bold">{step}</Text>
      </View>
      <Text className="text-white font-medium text-base flex-1 pt-1 leading-snug">{text}</Text>
    </View>
  );
}
