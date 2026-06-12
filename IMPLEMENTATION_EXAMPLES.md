# Implementation Examples & Patterns

## Authentication Screen Pattern

All authentication screens follow this pattern:

### 1. Basic Structure
```dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/auth_models.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  _AuthScreenState createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  // Controllers
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  
  // State
  bool _isLoading = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
```

### 2. Validation Pattern
```dart
  bool _validateForm() {
    final email = emailController.text.trim();
    final password = passwordController.text;

    // Check email
    if (email.isEmpty) {
      _showErrorSnackBar('Please enter your email');
      return false;
    }
    
    if (!email.contains('@')) {
      _showErrorSnackBar('Invalid email format');
      return false;
    }

    // Check password
    if (password.isEmpty) {
      _showErrorSnackBar('Please enter password');
      return false;
    }
    
    if (password.length < 6) {
      _showErrorSnackBar('Password must be 6+ characters');
      return false;
    }

    return true;
  }
```

### 3. API Call Pattern
```dart
  Future<void> login() async {
    // Validate
    if (!_validateForm()) {
      return;
    }

    // Show loading
    setState(() => _isLoading = true);

    try {
      // Make API call
      final response = await ApiService.login(
        email: emailController.text.trim(),
        password: passwordController.text,
      );

      // Check success
      if (response.success && response.token != null) {
        _showSuccessSnackBar('Login successful!');

        // Navigate after brief delay
        if (mounted) {
          await Future.delayed(const Duration(milliseconds: 500));
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => DashboardScreen(),
              ),
            );
          }
        }
      } else {
        _showErrorSnackBar(response.message ?? 'Login failed');
      }
    } on ApiErrorResponse catch (e) {
      // API error
      _showErrorSnackBar(e.message);
    } catch (e) {
      // Other error
      _showErrorSnackBar('Error: ${e.toString()}');
    } finally {
      // Hide loading
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
```

### 4. Snackbar Pattern
```dart
  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
      ),
    );
  }
```

### 5. UI Pattern - Loading Button
```dart
  SizedBox(
    width: double.infinity,
    height: 50,
    child: ElevatedButton(
      // Disable while loading
      onPressed: _isLoading ? null : login,
      child: _isLoading
          // Show spinner while loading
          ? SizedBox(
              height: 24,
              width: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          // Show text normally
          : Text(
              'Sign In',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
    ),
  ),
```

### 6. UI Pattern - Password Toggle
```dart
  TextField(
    controller: passwordController,
    decoration: InputDecoration(
      hintText: 'Enter your password',
      prefixIcon: Icon(Icons.lock),
      // Add visibility toggle
      suffixIcon: IconButton(
        icon: Icon(
          _obscurePassword ? Icons.visibility_off : Icons.visibility,
        ),
        onPressed: () {
          setState(() {
            _obscurePassword = !_obscurePassword;
          });
        },
      ),
    ),
    // Toggle obscure based on state
    obscureText: _obscurePassword,
  ),
```

## API Service Usage Examples

### Using Authenticated Endpoints (Future)

#### Get User Profile
```dart
try {
  final data = await ApiService.getAuthenticatedRequest('/user/get_profile.php');
  
  final userProfile = UserProfile.fromJson(data['data']);
  // Use user profile
  
} on ApiErrorResponse catch (e) {
  if (e.statusCode == 401) {
    // Token expired, redirect to login
    Navigator.pushReplacementNamed(context, '/auth');
  } else {
    print('Error: ${e.message}');
  }
}
```

#### Submit Quiz Answers
```dart
try {
  final response = await ApiService.postAuthenticatedRequest(
    '/quiz/submit_answers.php',
    {
      'question_ids': [1, 2, 3, 4, 5],
      'answers': ['a', 'b', 'c', 'a', 'b'],
    },
  );
  
  final score = response['data']['score'];
  final literacyLevel = response['data']['literacy_level'];
  
  // Navigate to results screen with data
  Navigator.pushNamed(
    context,
    '/quiz-results',
    arguments: {
      'score': score,
      'literacyLevel': literacyLevel,
    },
  );
  
} on ApiErrorResponse catch (e) {
  print('Error: ${e.message}');
}
```

## Token Service Usage Examples

### Check if User is Logged In
```dart
// In SplashScreen or InitialScreen
void _checkLogin() async {
  bool isLoggedIn = await TokenService.hasToken();
  
  if (isLoggedIn) {
    // Navigate to dashboard
    Navigator.pushReplacementNamed(context, '/dashboard');
  } else {
    // Navigate to welcome/login
    Navigator.pushReplacementNamed(context, '/welcome');
  }
}
```

### Get Current User Info
```dart
void _loadUserInfo() async {
  String? userName = await TokenService.getUserName();
  String? userEmail = await TokenService.getUserEmail();
  
  setState(() {
    _userName = userName;
    _userEmail = userEmail;
  });
}
```

### Logout
```dart
void _logout() async {
  // Call logout endpoint
  await ApiService.logout();
  
  // Redirect to login
  if (mounted) {
    Navigator.pushReplacementNamed(context, '/auth');
  }
}
```

## Model Usage Examples

### Creating Request Models
```dart
// Create registration request
final registerRequest = RegisterRequest(
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
);

// Convert to JSON for API
final json = registerRequest.toJson();
// Result: {"name": "John Doe", "email": "john@example.com", ...}
```

