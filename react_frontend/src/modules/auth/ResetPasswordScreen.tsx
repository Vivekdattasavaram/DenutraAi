import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api';

export default function ResetPasswordScreen({ route, navigation }: any) {
  const { email, otp_code } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/api/auth/reset-password', {
        email: email,
        otp_code: otp_code,
        new_password: password
      });
      
      Alert.alert(
        'Success', 
        'Your password has been successfully reset. Please login with your new password.',
        [
          { text: 'Login', onPress: () => navigation.replace('Login') }
        ]
      );
    } catch (error: any) {
      console.log('Reset Password Error Message:', error.message);
      console.log('Reset Password Error Data:', error.response?.data);
      const errMsg = error.response?.data?.detail || 'Failed to reset password. Please try again.';
      Alert.alert('Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          <View className="mt-8 mb-10">
            <Text className="text-3xl font-bold text-text mb-2">Create New Password</Text>
            <Text className="text-textMuted text-base">
              Your new password must be different from previous used passwords.
            </Text>
          </View>

          <View className="space-y-6 w-full">
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button 
              title="Reset Password" 
              onPress={handleResetPassword} 
              loading={loading}
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
