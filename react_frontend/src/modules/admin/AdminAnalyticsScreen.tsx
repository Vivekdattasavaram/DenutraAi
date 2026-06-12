import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { PieChart, LineChart } from 'react-native-gifted-charts';
import { Activity, BookOpen, ShieldAlert } from 'lucide-react-native';
import { apiClient } from '../../services/api';

export default function AdminAnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/admin/analytics');
      setAnalytics(data);
    } catch (e) {
      console.log('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const MetricRow = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
    <View className="flex-row items-center justify-between py-3 border-b border-slate-700/30">
      <View className="flex-row items-center">
        <View className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: color }} />
        <Text className="text-slate-300 font-medium">{label}</Text>
      </View>
      <Text className="text-white font-bold">{value}</Text>
    </View>
  );

  return (
    <ScreenWrapper useSafeArea>
      <ScrollView 
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadAnalytics} tintColor="#F59E0B" />}
      >
        <View className="flex-row items-center mb-8">
          <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center mr-3">
            <ShieldAlert color="#F59E0B" size={20} />
          </View>
          <View>
            <Text className="text-white text-xl font-bold">Deep Analytics</Text>
            <Text className="text-slate-400 text-sm">Engagement & Performance</Text>
          </View>
        </View>

        {loading && !analytics ? (
          <ActivityIndicator size="large" color="#F59E0B" className="mt-20" />
        ) : analytics ? (
          <>
            {/* Assessment Analytics */}
            <View className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 mb-6">
              <View className="flex-row items-center mb-4">
                <Activity color="#3B82F6" size={18} className="mr-2" />
                <Text className="text-white font-bold text-lg">Assessment Profile</Text>
              </View>
              
              <MetricRow 
                label="Average Literacy Score" 
                value={`${analytics.assessment_analytics.average_literacy_score}%`} 
                color="#3B82F6" 
              />
              <MetricRow 
                label="High Risk Percentage" 
                value={`${analytics.assessment_analytics.high_risk_percentage}%`} 
                color="#EF4444" 
              />
              <View className="mt-6 items-center">
                <Text className="text-slate-400 text-xs mb-4 uppercase tracking-wider font-bold">Risk Distribution</Text>
                <PieChart
                  data={[
                    { value: analytics.assessment_analytics.high_risk_percentage, color: '#EF4444' },
                    { value: 100 - analytics.assessment_analytics.high_risk_percentage, color: '#10B981' }
                  ]}
                  donut
                  radius={70}
                  innerRadius={50}
                  centerLabelComponent={() => {
                    return <Text className="text-white font-bold text-lg">{analytics.assessment_analytics.high_risk_percentage}%</Text>;
                  }}
                />
              </View>
            </View>

            {/* Learning Analytics */}
            <View className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 mb-10">
              <View className="flex-row items-center mb-4">
                <BookOpen color="#10B981" size={18} className="mr-2" />
                <Text className="text-white font-bold text-lg">Engagement Profile</Text>
              </View>
              
              <MetricRow 
                label="Total Videos Watched" 
                value={analytics.learning_analytics.videos_watched} 
                color="#10B981" 
              />
              <MetricRow 
                label="Quiz Completions" 
                value={analytics.learning_analytics.quiz_completions} 
                color="#F59E0B" 
              />
              <MetricRow 
                label="Fact/Myth Interactions" 
                value={analytics.learning_analytics.fact_myth_interactions} 
                color="#8B5CF6" 
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
}
