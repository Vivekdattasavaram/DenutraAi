import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from './types';
import { ShieldAlert, Users, LayoutDashboard } from 'lucide-react-native';
import { Platform, useWindowDimensions } from 'react-native';

import AdminDashboardScreen from '../modules/admin/AdminDashboardScreen';
import UserManagementScreen from '../modules/admin/UserManagementScreen';
import AdminAnalyticsScreen from '../modules/admin/AdminAnalyticsScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminNavigator() {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= 1024;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        sceneStyle: {
          marginLeft: isDesktopWeb ? 256 : 0,
          backgroundColor: '#07101F',
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#07101F',
          ...(isDesktopWeb ? {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 256,
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: 40,
            borderRightWidth: 1,
            borderRightColor: '#1E293B',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          } : {
            height: 72,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopColor: '#15263C',
            borderTopWidth: 1,
            shadowColor: '#000',
            shadowOpacity: 0.18,
            shadowRadius: 20,
            elevation: 20,
          })
        },
        tabBarItemStyle: isDesktopWeb ? {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 24,
          height: 56,
          flex: 0,
          width: '100%',
          marginBottom: 8,
        } : {},
        tabBarActiveTintColor: '#10B981', // Green for admin
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: isDesktopWeb ? 15 : 11,
          fontWeight: '700',
          marginBottom: isDesktopWeb ? 0 : 4,
          marginLeft: isDesktopWeb ? 16 : 0,
        },
      })}
    >
      <Tab.Screen 
        name="OverviewTab" 
        component={AdminDashboardScreen} 
        options={{
          tabBarLabel: 'Console',
          tabBarIcon: ({ color, size }) => {
            const iconSize = isDesktopWeb ? 20 : size;
            return <LayoutDashboard color={color} size={iconSize} />;
          }
        }}
      />
      <Tab.Screen 
        name="UsersTab" 
        component={UserManagementScreen} 
        options={{
          tabBarLabel: 'Directory',
          tabBarIcon: ({ color, size }) => {
            const iconSize = isDesktopWeb ? 20 : size;
            return <Users color={color} size={iconSize} />;
          }
        }}
      />
      <Tab.Screen 
        name="AnalyticsTab" 
        component={AdminAnalyticsScreen} 
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, size }) => {
            const iconSize = isDesktopWeb ? 20 : size;
            return <ShieldAlert color={color} size={iconSize} />;
          }
        }}
      />
    </Tab.Navigator>
  );
}
