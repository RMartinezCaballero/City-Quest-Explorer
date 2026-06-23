import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Proveedor centralizado de Dio con interceptores de seguridad
final apiClientProvider = Provider<Dio>((ref) {
  // Detectar URL según plataforma para facilitar pruebas locales
  final String baseUrl = kIsWeb
      ? 'http://localhost:3000/api'
      : (defaultTargetPlatform == TargetPlatform.android
            ? 'http://10.0.2.2:3000/api'
            : 'http://localhost:3000/api');

  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ),
  );

  dio.interceptors.add(SupabaseAuthInterceptor());

  // Logger útil para desarrollo
  dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));

  return dio;
});

/// Interceptor que extrae el token de Supabase y lo inyecta en el header Authorization
class SupabaseAuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final session = Supabase.instance.client.auth.currentSession;
    final token = session?.accessToken;

    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    handler.next(options);
  }
}
