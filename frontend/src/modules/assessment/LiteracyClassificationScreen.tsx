import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import ImageQuestionCard from '../../components/ui/ImageQuestionCard';
import LiteracyQuestionCard from '../../components/ui/LiteracyQuestionCard';
import { Button } from '../../components/ui/Button';
import { ChevronLeft } from 'lucide-react-native';

const sampleImages = [
  require('../../assets/healthy_tooth.png'),
  require('../../assets/flossing.png'),
  require('../../assets/cavity.png'),
];

export default function LiteracyClassificationScreen({ navigation }: any) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);

  const handleContinue = () => {
    // Basic heuristics for literacy based on UI
    let literacyLevel = 'Medium';
    if (selectedImage !== 2 || selectedHabit !== 10) {
      literacyLevel = 'Low';
    }
    navigation.navigate('QuestionFlow', { literacyLevel });
  };

  return (
    <ScreenWrapper useSafeArea className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Quick Check</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="text-textMuted mb-6 text-base">Before we begin, tap the picture that shows unhealthy teeth.</Text>

        <View className="mb-10 -mx-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <View className="flex-row space-x-4">
              {sampleImages.map((img, i) => (
                <ImageQuestionCard
                  key={i}
                  image={img}
                  prompt={i === 0 ? 'Brushing' : i === 1 ? 'Floss' : 'Cavity'}
                  selected={selectedImage === i}
                  onSelect={() => setSelectedImage(i)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <Text className="text-text font-bold text-lg mb-4">Which of these is a good habit?</Text>
        <View className="space-y-4 mb-6">
          <LiteracyQuestionCard text="Brush twice a day" selected={selectedHabit === 10} onPress={() => setSelectedHabit(10)} />
          <LiteracyQuestionCard text="Only brush sometimes" selected={selectedHabit === 11} onPress={() => setSelectedHabit(11)} />
          <LiteracyQuestionCard text="Never brush" selected={selectedHabit === 12} onPress={() => setSelectedHabit(12)} />
        </View>
      </ScrollView>

      <View className="px-6 py-4 bg-background border-t border-border/50">
        <Button 
          title="Continue to Assessment" 
          onPress={handleContinue} 
          size="lg"
          disabled={selectedImage === null || selectedHabit === null}
        />
      </View>
    </ScreenWrapper>
  );
}
