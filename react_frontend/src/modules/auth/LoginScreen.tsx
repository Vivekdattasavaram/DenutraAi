import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../services/api';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password: password
      });
      const token = response.data.access_token;
      await login(token, response.data.user);
    } catch (error: any) {
      console.log('Login Error Message:', error.message);
      console.log('Login Error Data:', error.response?.data);
      const errMsg = error.response?.data?.detail || 'Invalid email or password';
      Alert.alert('Login Failed', errMsg);
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
          <View className="mb-10 items-center">
            <View className="w-24 h-24 bg-primary/20 rounded-3xl items-center justify-center mb-6">
              <Text className="text-4xl">🦷</Text>
            </View>
            <Text className="text-3xl font-bold text-text mb-2 text-center">Welcome Back</Text>
            <Text className="text-textMuted text-base text-center">
              Sign in to continue your oral health journey
            </Text>
          </View>

          <View className="space-y-4 w-full">
            <Input
              testID="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              testID="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity 
              className="items-end mt-2 mb-6"
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text className="text-primary font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            <Button 
              testID="login-button"
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading}
              size="lg"
            />
          </View>

          <View className="flex-row justify-center mt-10">
            <Text className="text-textMuted">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-primary font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
