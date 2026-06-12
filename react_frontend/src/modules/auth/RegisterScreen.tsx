import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await apiClient.post('/api/auth/register', {
        email: email.trim().toLowerCase(),
        full_name: name,
        password: password
      });
      // Navigate to OTP Verification
      navigation.navigate('OtpVerification', { email: email.trim().toLowerCase() });
    } catch (error: any) {
      console.log('Registration Error Message:', error.message);
      console.log('Registration Error Data:', error.response?.data);
      const errMsg = error.response?.data?.detail || 'An error occurred during registration';
      Alert.alert('Registration Failed', errMsg);
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
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 mt-4">
            <Text className="text-3xl font-bold text-text mb-2">Create Account</Text>
            <Text className="text-textMuted text-base">
              Start your journey to better oral health
            </Text>
          </View>

          <View className="space-y-4 w-full mb-8">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              label="Password"
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button 
              title="Sign Up" 
              onPress={handleRegister} 
              loading={loading}
              size="lg"
              className="mt-6"
            />
          </View>

          <View className="flex-row justify-center mt-auto mb-4">
            <Text className="text-textMuted">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-primary font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
