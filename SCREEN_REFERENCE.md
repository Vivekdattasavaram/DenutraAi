# Complete Screen Reference Guide - Oral Health App (51 Screens)

## Quick Navigation Routes Table

| # | Screen Name | Route | File | Purpose | Connected To |
|---|---|---|---|---|---|
| **AUTHENTICATION FLOW** |
| 1 | Splash | `/splash` | splash_screen.dart | App startup | AppIntro \| Auth |
| 2 | Login | `/login` | auth_screen.dart | User authentication | Register \| ForgotPassword \| Dashboard |
| 3 | Register | `/register` | register_screen.dart | New user signup | OTPVerification \| Login |
| 4 | OTP Verification | `/otp-verification` | otp_verification_screen.dart | Email verification | ResetPassword \| Welcome |
| 5 | Forgot Password | `/forgot-password` | forgot_password_screen.dart | Password recovery | ResetPassword \| Login |
| 6 | Reset Password | `/reset-password` | reset_password_screen.dart | Set new password | Login |
| 7 | Welcome | `/welcome` | welcome_screen.dart | Post-registration success | Dashboard \| Onboarding |
| **ONBOARDING** |
| 8 | App Intro | `/app-intro` | app_intro_screen.dart | Feature carousel | Onboarding \| Dashboard |
| 9 | Onboarding | `/onboarding` | onboarding_screen.dart | Initial app orientation | Dashboard |
| **MAIN DASHBOARD** |
| 10 | Dashboard | `/dashboard` | dashboard_screen.dart | Central hub | All flows |
| 11 | Quick Actions | `/quick-actions` | quick_actions_screen.dart | Feature shortcuts | Dashboard |
| 12 | Search | `/search` | search_screen.dart | Content search | Dashboard |
| **PROFILE & SETTINGS** |
| 13 | Profile | `/profile` | profile_screen.dart | User profile/stats | Settings \| Dashboard |
| 14 | Settings | `/settings` | settings_screen.dart | App configuration | Profile \| Dashboard |
| 15 | Notifications | `/notifications` | notifications_screen.dart | Notification center | Dashboard |
| 16 | Achievements | `/achievement` | achievement_screen.dart | Badges & rewards | Profile |
| 17 | About App | `/about-app` | about_app_screen.dart | App information | Settings |
| **ASSESSMENT & QUIZ** |
| 18 | Assessment Intro | `/assessment-intro` | assessment_intro_screen.dart | Quiz introduction | QuestionFlow |
| 19 | Question Flow | `/question-flow` | question_flow_screen.dart | Individual questions | Feedback \| AdvancedQuiz |
| 20 | Feedback | `/feedback` | feedback_screen.dart | Answer feedback | QuizResults \| RiskAnalysis |
| 21 | Advanced Quiz | `/advanced-quiz` | advanced_quiz_screen.dart | Full 20-question quiz | QuizResults |
| 22 | Quiz Results | `/quiz-results` | quiz_results_screen.dart | Score display | LiteracyClassification \| PersonalizedSuggestions |
| 23 | Literacy Classification | `/literacy-classification` | literacy_classification_screen.dart | Literacy level | Reassessment \| Dashboard |
| 24 | Reassessment | `/reassessment` | reassessment_screen.dart | Progress comparison | ProgressTracking |
| 25 | Progress Tracking | `/progress-tracking` | progress_tracking_screen.dart | Progress history | Dashboard |
| **HEALTH ANALYSIS** |
| 26 | Personalized Suggestions | `/personalized-suggestions` | personalized_suggestions_screen.dart | AI recommendations | HealthInsights \| Dashboard |
| 27 | Health Insights | `/health-insights` | health_insights_screen.dart | Health analysis | OralHealthScore |
| 28 | Oral Health Score | `/oral-health-score` | oral_health_score_screen.dart | Overall score (0-100) | RiskAnalysis \| Dashboard |
| 29 | Risk Analysis | `/risk-analysis` | risk_analysis_screen.dart | Risk factors breakdown | Dashboard |
| **AI CHATBOT** |
| 30 | Chatbot Home | `/chatbot-home` | chatbot_home_screen.dart | AI assistant welcome | ChatbotConversation |
| 31 | Chatbot Conversation | `/chatbot-conversation` | chatbot_conversation_screen.dart | Real-time chat | ChatHistory \| VoiceAssistant |
| 32 | Chat History | `/chat-history` | chat_history_screen.dart | Previous conversations | ChatbotConversation \| Dashboard |
| 33 | Voice Assistant | `/voice-assistant` | voice_assistant_screen.dart | Voice input interface | ChatbotConversation |
| 34 | Follow-up Questions | `/follow-up-questions` | follow_up_questions_screen.dart | FAQ section | Dashboard |
| 35 | Smart Guidance | `/smart-guidance` | smart_guidance_screen.dart | Routine guidance | Dashboard |
| **LEARNING PATHS** |
| 36 | Learning Dashboard | `/learning-dashboard` | learning_dashboard_screen.dart | Learning paths overview | LessonDetails |
| 37 | Lesson Details | `/lesson-details` | lesson_details_screen.dart | Lesson content | InteractiveLearning \| Dashboard |
| 38 | Interactive Learning | `/interactive-learning` | interactive_learning_screen.dart | Q&A format learning | LearningRecommendations |
| 39 | Learning Recommendations | `/learning-recommendations` | learning_recommendations_screen.dart | AI suggestions | DailyTips \| Dashboard |
| 40 | Daily Tips | `/daily-tips` | daily_tips_screen.dart | Daily oral health tips | Dashboard |
| 41 | Oral Hygiene Tips | `/hygiene-tips` | oral_hygiene_screen.dart | Hygiene guides | BrushingTechniques |
| 42 | Brushing Techniques | `/brushing-techniques` | brushing_techniques_screen.dart | Brushing methods | PreventiveCare |
| 43 | Preventive Care | `/preventive-care` | preventive_care_screen.dart | Preventive measures | Dashboard |
| **VIDEO CONTENT** |
| 44 | Suggested Videos | `/suggested-videos` | suggested_videos_screen.dart | Video recommendations | VideoCategories |
| 45 | Video Categories | `/video-categories` | video_categories_screen.dart | Video categories | VideoPlayer |
| 46 | Video Player | `/video-player` | video_player_screen.dart | Video playback | RecentlyWatched \| SavedVideos |
| 47 | Recently Watched | `/recently-watched` | recently_watched_screen.dart | Watch history | VideoPlayer |
| 48 | Saved Videos | `/saved-videos` | saved_videos_screen.dart | Bookmarked videos | VideoPlayer \| Dashboard |
| **ANALYTICS** |
| 49 | User Statistics | `/user-statistics` | user_statistics_screen.dart | User metrics | UserAnalytics |
| 50 | User Analytics | `/user-analytics` | user_analytics_screen.dart | Analytics dashboard | AIRecommendationDashboard |
| 51 | AI Recommendation Dashboard | `/ai-recommendation` | ai_recommendation_dashboard_screen.dart | Recommendations hub | Dashboard |

