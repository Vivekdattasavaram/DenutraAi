import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { LineChart } from 'react-native-gifted-charts';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function OralHealthScoreScreen({ route, navigation }: any) {
  const score = route?.params?.score ?? 72;
  const history = route?.params?.history ?? [60, 65, 70, 72];
  const ml_confidence = route?.params?.confidence ?? 0.85;

  const chartData = history.map((v: number, i: number) => ({ 
    value: v, 
    label: `W${i + 1}`,
    dataPointText: v.toString()
  }));

  return (
    <ScreenWrapper useSafeArea className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Oral Health Score</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        
        <LinearGradient
          colors={['#1E3A8A', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[32px] p-6 mb-8 shadow-soft items-center"
        >
          <Text className="text-white/80 font-semibold text-lg mb-2">Current Score</Text>
          <View className="flex-row items-baseline mb-4">
            <Text className="text-7xl font-black text-white tracking-tighter">{Math.round(score)}</Text>
            <Text className="text-white/60 font-medium text-xl ml-2">/ 100</Text>
          </View>
          
          <View className="w-full bg-white/10 rounded-2xl p-4 flex-row justify-between items-center mt-2 border border-white/5">
            <View>
              <Text className="text-white font-semibold">ML Confidence</Text>
              <Text className="text-white/60 text-xs">Based on 20 data points</Text>
            </View>
            <Text className="text-accent font-bold text-xl">{Math.round(ml_confidence * 100)}%</Text>
          </View>
        </LinearGradient>

        <View className="bg-surface rounded-3xl p-6 mb-6 border border-white/5 shadow-soft">
          <Text className="text-text font-bold text-lg mb-6">Progress Trend</Text>
          <View className="items-center overflow-hidden">
            <LineChart 
              data={chartData} 
              color="#3B82F6" 
              thickness={4} 
              dataPointsColor="#22C55E" 
              hideRules 
              xAxisColor="transparent" 
              yAxisColor="transparent" 
              yAxisTextStyle={{ color: '#94A3B8' }} 
              xAxisLabelTextStyle={{ color: '#94A3B8', fontSize: 12 }}
              height={160} 
              noOfSections={4} 
              maxValue={100} 
              isAnimated
            />
          </View>
        </View>

        <View className="bg-surface rounded-3xl p-5 border border-white/5 shadow-soft mb-6">
          <Text className="text-text font-bold text-lg mb-2">Smart Guidance</Text>
          <Text className="text-textMuted text-base leading-relaxed">
            Your score has steadily improved over the past 4 weeks. Keep brushing gently for 2 minutes and prioritize flossing tonight.
          </Text>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}
