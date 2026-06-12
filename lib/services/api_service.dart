import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/auth_models.dart';
import 'token_service.dart';

class ApiService {
  // API Base URL - Change this to your actual backend URL
  static const String baseUrl = 'http://10.19.181.248/oral_health_api'; // Use 10.0.2.2 for Android emulator or your local IP for physical devices

  // Timeout duration for requests
  static const Duration timeout = Duration(seconds: 30);

  // ========== AUTHENTICATION ENDPOINTS ==========

  /// Register new user
  static Future<RegisterResponse> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String confirmPassword,
  }) async {
    try {
      final request = RegisterRequest(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      );

      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/register.php'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(request.toJson()),
          )
          .timeout(timeout);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final jsonResponse = jsonDecode(response.body);
        return RegisterResponse.fromJson(jsonResponse);
      } else {
        final jsonResponse = jsonDecode(response.body);
        final error = ApiErrorResponse.fromJson(
          jsonResponse,
          response.statusCode,
        );
        throw error;
      }
    } catch (e) {
      print('Register error: $e');
      rethrow;
    }
  }

  /// Login user
  static Future<LoginResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final request = LoginRequest(
        email: email,
        password: password,
      );

      print('DEBUG: Login request - email: $email, password: $password');

      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/login.php'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(request.toJson()),
          )
          .timeout(timeout);

      print('DEBUG: Login API response status: ${response.statusCode}');
      print('DEBUG: Login API response body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        print('DEBUG: Parsed JSON: $jsonResponse');
        
        final loginResponse = LoginResponse.fromJson(jsonResponse);
        print('DEBUG: Parsed LoginResponse - success: ${loginResponse.success}, token: ${loginResponse.token}, message: ${loginResponse.message}');

        // Save token and user info if login successful
        if (loginResponse.success && loginResponse.token != null) {
          print('DEBUG: Saving token and user info');
          await TokenService.saveToken(loginResponse.token!);
          if (loginResponse.user != null) {
            await TokenService.saveUserInfo(
              userId: loginResponse.user!.id ?? 0,
              email: loginResponse.user!.email ?? email,
              firstName: loginResponse.user!.firstName ?? '',
              lastName: loginResponse.user!.lastName ?? '',
            );
          }
        }

        return loginResponse;
      } else {
        final jsonResponse = jsonDecode(response.body);
        print('DEBUG: Error response: $jsonResponse');
        final error = ApiErrorResponse.fromJson(
          jsonResponse,
          response.statusCode,
        );
        throw error;
      }
    } catch (e) {
      print('Login error: $e');
      rethrow;
    }
  }

  /// Request password reset (send OTP)
  static Future<ForgotPasswordResponse> forgotPassword({
    required String email,
  }) async {
    try {
      final request = ForgotPasswordRequest(email: email);

      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/forgot_password.php'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(request.toJson()),
          )
          .timeout(timeout);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        return ForgotPasswordResponse.fromJson(jsonResponse);
      } else {
        final jsonResponse = jsonDecode(response.body);
        final error = ApiErrorResponse.fromJson(
          jsonResponse,
          response.statusCode,
        );
        throw error;
      }
    } catch (e) {
      print('Forgot password error: $e');
      rethrow;
    }
  }

  /// Verify OTP
  static Future<VerifyOTPResponse> verifyOTP({
    required String email,
    required String otp,
  }) async {
    try {
      final request = VerifyOTPRequest(email: email, otp: otp);

      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/verify_otp.php'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(request.toJson()),
          )
          .timeout(timeout);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        return VerifyOTPResponse.fromJson(jsonResponse);
      } else {
        final jsonResponse = jsonDecode(response.body);
        final error = ApiErrorResponse.fromJson(
          jsonResponse,
          response.statusCode,
        );
        throw error;
      }
    } catch (e) {
      print('Verify OTP error: $e');
      rethrow;
    }
  }

  /// Reset password after OTP verification
  static Future<ResetPasswordResponse> resetPassword({
    required String email,
    required String otp,
    required String newPassword,
    required String confirmPassword,
  }) async {
    try {
      final request = ResetPasswordRequest(
        email: email,
        otp: otp,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      );

      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/reset_password.php'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(request.toJson()),
          )
          .timeout(timeout);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        return ResetPasswordResponse.fromJson(jsonResponse);
      } else {
        final jsonResponse = jsonDecode(response.body);
        final error = ApiErrorResponse.fromJson(
          jsonResponse,
          response.statusCode,
        );
        throw error;
      }
    } catch (e) {
      print('Reset password error: $e');
      rethrow;
    }
  }

  /// Logout user
  static Future<bool> logout() async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        // Token already cleared
        return true;
      }

      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/logout.php'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
          )
          .timeout(timeout);

      // Clear local storage regardless of server response
      await TokenService.clearAll();

      return response.statusCode == 200;
    } catch (e) {
      print('Logout error: $e');
      // Still clear local storage on error
      await TokenService.clearAll();
      return false;
    }
  }

  // ========== HELPER METHODS ==========

  /// Get authorization header with JWT token
  static Future<Map<String, String>> getAuthHeaders() async {
    final token = await TokenService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  /// Make authenticated GET request
  static Future<dynamic> getAuthenticatedRequest(String endpoint) async {
    try {
      final headers = await getAuthHeaders();
      final response = await http
          .get(
            Uri.parse('$baseUrl$endpoint'),
            headers: headers,
          )
          .timeout(timeout);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else if (response.statusCode == 401) {
        // Token might be expired, clear it
        await TokenService.clearAll();
        throw ApiErrorResponse(
          success: false,
          message: 'Unauthorized - Please login again',
          statusCode: 401,
        );
      } else {
        final jsonResponse = jsonDecode(response.body);
        throw ApiErrorResponse.fromJson(
          jsonResponse,
          response.statusCode,
        );
      }
    } catch (e) {
      print('Authenticated GET request error: $e');
      rethrow;
    }
  }

  /// Make authenticated POST request
  static Future<dynamic> postAuthenticatedRequest(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      final headers = await getAuthHeaders();
      final response = await http
          .post(
            Uri.parse('$baseUrl$endpoint'),
            headers: headers,
            body: jsonEncode(body),
          )
          .timeout(timeout);

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else if (response.statusCode == 401) {
        // Token might be expired, clear it
        await TokenService.clearAll();
        throw ApiErrorResponse(
          success: false,
          message: 'Unauthorized - Please login again',
          statusCode: 401,
        );
      } else {
        final jsonResponse = jsonDecode(response.body);
        throw ApiErrorResponse.fromJson(
          jsonResponse,
          response.statusCode,
        );
      }
    } catch (e) {
      print('Authenticated POST request error: $e');
      rethrow;
    }
  }

  /// Check if user is authenticated
  static Future<bool> isAuthenticated() async {
    return await TokenService.hasToken();
  }
}
