const fs = require('fs');
const path = require('path');

const screens = {
  learning: [
    'LessonDetailsScreen', 'InteractiveLearningScreen', 'LearningRecommendationsScreen',
    'DailyTipsScreen', 'OralHygieneScreen', 'BrushingTechniquesScreen', 'PreventiveCareScreen'
  ],
  video: [
    'SuggestedVideosScreen', 'VideoCategoriesScreen', 'RecentlyWatchedScreen', 'SavedVideosScreen'
  ],
  chatbot: [
    'ChatHistoryScreen', 'FollowUpQuestionsScreen', 'SmartGuidanceScreen'
  ]
};

const template = (name) => `import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';

export default function ${name}({ navigation }: any) {
  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView className="flex-1 px-6 pt-6 pb-10">
        <View className="mb-8 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-text">${name.replace('Screen', '')}</Text>
          <Button title="Back" variant="ghost" size="sm" onPress={() => navigation.goBack()} />
        </View>
        <View className="bg-surface p-6 rounded-3xl border border-white/5 items-center justify-center py-20">
          <Text className="text-textMuted text-center leading-6">
            This is the ${name.replace('Screen', '')} view. Content will be dynamically populated here from the backend API.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
`;

for (const [module, fileList] of Object.entries(screens)) {
  const dirPath = path.join(__dirname, 'src', 'modules', module);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  for (const file of fileList) {
    const filePath = path.join(dirPath, `${file}.tsx`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, template(file));
      console.log(`Created ${filePath}`);
    }
  }
}

console.log("Done generating placeholder screens.");
