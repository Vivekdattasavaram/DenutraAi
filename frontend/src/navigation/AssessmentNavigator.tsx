import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AssessmentStackParamList } from './types';
import DashboardScreen from '../modules/dashboard/DashboardScreen';
import AssessmentIntroScreen from '../modules/assessment/AssessmentIntroScreen';
import AssessmentResultScreen from '../modules/assessment/AssessmentResultScreen';
import LiteracyClassificationScreen from '../modules/assessment/LiteracyClassificationScreen';
import RiskAnalysisScreen from '../modules/assessment/RiskAnalysisScreen';
import OralHealthScoreScreen from '../modules/health/OralHealthScoreScreen';
import QuestionFlowScreen from '../modules/assessment/QuestionFlowScreen';
import ProgressTrackingScreen from '../modules/assessment/ProgressTrackingScreen';

const Stack = createNativeStackNavigator<AssessmentStackParamList>();

export default function AssessmentNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Dashboard"
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="AssessmentIntro" component={AssessmentIntroScreen} />
      <Stack.Screen name="QuestionFlow" component={QuestionFlowScreen} />
      <Stack.Screen 
        name="AssessmentResult" 
        component={AssessmentResultScreen} 
        options={{ animation: 'fade_from_bottom' }}
      />
      <Stack.Screen name="LiteracyClassification" component={LiteracyClassificationScreen} />
      <Stack.Screen 
        name="RiskAnalysis" 
        component={RiskAnalysisScreen} 
        options={{ animation: 'fade_from_bottom' }}
      />
      <Stack.Screen 
        name="OralHealthScore" 
        component={OralHealthScoreScreen} 
        options={{ animation: 'fade_from_bottom' }}
      />
      <Stack.Screen 
        name="ProgressTracking" 
        component={ProgressTrackingScreen} 
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
