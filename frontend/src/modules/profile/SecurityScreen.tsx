import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ChevronLeft, KeyRound, ShieldAlert, Smartphone, Clock, ChevronRight } from 'lucide-react-native';

export default function SecurityScreen({ navigation }: any) {
  const { logout } = require('../../hooks/useAuth').useAuth();
  const [twoFA, setTwoFA] = React.useState(false);
  const lastLogin = '2026-05-25 09:42';

  const confirmDelete = () => {
    Alert.alert('Delete Account', 'This action will permanently delete your account. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete requested') },
    ]);
  };

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Security</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-white/60 font-semibold uppercase tracking-widest text-xs mb-3 ml-2">Account Security</Text>
          <View className="bg-surface rounded-3xl p-1 shadow-soft border border-white/5 overflow-hidden">
            <SettingRow 
              icon={<Clock size={20} color="#3B82F6" />}
              title="Last Login"
              value={lastLogin}
            />
            <SettingRow 
              icon={<KeyRound size={20} color="#10B981" />}
              title="Change Password"
              onPress={async () => {
                await logout();
                // After logout, the user is thrown to Auth.
                // We'll use the global NavigationService after a short delay 
                // to navigate to the ForgotPassword screen inside Auth.
                setTimeout(() => {
                  const navService = require('../../navigation/NavigationService');
                  navService.navigate('ForgotPassword');
                }, 100);
              }}
            />
            <SettingRow 
              icon={<Smartphone size={20} color="#F59E0B" />}
              title="Two-Factor Auth"
              rightElement={
                <Switch 
                  value={twoFA} 
                  onValueChange={setTwoFA} 
                  trackColor={{ false: '#334155', true: '#F59E0B' }}
                  thumbColor="#ffffff"
                />
              }
            />
            <SettingRow 
              icon={<ShieldAlert size={20} color="#EF4444" />}
              title="Delete Account"
              titleColor="#EF4444"
              onPress={confirmDelete}
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function SettingRow({ icon, title, titleColor = "#ffffff", value, onPress, rightElement, isLast = false }: any) {
  return (
    <TouchableOpacity 
      className={`flex-row items-center p-4 ${!isLast ? 'border-b border-white/5' : ''}`}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View className="w-10 h-10 bg-background rounded-xl items-center justify-center mr-4 border border-white/5">
        {icon}
      </View>
      <Text className="flex-1 font-medium text-base" style={{ color: titleColor }}>{title}</Text>
      
      {rightElement ? (
        rightElement
      ) : (
        <View className="flex-row items-center">
          {value && <Text className="text-white/50 text-sm mr-2">{value}</Text>}
          {onPress && <ChevronRight size={20} color="#64748B" />}
        </View>
      )}
    </TouchableOpacity>
  );
}
