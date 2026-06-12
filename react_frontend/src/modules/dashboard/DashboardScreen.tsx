import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Settings, Bell, ChevronRight, Calendar, Award, MessageCircle, ExternalLink, Sparkles } from 'lucide-react-native';
import { apiClient } from '../../services/api';
import { LineChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { OralHealthInsights } from '../../components/OralHealthInsights';
import { NotificationBadge } from '../../components/NotificationBadge';

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  useEffect(() => {
    if (isFocused) {
      fetchHistory();
    }
  }, [isFocused]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/assessment/history');
      setHistory(response.data);
    } catch (e) {
      console.log('Failed to fetch history', e);
    } finally {
      setLoading(false);
    }
  };

  const latestResult = useMemo(() => {
    if (!history.length) return null;
    return history[history.length - 1];
  }, [history]);

  const latestScore = latestResult?.oral_health_score ?? 0;
  const latestRisk = latestResult?.risk_level ?? 'Take Assessment';
  const latestConfidence = latestResult?.ml_confidence ?? 0;

  const chartData = history.map((h: any, index: number) => ({
    value: Math.round(h.oral_health_score),
    label: `T${index + 1}`,
  }));

  const handleStartAssessment = () => {
    navigation.navigate('AssessmentIntro');
  };

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView className="flex-1 px-6 pt-6 pb-10" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-start mb-8">
          <View>
            <Text className="text-textMuted text-base font-medium mb-1">Welcome back,</Text>
            <Text className="text-3xl font-bold text-text">{user?.full_name?.split(' ')[0] ?? 'Datta'}</Text>
          </View>
          <TouchableOpacity
            className="w-12 h-12 bg-surfaceAlt rounded-2xl items-center justify-center border border-white/5 shadow-soft"
            onPress={() => navigation.navigate('ProfileTab', { screen: 'Notifications' })}
          >
            <NotificationBadge>
              <Bell size={22} color="#F8FAFC" />
            </NotificationBadge>
          </TouchableOpacity>
        </View>

        <View style={isDesktop ? { flexDirection: 'row', marginBottom: 24 } : {}}>
          <LinearGradient
            colors={['#1E3A8A', '#0F172A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`rounded-[32px] p-6 shadow-soft ${isDesktop ? 'flex-1 mr-6' : 'mb-6'}`}
          >
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="text-white/80 font-semibold text-lg">Your Oral Health Score</Text>
                <View className="bg-primary/20 mt-2 px-3 py-1.5 rounded-full self-start">
                  <Text className="text-accent font-bold text-xs uppercase tracking-wider">{latestRisk}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-end justify-between mb-2">
              <View className="flex-row items-baseline">
                <Text className="text-6xl font-black text-white tracking-tighter">{loading ? '--' : Math.round(latestScore)}</Text>
                <Text className="text-white/60 font-medium text-lg ml-2">out of 100</Text>
              </View>
              <View className="items-end">
                <Text className="text-white/50 font-medium text-xs uppercase tracking-widest mb-1">AI Confidence</Text>
                <Text className="text-accent font-bold text-lg">{latestConfidence ? `${Math.round(latestConfidence * 100)}%` : '—'}</Text>
              </View>
            </View>

            <View className="mt-4 mb-8">
              <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                <View
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${Math.min(Math.max(latestScore, 0), 100)}%` }}
                />
              </View>
            </View>

            <TouchableOpacity 
              className="bg-white py-4 rounded-2xl flex-row items-center justify-center shadow-soft mt-auto"
              onPress={handleStartAssessment}
            >
              <Text className="text-background font-bold text-lg mr-2">Start Assessment</Text>
              <ChevronRight size={20} color="#07101F" strokeWidth={3} />
            </TouchableOpacity>
          </LinearGradient>

          <View className={isDesktop ? "flex-1" : ""}>
            {chartData.length > 0 ? (
              <TouchableOpacity 
                className={`bg-surface rounded-3xl p-5 border border-border shadow-soft ${isDesktop ? 'flex-1 justify-center' : 'mb-6'}`}
                onPress={() => navigation.navigate('HomeTab', { screen: 'ProgressTracking' })}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-text font-bold text-lg">Progress Trend</Text>
                  <Text className="text-textMuted text-sm">Last {chartData.length} sessions</Text>
                </View>
                <LineChart
                  data={chartData}
                  color="#3B82F6"
                  thickness={4}
                  dataPointsColor="#22C55E"
                  hideRules
                  xAxisColor="transparent"
                  yAxisColor="transparent"
                  xAxisLabelTextStyle={{ color: '#94A3B8' }}
                  yAxisTextStyle={{ color: '#94A3B8' }}
                  height={170}
                  noOfSections={4}
                  maxValue={100}
                />
              </TouchableOpacity>
            ) : (
              <View className={`bg-surface rounded-3xl p-5 border border-border shadow-soft ${isDesktop ? 'flex-1 justify-center' : 'mb-6'}`}>
                <Text className="text-text font-semibold text-lg mb-3">No history yet</Text>
                <Text className="text-textMuted">Complete your first assessment to unlock performance trends and insights.</Text>
              </View>
            )}
          </View>
        </View>

        <OralHealthInsights personalized={true} showDots={true} />

        {/* Advertisement Banner */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="text-text font-bold text-lg">Sponsored</Text>
        </View>
        <TouchableOpacity className="bg-surface rounded-3xl p-5 mb-10 border border-white/5 shadow-soft flex-row items-center">
          <View className="w-16 h-16 bg-primary/20 rounded-2xl items-center justify-center mr-4">
            <Sparkles size={28} color="#3B82F6" />
          </View>
          <View className="flex-1 pr-2">
            <Text className="text-white font-bold text-base mb-1">Dentura Premium Brush</Text>
            <Text className="text-textMuted text-sm leading-snug">Upgrade your daily routine with sonic technology. Save 20% today.</Text>
          </View>
          <ExternalLink size={20} color="#94A3B8" />
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}
