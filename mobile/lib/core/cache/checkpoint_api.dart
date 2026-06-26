import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/features/map/domain/checkpoint_marker.dart';

/// IDs del piloto de Cartagena — deben coincidir con prisma/seed.ts
const String kPilotRouteId = '550e8400-e29b-41d4-a716-446655440010';
const String kPilotCityId = '550e8400-e29b-41d4-a716-446655440001';

final checkpointApiProvider = Provider<CheckpointApi>(
  (ref) => CheckpointApi(ref.watch(apiClientProvider)),
);

class CheckpointApi {
  final ApiClient _client;
  CheckpointApi(this._client);

  /// Fetch checkpoints desde el endpoint de rutas.
  /// GET /cities/:cityId/routes/:routeId → { ..., checkpoints: [...] }
  Future<List<CheckpointMarker>> fetchCheckpoints({
    String routeId = kPilotRouteId,
    String cityId = kPilotCityId,
  }) async {
    final res = await _client.dio.get(
      '/cities/$cityId/routes/$routeId',
    );
    final data = res.data as Map<String, dynamic>;
    final checkpointsJson = (data['checkpoints'] ?? []) as List<dynamic>;

    return checkpointsJson.map((json) {
      final map = json as Map<String, dynamic>;
      return CheckpointMarker(
        id: map['id'] as String,
        name: map['name'] as String,
        description: map['description'] as String? ?? '',
        latitude: (map['latitude'] as num).toDouble(),
        longitude: (map['longitude'] as num).toDouble(),
        orderIndex: map['orderIndex'] as int? ?? 0,
        reached: false,
      );
    }).toList();
  }
}