### Parsing Response Models
```dart
// From API response
final jsonResponse = jsonDecode(responseBody);

// Create response model
final loginResponse = LoginResponse.fromJson(jsonResponse);

// Access properties
if (loginResponse.success) {
  String token = loginResponse.token;
  UserResponse user = loginResponse.user;
  print('User: ${user.name}');
}
```

## Error Handling Examples

### Comprehensive Error Handling
```dart
Future<void> performLogin() async {
  try {
    // Validate input
    if (!_validateForm()) return;
    
    // Show loading
    setState(() => _isLoading = true);
    
    // Make API call
    final response = await ApiService.login(
      email: emailController.text,
      password: passwordController.text,
    );
    
    // Check response
    if (response.success) {
      // Navigate on success
      _navigate();
    } else {
      // Show user-friendly error
      _showErrorSnackBar(response.message ?? 'Unknown error');
    }
    
  } on SocketException catch (e) {
    // Network error
    _showErrorSnackBar('Network error. Check your connection.');
    
  } on TimeoutException catch (e) {
    // Timeout error
    _showErrorSnackBar('Request timed out. Please try again.');
    
  } on ApiErrorResponse catch (e) {
    // API returned error
    if (e.statusCode == 401) {
      _showErrorSnackBar('Invalid credentials');
    } else if (e.statusCode == 404) {
      _showErrorSnackBar('User not found');
    } else {
      _showErrorSnackBar(e.message);
    }
    
  } on FormatException catch (e) {
    // JSON parsing error
    _showErrorSnackBar('Server response error');
    
  } catch (e) {
    // Unknown error
    _showErrorSnackBar('An unexpected error occurred');
    print('Unknown error: $e');
  }
  
  finally {
    // Always stop loading
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }
}
```

## Common Patterns

### Pattern 1: Login → Dashboard
```dart
// 1. User on AuthScreen
// 2. Clicks "Sign In"
// 3. ApiService.login() called
// 4. Token saved to SharedPreferences
// 5. Navigator.pushReplacement() → DashboardScreen
// 6. DashboardScreen loads user data using token
```

### Pattern 2: Forgot Password → Reset
```dart
// 1. User on ForgotPasswordScreen
// 2. Clicks "Send Reset Code"
// 3. ApiService.forgotPassword() → OTP generated
// 4. Navigator → OTPVerificationScreen
// 5. User enters OTP
// 6. ApiService.verifyOTP() → verified
// 7. Navigator → ResetPasswordScreen with email & otp
// 8. User enters new password
// 9. ApiService.resetPassword() → success
// 10. Navigator → AuthScreen
```

### Pattern 3: Authenticated Requests
```dart
// 1. User logged in with token stored
// 2. Need data from protected endpoint
// 3. Call ApiService.getAuthenticatedRequest()
// 4. ApiService automatically adds: Authorization: Bearer <token>
// 5. If 401 (unauthorized): clear token & redirect to login
// 6. Process response data
```

## Testing Patterns

### Unit Test Pattern
```dart
test('Login with valid credentials succeeds', () async {
  final response = await ApiService.login(
    email: 'test@example.com',
    password: 'password123',
  );
  
  expect(response.success, true);
  expect(response.token, isNotNull);
  expect(response.user, isNotNull);
});

test('Login with invalid email fails', () async {
  expect(
    () => ApiService.login(
      email: 'invalid-email',
      password: 'password123',
    ),
    throwsException,
  );
});
```

### Widget Test Pattern
```dart
testWidgets('Register button shows loading indicator', (WidgetTester tester) async {
  await tester.pumpWidget(MyApp());
  
  // Find register button
  final registerButton = find.byType(ElevatedButton);
  
  // Tap button
  await tester.tap(registerButton);
  await tester.pump();
  
  // Verify loading indicator shown
  expect(find.byType(CircularProgressIndicator), findsOneWidget);
});
```

## Files Structure
```
lib/
├── services/
│   ├── api_service.dart          ← HTTP client (30 endpoints)
│   └── token_service.dart         ← Token management
├── models/
│   └── auth_models.dart           ← Request/response models
├── screens/
│   ├── auth_screen.dart           ← Login (API integrated)
│   ├── register_screen.dart       ← Register (API integrated)
│   ├── otp_verification_screen.dart ← OTP (API integrated)
│   ├── forgot_password_screen.dart ← Forgot (API integrated)
│   ├── reset_password_screen.dart ← Reset (API integrated)
│   └── dashboard_screen.dart      ← Main dashboard
└── config/
    └── app_routes.dart            ← Route generator

Backend:
C:\Users\vivek\oral_health_backend\
├── config/
│   └── db.php                     ← DB connection, JWT utilities
├── auth/                          ← 6 authentication endpoints
├── user/                          ← 5 user management endpoints
├── quiz/                          ← 4 quiz endpoints
├── learning/                      ← 6 learning endpoints
├── videos/                        ← 5 video endpoints
├── analytics/                     ← 5 analytics endpoints
├── ai/                            ← 2 AI endpoints
├── notifications/                 ← 2 notification endpoints
├── support/                       ← 4 support endpoints
└── database/
    └── oral_health_db.sql         ← 22 tables schema
```

---

**Version:** 1.0
**Last Updated:** May 11, 2026
