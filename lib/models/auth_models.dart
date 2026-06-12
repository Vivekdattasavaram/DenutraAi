// Authentication Request Models
class LoginRequest {
  final String email;
  final String password;

  LoginRequest({
    required this.email,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }
}

class RegisterRequest {
  final String firstName;
  final String lastName;
  final String email;
  final String password;
  final String confirmPassword;

  RegisterRequest({
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.password,
    required this.confirmPassword,
  });

  Map<String, dynamic> toJson() {
    return {
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'password': password,
      'confirm_password': confirmPassword,
    };
  }
}

class ForgotPasswordRequest {
  final String email;

  ForgotPasswordRequest({required this.email});

  Map<String, dynamic> toJson() {
    return {'email': email};
  }
}

class VerifyOTPRequest {
  final String email;
  final String otp;

  VerifyOTPRequest({
    required this.email,
    required this.otp,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'otp': otp,
    };
  }
}

class ResetPasswordRequest {
  final String email;
  final String otp;
  final String newPassword;
  final String confirmPassword;

  ResetPasswordRequest({
    required this.email,
    required this.otp,
    required this.newPassword,
    required this.confirmPassword,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'otp': otp,
      'new_password': newPassword,
      'confirm_password': confirmPassword,
    };
  }
}

// Authentication Response Models
class LoginResponse {
  final bool success;
  final String message;
  final String? token;
  final UserResponse? user;

  LoginResponse({
    required this.success,
    required this.message,
    this.token,
    this.user,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      success: json['success'] == true || json['status'] == 'success',
      message: json['message'] ?? '',
      token: json['data']?['token'],
      user: json['data'] != null ? UserResponse.fromJson(json['data']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': {
        'token': token,
        'user': user?.toJson(),
      },
    };
  }
}

class RegisterResponse {
  final bool success;
  final String message;
  final UserResponse? user;

  RegisterResponse({
    required this.success,
    required this.message,
    this.user,
  });

  factory RegisterResponse.fromJson(Map<String, dynamic> json) {
    return RegisterResponse(
      success: json['success'] == true || json['status'] == 'success',
      message: json['message'] ?? '',
      user: json['data'] != null ? UserResponse.fromJson(json['data']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': user?.toJson(),
    };
  }
}

class ForgotPasswordResponse {
  final bool success;
  final String message;
  final String? email;

  ForgotPasswordResponse({
    required this.success,
    required this.message,
    this.email,
  });

  factory ForgotPasswordResponse.fromJson(Map<String, dynamic> json) {
    return ForgotPasswordResponse(
      success: json['success'] == true || json['status'] == 'success',
      message: json['message'] ?? '',
      email: json['data']?['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': {'email': email},
    };
  }
}

class VerifyOTPResponse {
  final bool success;
  final String message;
  final bool? verified;

  VerifyOTPResponse({
    required this.success,
    required this.message,
    this.verified,
  });

  factory VerifyOTPResponse.fromJson(Map<String, dynamic> json) {
    return VerifyOTPResponse(
      success: json['success'] == true || json['status'] == 'success',
      message: json['message'] ?? '',
      verified: json['data']?['verified'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': {'verified': verified},
    };
  }
}

class ResetPasswordResponse {
  final bool success;
  final String message;

  ResetPasswordResponse({
    required this.success,
    required this.message,
  });

  factory ResetPasswordResponse.fromJson(Map<String, dynamic> json) {
    return ResetPasswordResponse(
      success: json['success'] == true || json['status'] == 'success',
      message: json['message'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
    };
  }
}

class UserResponse {
  final int? id;
  final String? firstName;
  final String? lastName;
  final String? email;
  final String? profileImage;
  final String? createdAt;

  UserResponse({
    this.id,
    this.firstName,
    this.lastName,
    this.email,
    this.profileImage,
    this.createdAt,
  });

  factory UserResponse.fromJson(Map<String, dynamic> json) {
    return UserResponse(
      id: json['id'] ?? json['user_id'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      email: json['email'],
      profileImage: json['profile_image'],
      createdAt: json['created_at'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'profile_image': profileImage,
      'created_at': createdAt,
    };
  }
}

class ApiErrorResponse {
  final bool success;
  final String message;
  final int? statusCode;

  ApiErrorResponse({
    required this.success,
    required this.message,
    this.statusCode,
  });

  factory ApiErrorResponse.fromJson(Map<String, dynamic> json, int statusCode) {
    return ApiErrorResponse(
      success: json['success'] == true || json['status'] == 'success',
      message: json['message'] ?? 'An error occurred',
      statusCode: statusCode,
    );
  }

  @override
  String toString() => 'ApiErrorResponse(statusCode: $statusCode, message: $message)';
}
