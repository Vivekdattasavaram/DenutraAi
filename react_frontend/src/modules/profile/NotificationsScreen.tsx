import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Platform, useWindowDimensions } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ChevronLeft, BellRing, Info, CheckCircle2, Activity, PlaySquare, AlertTriangle, MessageCircle, FileQuestion } from 'lucide-react-native';
import { apiClient } from '../../services/api';

export default function NotificationsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/notifications');
      setNotifications(data);
    } catch (e) {
      console.log('Failed to fetch notifications', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handlePress = async (notif: any) => {
    if (!notif.is_read) {
      try {
        await apiClient.post(`/api/notifications/read/${notif.id}`);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      } catch (e) {
        console.log('Failed to mark read', e);
      }
    }
    if (notif.action_route) {
      // Map basic names to routes
      if (notif.action_route === 'Assessment History') navigation.navigate('HomeTab', { screen: 'ProgressTracking' });
      else if (notif.action_route === 'Learning Dashboard') navigation.navigate('LearningTab', { screen: 'LearningDashboard' });
      else if (notif.action_route === 'Video Player') navigation.navigate('LearningTab', { screen: 'LearningDashboard' });
      else if (notif.action_route === 'Latest Assessment Result') navigation.navigate('HomeTab', { screen: 'Dashboard' });
      else if (notif.action_route === 'Daily Quiz') navigation.navigate('LearningTab', { screen: 'DailyQuiz' });
      else if (notif.action_route === 'Profile') navigation.navigate('ProfileTab', { screen: 'Profile' });
    }
  };

  const markAllRead = async () => {
    try {
      await apiClient.post('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      console.log('Failed to mark all read', e);
    }
  };

  // Group notifications
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const grouped = {
    Today: [] as any[],
    Yesterday: [] as any[],
    Earlier: [] as any[]
  };

  notifications.forEach(n => {
    const d = new Date(n.created_at);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) grouped.Today.push(n);
    else if (d.getTime() === yesterday.getTime()) grouped.Yesterday.push(n);
    else grouped.Earlier.push(n);
  });

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View style={{ flex: 1, width: '100%', maxWidth: isDesktop ? 900 : '100%', alignSelf: 'center' }}>
        <View className="flex-row items-center justify-between px-6 pt-2 pb-4 border-b border-white/5">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
              <ChevronLeft size={28} color="#F8FAFC" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-xl">Inbox</Text>
          </View>
          <TouchableOpacity onPress={markAllRead}>
            <Text className="text-primary font-semibold">Mark all read</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1 px-6 pt-6 pb-10" 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchNotifications} tintColor="#3B82F6" />}
        >
          {notifications.length === 0 && !loading ? (
            <View className="items-center justify-center py-20">
              <BellRing size={48} color="#1E293B" className="mb-4" />
              <Text className="text-textMuted text-lg font-medium">No notifications yet</Text>
            </View>
          ) : (
            <>
              {grouped.Today.length > 0 && (
                <View className="mb-6">
                  <Text className="text-textMuted font-bold uppercase tracking-wider text-xs mb-3">Today</Text>
                  {grouped.Today.map(n => <NotificationCard key={n.id} notif={n} onPress={() => handlePress(n)} />)}
                </View>
              )}
              {grouped.Yesterday.length > 0 && (
                <View className="mb-6">
                  <Text className="text-textMuted font-bold uppercase tracking-wider text-xs mb-3">Yesterday</Text>
                  {grouped.Yesterday.map(n => <NotificationCard key={n.id} notif={n} onPress={() => handlePress(n)} />)}
                </View>
              )}
              {grouped.Earlier.length > 0 && (
                <View className="mb-6">
                  <Text className="text-textMuted font-bold uppercase tracking-wider text-xs mb-3">Earlier</Text>
                  {grouped.Earlier.map(n => <NotificationCard key={n.id} notif={n} onPress={() => handlePress(n)} />)}
                </View>
              )}
              <View className="h-10" />
            </>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

function NotificationCard({ notif, onPress }: any) {
  const getIcon = () => {
    switch(notif.type) {
      case 'assessment': return <Activity size={20} color="#3B82F6" />;
      case 'recommendation': return <Info size={20} color="#F59E0B" />;
      case 'risk_alert': return <AlertTriangle size={20} color="#EF4444" />;
      case 'achievement': return <CheckCircle2 size={20} color="#10B981" />;
      case 'quiz': return <FileQuestion size={20} color="#8B5CF6" />;
      case 'video': return <PlaySquare size={20} color="#F472B6" />;
      case 'chatbot_tip': return <MessageCircle size={20} color="#0EA5E9" />;
      default: return <BellRing size={20} color="#94A3B8" />;
    }
  };

  const getRelativeTime = (dateString: string) => {
    const d = new Date(dateString);
    let hours = d.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let mins = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins} ${ampm}`;
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`p-5 rounded-3xl flex-row shadow-soft mb-3 border ${!notif.is_read ? 'bg-surfaceAlt border-primary/30' : 'bg-surface border-white/5'}`}
    >
      <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 border ${!notif.is_read ? 'bg-primary/10 border-primary/20' : 'bg-background border-white/5'}`}>
        {getIcon()}
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className={`font-bold text-base ${!notif.is_read ? 'text-white' : 'text-white/70'}`}>{notif.title}</Text>
          {!notif.is_read && <View className="w-2 h-2 rounded-full bg-primary" />}
        </View>
        <Text className="text-textMuted text-sm leading-snug mb-2">{notif.message}</Text>
        <Text className="text-white/40 text-xs font-medium">{getRelativeTime(notif.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}
