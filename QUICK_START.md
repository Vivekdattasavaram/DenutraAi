# Quick Start Guide - API Integration

## Installation & Setup

### Step 1: Update Dependencies
```bash
cd c:\Users\vivek\oral_health_app
flutter pub get
```

This will install:
- `http: ^1.1.0` - HTTP client for API requests
- `shared_preferences: ^2.2.2` - Local token storage

### Step 2: Ensure Backend is Running

**Start PHP Backend:**
1. Open XAMPP Control Panel
2. Click "Start" for Apache
3. Click "Start" for MySQL
4. Navigate to `http://localhost/phpmyadmin`
5. Verify `oral_health_db` database exists

**Backend Location:**
```
C:\Users\vivek\oral_health_backend\
```

**Verify Backend is Running:**
```
GET http://localhost/oral_health_api/config/db.php
```

Should respond with PHP content (not error).

### Step 3: Update Base URL (if needed)

**File:** `lib/services/api_service.dart`

```dart
// Line ~11
static const String baseUrl = 'http://localhost/oral_health_api';

// For production, change to:
// static const String baseUrl = 'https://your-domain.com/oral_health_api';
```

### Step 4: Run the App

```bash
flutter run
```

## Complete Authentication Flow - Step by Step

### Scenario: New User Registration & Login

#### Step 1: Launch App
- App starts on SplashScreen
- No existing token (first time user)
- Automatically navigates to WelcomeScreen

#### Step 2: Navigate to Register
```
Splash → Welcome (click Sign Up) → Register Screen
```

#### Step 3: Fill Registration Form
```
Full Name:        John Doe
Email:            john.doe@example.com
Password:         SecurePass123
Confirm Password: SecurePass123
Click "Sign Up"
```

**Behind the Scenes:**
```dart
ApiService.register(
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'SecurePass123',
  confirmPassword: 'SecurePass123',
)
```

**Backend:**
- Creates user in `users` table
- Hashes password with password_hash()
- Returns success response

#### Step 4: Success & Redirect
- Shows: "Account created successfully! Redirecting to login..."
- Waits 500ms
- Navigates to Login Screen

#### Step 5: Login
```
Email:    john.doe@example.com
Password: SecurePass123
Click "Sign In"
```

**Behind the Scenes:**
```dart
ApiService.login(
  email: 'john.doe@example.com',
  password: 'SecurePass123',
)
```

**Backend:**
- Validates email exists
- Verifies password with password_verify()
- Generates JWT token (24-hour expiry)
- Returns token and user data

**Frontend (automatic):**
```dart
TokenService.saveToken(token);
TokenService.saveUserInfo(
  userId: 1,
  email: 'john.doe@example.com',
  name: 'John Doe',
);
Navigator.pushReplacement(..., DashboardScreen());
```

#### Step 6: Logged In - Dashboard
- User successfully logged in
- Token saved in SharedPreferences
- Dashboard displays user information

### Scenario: Forgot Password & Reset

#### Step 1: Navigate to Forgot Password
```
Auth Screen (click Forgot Password?) → Forgot Password Screen
```

#### Step 2: Request Password Reset
```
Email: john.doe@example.com
Click "Send Reset Code"
```

**Behind the Scenes:**
```dart
ApiService.forgotPassword(email: 'john.doe@example.com')
```

**Backend:**
- Finds user by email
- Generates 6-digit OTP
- Saves OTP with 10-minute expiry
- Simulates email (check console output)

#### Step 3: Enter OTP
- Screen shows: "We've sent a 6-digit code to john.doe@example.com"
- **To get OTP:** Check backend console or database

**Database:**
```sql
SELECT otp FROM otp_verifications WHERE email = 'john.doe@example.com';
```

```
OTP Input:  [1] [2] [3] [4] [5] [6]
Click "Verify OTP"
```

**Backend:**
- Verifies OTP matches
- Verifies OTP not expired (< 10 minutes)
- Returns verified: true

#### Step 4: Reset Password
```
New Password:     NewPassword123
Confirm Password: NewPassword123
Click "Reset Password"
```

**Behind the Scenes:**
```dart
ApiService.resetPassword(
  email: 'john.doe@example.com',
  otp: '123456',
  newPassword: 'NewPassword123',
  confirmPassword: 'NewPassword123',
)
```

**Backend:**
- Verifies OTP one more time
- Updates password in database
- Hashes new password
- Deletes OTP record

#### Step 5: Success & Redirect
- Shows: "Password reset successfully!"
- Redirects to Login Screen
- User can now login with new password

## Testing Checklist

### ✅ User Registration
- [ ] Open Register Screen
- [ ] Fill all fields with valid data
- [ ] Click "Sign Up"
- [ ] See success message
- [ ] Verify redirect to Login Screen
- [ ] Check database: `SELECT * FROM users WHERE email = '...';`

### ✅ User Login
- [ ] Enter registered email
- [ ] Enter correct password
- [ ] Click "Sign In"
- [ ] See success message
- [ ] Verify redirected to Dashboard
- [ ] Verify token saved: Check SharedPreferences

### ✅ Password Visibility Toggle
- [ ] On Login/Register, click password eye icon
- [ ] Password should toggle between visible/hidden

### ✅ Form Validation
- [ ] Leave email empty → "Please enter your email address"
- [ ] Enter invalid email → "Please enter a valid email address"
- [ ] Leave password empty → "Please enter your password"
- [ ] Password < 6 chars → "Password must be at least 6 characters"
- [ ] Passwords don't match → "Passwords do not match"

