import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendInstructions = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      await apiClient.post(`/api/auth/forgot-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      navigation.navigate('OtpVerification', { email: email.trim().toLowerCase(), isPasswordReset: true });
    } catch (error: any) {
      console.log('Forgot Password Error Message:', error.message);
      console.log('Forgot Password Error Data:', error.response?.data);
      const errMsg = error.response?.data?.detail || 'An error occurred';
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
            <Text className="text-3xl font-bold text-text mb-2">Reset Password</Text>
            <Text className="text-textMuted text-base">
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
          </View>

          <View className="space-y-6 w-full">
            <Input
              label="Email Address"
              placeholder="Enter your registered email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button 
              title="Send Instructions" 
              onPress={handleSendInstructions} 
              loading={loading}
              size="lg"
            />

            <Button 
              title="Back to Login" 
              variant="ghost"
              onPress={() => navigation.goBack()} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
