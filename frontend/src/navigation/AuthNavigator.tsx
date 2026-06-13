import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import SplashScreen from '../modules/auth/SplashScreen';
import OnboardingScreen from '../modules/onboarding/OnboardingScreen';
import LoginScreen from '../modules/auth/LoginScreen';
import RegisterScreen from '../modules/auth/RegisterScreen';
import ForgotPasswordScreen from '../modules/auth/ForgotPasswordScreen';
import OtpVerificationScreen from '../modules/auth/OtpVerificationScreen';
import ResetPasswordScreen from '../modules/auth/ResetPasswordScreen';
import WelcomeScreen from '../modules/auth/WelcomeScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade'
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />

      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}
