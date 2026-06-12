import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Platform, RefreshControl, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Shield, Users, Activity, PlaySquare, FileQuestion, AlertTriangle, LogOut } from 'lucide-react-native';
import { apiClient } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboardScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/admin/dashboard');
      setStats(data);
    } catch (e) {
      console.log('Failed to load admin dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const StatCard = ({ title, value, icon, subtitle }: { title: string, value: string | number, icon: any, subtitle?: string }) => (
    <View className={`bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mb-4 ${isDesktop ? 'w-[32%]' : 'w-[48%]'}`}>
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center mr-3">
          {icon}
        </View>
        <Text className="text-slate-400 text-xs font-medium flex-1 uppercase tracking-wider">{title}</Text>
      </View>
      <Text className="text-white text-3xl font-bold">{value}</Text>
      {subtitle && <Text className="text-slate-500 text-xs mt-1">{subtitle}</Text>}
    </View>
  );

  return (
    <ScreenWrapper useSafeArea>
      <ScrollView 
        className={`flex-1 pt-6 ${isDesktop ? 'px-8' : 'px-4'}`}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadDashboard} tintColor="#10B981" />}
      >
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-emerald-500/20 items-center justify-center mr-3">
              <Shield color="#10B981" size={20} />
            </View>
            <View>
              <Text className="text-white text-xl font-bold">Admin Console</Text>
              <Text className="text-slate-400 text-sm">Platform Health Overview</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={logout} 
            className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center"
            activeOpacity={0.7}
          >
            <LogOut color="#EF4444" size={18} />
          </TouchableOpacity>
        </View>

        {loading && !stats ? (
          <ActivityIndicator size="large" color="#10B981" className="mt-20" />
        ) : stats ? (
          <View className={`flex-row flex-wrap ${isDesktop ? 'gap-4 justify-start' : 'justify-between'}`}>
            <StatCard 
              title="Total Users" 
              value={stats.total_users} 
              icon={<Users color="#3B82F6" size={16} />} 
              subtitle="Registered accounts"
            />
            <StatCard 
              title="Assessments" 
              value={stats.total_assessments} 
              icon={<Activity color="#F59E0B" size={16} />} 
              subtitle="Completed flows"
            />
            <StatCard 
              title="Avg Literacy" 
              value={`${stats.avg_literacy_score}%`} 
              icon={<FileQuestion color="#8B5CF6" size={16} />} 
              subtitle="Platform average"
            />
            <StatCard 
              title="High Risk" 
              value={stats.high_risk_users} 
              icon={<AlertTriangle color="#EF4444" size={16} />} 
              subtitle="Requires attention"
            />
            <StatCard 
              title="Videos Watched" 
              value={stats.videos_watched} 
              icon={<PlaySquare color="#10B981" size={16} />} 
              subtitle="Engagement metric"
            />
            <StatCard 
              title="Quiz Attempts" 
              value={stats.quiz_attempts} 
              icon={<Shield color="#6366F1" size={16} />} 
              subtitle="Learning metric"
            />
          </View>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
}