### ✅ Error Scenarios
- [ ] Wrong password → "Invalid credentials" (or similar)
- [ ] Non-existent email → "User not found"
- [ ] Network offline → "Connection timeout"
- [ ] Backend down → "Connection refused"

### ✅ Forgot Password Flow
- [ ] Click "Forgot Password?" on Login Screen
- [ ] Enter email
- [ ] Click "Send Reset Code"
- [ ] See "OTP sent to your email!"
- [ ] Get 6-digit OTP from backend
- [ ] Enter OTP and click "Verify OTP"
- [ ] See "OTP Verified!"
- [ ] Enter new password
- [ ] Click "Reset Password"
- [ ] See "Password reset successfully!"
- [ ] Redirected to Login Screen
- [ ] Login with new password

### ✅ Token Persistence
- [ ] Login successfully
- [ ] Close app (hot restart)
- [ ] App should still show as logged in (once splash check added)
- [ ] Navigate to Dashboard
- [ ] User data should be available

### ✅ Logout
- [ ] After adding logout to Settings screen
- [ ] Login to app
- [ ] Click Settings → Logout
- [ ] Token should be cleared
- [ ] Redirected to Login Screen
- [ ] Closing/reopening app should show Login

## Database Verification

### Check User Created
```sql
USE oral_health_db;
SELECT id, name, email, created_at FROM users WHERE email = 'john.doe@example.com';
```

**Expected Output:**
```
+----+----------+----------------------+---------------------+
| id | name     | email                | created_at          |
+----+----------+----------------------+---------------------+
| 1  | John Doe | john.doe@example.com | 2026-05-11 10:30:00 |
+----+----------+----------------------+---------------------+
```

### Check Password Hashed
```sql
SELECT password FROM users WHERE email = 'john.doe@example.com';
```

**Expected Output:**
```
$2y$10$aBcDeFgHiJkLmNoPqRsTuVwXyZ... (hashed)
```

### Check OTP Created
```sql
SELECT email, otp, expires_at FROM otp_verifications WHERE email = 'john.doe@example.com';
```

**Expected Output:**
```
+----------------------+--------+---------------------+
| email                | otp    | expires_at          |
+----------------------+--------+---------------------+
| john.doe@example.com | 123456 | 2026-05-11 10:40:00 |
+----------------------+--------+---------------------+
```

## Common Issues & Solutions

### Issue: "Connection refused"
**Solution:**
1. Check XAMPP is running (Apache + MySQL)
2. Check backend files exist: `C:\Users\vivek\oral_health_backend\`
3. Verify PHP server is accessible: `http://localhost`
4. Update base URL if backend is on different port

### Issue: "Email already exists"
**Solution:**
1. Use a different email for registration
2. Check database: email must be unique
3. Optionally clear users table: `DELETE FROM users;`

### Issue: "OTP verification failed"
**Solution:**
1. Verify OTP hasn't expired (10-minute window)
2. Check OTP is exactly 6 digits
3. Verify email matches original request
4. Check database: OTP still exists and not expired

### Issue: "Password must be at least 6 characters"
**Solution:**
- Use password with min 6 characters (backend requirement)

### Issue: "Passwords do not match"
**Solution:**
- Ensure both password fields are identical
- Check for trailing spaces

### Issue: App shows blank screen after login
**Solution:**
1. Check Dashboard Screen is created
2. Verify imports in app_routes.dart
3. Run: `flutter clean && flutter pub get && flutter run`

### Issue: Token not persisting after restart
**Solution:**
1. Add authentication check in SplashScreen
2. Implement: `TokenService.hasToken()`
3. If has token, navigate to Dashboard
4. If no token, navigate to Welcome/Login

## Next Steps After API Integration

### 1. Add Logout Functionality
Update Settings Screen:
```dart
ListTile(
  title: Text('Logout'),
  onTap: () async {
    await ApiService.logout();
    Navigator.pushReplacementNamed(context, '/auth');
  },
)
```

### 2. Integrate Quiz API
```dart
// Get quiz questions
final questions = await ApiService.getAuthenticatedRequest(
  '/quiz/get_questions.php'
);

// Submit answers
final results = await ApiService.postAuthenticatedRequest(
  '/quiz/submit_answers.php',
  {'answers': answersData}
);
```

### 3. Integrate Learning API
```dart
// Get learning modules
final modules = await ApiService.getAuthenticatedRequest(
  '/learning/learning_modules.php'
);

// Get lesson details
final lesson = await ApiService.getAuthenticatedRequest(
  '/learning/lesson_details.php?lesson_id=1'
);
```

### 4. Add Auto-Login in SplashScreen
```dart
@override
void initState() {
  super.initState();
  _checkAuthentication();
}

Future<void> _checkAuthentication() async {
  await Future.delayed(const Duration(seconds: 2));
  
  bool isAuthenticated = await TokenService.hasToken();
  
  if (mounted) {
    Navigator.pushReplacementNamed(
      context,
      isAuthenticated ? '/dashboard' : '/welcome',
    );
  }
}
```

### 5. Add Token Refresh (Advanced)
Implement automatic token refresh before expiry (currently 24 hours).

---

## Support & Documentation

- **API Documentation:** See `../oral_health_backend/API_DOCUMENTATION.md`
- **Backend Setup:** See `../oral_health_backend/SETUP_GUIDE.md`
- **Full Integration Guide:** See `API_INTEGRATION_GUIDE.md`

---

**Status:** ✅ Complete
**Last Updated:** May 11, 2026
**Flutter Version:** 3.11.5+
**Dart Version:** 3.11.5+
