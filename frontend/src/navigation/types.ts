import { NavigatorScreenParams, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: { token?: string; user?: { email: string; full_name: string } } | undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OtpVerification: { email?: string; isPasswordReset?: boolean };
  ResetPassword: { email: string; otp_code: string };
  Welcome: undefined;
};

export type AssessmentStackParamList = {
  Dashboard: undefined;
  AssessmentIntro: undefined;
  QuestionFlow: undefined;
  AssessmentResult: { result: any };
  LiteracyClassification: undefined;
  RiskAnalysis: { result?: any } | undefined;
  OralHealthScore: undefined;
  ProgressTracking: undefined;
};

export type LearningStackParamList = {
  LearningHome: undefined;
  LessonDetails: { lessonId?: string } | undefined;
  InteractiveLearning: { module_id?: any } | undefined;
  DailyQuiz: undefined;
  Exercises: undefined;
  FactOrMyth: undefined;
  DailyTips: undefined;
  OralHygiene: undefined;
  BrushingTechniques: undefined;
  PreventiveCare: undefined;
  // Video flow
  VideoCategories: undefined;
  SuggestedVideos: undefined;
  VideoPlayer: { videoId: string; title?: string; channel?: string };
  NativeVideoPlayer: { video: any; localSource: any };
};

export type ChatbotStackParamList = {
  ChatbotHome: undefined;
  ChatbotConversation: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Notifications: undefined;
  Achievement: undefined;
  Security: undefined;
  PrivacyPolicy: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  AssistantTab: undefined;
  LearnTab: undefined;
  ProfileTab: undefined;
};

export type AdminTabParamList = {
  OverviewTab: undefined;
  UsersTab: undefined;
  AnalyticsTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Admin: NavigatorScreenParams<AdminTabParamList>;
};

// Helper types for screens
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type AssessmentNavigationProp = NativeStackNavigationProp<AssessmentStackParamList>;
export type LearningNavigationProp = NativeStackNavigationProp<LearningStackParamList>;
export type ChatbotNavigationProp = NativeStackNavigationProp<ChatbotStackParamList>;
export type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
