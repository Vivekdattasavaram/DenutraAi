import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View className="flex-row items-center px-6 pt-2 pb-4 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Privacy Policy</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-8 pb-10" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mb-4 border border-primary/30">
            <ShieldCheck size={32} color="#3B82F6" />
          </View>
          <Text className="text-white/60 font-semibold uppercase tracking-widest text-xs">Last Updated: May 2026</Text>
        </View>
        <View className="bg-surface p-6 rounded-3xl border border-white/5 shadow-soft mb-6">
          <Text className="text-white/80 text-base leading-relaxed mb-4">
            Your privacy is important to us. This Privacy Policy outlines how your data is collected, used, and protected when you use Dentura AI.
          </Text>
          
          <Text className="text-white font-bold text-lg mt-4 mb-2">1. Information Collection</Text>
          <Text className="text-white/70 text-base leading-relaxed mb-4">
            We collect personal information such as your name, email, and oral health scores to provide personalized recommendations.
          </Text>
          
          <Text className="text-white font-bold text-lg mt-2 mb-2">2. Data Usage</Text>
          <Text className="text-white/70 text-base leading-relaxed mb-4">
            Your data is solely used to track your progress and improve our AI models for better accuracy.
          </Text>
          
          <Text className="text-white font-bold text-lg mt-2 mb-2">3. Data Security</Text>
          <Text className="text-white/70 text-base leading-relaxed mb-6">
            We implement industry-standard encryption to protect your sensitive health data from unauthorized access.
          </Text>
          
          <View className="bg-background/50 p-4 rounded-xl border border-white/5">
            <Text className="text-white/50 text-sm text-center leading-relaxed">
              For detailed inquiries, please contact our support team at privacy@dentura.ai
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
