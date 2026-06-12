import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { ClipboardList, Clock, Sparkles, ChevronLeft } from 'lucide-react-native';

export default function AssessmentIntroScreen({ navigation }: any) {
  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Assessment</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6 pb-10" showsVerticalScrollIndicator={false}>
        <View className="mb-10 mt-4">
          <Text className="text-4xl font-black text-text mb-3 leading-tight">
            AI Oral Health Assessment
          </Text>
          <Text className="text-textMuted text-lg">
            Let's personalize your experience
          </Text>
        </View>

        <View className="space-y-4 mb-10">
          {/* Card 1 */}
          <View className="flex-row items-center bg-surface p-5 rounded-3xl border border-white/5 shadow-soft">
            <View className="w-14 h-14 bg-background rounded-2xl items-center justify-center mr-5 border border-white/5">
              <ClipboardList size={26} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-text font-bold text-lg mb-1">20 Questions</Text>
              <Text className="text-textMuted text-sm">Comprehensive analysis</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View className="flex-row items-center bg-surface p-5 rounded-3xl border border-white/5 shadow-soft">
            <View className="w-14 h-14 bg-background rounded-2xl items-center justify-center mr-5 border border-white/5">
              <Clock size={26} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-text font-bold text-lg mb-1">2 Minutes</Text>
              <Text className="text-textMuted text-sm">Quick and easy</Text>
            </View>
          </View>

          {/* Card 3 */}
          <View className="flex-row items-center bg-surface p-5 rounded-3xl border border-white/5 shadow-soft">
            <View className="w-14 h-14 bg-background rounded-2xl items-center justify-center mr-5 border border-white/5">
              <Sparkles size={26} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-text font-bold text-lg mb-1">Instant AI Results</Text>
              <Text className="text-textMuted text-sm">Actionable insights</Text>
            </View>
          </View>
        </View>

      </ScrollView>
      
      <View className="px-6 py-4 bg-background border-t border-border/50">
        <Button 
          title="Begin Assessment" 
          onPress={() => navigation.navigate('LiteracyClassification')} 
          size="lg"
        />
      </View>
    </ScreenWrapper>
  );
}
