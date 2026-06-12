import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';

export default function DailyTipsScreen({ navigation }: any) {
  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView className="flex-1 px-6 pt-6 pb-10">
        <View className="mb-8 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-text">DailyTips</Text>
          <Button title="Back" variant="ghost" size="sm" onPress={() => navigation.goBack()} />
        </View>
        <View className="bg-surface p-6 rounded-3xl border border-white/5 items-center justify-center py-20">
          <Text className="text-textMuted text-center leading-6">
            This is the DailyTips view. Content will be dynamically populated here from the backend API.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
