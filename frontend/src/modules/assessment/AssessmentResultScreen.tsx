import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { ChevronRight, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { Alert } from 'react-native';
import { BookOpen, Sparkles, TrendingUp, Trophy } from 'lucide-react-native';

import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { AssessmentStackParamList, MainTabParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AssessmentStackParamList, 'AssessmentResult'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function AssessmentResultScreen({ route, navigation }: Props) {
  const { result } = route.params;
  const { assessment, recommendations, learning_path } = result;

  const getLiteracyColor = (level: string) => {
    if (level === "Advanced") return "#10B981"; // green
    if (level === "Intermediate") return "#F59E0B"; // orange
    return "#3B82F6"; // blue
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Low Risk" || risk === "Healthy") return "#10B981"; // green
    if (risk === "Moderate Risk") return "#F59E0B"; // yellow/orange
    return "#EF4444"; // red
  };

  const riskColor = getRiskColor(assessment.risk_level);
  const score = Math.round(assessment.oral_health_score);
  
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Pie chart data for progress ring
  const pieData = [
    { value: score, color: riskColor },
    { value: 100 - score, color: '#1E293B' }
  ];

  // Bar chart data for categories
  const barData = [
    { value: assessment.knowledge_score, label: 'Know', frontColor: '#3B82F6' },
    { value: assessment.habit_score, label: 'Habit', frontColor: '#10B981' },
    { value: assessment.risk_score, label: 'Risk', frontColor: '#F59E0B' },
    { value: assessment.consistency_score, label: 'Consist', frontColor: '#8B5CF6' }
  ];

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <Text className="text-white font-bold text-xl">Your Results</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        
        {/* 1. Literacy Level Priority */}
        <LinearGradient
          colors={['#1E3A8A', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[32px] p-6 mb-8 shadow-soft items-center"
        >
          <View className="mb-2">
            <Text className="text-white/80 font-medium text-sm uppercase tracking-widest text-center mb-2">Oral Health Literacy Level</Text>
            <Text className="text-4xl font-black text-center" style={{ color: getLiteracyColor(assessment.literacy_classification_output || 'Beginner') }}>
              {assessment.literacy_classification_output || 'Beginner'}
            </Text>
          </View>
          
          <View className="w-full h-[1px] bg-white/10 my-6" />

          {/* Mini Stats Bar */}
          <View className="flex-row w-full justify-between items-center px-2">
              <View className="items-center">
                  <Text className="text-white/60 text-xs uppercase tracking-wider mb-1">Score</Text>
                  <Text className="text-white font-bold text-lg">{score}/100</Text>
              </View>
              <View className="w-[1px] h-8 bg-white/10" />
              <View className="items-center">
                  <Text className="text-white/60 text-xs uppercase tracking-wider mb-1">Risk</Text>
                  <Text className="font-bold text-lg" style={{ color: riskColor }}>{assessment.risk_level}</Text>
              </View>
              <View className="w-[1px] h-8 bg-white/10" />
              <TouchableOpacity 
                className="items-center"
                onPress={() => Alert.alert(
                  "AI Confidence",
                  "This percentage represents the AI model's statistical certainty about your assessment based on analyzing thousands of similar patient profiles."
                )}
              >
                  <View className="flex-row items-center mb-1">
                    <Text className="text-white/60 text-xs uppercase tracking-wider mr-1">AI Conf</Text>
                    <Info size={12} color="#94A3B8" />
                  </View>
                  <Text className="text-white font-bold text-lg">{(assessment.ml_confidence * 100).toFixed(0)}%</Text>
              </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* 2. Personalized Learning Path */}
        {learning_path && learning_path.recommended_path && learning_path.recommended_path.length > 0 && (
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-text">Your Learning Path</Text>
              <View className="bg-primary/20 px-3 py-1 rounded-full flex-row items-center">
                <Sparkles size={14} color="#3B82F6" />
                <Text className="text-primary text-xs font-bold ml-1">Personalized</Text>
              </View>
            </View>
            
            <View className="bg-surface p-5 rounded-3xl border border-white/5 shadow-soft">
              <Text className="text-textMuted text-sm mb-4">Based on your weak areas, we've organized a custom curriculum for you.</Text>
              
              {learning_path.recommended_path.slice(0, 3).map((mod: any, idx: number) => (
                <View key={idx} className="flex-row items-center mb-3">
                  <View className="w-8 h-8 rounded-full bg-background items-center justify-center border border-white/5 mr-3">
                    <Text className="text-white font-bold">{idx + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{mod.title}</Text>
                    <Text className="text-textMuted text-xs">{mod.estimated_minutes} mins • {mod.difficulty_tier}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sub-scores Chart */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-text mb-6">Category Breakdown</Text>
          <View className="items-center bg-surface p-4 rounded-3xl border border-white/5 shadow-soft">
              <BarChart
                data={barData}
                width={280}
                height={150}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                hideYAxisText
                barWidth={30}
                barBorderRadius={4}
                spacing={35}
                xAxisLabelTextStyle={{ color: '#94A3B8', fontSize: 11, fontWeight: 'bold' }}
              />
          </View>
        </View>

        {/* Recommendations */}
        <View className="mb-10">
          <Text className="text-xl font-bold text-text mb-4">Personalized Recommendations</Text>
          {recommendations.map((rec: any, idx: number) => (
            <View key={idx} className="bg-surface p-4 rounded-3xl mb-4 border border-white/5 flex-row items-start shadow-soft">
              <View className="w-12 h-12 rounded-2xl bg-surfaceAlt items-center justify-center mr-4">
                <Text className="text-2xl">
                  {rec.action_type === 'habit' ? '🪥' : rec.action_type === 'risk' ? '⚠️' : '🧠'}
                </Text>
              </View>
              <View className="flex-1 pt-1">
                <Text className="font-bold text-text text-base mb-1">{rec.title}</Text>
                <Text className="text-textMuted text-sm leading-snug">{rec.description}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      <View className="px-6 py-4 bg-background border-t border-border/50">
        <Button 
          title="Start Your Learning Path" 
          onPress={() => navigation.navigate('LearnTab')} 
          size="lg"
        />
        <TouchableOpacity className="mt-4 items-center" onPress={() => navigation.navigate('Dashboard')}>
          <Text className="text-white/60 font-medium">Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
