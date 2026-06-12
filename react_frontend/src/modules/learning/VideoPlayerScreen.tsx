import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ChevronLeft } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearningStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<LearningStackParamList, 'NativeVideoPlayer'>;

export default function VideoPlayerScreen({ route, navigation }: Props) {
  const { video, localSource } = route.params;
  const progressRef = useRef(0);
  const lastSavedIntRef = useRef(-1);

  const player = useVideoPlayer(localSource, player => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    return () => {
      saveProgress(progressRef.current);
    };
  }, []);

  const saveProgress = async (percentage: number) => {
    if (percentage > 0) {
      try {
        const progStr = await AsyncStorage.getItem('video_progress');
        const progressObj = progStr ? JSON.parse(progStr) : {};
        if ((progressObj[video.id] || 0) < percentage) {
          progressObj[video.id] = percentage;
          await AsyncStorage.setItem('video_progress', JSON.stringify(progressObj));
        }
      } catch (e) {
        console.log('Failed to save video progress', e);
      }
    }
  };

  useEventListener(player, 'timeUpdate', () => {
    if (player && player.duration > 0) {
      const percentage = player.currentTime / player.duration;
      progressRef.current = percentage;

      const currentInt = Math.round(percentage * 100);
      if (currentInt !== lastSavedIntRef.current) {
        lastSavedIntRef.current = currentInt;
        saveProgress(percentage);
      }
    }
  });

  useEventListener(player, 'playToEnd', async () => {
    progressRef.current = 1.0;
    await saveProgress(1.0);
    Alert.alert("Video Completed!", "Great job! Your progress has been updated.");
    try {
      await apiClient.post(`/api/learning/curriculum/module/${video.id}/complete`, { time_spent: Math.round(player.duration || 0) });
    } catch (e) {
      console.log('Failed to update progress', e);
    }
  });

  return (
    <ScreenWrapper useSafeArea className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pt-2 pb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl flex-1" numberOfLines={1}>{video.title}</Text>
      </View>

      <View className="flex-1 items-center px-4">
        <View className="w-full rounded-2xl overflow-hidden bg-black aspect-video justify-center mb-6 border border-white/10 shadow-soft">
          <VideoView
            player={player}
            style={{ width: '100%', height: '100%' }}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>

        <View className="w-full bg-surface p-6 rounded-3xl border border-white/5 shadow-soft">
            <Text className="text-white font-bold text-2xl mb-2">{video.title}</Text>
            <View className="bg-primary/20 self-start px-3 py-1 rounded-full mb-4">
                <Text className="text-primary font-bold text-xs uppercase tracking-wider">{video.category}</Text>
            </View>
            <Text className="text-textMuted text-base leading-relaxed mb-4">{video.description}</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}
