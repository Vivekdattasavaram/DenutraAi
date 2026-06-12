import 'package:flutter/material.dart';
import 'config/app_routes.dart';
import 'theme/theme.dart';

// Import all screens
import 'screens/splash_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/auth_screen.dart';
import 'screens/register_screen.dart';
import 'screens/otp_verification_screen.dart';
import 'screens/forgot_password_screen.dart';
import 'screens/reset_password_screen.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'DentAI - Oral Health Literacy Assistant',
      theme: AppTheme.getThemeData(),
      home: const SplashScreen(),
      onGenerateRoute: RouteGenerator.generateRoute,
      routes: {
        AppRoutes.splash: (context) => const SplashScreen(),
        AppRoutes.onboarding: (context) => const OnboardingScreen(),
        AppRoutes.login: (context) => const AuthScreen(),
        AppRoutes.register: (context) => RegisterScreen(),
        AppRoutes.forgotPassword: (context) => ForgotPasswordScreen(),
        AppRoutes.dashboard: (context) => const DashboardScreen(),
      },
    );
  }
}