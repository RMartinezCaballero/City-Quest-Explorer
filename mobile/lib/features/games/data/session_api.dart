import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/network/api_client.dart';

final sessionApiProvider = Provider<SessionApi>(
  (ref) => SessionApi(ref.watch(apiClientProvider)),
);

class GameSession {
  final String id;
  final String teamId;
  final String routeId;
  final String status;
  final int score;

  const GameSession({
    required this.id,
    required this.teamId,
    required this.routeId,
    required this.status,
    required this.score,
  });

  factory GameSession.fromJson(Map<String, dynamic> json) => GameSession(
        id: json['id'] as String,
        teamId: json['teamId'] as String,
        routeId: json['routeId'] as String,
        status: json['status'] as String,
        score: json['score'] as int? ?? 0,
      );
}

class SessionApi {
  final ApiClient _client;
  SessionApi(this._client);

  /// Crea o reutiliza sesión solo para el usuario autenticado.
  /// routeId y cityId son los del piloto de Cartagena.
  Future<GameSession> createSoloSession({
    required String routeId,
    required String cityId,
  }) async {
    final res = await _client.dio.post(
      '/games/solo/sessions',
      data: {'routeId': routeId, 'cityId': cityId},
    );
    return GameSession.fromJson((res.data as Map).cast<String, dynamic>());
  }

  Future<GameSession> getSession(String sessionId) async {
    final res = await _client.dio.get('/games/sessions/$sessionId');
    return GameSession.fromJson((res.data as Map).cast<String, dynamic>());
  }
}
