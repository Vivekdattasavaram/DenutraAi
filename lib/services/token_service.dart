import 'package:shared_preferences/shared_preferences.dart';

class TokenService {
  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _userEmailKey = 'user_email';
  static const String _userNameKey = 'user_name';

  /// Save JWT token to local storage
  static Future<bool> saveToken(String token) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.setString(_tokenKey, token);
    } catch (e) {
      print('Error saving token: $e');
      return false;
    }
  }

  /// Get JWT token from local storage
  static Future<String?> getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_tokenKey);
    } catch (e) {
      print('Error retrieving token: $e');
      return null;
    }
  }

  /// Check if token exists
  static Future<bool> hasToken() async {
    try {
      final token = await getToken();
      return token != null && token.isNotEmpty;
    } catch (e) {
      print('Error checking token: $e');
      return false;
    }
  }

  /// Save user information
  static Future<bool> saveUserInfo({
    required int userId,
    required String email,
    required String firstName,
    required String lastName,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt(_userIdKey, userId);
      await prefs.setString(_userEmailKey, email);
      await prefs.setString(_userNameKey, '$firstName $lastName');
      return true;
    } catch (e) {
      print('Error saving user info: $e');
      return false;
    }
  }

  /// Get user ID
  static Future<int?> getUserId() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getInt(_userIdKey);
    } catch (e) {
      print('Error retrieving user ID: $e');
      return null;
    }
  }

  /// Get user email
  static Future<String?> getUserEmail() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_userEmailKey);
    } catch (e) {
      print('Error retrieving user email: $e');
      return null;
    }
  }

  /// Get user name
  static Future<String?> getUserName() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_userNameKey);
    } catch (e) {
      print('Error retrieving user name: $e');
      return null;
    }
  }

  /// Clear all authentication data (logout)
  static Future<bool> clearAll() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_tokenKey);
      await prefs.remove(_userIdKey);
      await prefs.remove(_userEmailKey);
      await prefs.remove(_userNameKey);
      return true;
    } catch (e) {
      print('Error clearing authentication data: $e');
      return false;
    }
  }
}
