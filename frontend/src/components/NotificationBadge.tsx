import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { apiClient } from '../services/api';

interface NotificationBadgeProps {
  children: React.ReactNode;
}

export const NotificationBadge = ({ children }: NotificationBadgeProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await apiClient.get('/api/notifications/unread-count');
      setUnreadCount(data.unread_count);
    } catch (e) {
      console.log('Failed to fetch unread notifications count:', e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // In a real app, this might poll or use websockets.
    // We'll set a simple 30s poll for the demo.
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="relative">
      {children}
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center border-2 border-slate-900">
          <Text className="text-white text-[8px] font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
};
