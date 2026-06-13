import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { MessageCircle, Sparkles, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = ['English', 'Tamil', 'Hindi'];

export default function ChatbotHomeScreen({ navigation }: any) {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem('chatbotLanguage');
      if (stored) setSelectedLanguage(stored);
    } catch (e) {
      console.log('Failed to load language', e);
    } finally {
      setLoading(false);
    }
  };

  const saveLanguage = async (lang: string) => {
    setSelectedLanguage(lang);
    try {
      await AsyncStorage.setItem('chatbotLanguage', lang);
    } catch (e) {
      console.log('Failed to save language', e);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper className="flex-1 bg-background" useSafeArea>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View style={{ flex: 1, width: '100%', maxWidth: isDesktop ? 900 : '100%', alignSelf: 'center' }}>
        <ScrollView className="flex-1 px-6 pt-8 pb-10" showsVerticalScrollIndicator={false}>
        <View className="mb-8 mt-4">
          <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-6 border border-primary/30">
            <Sparkles size={36} color="#3B82F6" />
          </View>
          <Text className="text-4xl font-black text-white mb-3 leading-tight">Oral Health Assistant</Text>
          <Text className="text-textMuted text-lg">
            How can I help you today?
          </Text>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Globe size={20} color="#94A3B8" className="mr-2" />
            <Text className="text-textMuted font-bold uppercase tracking-wider text-sm">Select Language</Text>
          </View>
          <View className="flex-row space-x-3">
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => saveLanguage(lang)}
                className={`flex-1 py-3 items-center justify-center rounded-xl border ${selectedLanguage === lang ? 'bg-primary/20 border-primary' : 'bg-surface border-white/5'}`}
              >
                <Text className={`font-bold ${selectedLanguage === lang ? 'text-primary' : 'text-textMuted'}`}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="space-y-4">
          <MenuCard 
            icon={<MessageCircle size={32} color="#ffffff" />}
            title="Text Assistant"
            subtitle="Chat with AI for instant dental guidance"
            colors={['#1E3A8A', '#0F172A']}
            onPress={() => navigation.navigate('ChatbotConversation')}
          />
        </View>
      </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

function MenuCard({ icon, title, subtitle, colors, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-3xl flex-row items-center shadow-soft"
      >
        <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mr-5 backdrop-blur-md">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold text-xl mb-1">{title}</Text>
          <Text className="text-white/70 text-sm leading-snug">{subtitle}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
