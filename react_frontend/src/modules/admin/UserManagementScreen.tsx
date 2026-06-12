import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Users, AlertCircle, ShieldCheck } from 'lucide-react-native';
import { apiClient } from '../../services/api';

export default function UserManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/admin/users');
      setUsers(data);
    } catch (e) {
      console.log('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRiskColor = (risk: string) => {
    if (risk === "High Risk") return "text-red-400";
    if (risk === "Medium Risk") return "text-orange-400";
    if (risk === "Low Risk") return "text-green-400";
    return "text-slate-400";
  };

  return (
    <ScreenWrapper useSafeArea>
      <View className="flex-1 px-4 pt-6 pb-0">
        <View className="flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center mr-3">
            <Users color="#3B82F6" size={20} />
          </View>
          <View>
            <Text className="text-white text-xl font-bold">User Directory</Text>
            <Text className="text-slate-400 text-sm">Manage {users.length} registered patients</Text>
          </View>
        </View>

        {/* Table Header */}
        <View className="flex-row bg-slate-800/80 px-4 py-3 rounded-t-xl border-b border-slate-700">
          <Text className="flex-1 text-slate-400 text-xs font-bold uppercase">Patient</Text>
          <Text className="flex-1 text-slate-400 text-xs font-bold uppercase text-center">Score</Text>
          <Text className="flex-1 text-slate-400 text-xs font-bold uppercase text-right">Risk</Text>
        </View>

        {loading && users.length === 0 ? (
          <ActivityIndicator size="large" color="#3B82F6" className="mt-20" />
        ) : (
          <ScrollView 
            className="flex-1 bg-slate-800/30 rounded-b-xl"
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadUsers} tintColor="#3B82F6" />}
          >
            {users.map((user, index) => (
              <View 
                key={user.id} 
                className={`flex-row items-center px-4 py-4 border-b border-slate-700/50 ${index === users.length - 1 ? 'border-b-0' : ''}`}
              >
                <View className="flex-1">
                  <Text className="text-white font-medium mb-1">{user.name}</Text>
                  <Text className="text-slate-500 text-xs" numberOfLines={1}>{user.email}</Text>
                </View>
                
                <View className="flex-1 items-center justify-center">
                  <View className="bg-slate-700/50 px-3 py-1 rounded-full">
                    <Text className="text-white font-bold">{user.literacy_score || 0}%</Text>
                  </View>
                </View>

                <View className="flex-1 items-end justify-center">
                  <View className="flex-row items-center">
                    {user.risk_level === 'High Risk' ? (
                      <AlertCircle size={14} color="#EF4444" className="mr-1" />
                    ) : user.risk_level === 'Low Risk' ? (
                      <ShieldCheck size={14} color="#10B981" className="mr-1" />
                    ) : null}
                    <Text className={`text-xs font-semibold ${getRiskColor(user.risk_level)}`}>
                      {user.risk_level}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            <View className="h-20" />
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
}
