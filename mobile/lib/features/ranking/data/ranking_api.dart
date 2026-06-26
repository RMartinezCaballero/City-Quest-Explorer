import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/network/api_client.dart';

/// ID de la ruta piloto (El Manuscrito Prohibido - Cartagena)
/// Generado por prisma/seed.ts
const String kPilotRouteId = '550e8400-e29b-41d4-a716-446655440010';

final rankingApiProvider = Provider<RankingApi>(
  (ref) => RankingApi(ref.watch(apiClientProvider)),
);

class RankingEntry {
  final String teamId;
  final String teamName;
  final int score;
  final int position;

  const RankingEntry({
    required this.teamId,
    required this.teamName,
    required this.score,
    required this.position,
  });

  factory RankingEntry.fromJson(Map<String, dynamic> json) {
    final team = json['team'] as Map<String, dynamic>? ?? {};
    return RankingEntry(
      teamId: json['teamId'] as String? ?? '',
      teamName: team['name'] as String? ?? 'Equipo desconocido',
      score: json['score'] as int? ?? 0,
      position: json['position'] as int? ?? 0,
    );
  }
}

class RankingApi {
  final ApiClient _client;
  RankingApi(this._client);

  Future<List<RankingEntry>> getRanking(String routeId) async {
    try {
      final res = await _client.dio.get('/routes/$routeId/rankings');
      final list = res.data as List<dynamic>;
      return list
          .map((e) => RankingEntry.fromJson((e as Map).cast<String, dynamic>()))
          .toList();
    } catch (e) {
      return [];
    }
  }
}

// Provider que carga el ranking del piloto automáticamente
final rankingProvider = FutureProvider<List<RankingEntry>>((ref) async {
  final api = ref.watch(rankingApiProvider);
  return api.getRanking(kPilotRouteId);
});
