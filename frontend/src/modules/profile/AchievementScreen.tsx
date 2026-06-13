import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ChevronLeft } from 'lucide-react-native';

const SAMPLE_ACHIEVEMENTS = [
  { id: 'a1', title: '7-Day Streak', emoji: '🏆', date: '2026-05-20', description: 'Completed brushing twice daily for 7 days.' },
  { id: 'a2', title: 'First Assessment', emoji: '📝', date: '2026-05-15', description: 'Finished your first oral health assessment.' },
  { id: 'a3', title: 'Flossing Habit', emoji: '🪥', date: '2026-04-30', description: 'Flossed daily for 10 consecutive days.' },
  { id: 'a4', title: 'Gum Care Badge', emoji: '❤️', date: '2026-03-12', description: 'Improved gum health score by 15%.' },
];

export default function AchievementScreen({ navigation }: any) {
  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View className="flex-row items-center px-6 pt-2 pb-4 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Achievements</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6 pb-10" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {SAMPLE_ACHIEVEMENTS.map(a => (
            <View key={a.id} className="w-[48%] bg-surface p-5 rounded-3xl mb-4 border border-white/5 shadow-soft items-center justify-center relative overflow-hidden">
              <View className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full" />
              <View className="w-16 h-16 bg-surfaceAlt rounded-full items-center justify-center mb-4 border border-white/10">
                <Text className="text-3xl">{a.emoji}</Text>
              </View>
              <Text className="text-white font-bold text-center mb-1 text-base">{a.title}</Text>
              <Text className="text-textMuted text-xs text-center mb-3 leading-tight">{a.description}</Text>
              <View className="bg-background/50 px-3 py-1 rounded-full border border-white/5 mt-auto">
                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{a.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
