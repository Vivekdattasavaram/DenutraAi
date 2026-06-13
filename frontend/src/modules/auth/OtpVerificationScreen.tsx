import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../services/api';

export default function OtpVerificationScreen({ route, navigation }: any) {
  const { login } = useAuth();
  const { email, isPasswordReset } = route.params || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/verify-otp', {
        email: email,
        otp_code: otp,
        is_password_reset: isPasswordReset || false
      });
      
      if (isPasswordReset) {
        Alert.alert('Success', 'OTP verified. You can now reset your password.');
        // Navigate to ResetPassword
        navigation.replace('ResetPassword', { email: email, otp_code: otp });
      } else {
        const token = response.data.access_token;
        const user = response.data.user;
        navigation.replace('Onboarding', { token, user });
      }
    } catch (error: any) {
      console.log('OTP Verification Error Message:', error.message);
      console.log('OTP Verification Error Data:', error.response?.data);
      const errMsg = error.response?.data?.detail || 'Invalid or expired OTP';
      Alert.alert('Verification Failed', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await apiClient.post(`/api/auth/forgot-password?email=${encodeURIComponent(email?.trim().toLowerCase() || '')}`);
      Alert.alert('Success', 'Verification code resent to your email');
    } catch (error: any) {
      console.log('Resend OTP Error:', error.message);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  return (
    <ScreenWrapper className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-8 mb-10">
            <Text className="text-3xl font-bold text-text mb-2">Verification Code</Text>
            <Text className="text-textMuted text-base">
              We've sent a 6-digit verification code to <Text className="font-semibold text-text">{email || 'your email'}</Text>.
            </Text>
          </View>

          <View className="space-y-6 w-full">
            <Input
              label="OTP Code"
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />

            <Button 
              title="Verify Code" 
              onPress={handleVerify} 
              loading={loading}
              size="lg"
            />

            <Button 
              title="Resend Code" 
              variant="ghost"
              onPress={handleResendCode} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
