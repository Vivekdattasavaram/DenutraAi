import 'package:flutter/material.dart';
import '../screens/splash_screen.dart';
import '../screens/auth_screen.dart';
import '../screens/register_screen.dart';
import '../screens/otp_verification_screen.dart';
import '../screens/forgot_password_screen.dart';
import '../screens/reset_password_screen.dart';
import '../screens/welcome_screen.dart';
import '../screens/onboarding_screen.dart';
import '../screens/app_intro_screen.dart';
import '../screens/dashboard_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/notifications_screen.dart';
import '../screens/achievement_screen.dart';
import '../screens/about_app_screen.dart';
import '../screens/assessment_intro_screen.dart';
import '../screens/question_flow_screen.dart';
import '../screens/feedback_screen.dart';
import '../screens/quiz_results_screen.dart';
import '../screens/literacy_classification_screen.dart';
import '../screens/reassessment_screen.dart';
import '../screens/personalized_suggestions_screen.dart';
import '../screens/chatbot_home_screen.dart';
import '../screens/chatbot_conversation_screen.dart';
import '../screens/chat_history_screen.dart';
import '../screens/follow_up_questions_screen.dart';
import '../screens/smart_guidance_screen.dart';
import '../screens/learning_dashboard_screen.dart';
import '../screens/lesson_details_screen.dart';
import '../screens/interactive_learning_screen.dart';
import '../screens/learning_recommendations_screen.dart';
import '../screens/daily_tips_screen.dart';
import '../screens/suggested_videos_screen.dart';
import '../screens/video_categories_screen.dart';
import '../screens/video_player_screen.dart';
import '../screens/saved_videos_screen.dart';
import '../screens/health_insights_screen.dart';
import '../screens/oral_health_score_screen.dart';
import '../screens/risk_analysis_screen.dart';
import '../screens/oral_hygiene_screen.dart';
import '../screens/brushing_techniques_screen.dart';
import '../screens/preventive_care_screen.dart';
import '../screens/progress_tracking_screen.dart';
import '../screens/search_screen.dart';
import '../screens/user_analytics_screen.dart';
import '../screens/ai_recommendation_dashboard_screen.dart';
import '../screens/quick_actions_screen.dart';
import '../screens/privacy_policy_screen.dart';
import '../screens/terms_conditions_screen.dart';
import '../screens/help_support_screen.dart';
import '../screens/report_issue_screen.dart';

class AppRoutes {
  // Authentication Routes
  static const String splash = '/splash';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String otpVerification = '/otp-verification';
  static const String resetPassword = '/reset-password';
  static const String welcome = '/welcome';

  // Onboarding Routes
  static const String onboarding = '/onboarding';
  static const String appIntro = '/app-intro';

  // Dashboard Routes
  static const String dashboard = '/dashboard';
  static const String quickActions = '/quick-actions';
  static const String search = '/search';

  // Profile & Settings Routes
  static const String profile = '/profile';
  static const String settings = '/settings';
  static const String notifications = '/notifications';
  static const String achievement = '/achievement';
  static const String aboutApp = '/about-app';

  // Assessment & Quiz Routes
  static const String assessmentIntro = '/assessment-intro';
  static const String questionFlow = '/question-flow';
  static const String feedback = '/feedback';
  static const String quizResults = '/quiz-results';
  static const String literacyClassification = '/literacy-classification';
  static const String reassessment = '/reassessment';
  static const String progressTracking = '/progress-tracking';

  // Health Analysis Routes
  static const String personalizedSuggestions = '/personalized-suggestions';
  static const String healthInsights = '/health-insights';
  static const String oralHealthScore = '/oral-health-score';
  static const String riskAnalysis = '/risk-analysis';

  // Chatbot Routes
  static const String chatbotHome = '/chatbot-home';
  static const String chatbotConversation = '/chatbot-conversation';
  static const String chatHistory = '/chat-history';
  static const String followUpQuestions = '/follow-up-questions';
  static const String smartGuidance = '/smart-guidance';

