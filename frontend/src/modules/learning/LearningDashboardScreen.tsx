import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, useWindowDimensions, Platform } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { BookOpen, Trophy, Flame, Award, TrendingUp, Clock, ChevronRight, PlayCircle, HelpCircle, Layers, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../services/api';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearningStackParamList } from '../../navigation/types';

const VIDEO_SOURCES: Record<string, any> = {
  brushing: require('../../../assets/videos/brushing.mp4'),
  flossing: require('../../../assets/videos/flossing.mp4'),
  gumHealth: require('../../../assets/videos/gumhealth.mp4'),
  dietaryHabits: require('../../../assets/videos/dietaryhabits.mp4'),
  cariesAwareness: require('../../../assets/videos/cavitycauses.mp4'),
  lifestyleRisk: require('../../../assets/videos/smoking_effects.mp4'),
};

const ALL_VIDEOS = [
  { id: 'brushing', title: 'Proper Brushing Technique', duration: '2:15', category: 'Oral Hygiene', matchKeys: ['Brushing Habits', 'brushing', 'Oral Hygiene'], url: 'brushing.mp4', localSource: VIDEO_SOURCES.brushing },
  { id: 'flossing', title: 'Correct Flossing Method', duration: '1:45', category: 'Flossing Habits', matchKeys: ['Flossing Habits', 'flossing'], url: 'flossing.mp4', localSource: VIDEO_SOURCES.flossing },
  { id: 'gumHealth', title: 'Understanding Gum Health', duration: '3:20', category: 'Gum Health', matchKeys: ['Gum Health', 'gumHealth'], url: 'gumhealth.mp4', localSource: VIDEO_SOURCES.gumHealth },
  { id: 'dietaryHabits', title: 'Diet and Dental Health', duration: '4:10', category: 'Dietary Habits', matchKeys: ['Dietary Habits', 'dietaryHabits'], url: 'dietaryhabits.mp4', localSource: VIDEO_SOURCES.dietaryHabits },
  { id: 'cariesAwareness', title: 'Preventing Cavities', duration: '2:50', category: 'Dental Caries Awareness', matchKeys: ['Dental Caries Awareness', 'cariesAwareness'], url: 'cavitycauses.mp4', localSource: VIDEO_SOURCES.cariesAwareness },
  { id: 'lifestyleRisk', title: 'Effects of Smoking on Teeth', duration: '5:00', category: 'Lifestyle Risk Factors', matchKeys: ['Lifestyle Risk Factors', 'lifestyleRisk'], url: 'smoking_effects.mp4', localSource: VIDEO_SOURCES.lifestyleRisk }
];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'Brushing Habits': 'Oral Hygiene',
  'Flossing Habits': 'Flossing Habits',
  'Gum Health': 'Gum Health',
  'Dietary Habits': 'Dietary Habits',
  'Dental Caries Awareness': 'Dental Caries Awareness',
  'Lifestyle Risk Factors': 'Lifestyle Risk Factors',
  'brushing': 'Oral Hygiene',
  'flossing': 'Flossing Habits',
  'gumHealth': 'Gum Health',
  'dietaryHabits': 'Dietary Habits',
  'cariesAwareness': 'Dental Caries Awareness',
  'lifestyleRisk': 'Lifestyle Risk Factors',
  'Oral Hygiene': 'Oral Hygiene'
};

type Props = NativeStackScreenProps<LearningStackParamList, 'LearningHome'>;

