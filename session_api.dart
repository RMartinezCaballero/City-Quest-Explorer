import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/features/games/domain/models/game_session.dart';

final sessionApiProvider = Provider(
  (ref) => SessionApi(ref.watch(apiClientProvider)),
);

class SessionApi {
  final Dio _dio;

  SessionApi(this._dio);

  Future<GameSession> startSoloSession(String routeId) async {
    try {
      final response = await _dio.post(
        '/games/solo/sessions',
        data: {'routeId': routeId},
      );
      return GameSession.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception(
        e.response?.data['message'] ?? 'Error al iniciar sesión de juego',
      );
    }
  }

  Future<GameSession> getSessionStatus(String sessionId) async {
    final response = await _dio.get('/games/sessions/$sessionId');
    return GameSession.fromJson(response.data);
  }
}
