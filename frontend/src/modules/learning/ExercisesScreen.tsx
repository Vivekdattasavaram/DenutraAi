import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, useWindowDimensions, Platform } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ChevronLeft, Play, Clock, CheckCircle2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_VIDEOS = [
  { id: 1, title: 'Proper Brushing Technique', duration: '2:15', category: 'Habits', url: 'https://www.youtube.com/watch?v=4iIGhqi57es' },
  { id: 2, title: 'Correct Flossing Method', duration: '1:45', category: 'Hygiene', url: 'https://www.youtube.com/watch?v=HhdoPXNKNm4' },
  { id: 3, title: 'Gum Disease Prevention', duration: '3:20', category: 'Prevention', url: 'https://www.youtube.com/watch?v=T1wG0EksfC4' },
  { id: 4, title: 'Plaque and Tartar Explained', duration: '2:50', category: 'Knowledge', url: 'https://www.youtube.com/watch?v=T1wG0EksfC4' },
  { id: 5, title: 'Tooth Decay Prevention', duration: '4:10', category: 'Prevention', url: 'https://www.youtube.com/watch?v=4iIGhqi57es' },
  { id: 6, title: 'Children\'s Oral Health', duration: '3:05', category: 'Kids', url: 'https://www.youtube.com/watch?v=HhdoPXNKNm4' },
  { id: 7, title: 'Mouthwash Usage Guide', duration: '1:30', category: 'Hygiene', url: 'https://www.youtube.com/watch?v=T1wG0EksfC4' },
  { id: 8, title: 'Oral Cancer Awareness', duration: '5:00', category: 'Health', url: 'https://www.youtube.com/watch?v=4iIGhqi57es' },
  { id: 9, title: 'What to Expect at Dental Checkups', duration: '2:40', category: 'Visits', url: 'https://www.youtube.com/watch?v=HhdoPXNKNm4' },
  { id: 10, title: 'Healthy Diet for Teeth', duration: '3:15', category: 'Diet', url: 'https://www.youtube.com/watch?v=T1wG0EksfC4' }
];

export default function ExercisesScreen({ navigation }: any) {
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem('completed_videos');
      if (stored) {
        setCompletedVideos(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Error loading video progress', e);
    }
  };

  const handlePlayVideo = async (video: any) => {
    let updatedCompleted = [...completedVideos];
    let justCompleted = false;

    if (!completedVideos.includes(video.id)) {
      updatedCompleted.push(video.id);
      setCompletedVideos(updatedCompleted);
      justCompleted = true;
      try {
        await AsyncStorage.setItem('completed_videos', JSON.stringify(updatedCompleted));
        
        // Update global stats
        const currentStats = await AsyncStorage.getItem('user_engagement_stats');
        const stats = currentStats ? JSON.parse(currentStats) : { quizzes: 0, facts: 0, videos: 0 };
        stats.videos = (stats.videos || 0) + 1;
        await AsyncStorage.setItem('user_engagement_stats', JSON.stringify(stats));
      } catch (e) {
        console.log('Error saving video progress', e);
      }
    }
    
    // Open in YouTube app/browser
    Linking.openURL(video.url);
  };

  return (
    <ScreenWrapper useSafeArea className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Video Learning</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-3xl font-black text-white mb-2 leading-tight">Educational Videos</Text>
          <Text className="text-textMuted text-base">Expand your knowledge with our curated video library.</Text>
        </View>

        <View className={isDesktop ? 'flex-row flex-wrap justify-between' : 'space-y-4'}>
          {MOCK_VIDEOS.map((video) => {
            const isCompleted = completedVideos.includes(video.id);
            return (
              <TouchableOpacity 
                key={video.id} 
                onPress={() => handlePlayVideo(video)} 
                className={`bg-surface rounded-3xl overflow-hidden border shadow-soft mb-4 ${isCompleted ? 'border-green-500/20' : 'border-white/5'} ${isDesktop ? 'w-[48%]' : ''}`}
              >
                <View className="flex-row p-5 items-center">
                  <View className={`w-16 h-16 rounded-2xl items-center justify-center mr-5 border overflow-hidden ${isCompleted ? 'bg-green-500/10 border-green-500/20' : 'bg-surfaceAlt border-white/5'}`}>
                     <Play size={24} color={isCompleted ? "#10B981" : "#3B82F6"} fill={isCompleted ? "#10B981" : "#3B82F6"} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg mb-1" numberOfLines={1}>{video.title}</Text>
                    <Text className="text-textMuted text-sm mb-3 leading-tight">{video.category}</Text>
                    <View className="flex-row items-center">
                      <View className="flex-row items-center bg-background/50 px-2.5 py-1 rounded-full border border-white/5 mr-3">
                        <Clock size={12} color="#94A3B8" />
                        <Text className="text-textMuted text-xs ml-1.5 font-medium">{video.duration}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className={`h-12 flex-row items-center justify-center border-t border-white/5 ${isCompleted ? 'bg-green-500/10' : 'bg-surfaceAlt/50'}`}>
                  {isCompleted ? (
                    <>
                      <CheckCircle2 size={16} color="#10B981" />
                      <Text className="font-bold ml-2 text-sm text-green-400">100% Completed</Text>
                    </>
                  ) : (
                    <>
                      <Text className="font-bold ml-2 text-sm text-textMuted">Not Started • Tap to Watch</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
