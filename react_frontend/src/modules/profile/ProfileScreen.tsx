import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, LogOut, Shield, Edit2, ChevronRight, Flame, BookOpen, Star } from 'lucide-react-native';
import { apiClient } from '../../services/api';
import { NotificationBadge } from '../../components/NotificationBadge';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, updateProfile } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [age, setAge] = useState<string>(user?.age ? String(user.age) : '');
  const [goal, setGoal] = useState(user?.goal ?? '');
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/api/auth/me');
      setStats(res.data.stats);
    } catch (error) {
      console.log('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView className="flex-1 px-6 pt-6 pb-10">
        <View className="items-center mb-8 mt-4">
          <View className="relative mb-4">
            <View className="w-28 h-28 bg-surface rounded-full items-center justify-center border-[3px] border-primary/50 shadow-soft overflow-hidden">
              <User size={48} color="#F8FAFC" />
            </View>
            <TouchableOpacity 
              onPress={() => setEditVisible(true)} 
              className="absolute bottom-0 right-0 bg-primary w-9 h-9 rounded-full items-center justify-center border-2 border-background"
            >
              <Edit2 size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-3xl font-black text-white mb-1">{user?.full_name || 'User'}</Text>
          <Text className="text-textMuted text-sm font-medium tracking-wide">{user?.email}</Text>
        </View>

        {/* Stats Section */}
        {loading ? (
          <ActivityIndicator size="small" color="#3B82F6" className="mb-8" />
        ) : (
          <View className="flex-row justify-between mb-8">
            <View className="flex-1 bg-surface py-5 px-2 rounded-3xl items-center border border-white/5 mx-1 shadow-soft">
              <Star size={24} color="#F59E0B" className="mb-2" />
              <Text className="text-white font-bold text-2xl mb-1">{stats?.average_score || 0}</Text>
              <Text className="text-textMuted text-[10px] font-semibold uppercase tracking-wider text-center">Avg Score</Text>
            </View>
            <View className="flex-1 bg-surface py-5 px-2 rounded-3xl items-center border border-white/5 mx-1 shadow-soft">
              <BookOpen size={24} color="#3B82F6" className="mb-2" />
              <Text className="text-white font-bold text-2xl mb-1">{(stats?.learning_progress * 100).toFixed(0) || 0}%</Text>
              <Text className="text-textMuted text-[10px] font-semibold uppercase tracking-wider text-center">Learning</Text>
            </View>
            <View className="flex-1 bg-surface py-5 px-2 rounded-3xl items-center border border-white/5 mx-1 shadow-soft">
              <Flame size={24} color="#EF4444" className="mb-2" />
              <Text className="text-white font-bold text-2xl mb-1">{stats?.streak_days || 0}</Text>
              <Text className="text-textMuted text-[10px] font-semibold uppercase tracking-wider text-center">Streak</Text>
            </View>
          </View>
        )}

        <View className="bg-surface rounded-3xl p-1 mb-8 shadow-soft border border-white/5 overflow-hidden">
          <SettingItem 
            icon={<User size={20} color="#3B82F6" />}
            title="Edit Profile"
            onPress={() => setEditVisible(true)}
          />
          <SettingItem 
            icon={
              <NotificationBadge>
                <Bell size={20} color="#10B981" />
              </NotificationBadge>
            }
            title="Notifications"
            onPress={() => navigation.navigate('Notifications')}
          />
          <SettingItem 
            icon={<Shield size={20} color="#F59E0B" />}
            title="Security"
            onPress={() => navigation.navigate('Security')}
            isLast
          />
        </View>

        <TouchableOpacity 
          onPress={logout}
          className="flex-row items-center justify-center p-4 rounded-2xl border border-error/30 bg-error/10 mb-8"
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-error font-bold text-lg ml-2">Log Out</Text>
        </TouchableOpacity>
        
        {/* Edit Profile Modal */}
        <Modal visible={editVisible} animationType="slide" transparent>
          <View style={{ flex: 1, backgroundColor: '#00000099', justifyContent: 'center', padding: 20 }}>
            <View style={{ backgroundColor: '#0f1724', borderRadius: 12, padding: 16 }}>
              <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Edit Profile</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 6 }}>Full name</Text>
              <TextInput value={fullName} onChangeText={setFullName} placeholder="Full name" placeholderTextColor="#94A3B8" style={{ backgroundColor: '#020617', color: '#F8FAFC', padding: 10, borderRadius: 8, marginBottom: 10 }} />
              <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 6 }}>Age</Text>
              <TextInput value={age} onChangeText={setAge} placeholder="Age" placeholderTextColor="#94A3B8" keyboardType="numeric" style={{ backgroundColor: '#020617', color: '#F8FAFC', padding: 10, borderRadius: 8, marginBottom: 10 }} />
              <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 6 }}>Goal</Text>
              <TextInput value={goal} onChangeText={setGoal} placeholder="Your goal" placeholderTextColor="#94A3B8" style={{ backgroundColor: '#020617', color: '#F8FAFC', padding: 10, borderRadius: 8, marginBottom: 16 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => setEditVisible(false)} style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ color: '#94A3B8' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                  const updated = {
                    ...(user || { email: '' }),
                    full_name: fullName,
                    age: age ? Number(age) : undefined,
                    goal: goal || undefined,
                  };
                  await updateProfile(updated as any);
                  setEditVisible(false);
                }} style={{ backgroundColor: '#3B82F6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginLeft: 10 }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ScreenWrapper>
  );
}

function SettingItem({ icon, title, onPress, rightElement, isLast = false }: any) {
  return (
    <TouchableOpacity 
      className={`flex-row items-center p-5 ${!isLast ? 'border-b border-white/5' : ''}`}
      onPress={onPress}
      disabled={!onPress}
    >
      <View className="w-10 h-10 bg-background rounded-xl items-center justify-center mr-4 border border-white/5">
        {icon}
      </View>
      <Text className="flex-1 text-white font-semibold text-base">{title}</Text>
      {rightElement || <ChevronRight size={20} color="#64748B" />}
    </TouchableOpacity>
  );
}
