import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LearningStackParamList } from './types';
import LearningDashboardScreen from '../modules/learning/LearningDashboardScreen';
import LessonDetailsScreen from '../modules/learning/LessonDetailsScreen';
import InteractiveLearningScreen from '../modules/learning/InteractiveLearningScreen';
import FactOrMythScreen from '../modules/learning/FactOrMythScreen';
import DailyQuizScreen from '../modules/learning/DailyQuizScreen';
import ExercisesScreen from '../modules/learning/ExercisesScreen';
import DailyTipsScreen from '../modules/learning/DailyTipsScreen';
import OralHygieneScreen from '../modules/learning/OralHygieneScreen';
import BrushingTechniquesScreen from '../modules/learning/BrushingTechniquesScreen';
import PreventiveCareScreen from '../modules/learning/PreventiveCareScreen';

// Video screens
import VideoCategoriesScreen from '../modules/video/VideoCategoriesScreen';
import SuggestedVideosScreen from '../modules/video/SuggestedVideosScreen';
import VideoPlayerScreen from '../modules/video/VideoPlayerScreen';
import NativeVideoPlayerScreen from '../modules/learning/VideoPlayerScreen';

const Stack = createNativeStackNavigator<LearningStackParamList>();

export default function LearningNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="LearningHome" component={LearningDashboardScreen} />
      <Stack.Screen name="LessonDetails" component={LessonDetailsScreen} />
      <Stack.Screen name="InteractiveLearning" component={InteractiveLearningScreen} />
      <Stack.Screen name="DailyQuiz" component={DailyQuizScreen} />
      <Stack.Screen name="Exercises" component={ExercisesScreen} />
      <Stack.Screen name="FactOrMyth" component={FactOrMythScreen} />
      <Stack.Screen name="DailyTips" component={DailyTipsScreen} />
      <Stack.Screen name="OralHygiene" component={OralHygieneScreen} />
      <Stack.Screen name="BrushingTechniques" component={BrushingTechniquesScreen} />
      <Stack.Screen name="PreventiveCare" component={PreventiveCareScreen} />

      {/* Video Flow */}
      <Stack.Screen name="VideoCategories" component={VideoCategoriesScreen} />
      <Stack.Screen name="SuggestedVideos" component={SuggestedVideosScreen} />
      <Stack.Screen 
        name="VideoPlayer" 
        component={VideoPlayerScreen} 
        options={{ animation: 'slide_from_bottom' }} 
      />
      <Stack.Screen 
        name="NativeVideoPlayer" 
        component={NativeVideoPlayerScreen} 
        options={{ animation: 'slide_from_bottom' }} 
      />
    </Stack.Navigator>
  );
}
