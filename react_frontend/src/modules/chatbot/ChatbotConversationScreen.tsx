import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, useWindowDimensions } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Send, Sparkles, ChevronLeft, Square, Play, Globe } from 'lucide-react-native';
import { apiClient } from '../../services/api';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = ['English', 'Tamil', 'Hindi'];

export default function ChatbotConversationScreen({ navigation }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatLanguage, setChatLanguage] = useState('English');
  const flatListRef = useRef<FlatList>(null);
  
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  useEffect(() => {
    loadLanguage();
    return () => {
      Speech.stop();
    };
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem('chatbotLanguage');
      const lang = stored || 'English';
      setChatLanguage(lang);
      
      // Set welcome message in correct language
      let welcomeText = 'Hello! I am your AI Dental Assistant. How can I help you today?';
      if (lang === 'Tamil') welcomeText = 'வணக்கம்! நான் உங்கள் AI பல் உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?';
      if (lang === 'Hindi') welcomeText = 'नमस्ते! मैं आपका एआई डेंटल असिस्टेंट हूं। आज मैं आपकी कैसे मदद कर सकता हूं?';
      
      setMessages([{ id: '1', text: welcomeText, isBot: true, lang: lang }]);
    } catch (e) {
      console.log('Failed to load language', e);
      setMessages([{ id: '1', text: 'Hello! I am your AI Dental Assistant. How can I help you today?', isBot: true, lang: 'English' }]);
    }
  };

  const toggleLanguage = async () => {
    const nextIndex = (LANGUAGES.indexOf(chatLanguage) + 1) % LANGUAGES.length;
    const nextLang = LANGUAGES[nextIndex];
    setChatLanguage(nextLang);
    try {
      await AsyncStorage.setItem('chatbotLanguage', nextLang);
    } catch (e) {
      console.log('Failed to save language', e);
    }
  };

  const handleSend = async (textToSend: string = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = textToSend.trim();
    const newMessages = [...messages, { id: Date.now().toString(), text: userMsg, isBot: false, lang: chatLanguage }];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const response = await apiClient.post('/api/chatbot/message', { 
        message: userMsg,
        language: chatLanguage 
      });
      const replyLang = response.data.language;
      const replyText = response.data.reply;

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: replyText, isBot: true, lang: replyLang }
      ]);

      handlePlayAudio((Date.now() + 1).toString(), replyText, replyLang);
    } catch (error) {
      let errText = "I'm sorry, I'm having trouble connecting to the server.";
      if (chatLanguage === 'Tamil') errText = "மன்னிக்கவும், சேவையகத்துடன் இணைப்பதில் சிக்கல் உள்ளது.";
      if (chatLanguage === 'Hindi') errText = "क्षमा करें, मुझे सर्वर से कनेक्ट करने में समस्या हो रही है।";
      
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: errText, isBot: true, lang: chatLanguage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (messageId: string, text: string, lang: string) => {
    if (speakingMessageId === messageId && isSpeaking) {
      Speech.stop();
      setSpeakingMessageId(null);
      setIsSpeaking(false);
      return;
    }

    Speech.stop();
    setSpeakingMessageId(messageId);
    setIsSpeaking(true);

    let ttsLang = 'en-US';
    if (lang === 'Tamil') ttsLang = 'ta-IN';
    if (lang === 'Hindi') ttsLang = 'hi-IN';

    Speech.speak(text, {
      language: ttsLang,
      pitch: 1.0,
      rate: 0.9,
      onDone: () => {
        setSpeakingMessageId(null);
        setIsSpeaking(false);
      },
      onStopped: () => {
        setSpeakingMessageId(null);
        setIsSpeaking(false);
      },
      onError: () => {
        setSpeakingMessageId(null);
        setIsSpeaking(false);
      }
    });
  };

  const renderMessage = ({ item }: any) => {
    const isBot = item.isBot;
    return (
      <View className={`flex-row mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
        {isBot && (
          <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-3 mt-1 border border-primary/30">
            <Sparkles size={16} color="#3B82F6" />
          </View>
        )}
        <View className={`max-w-[75%] rounded-3xl p-4 shadow-soft ${isBot ? 'bg-surface border border-white/5 rounded-tl-sm' : 'bg-primary rounded-tr-sm'}`}>
          <Text className={`text-base leading-relaxed ${isBot ? 'text-text' : 'text-white'}`}>{item.text}</Text>
          {isBot && (
            <TouchableOpacity
              className="mt-2 flex-row items-center self-start bg-background/50 px-2 py-1.5 rounded"
              onPress={() => handlePlayAudio(item.id, item.text, item.lang)}
            >
              {speakingMessageId === item.id && isSpeaking ? (
                <>
                  <Square size={12} color="#EF4444" className="mr-1.5" />
                  <Text className="text-error text-[10px] uppercase tracking-wider font-bold">Stop Reading</Text>
                </>
              ) : (
                <>
                  <Play size={12} color="#94A3B8" className="mr-1.5" />
                  <Text className="text-textMuted text-[10px] uppercase tracking-wider font-bold">Play Aloud</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View style={{ flex: 1, width: '100%', maxWidth: isDesktop ? 900 : '100%', alignSelf: 'center' }}>
        <View className="flex-row items-center justify-between px-6 pt-2 pb-4 border-b border-white/5">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => { Speech.stop(); navigation.goBack(); }} className="mr-4">
            <ChevronLeft size={28} color="#F8FAFC" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-xl">AI Chat Assistant</Text>
        </View>
        <TouchableOpacity 
          onPress={toggleLanguage}
          className="flex-row items-center bg-surface px-3 py-1.5 rounded-full border border-white/10"
        >
          <Globe size={14} color="#3B82F6" className="mr-1.5" />
          <Text className="text-primary font-bold text-xs">{chatLanguage}</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          className="flex-1"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View className="px-6 pb-2 flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-3 border border-primary/30">
              <Sparkles size={16} color="#3B82F6" />
            </View>
            <ActivityIndicator size="small" color="#3B82F6" />
          </View>
        )}

        <View className="p-4 px-6 bg-background border-t border-white/5 flex-row items-center pb-8">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              chatLanguage === 'Tamil' ? 'உங்கள் செய்தியை தட்டச்சு செய்யவும்...' :
              chatLanguage === 'Hindi' ? 'अपना संदेश टाइप करें...' :
              'Type your message...'
            }
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-surfaceAlt text-text px-5 py-3 rounded-full mr-3 border border-white/5"
            editable={!loading}
          />

          <TouchableOpacity
            onPress={() => handleSend(inputText)}
            className={`w-12 h-12 rounded-full items-center justify-center shadow-soft ${inputText.trim() && !loading ? 'bg-primary' : 'bg-surface'}`}
            disabled={!inputText.trim() || loading}
          >
            <Send size={18} color={inputText.trim() && !loading ? '#FFFFFF' : '#94A3B8'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
}
