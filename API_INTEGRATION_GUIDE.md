# Flutter API Integration Documentation

## Overview

The oral health app is now fully integrated with the PHP backend API. This document explains the API service architecture, authentication flow, and how to use the HTTP client for all API operations.

## Architecture

### Service Layer
- **`lib/services/api_service.dart`** - Main HTTP client for all API requests
- **`lib/services/token_service.dart`** - JWT token management (save, retrieve, clear)
- **`lib/models/auth_models.dart`** - Request/response models for JSON serialization

### Dependencies Added
```yaml
dependencies:
  http: ^1.1.0
  shared_preferences: ^2.2.2
```

## API Service (`api_service.dart`)

### Configuration

**Base URL:**
```dart
static const String baseUrl = 'http://localhost/oral_health_api';
```

**Change this to your actual backend URL** when deploying.

### Authentication Endpoints

#### 1. Register New User
```dart
final response = await ApiService.register(
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
);

if (response.success) {
  // Account created successfully
  // User can now login
}
```

**Response Model:**
- `success: bool` - Registration successful
- `message: string` - Response message
- `user: UserResponse?` - User details (optional)

#### 2. Login User
```dart
final response = await ApiService.login(
  email: 'john@example.com',
  password: 'password123',
);

if (response.success && response.token != null) {
  // Login successful
  // Token automatically saved to SharedPreferences
  // User data automatically saved
  // Navigate to dashboard
}
```

**Response Model:**
- `success: bool` - Login successful
- `message: string` - Response message
- `token: string?` - JWT authentication token
- `user: UserResponse?` - User details

**Automatic Actions:**
- JWT token saved to `SharedPreferences` (key: `auth_token`)
- User ID saved (key: `user_id`)
- User email saved (key: `user_email`)
- User name saved (key: `user_name`)

#### 3. Forgot Password (Request OTP)
```dart
final response = await ApiService.forgotPassword(
  email: 'john@example.com',
);

if (response.success) {
  // OTP sent to email
  // Navigate to OTP verification screen
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => OTPVerificationScreen(
        email: 'john@example.com',
      ),
    ),
  );
}
```

#### 4. Verify OTP
```dart
final response = await ApiService.verifyOTP(
  email: 'john@example.com',
  otp: '123456',
);

if (response.success && response.verified == true) {
  // OTP verified
  // Navigate to reset password screen with email and OTP
  Navigator.pushNamed(
    context,
    '/reset-password',
    arguments: {
      'email': 'john@example.com',
      'otp': '123456',
    },
  );
}
```

#### 5. Reset Password
```dart
final response = await ApiService.resetPassword(
  email: 'john@example.com',
  otp: '123456',
  newPassword: 'newPassword123',
  confirmPassword: 'newPassword123',
);

if (response.success) {
  // Password reset successful
  // Navigate to login screen
}
```

#### 6. Logout
```dart
final success = await ApiService.logout();

// Automatic actions:
// - Calls logout endpoint on backend
// - Clears all tokens and user data from SharedPreferences
// - Navigate to login screen
```

## Token Management (`token_service.dart`)

### Token Operations

**Save Token:**
```dart
await TokenService.saveToken('jwt_token_here');
```

**Get Token:**
```dart
String? token = await TokenService.getToken();
```

**Check Authentication Status:**
```dart
bool isAuthenticated = await TokenService.hasToken();
```

**Get User Information:**
```dart
int? userId = await TokenService.getUserId();
String? email = await TokenService.getUserEmail();
String? name = await TokenService.getUserName();
```

**Clear All Data (Logout):**
```dart
await TokenService.clearAll();
```

## Data Models (`auth_models.dart`)

### Request Models
- `LoginRequest` - Email, password
- `RegisterRequest` - Name, email, password, confirmPassword
- `ForgotPasswordRequest` - Email
- `VerifyOTPRequest` - Email, OTP
- `ResetPasswordRequest` - Email, OTP, newPassword, confirmPassword

### Response Models
- `LoginResponse` - success, message, token, user
- `RegisterResponse` - success, message, user
- `ForgotPasswordResponse` - success, message, email
- `VerifyOTPResponse` - success, message, verified
- `ResetPasswordResponse` - success, message
- `UserResponse` - id, name, email, profileImage, createdAt
- `ApiErrorResponse` - success, message, statusCode

All models include:
- `fromJson(Map<String, dynamic>)` - Deserialize from JSON
- `toJson()` - Serialize to JSON

## Error Handling

