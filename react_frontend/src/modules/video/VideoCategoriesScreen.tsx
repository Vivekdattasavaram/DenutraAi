import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';

export default function VideoCategoriesScreen({ navigation }: any) {
  const videos = [
    { id: 'dQw4w9WgXcQ', title: 'Proper Brushing Technique', channel: 'Oral Health Academy' },
    { id: 'M7lc1UVf-VE', title: 'How to Floss Correctly', channel: 'DentalCare' },
    { id: '3JZ_D3ELwOQ', title: 'Sugar & Cavities Explained', channel: 'HealthySmiles' },
  ];

  const openVideo = (videoId: string, title?: string, channel?: string) => {
    // prefer in-app player if navigation is available
    if ((navigation && navigation.navigate)) {
      navigation.navigate('VideoPlayer', { videoId, title, channel });
      return;
    }
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(url).catch((e) => console.error('Failed to open URL', e));
  };
  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView className="flex-1 px-6 pt-6 pb-10">
        <View className="mb-8 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-text">VideoCategories</Text>
          <Button title="Back" variant="ghost" size="sm" onPress={() => navigation.goBack()} />
        </View>
        <View className="space-y-4">
          {videos.map((v) => (
            <TouchableOpacity key={v.id} onPress={() => openVideo(v.id, v.title, v.channel)} className="bg-surface rounded-2xl p-3 border border-white/5 flex-row items-center">
              <Image source={{ uri: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg` }} style={{ width: 120, height: 68, borderRadius: 8, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text className="text-text font-bold">{v.title}</Text>
                <Text className="text-textMuted text-sm mt-1">{v.channel}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
