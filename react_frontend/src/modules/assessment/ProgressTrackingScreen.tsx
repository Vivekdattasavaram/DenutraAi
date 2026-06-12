import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { LineChart } from 'react-native-gifted-charts';
import { apiClient } from '../../services/api';
import { useIsFocused } from '@react-navigation/native';

export default function ProgressTrackingScreen({ navigation }: any) {
  const isFocused = useIsFocused();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const chartData = history.map((h: any, index: number) => ({
    value: Math.round(h.oral_health_score),
    label: `T${index + 1}`,
  }));
  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView className="flex-1 px-6 pt-6 pb-10">
        <View className="mb-8 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-text">Your Progress</Text>
          <Button title="Back" variant="ghost" size="sm" onPress={() => navigation.goBack()} />
        </View>

        <View className="bg-surface rounded-3xl p-6 mb-6">
          <Text className="text-text font-bold text-lg mb-4">Score History</Text>
          {loading ? (
            <View className="h-48 items-center justify-center">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : chartData.length > 0 ? (
            <View className="h-48 items-center justify-center border border-white/5 rounded-xl">
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
            </View>
          ) : (
            <View className="h-48 bg-background/50 rounded-xl items-center justify-center border border-white/5 p-4">
              <Text className="text-textMuted text-center">No assessments found. Complete an assessment to see your progress.</Text>
            </View>
          )}
        </View>

        <Text className="text-text font-bold text-xl mb-4">Recent Assessments</Text>
        <View className="space-y-3">
          {history.length > 0 ? (
            [...history].reverse().map((h: any, index: number) => (
              <View key={h.id || index} className="bg-surface p-4 rounded-xl flex-row justify-between items-center">
                <View>
                  <Text className="text-text font-medium">{new Date(h.created_at).toLocaleDateString()}</Text>
                  <Text className="text-textMuted text-xs mt-1">{h.risk_level}</Text>
                </View>
                <Text className="text-primary font-bold text-lg">{Math.round(h.oral_health_score)}</Text>
              </View>
            ))
          ) : (
            <View className="bg-surface p-6 rounded-xl items-center">
              <Text className="text-textMuted text-center">No recent history.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