  // Learning Routes
  static const String learningDashboard = '/learning-dashboard';
  static const String lessonDetails = '/lesson-details';
  static const String interactiveLearning = '/interactive-learning';
  static const String learningRecommendations = '/learning-recommendations';
  static const String dailyTips = '/daily-tips';
  static const String hygieneTips = '/hygiene-tips';
  static const String brushingTechniques = '/brushing-techniques';
  static const String preventiveCare = '/preventive-care';

  // Video Routes
  static const String suggestedVideos = '/suggested-videos';
  static const String videoCategories = '/video-categories';
  static const String videoPlayer = '/video-player';
  static const String savedVideos = '/saved-videos';

  // Analytics Routes
  static const String userAnalytics = '/user-analytics';
  static const String aiRecommendation = '/ai-recommendation';

  // Legal & Support Routes
  static const String privacyPolicy = '/privacy-policy';
  static const String termsConditions = '/terms-conditions';
  static const String helpSupport = '/help-support';
  static const String reportIssue = '/report-issue';

  static Map<String, WidgetBuilder> getRoutes(BuildContext context) {
    return {
      // These will be implemented progressively
      dashboard: (context) => Container(),
      notifications: (context) => Container(),
      login: (context) => Container(),
      register: (context) => Container(),
      forgotPassword: (context) => Container(),
      profile: (context) => Container(),
      settings: (context) => Container(),
    };
  }
}

class RouteGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      // ========== AUTHENTICATION FLOW ==========
      case AppRoutes.splash:
        return _buildRoute(settings, const SplashScreen());
      case AppRoutes.login:
        return _buildRoute(settings, const AuthScreen());
      case AppRoutes.register:
        return _buildRoute(settings, RegisterScreen());
      case AppRoutes.otpVerification:
        final email = settings.arguments as String? ?? '';
        return _buildRoute(settings, OTPVerificationScreen(email: email));
      case AppRoutes.forgotPassword:
        return _buildRoute(settings, ForgotPasswordScreen());
      case AppRoutes.resetPassword:
        final args = settings.arguments as Map<String, String>? ?? {};
        return _buildRoute(
          settings,
          ResetPasswordScreen(
            email: args['email'],
            otp: args['otp'],
          ),
        );
      case AppRoutes.welcome:
        return _buildRoute(settings, const WelcomeScreen());

      // ========== ONBOARDING ==========
      case AppRoutes.onboarding:
        return _buildRoute(settings, const OnboardingScreen());
      case AppRoutes.appIntro:
        return _buildRoute(settings, const AppIntroScreen());

      // ========== MAIN DASHBOARD ==========
      case AppRoutes.dashboard:
        return _buildRoute(settings, const DashboardScreen());
      case AppRoutes.quickActions:
        return _buildRoute(settings, const QuickActionsScreen());
      case AppRoutes.search:
        return _buildRoute(settings, const SearchScreen());

      // ========== PROFILE & SETTINGS ==========
      case AppRoutes.profile:
        return _buildRoute(settings, const ProfileScreen());
      case AppRoutes.settings:
        return _buildRoute(settings, const SettingsScreen());
      case AppRoutes.notifications:
        return _buildRoute(settings, const NotificationsScreen());
      case AppRoutes.achievement:
        return _buildRoute(settings, const AchievementScreen());
      case AppRoutes.aboutApp:
        return _buildRoute(settings, const AboutAppScreen());

      // ========== ASSESSMENT & QUIZ FLOW ==========
      case AppRoutes.assessmentIntro:
        return _buildRoute(settings, const AssessmentIntroScreen());
      case AppRoutes.questionFlow:
        return _buildRoute(settings, const QuestionFlowScreen());
      case AppRoutes.feedback:
        return _buildRoute(settings, const FeedbackScreen(
          userAnswer: '',
          questionIndex: 0,
          totalQuestions: 0,
        ));
      case AppRoutes.quizResults:
        return _buildRoute(settings, const QuizResultsScreen(
          score: 0,
          totalQuestions: 0,
          literacyLevel: 'Beginner',
        ));
      case AppRoutes.literacyClassification:
        return _buildRoute(settings, const LiteracyClassificationScreen());
      case AppRoutes.reassessment:
        return _buildRoute(settings, const ReassessmentScreen());
      case AppRoutes.progressTracking:
        return _buildRoute(settings, const ProgressTrackingScreen());

      // ========== HEALTH ANALYSIS ==========
      case AppRoutes.personalizedSuggestions:
        return _buildRoute(settings, const PersonalizedSuggestionsScreen());
      case AppRoutes.healthInsights:
        return _buildRoute(settings, const HealthInsightsScreen());
      case AppRoutes.oralHealthScore:
        return _buildRoute(settings, const OralHealthScoreScreen());
      case AppRoutes.riskAnalysis:
        return _buildRoute(settings, const RiskAnalysisScreen());

      // ========== AI CHATBOT ==========
      case AppRoutes.chatbotHome:
        return _buildRoute(settings, const ChatbotHomeScreen());
      case AppRoutes.chatbotConversation:
        return _buildRoute(settings, const ChatbotConversationScreen());
      case AppRoutes.chatHistory:
        return _buildRoute(settings, const ChatHistoryScreen());
      case AppRoutes.followUpQuestions:
        return _buildRoute(settings, const FollowUpQuestionsScreen());
      case AppRoutes.smartGuidance:
        return _buildRoute(settings, const SmartGuidanceScreen());

      // ========== LEARNING PATHS ==========
      case AppRoutes.learningDashboard:
        return _buildRoute(settings, const LearningDashboardScreen());
      case AppRoutes.lessonDetails:
        return _buildRoute(settings, const LessonDetailsScreen());
      case AppRoutes.interactiveLearning:
        return _buildRoute(settings, const InteractiveLearningScreen());
      case AppRoutes.learningRecommendations:
        return _buildRoute(settings, const LearningRecommendationsScreen());
      case AppRoutes.dailyTips:
        return _buildRoute(settings, const DailyTipsScreen());
      case AppRoutes.hygieneTips:
        return _buildRoute(settings, const OralHygieneScreen());
      case AppRoutes.brushingTechniques:
        return _buildRoute(settings, const BrushingTechniquesScreen());
      case AppRoutes.preventiveCare:
        return _buildRoute(settings, const PreventiveCareScreen());

      // ========== VIDEO CONTENT ==========
      case AppRoutes.suggestedVideos:
        return _buildRoute(settings, const SuggestedVideosScreen());
      case AppRoutes.videoCategories:
        return _buildRoute(settings, const VideoCategoriesScreen());
      case AppRoutes.videoPlayer:
        return _buildRoute(settings, const VideoPlayerScreen(
          videoTitle: 'Educational Video',
        ));
      case AppRoutes.savedVideos:
        return _buildRoute(settings, const SavedVideosScreen());

      // ========== ANALYTICS & RECOMMENDATIONS ==========
      case AppRoutes.userAnalytics:
        return _buildRoute(settings, const UserAnalyticsScreen());
      case AppRoutes.aiRecommendation:
        return _buildRoute(settings, const AIRecommendationDashboardScreen());

      // ========== LEGAL & SUPPORT ==========
      case AppRoutes.privacyPolicy:
        return _buildRoute(settings, const PrivacyPolicyScreen());
      case AppRoutes.termsConditions:
        return _buildRoute(settings, const TermsConditionsScreen());
      case AppRoutes.helpSupport:
        return _buildRoute(settings, const HelpSupportScreen());
      case AppRoutes.reportIssue:
        return _buildRoute(settings, const ReportIssueScreen());

      default:
        return _errorRoute();
    }
  }

  static Route<dynamic> _buildRoute(RouteSettings settings, Widget widget) {
    return PageRouteBuilder(
      settings: settings,
      pageBuilder: (context, animation, secondaryAnimation) => widget,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.ease;

        final tween =
            Tween(begin: begin, end: end).chain(CurveTween(curve: curve));

        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
    );
  }

  static Route<dynamic> _errorRoute() {
    return MaterialPageRoute(
      builder: (_) => Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: const Center(
          child: Text('ERROR: Route not found'),
        ),
      ),
    );
  }
}
