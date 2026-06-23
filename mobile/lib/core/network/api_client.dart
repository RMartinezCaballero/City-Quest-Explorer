import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/auth_provider.dart';

/// Base URL de la API.
///
/// En Flutter web, `localhost` apunta a la máquina del browser (el host donde corre el sitio web),
/// por eso conviene parametrizarlo.
///
/// Uso recomendado:
/// `flutter run -d chrome --dart-define=API_BASE_URL=http://127.0.0.1:3000/api`
/// o `API_BASE_URL=http://<IP_LAN>:3000/api`.
const String kDefaultBaseUrl = 'http://localhost:3000/api';

String get kBaseUrl {
  const defined = String.fromEnvironment('API_BASE_URL');
  final value = defined.isNotEmpty ? defined : kDefaultBaseUrl;

  // Evitar dobles '/' al concatenar rutas.
  return value.endsWith('/') ? value.substring(0, value.length - 1) : value;
}

class ApiClient {
  final Dio dio;

  ApiClient(this.dio);

  static Dio _buildDio() {
    final dio = Dio(
      BaseOptions(
        baseUrl: kBaseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 15),
        headers: const {'Content-Type': 'application/json'},
      ),
    );
    return dio;
  }
}

final apiClientProvider = Provider<ApiClient>((ref) {
  final dio = ApiClient._buildDio();

  // Usar interceptores es más dinámico para el refresco de tokens
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = ref.read(authStateProvider).accessToken;
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ),
  );

  return ApiClient(dio);
});