### Try-Catch Pattern
```dart
try {
  final response = await ApiService.login(
    email: email,
    password: password,
  );

  if (response.success && response.token != null) {
    // Handle success
  } else {
    // Handle validation error
    print(response.message);
  }
} on ApiErrorResponse catch (e) {
  // Handle API errors (401, 400, 500, etc.)
  print('API Error: ${e.message}');
  print('Status Code: ${e.statusCode}');
} catch (e) {
  // Handle other errors (network, parsing, etc.)
  print('Error: ${e.toString()}');
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid credentials or expired token)
- `404` - Not Found
- `500` - Server Error

## Authenticated Requests

For future API endpoints that require authentication:

### GET Request
```dart
final data = await ApiService.getAuthenticatedRequest('/user/get_profile.php');
```

### POST Request
```dart
final data = await ApiService.postAuthenticatedRequest(
  '/quiz/submit_answers.php',
  {
    'answer_1': 'option_a',
    'answer_2': 'option_b',
  },
);
```

**Automatic Actions:**
- JWT token automatically added to headers as `Authorization: Bearer <token>`
- If token expired (401), automatically cleared and user redirected to login

## Screen Integration

### Login Screen (`auth_screen.dart`)
- Form validation for email and password
- Loading indicator during authentication
- Error messages for failed login
- Password visibility toggle
- Automatic token storage on success

### Register Screen (`register_screen.dart`)
- Full name, email, password, confirm password fields
- Password strength validation
- Duplicate email detection
- Auto-redirect to login on success

### Forgot Password Flow (`forgot_password_screen.dart` → `otp_verification_screen.dart` → `reset_password_screen.dart`)
1. User enters email
2. OTP sent to email (simulated in backend)
3. User verifies 6-digit OTP
4. User sets new password
5. Password reset confirmed, redirect to login

## Implementation Checklist

✅ **Authentication API Integration:**
- [x] Login screen connected to API
- [x] Register screen connected to API
- [x] OTP verification working
- [x] Password reset working
- [x] Logout functionality

✅ **Token Management:**
- [x] JWT token storage
- [x] User data persistence
- [x] Token retrieval for authenticated requests
- [x] Automatic token cleanup on logout

✅ **Error Handling:**
- [x] User-friendly error messages
- [x] Network error handling
- [x] Validation error handling
- [x] Unauthorized (401) error handling

## Next Steps

### 1. Update Splash Screen
Add automatic login check:
```dart
Future<void> _checkAuthentication() async {
  await Future.delayed(const Duration(seconds: 2));
  
  bool isAuthenticated = await TokenService.hasToken();
  
  if (mounted) {
    if (isAuthenticated) {
      Navigator.pushReplacementNamed(context, '/dashboard');
    } else {
      Navigator.pushReplacementNamed(context, '/welcome');
    }
  }
}
```

### 2. Integrate Other Modules
Use the same pattern for other API endpoints:
- Quiz API
- Learning API
- Videos API
- Analytics API
- Chatbot API

### 3. Add Interceptors (Advanced)
For token refresh and automatic retry:
```dart
// Future enhancement: Add request/response interceptors
// to handle token refresh automatically
```

### 4. Add Unit Tests
Create tests for:
- API service methods
- Token service operations
- Model serialization/deserialization
- Error scenarios

## Testing

### Manual Testing Steps

1. **Register Flow:**
   - Launch app
   - Navigate to Register
   - Fill in all fields
   - Click "Sign Up"
   - Verify success message
   - Verify user created in database

2. **Login Flow:**
   - Enter registered email and password
   - Click "Sign In"
   - Verify token stored
   - Verify redirected to dashboard

3. **Forgot Password Flow:**
   - Click "Forgot Password?"
   - Enter registered email
   - Enter received OTP (check backend email simulation)
   - Enter new password
   - Verify password changed in database

4. **Logout Flow:**
   - Login to app
   - Go to Settings
   - Click Logout
   - Verify token cleared
   - Verify redirected to login

## API Response Examples

### Successful Login
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile_image": null,
    "created_at": "2024-05-11 10:30:00",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Database error occurred"
}
```

## Troubleshooting

### "Connection refused" Error
- Ensure backend PHP server is running on localhost
- Check XAMPP is running
- Verify base URL in `api_service.dart`

### "Invalid email" Error
- Ensure email format is valid (contains @)
- Check password is at least 6 characters

### "Token expired" Error
- User will be automatically logged out
- Implement token refresh for future enhancement

### OTP Not Received
- Check backend email configuration
- Verify email address in database
- Check OTP verification window (10 minutes)

## Security Considerations

1. **JWT Token Storage:**
   - Currently stored in SharedPreferences
   - Consider upgrading to secure storage (flutter_secure_storage)

2. **Password Validation:**
   - Implement stronger password requirements
   - Add password strength meter

3. **HTTPS:**
   - Use HTTPS in production
   - Update base URL to `https://your-domain.com/oral_health_api`

4. **Token Refresh:**
   - Implement token refresh mechanism
   - Add automatic retry with refresh token

## Performance Optimization

1. **Request Timeout:**
   - Current: 30 seconds
   - Adjust in `api_service.dart` if needed

2. **Network Caching:**
   - Consider caching user profile data
   - Implement for offline support

3. **Connection Pooling:**
   - HTTP package handles this automatically
   - Consider Dio package for advanced features

---

**Last Updated:** May 11, 2026
**Backend API:** http://localhost/oral_health_api
**Documentation Version:** 1.0
