import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Play } from 'lucide-react-native';

let WebView: any = null;
try {
  // try to require react-native-webview at runtime; if not installed, we'll fallback
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  WebView = require('react-native-webview').WebView;
} catch (e) {
  WebView = null;
}

export default function VideoPlayerScreen({ route }: any) {
  const { videoId, title = 'Video', channel = '' } = route?.params || {};

  const openExternal = () => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(url).catch((err) => console.error('open external failed', err));
  };

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView className="flex-1 px-6 pt-6 pb-10">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text mb-2">{title}</Text>
          {channel ? <Text className="text-textMuted text-sm">{channel}</Text> : null}
        </View>

        <View className="w-full aspect-video bg-surface rounded-3xl overflow-hidden border border-white/5 mb-6">
          {WebView ? (
            <WebView
              source={{ uri: embedUrl }}
              style={{ flex: 1 }}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
            />
          ) : (
            <TouchableOpacity onPress={openExternal} className="flex-1 items-center justify-center">
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center pl-1">
                <Play size={32} color="#FFFFFF" />
              </View>
              <Text className="text-textMuted mt-3">Open in YouTube</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-text font-bold text-xl mb-4">Description</Text>
        <Text className="text-textMuted leading-6 mb-8">
          Learn the modified Bass technique for brushing your teeth. This method ensures that you clean the gumline effectively, reducing plaque and preventing gingivitis.
        </Text>

      </ScrollView>
    </ScreenWrapper>
  );
}