export default function LearningDashboardScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [engagementStats, setEngagementStats] = useState({ quizzes: 0, facts: 0, videos: 0 });
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({});

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, pathRes, statsStr, scoresStr, videoProgStr] = await Promise.all([
        apiClient.get('/api/learning/dashboard'),
        apiClient.get('/api/learning/curriculum/path'),
        AsyncStorage.getItem('user_engagement_stats'),
        AsyncStorage.getItem('category_scores'),
        AsyncStorage.getItem('video_progress')
      ]);
      setDashboardData(dashRes.data);
      setLearningPath(pathRes.data);
      if (statsStr) {
        setEngagementStats(JSON.parse(statsStr));
      }
      if (scoresStr) {
        setCategoryScores(JSON.parse(scoresStr));
      }
      if (videoProgStr) {
        setVideoProgress(JSON.parse(videoProgStr));
      }
    } catch (e) {
      console.log('Error fetching learning dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchDashboardData();
    }
  }, [isFocused]);

  const getLiteracyColor = (level: string) => {
    if (level === "Advanced") return "#10B981"; 
    if (level === "Intermediate") return "#F59E0B"; 
    return "#3B82F6"; 
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const weakCategories = Object.keys(categoryScores).filter(cat => categoryScores[cat] < 60);
  
  const recommendedVideos = ALL_VIDEOS.filter(v => 
    v.matchKeys.some(key => weakCategories.includes(key))
  );
  
  const exploreVideos = ALL_VIDEOS.filter(v => !recommendedVideos.includes(v));

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="mb-6 mt-4">
          <Text className="text-3xl font-black text-white mb-2">Literacy Hub</Text>
          <Text className="text-textMuted text-base">Track your progress and build better habits.</Text>
        </View>

        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <>
            {/* Gamification Stats Row */}
            <View className="flex-row justify-between mb-6">
              <View className="bg-surface p-4 rounded-3xl flex-1 mr-2 border border-white/5 items-center">
                <Flame size={24} color="#F59E0B" className="mb-2" />
                <Text className="text-white font-bold text-xl">{dashboardData?.streak_days || 0}</Text>
                <Text className="text-textMuted text-xs">Day Streak</Text>
              </View>
              <View className="bg-surface p-4 rounded-3xl flex-1 mx-1 border border-white/5 items-center">
                <Trophy size={24} color="#3B82F6" className="mb-2" />
                <Text className="text-white font-bold text-xl">{dashboardData?.xp_points || 0}</Text>
                <Text className="text-textMuted text-xs">XP Earned</Text>
              </View>
              <View className="bg-surface p-4 rounded-3xl flex-1 ml-2 border border-white/5 items-center">
                <Award size={24} color="#8B5CF6" className="mb-2" />
                <Text className="text-white font-bold text-xl">{(dashboardData?.badges_earned || []).length}</Text>
                <Text className="text-textMuted text-xs">Badges</Text>
              </View>
            </View>

            {/* Literacy Progress Card */}
            <LinearGradient
              colors={['#1E3A8A', '#0F172A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-[32px] p-6 mb-8 shadow-soft"
            >
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-white/60 text-xs uppercase tracking-widest mb-1">Current Level</Text>
                  <Text className="text-2xl font-bold" style={{ color: getLiteracyColor(dashboardData?.current_literacy_level || 'Beginner') }}>
                    {dashboardData?.current_literacy_level || 'Beginner'}
                  </Text>
                </View>
                {dashboardData?.literacy_growth_percentage > 0 && (
                  <View className="bg-green-500/20 px-3 py-1.5 rounded-full flex-row items-center">
                    <TrendingUp size={14} color="#10B981" />
                    <Text className="text-green-400 font-bold ml-1">+{dashboardData.literacy_growth_percentage.toFixed(0)}%</Text>
                  </View>
                )}
              </View>
              
              <View className="flex-row justify-between items-center border-t border-white/10 pt-4">
                <View className="items-center">
                  <View className="flex-row items-center mb-1">
                    <BookOpen size={14} color="#94A3B8" className="mr-1" />
                    <Text className="text-textMuted text-xs">Completed</Text>
                  </View>
                  <Text className="text-white font-bold">{(dashboardData?.completed_module_ids || []).length} Modules</Text>
                </View>
                <View className="w-[1px] h-8 bg-white/10" />
                <View className="items-center">
                  <View className="flex-row items-center mb-1">
                    <Clock size={14} color="#94A3B8" className="mr-1" />
                    <Text className="text-textMuted text-xs">Learning Time</Text>
                  </View>
                  <Text className="text-white font-bold">{formatTime(dashboardData?.learning_time_seconds || 0)}</Text>
                </View>
              </View>
            </LinearGradient>

            <View className={isDesktop ? "flex-row mb-8" : ""}>
              <View className={isDesktop ? "flex-1 mr-4" : "mb-8"}>
                {/* Daily Activities */}
                <Text className="text-xl font-bold text-white mb-4">Daily Activities</Text>
                <View className="flex-row justify-between h-[140px]">
                  <TouchableOpacity
                    className="bg-surface p-5 rounded-3xl flex-1 mr-2 border border-white/5 items-center justify-center shadow-soft"
                    onPress={() => navigation.navigate('DailyQuiz')}
                  >
                    <View className="bg-primary/20 p-3 rounded-full mb-3">
                      <HelpCircle size={24} color="#3B82F6" />
                    </View>
                    <Text className="text-white font-bold text-base mb-1">Daily Quiz</Text>
                    <Text className="text-textMuted text-xs text-center">Test your knowledge</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-surface p-5 rounded-3xl flex-1 ml-2 border border-white/5 items-center justify-center shadow-soft"
                    onPress={() => navigation.navigate('FactOrMyth')}
                  >
                    <View className="bg-green-500/20 p-3 rounded-full mb-3">
                      <Layers size={24} color="#10B981" />
                    </View>
                    <Text className="text-white font-bold text-base mb-1">Fact or Myth</Text>
                    <Text className="text-textMuted text-xs text-center">Swipe to learn</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className={isDesktop ? "flex-1 ml-4" : "mb-8"}>
                {/* Learning Engagement Stats */}
                <Text className="text-xl font-bold text-white mb-4">Engagement Stats</Text>
                <View className="bg-surface rounded-3xl p-5 border border-white/5 shadow-soft h-[140px] justify-center">
                  <View className="flex-row items-center justify-between mb-3 border-b border-white/10 pb-3">
                    <View className="flex-row items-center">
                      <HelpCircle size={20} color="#3B82F6" className="mr-3" />
                      <Text className="text-white font-medium text-base">Quizzes Completed</Text>
                    </View>
                    <Text className="text-primary font-bold text-lg">{engagementStats.quizzes}</Text>
                  </View>
                  
                  <View className="flex-row items-center justify-between mb-3 border-b border-white/10 pb-3">
                    <View className="flex-row items-center">
                      <Layers size={20} color="#10B981" className="mr-3" />
                      <Text className="text-white font-medium text-base">Fact/Myth Swipes</Text>
                    </View>
                    <Text className="text-green-400 font-bold text-lg">{engagementStats.facts}</Text>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <PlayCircle size={20} color="#8B5CF6" className="mr-3" />
                      <Text className="text-white font-medium text-base">Videos Watched</Text>
                    </View>
                    <Text className="text-purple-400 font-bold text-lg">{engagementStats.videos}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Learning Gap Analysis */}
            {Object.keys(categoryScores).length > 0 && (
              <View className="mb-8">
                <Text className="text-xl font-bold text-white mb-4">Learning Gap Analysis</Text>
                <View className={`bg-surface p-5 rounded-3xl border border-white/5 shadow-soft ${isDesktop ? 'flex-row flex-wrap justify-between' : 'space-y-4'}`}>
                  {Object.entries(categoryScores).map(([category, score]) => {
                    const displayName = CATEGORY_DISPLAY_NAMES[category] || category;
                    const isWeak = score < 60;
                    return (
                      <View key={category} className={`mb-3 ${isDesktop ? 'w-[48%]' : ''}`}>
                        <View className="flex-row justify-between mb-1">
                          <Text className="text-white font-medium">{displayName}</Text>
                          <Text className={`font-bold ${isWeak ? 'text-red-400' : 'text-green-400'}`}>{score}%</Text>
                        </View>
                        <View className="h-2 bg-background rounded-full overflow-hidden border border-white/5">
                          <View 
                            className={`h-full ${isWeak ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${score}%` }} 
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Recommended Learning Path */}
            <View className="mb-8">
              <View className="flex-row justify-between items-end mb-4">
                <Text className="text-xl font-bold text-white">Your Path</Text>
                <TouchableOpacity>
                  <Text className="text-primary font-medium text-sm">See all</Text>
                </TouchableOpacity>
              </View>

              {learningPath?.recommended_path?.length > 0 ? (
                <View className={isDesktop ? 'flex-row flex-wrap justify-between' : ''}>
                {learningPath.recommended_path.slice(0, 4).map((mod: any, idx: number) => {
                  const isCompleted = dashboardData?.completed_module_ids?.includes(mod.id);
                  return (
                    <TouchableOpacity
                      key={mod.id}
                      className={`p-5 rounded-3xl mb-3 flex-row items-center border shadow-soft ${
                        isCompleted ? 'bg-surface border-green-500/20 opacity-70' : 'bg-surfaceAlt border-white/5'
                      } ${isDesktop ? 'w-[48%]' : ''}`}
                      onPress={() => navigation.navigate('InteractiveLearning', { module_id: mod.id })}
                    >
                      <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${isCompleted ? 'bg-green-500/20' : 'bg-background'}`}>
                        {isCompleted ? <Award size={20} color="#10B981" /> : <BookOpen size={20} color="#3B82F6" />}
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-base mb-1">{mod.title}</Text>
                        <Text className="text-textMuted text-xs">{mod.category} • {mod.estimated_minutes} min</Text>
                      </View>
                      <View className="ml-2">
                        {isCompleted ? (
                          <Text className="text-green-400 text-xs font-bold">Done</Text>
                        ) : (
                          <View className="bg-primary/20 p-2 rounded-full">
                            <ChevronRight size={16} color="#3B82F6" />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  )
                })}
                </View>
              ) : (
                <View className="bg-surface p-6 rounded-3xl border border-white/5 items-center">
                  <Text className="text-textMuted text-center">Take an assessment to generate your personalized learning path.</Text>
                </View>
              )}
            </View>

            {/* Recommended For You Section */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-white mb-4">Recommended For You</Text>
              
              {recommendedVideos.length > 0 ? (
                <View className={isDesktop ? 'flex-row flex-wrap justify-between' : ''}>
                {recommendedVideos.map((video) => {
                  // Find user score for this video's matched categories
                  let userScore = 0;
                  for (const key of video.matchKeys) {
                    if (categoryScores[key] !== undefined) {
                      userScore = categoryScores[key];
                      break;
                    }
                  }

                  const watchPercentage = Math.round((videoProgress[video.id] || 0) * 100);

                  return (
                    <View key={video.id} className={`bg-surface p-4 rounded-3xl mb-4 border border-white/5 shadow-soft ${isDesktop ? 'w-[48%]' : ''}`}>
                      <TouchableOpacity 
                        className="flex-row items-center mb-3"
                        onPress={() => navigation.navigate('NativeVideoPlayer', { video: video, localSource: video.localSource })}
                      >
                        <View className="w-16 h-16 bg-surfaceAlt rounded-2xl items-center justify-center mr-4 border border-white/5 overflow-hidden">
                          {watchPercentage >= 95 ? (
                            <Activity size={28} color="#10B981" />
                          ) : (
                            <PlayCircle size={28} color="#3B82F6" />
                          )}
                          {watchPercentage > 0 && (
                            <View className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                              <View className="h-full bg-primary" style={{ width: `${watchPercentage}%` }} />
                            </View>
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>{video.title}</Text>
                          <Text className="text-textMuted text-xs mb-1">Category: {video.category}</Text>
                          <View className="flex-row items-center">
                            <Text className="text-red-400 text-xs font-bold mr-3">Your Score: {userScore}%</Text>
                            {watchPercentage > 0 && (
                              <Text className={`text-xs font-medium ${watchPercentage >= 95 ? 'text-green-400' : 'text-primary'}`}>
                                {watchPercentage >= 95 ? 'Completed' : `${watchPercentage}% Watched`}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View className="flex-row items-center bg-background px-2.5 py-1 rounded-full ml-2 border border-white/5">
                          <Clock size={12} color="#94A3B8" />
                          <Text className="text-textMuted text-xs ml-1 font-medium">{video.duration}</Text>
                        </View>
                      </TouchableOpacity>
                      
                      <View className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20">
                        <Text className="text-red-300 text-xs">
                          Recommended because your score in this category was below the proficiency threshold.
                        </Text>
                      </View>
                    </View>
                  );
                })}
                </View>
              ) : (
                <View className="bg-surface p-6 rounded-3xl border border-white/5 items-center">
                  <Text className="text-green-400 font-bold mb-2">Excellent work! 🌟</Text>
                  <Text className="text-textMuted text-center text-sm leading-relaxed">
                    No major learning gaps detected. Explore our learning videos to continue improving your oral health knowledge.
                  </Text>
                </View>
              )}
            </View>

            {/* Explore All Videos */}
            <View className="mb-6">
              <View className="flex-row justify-between items-end mb-4">
                <Text className="text-xl font-bold text-white">Explore All Videos</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Exercises')}>
                  <Text className="text-primary font-medium text-sm">See all</Text>
                </TouchableOpacity>
              </View>

              <View className={isDesktop ? 'flex-row flex-wrap justify-between' : ''}>
              {exploreVideos.map((video) => {
                const watchPercentage = Math.round((videoProgress[video.id] || 0) * 100);
                return (
                  <View key={video.id} className={`bg-surface p-4 rounded-3xl mb-3 border border-white/5 shadow-soft ${isDesktop ? 'w-[48%]' : ''}`}>
                    <TouchableOpacity
                      className="flex-row items-center"
                      onPress={() => navigation.navigate('NativeVideoPlayer', { video: video, localSource: video.localSource })}
                    >
                      <View className="w-16 h-16 bg-surfaceAlt rounded-2xl items-center justify-center mr-4 border border-white/5 overflow-hidden">
                        {watchPercentage >= 95 ? (
                          <Activity size={28} color="#10B981" />
                        ) : (
                          <PlayCircle size={28} color="#3B82F6" />
                        )}
                        {watchPercentage > 0 && (
                          <View className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                            <View className="h-full bg-primary" style={{ width: `${watchPercentage}%` }} />
                          </View>
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>{video.title}</Text>
                        <View className="flex-row items-center">
                          <Text className="text-textMuted text-xs mr-3">{video.category}</Text>
                          {watchPercentage > 0 && (
                            <Text className={`text-xs font-medium ${watchPercentage >= 95 ? 'text-green-400' : 'text-primary'}`}>
                              {watchPercentage >= 95 ? 'Completed' : `${watchPercentage}% Watched`}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View className="flex-row items-center bg-background px-2.5 py-1 rounded-full ml-2 border border-white/5">
                        <Clock size={12} color="#94A3B8" />
                        <Text className="text-textMuted text-xs ml-1 font-medium">{video.duration}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
              </View>
            </View>

          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
