import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ChevronLeft, Play, Clock, CheckCircle, Lightbulb, Target, Volume2 } from 'lucide-react-native';
import { apiClient } from '../../services/api';
import { Button } from '../../components/ui/Button';
import * as Speech from 'expo-speech';

export default function InteractiveLearningScreen({ route, navigation }: any) {
  const moduleId = route.params?.module_id || 1; 
  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchModule();
    return () => {
      Speech.stop();
    };
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/learning/curriculum/module/${moduleId}`);
      setModuleData(res.data);
    } catch (e) {
      console.log('Error fetching curriculum module', e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const res = await apiClient.post(`/api/learning/curriculum/module/${moduleId}/complete`, {
        time_spent: timeSpent
      });
      
      if (res.data.reassessment_triggered) {
        Alert.alert(
          "Reassessment Time! 🎓",
          "You've completed several modules and built your knowledge. It's time to take a reassessment to measure your Literacy Improvement!",
          [
            { text: "Later", onPress: () => navigation.navigate('Dashboard'), style: "cancel" },
            { text: "Start Now", onPress: () => navigation.navigate('Assessment', { screen: 'StartAssessment' }) }
          ]
        );
      } else {
        navigation.navigate('Dashboard');
      }
    } catch (e) {
      console.log('Error completing module', e);
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <ScreenWrapper useSafeArea className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </ScreenWrapper>
    );
  }

  if (!moduleData) {
    return (
      <ScreenWrapper useSafeArea className="flex-1 bg-background justify-center items-center">
        <Text className="text-white">Module not found.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} className="mt-4" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper useSafeArea className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Curriculum</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <View className="bg-primary/20 self-start px-3 py-1 rounded-full mb-3">
            <Text className="text-primary font-bold text-xs">{moduleData.category}</Text>
          </View>
          <Text className="text-3xl font-black text-white mb-2">{moduleData.title}</Text>
          <View className="flex-row items-center">
            <Clock size={16} color="#94A3B8" className="mr-1.5" />
            <Text className="text-textMuted text-sm">{moduleData.estimated_minutes} min read</Text>
            <Text className="text-textMuted text-sm mx-2">•</Text>
            <Text className="text-textMuted text-sm">{moduleData.difficulty_tier}</Text>
          </View>
        </View>

        {/* Learning Objectives */}
        {moduleData.learning_objectives && moduleData.learning_objectives.length > 0 && (
          <View className="bg-surfaceAlt p-5 rounded-3xl mb-6 border border-white/5">
            <View className="flex-row items-center mb-3">
              <Target size={20} color="#10B981" className="mr-2" />
              <Text className="text-white font-bold text-lg">Objectives</Text>
            </View>
            {moduleData.learning_objectives.map((obj: string, i: number) => (
              <View key={i} className="flex-row items-start mb-2">
                <Text className="text-green-500 mr-2 mt-0.5">•</Text>
                <Text className="text-white/80 leading-snug">{obj}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Micro-Lesson Content */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-bold text-white">Lesson Content</Text>
            <TouchableOpacity 
              className="flex-row items-center bg-primary/20 px-3 py-1.5 rounded-full"
              onPress={() => Speech.speak(moduleData.micro_lesson_content, { language: 'en-US' })}
            >
              <Volume2 size={16} color="#3B82F6" className="mr-2" />
              <Text className="text-primary font-bold text-xs">Read Aloud</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-white/90 text-base leading-relaxed tracking-wide">
            {moduleData.micro_lesson_content}
          </Text>
        </View>

        {/* Key Takeaways */}
        {moduleData.key_takeaways && moduleData.key_takeaways.length > 0 && (
          <View className="bg-surface p-5 rounded-3xl mb-8 border border-white/5 shadow-soft">
            <View className="flex-row items-center mb-3">
              <Lightbulb size={20} color="#F59E0B" className="mr-2" />
              <Text className="text-white font-bold text-lg">Key Takeaways</Text>
            </View>
            {moduleData.key_takeaways.map((takeaway: string, i: number) => (
              <View key={i} className="flex-row items-start mb-2">
                <CheckCircle size={16} color="#F59E0B" className="mr-2 mt-1" />
                <Text className="text-white/80 leading-snug flex-1">{takeaway}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      <View className="px-6 py-4 bg-background border-t border-border/50">
        <Button 
          title="Mark as Completed" 
          onPress={handleComplete} 
          size="lg"
        />
      </View>
    </ScreenWrapper>
  );
}