---

## Screen Organization by Flow

### Flow 1: Authentication (7 screens)
Entry point for new/returning users
- Splash → Login/Register → OTP → Welcome → Dashboard
- Alternative: Forgot Password → Reset → Login

### Flow 2: Assessment (8 screens)
Complete health evaluation
- Assessment Intro → Question Flow → Advanced Quiz → Results → Literacy → Reassessment → Progress

### Flow 3: Health Analysis (4 screens)
Health insights and recommendations
- Suggestions → Insights → Score → Risk Analysis

### Flow 4: Chatbot (6 screens)
AI-powered assistance
- Chatbot Home → Conversation → Voice/History/FAQ/Guidance

### Flow 5: Learning (8 screens)
Educational content
- Learning Dashboard → Lessons → Interactive → Tips/Recommendations/Hygiene/Techniques

### Flow 6: Videos (5 screens)
Video content library
- Suggested → Categories → Player → Recently Watched/Saved

### Flow 7: Profile (5 screens)
User account management
- Profile → Settings → Notifications → Achievements → About

### Flow 8: Analytics (3 screens)
Data and insights
- Statistics → Analytics → AI Recommendations

### Flow 9: Onboarding (2 screens)
First-time user experience
- App Intro → Onboarding

### Flow 10: Dashboard & Search (3 screens)
Central navigation hub
- Dashboard → Quick Actions/Search

---

## Navigation Examples

### Navigate to screen:
```dart
Navigator.pushNamed(context, AppRoutes.dashboard);
Navigator.pushNamed(context, AppRoutes.learningDashboard);
Navigator.pushNamed(context, AppRoutes.chatbotHome);
Navigator.pushNamed(context, AppRoutes.suggestedVideos);
```

### Navigate with parameters:
```dart
// Screens with required parameters use defaults in RouteGenerator
Navigator.pushNamed(context, AppRoutes.quizResults);
Navigator.pushNamed(context, AppRoutes.videoPlayer);
```

### Navigate with replacement:
```dart
Navigator.pushReplacementNamed(context, AppRoutes.welcome);
Navigator.pushReplacementNamed(context, AppRoutes.dashboard);
```

### Go back:
```dart
Navigator.pop(context);
```

---

## Transition Animation
All routes use **SlideTransition** with:
- Begin offset: (1.0, 0.0) - slide from right
- End offset: (0.0, 0.0) - settle in place
- Curve: Curves.ease - smooth easing
- Duration: Handled by Navigator

---

## Architecture Notes

1. **RouteGenerator**: Central route management in `lib/config/app_routes.dart`
2. **AppRoutes**: Class with all static String constants
3. **Error Route**: Shows error screen for unmapped routes
4. **Deep Linking**: All routes support direct navigation
5. **State Management**: Screens are stateless/stateful as needed
6. **Imports**: All screens properly imported in RouteGenerator

---

## Implementation Checklist

✅ All 51 screens created
✅ All routes defined in AppRoutes class
✅ All routes mapped in RouteGenerator
✅ SlideTransition animation configured
✅ Error route for unmapped paths
✅ Navigation flows documented
✅ Default parameters for complex screens
✅ Compilation: 0 errors verified

---

## Future Enhancements

- Add breadcrumb navigation for nested flows
- Implement bottom sheet transitions for modals
- Add fade transitions for overlay screens
- Support for route parameters with ArgParsers
- Analytics tracking for screen navigation
- Deep linking with query parameters

---

**Last Updated**: 2026-05-11  
**Total Screens**: 51  
**Total Routes**: 51  
**Status**: Production Ready ✅
