import 'dart:convert';
import 'dart:developer' as developer;
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/map/domain/checkpoint_marker.dart';

/// Cache manager for mission and checkpoint data (7-day TTL)
final missionCacheManager = CacheManager(
  Config(
    'mission_cache',
    stalePeriod: const Duration(days: 7),
    maxNrOfCacheObjects: 50,
  ),
);

/// ── Pending Events Queue ──
/// Stores QR scans made offline for later sync when connection is restored

final pendingEventsProvider =
    StateNotifierProvider<PendingEventsNotifier, List<Map<String, dynamic>>>(
  (ref) => PendingEventsNotifier(),
);

class PendingEventsNotifier extends StateNotifier<List<Map<String, dynamic>>> {
  PendingEventsNotifier() : super([]) {
    // Auto-recover pending events from previous session
    _loadFromStorage();
  }

  void addEvent(Map<String, dynamic> event) {
    state = [...state, event];
    _persistQueue(state);
  }

  void removeEvent(int index) {
    final updated = [...state];
    updated.removeAt(index);
    state = updated;
    _persistQueue(updated);
  }

  void clearAll() {
    state = [];
    _persistQueue([]);
  }

  Future<void> _persistQueue(List<Map<String, dynamic>> queue) async {
    try {
      await missionCacheManager.putFile(
        'pending_events',
        utf8.encode(jsonEncode(queue)),
      );
    } catch (e) {
      developer.log('[OfflineCache] Error persisting queue: $e');
    }
  }

  Future<void> _loadFromStorage() async {
    try {
      final fileInfo =
          await missionCacheManager.getFileFromCache('pending_events');
      if (fileInfo == null) return;
      final content = await fileInfo.file.readAsString();
      final list = jsonDecode(content) as List<dynamic>;
      state = list.cast<Map<String, dynamic>>();
      developer.log('[OfflineCache] Restored ${state.length} pending events');
    } catch (e) {
      developer.log('[OfflineCache] Error loading queue: $e');
    }
  }
}

/// ── Session Cache ──
/// Persiste la sesión de juego activa para restaurarla al reabrir la app.

class SessionCacheData {
  final String sessionId;
  final String teamId;
  final String routeId;
  final int score;
  final String status;

  const SessionCacheData({
    required this.sessionId,
    required this.teamId,
    required this.routeId,
    required this.score,
    required this.status,
  });

  Map<String, dynamic> toJson() => {
        'sessionId': sessionId,
        'teamId': teamId,
        'routeId': routeId,
        'score': score,
        'status': status,
      };

  factory SessionCacheData.fromJson(Map<String, dynamic> json) =>
      SessionCacheData(
        sessionId: json['sessionId'] as String,
        teamId: json['teamId'] as String,
        routeId: json['routeId'] as String,
        score: json['score'] as int? ?? 0,
        status: json['status'] as String? ?? 'ACTIVE',
      );
}

class SessionCacheService {
  static const _sessionKey = 'active_session';

  static Future<void> saveSession({
    required String sessionId,
    required String teamId,
    required String routeId,
    required int score,
    required String status,
  }) async {
    try {
      final data = SessionCacheData(
        sessionId: sessionId,
        teamId: teamId,
        routeId: routeId,
        score: score,
        status: status,
      );
      await missionCacheManager.putFile(
        _sessionKey,
        utf8.encode(jsonEncode(data.toJson())),
      );
      developer.log('[SessionCache] Session saved');
    } catch (e) {
      developer.log('[SessionCache] Error saving session: $e');
    }
  }

  static Future<SessionCacheData?> getSavedSession() async {
    try {
      final fileInfo =
          await missionCacheManager.getFileFromCache(_sessionKey);
      if (fileInfo == null) return null;
      final content = await fileInfo.file.readAsString();
      final json = jsonDecode(content) as Map<String, dynamic>;
      developer.log('[SessionCache] Session restored');
      return SessionCacheData.fromJson(json);
    } catch (e) {
      developer.log('[SessionCache] Error restoring session: $e');
      return null;
    }
  }

  static Future<void> clearSession() async {
    try {
      await missionCacheManager.removeFile(_sessionKey);
      developer.log('[SessionCache] Session cleared');
    } catch (e) {
      developer.log('[SessionCache] Error clearing session: $e');
    }
  }
}

/// ── OfflineCacheService ──
/// Caches checkpoints, narratives, and syncing helpers
class OfflineCacheService {
  static const _checkpointsKey = 'cached_checkpoints';
  static const _narrativesKey = 'cached_narratives';

  static Future<void> cacheCheckpoints(
      List<CheckpointMarker> checkpoints) async {
    try {
      final jsonList = checkpoints
          .map((cp) => {
                'id': cp.id,
                'name': cp.name,
                'description': cp.description,
                'latitude': cp.latitude,
                'longitude': cp.longitude,
                'orderIndex': cp.orderIndex,
                'reached': cp.reached,
              })
          .toList();

      await missionCacheManager.putFile(
        _checkpointsKey,
        utf8.encode(jsonEncode(jsonList)),
      );
      developer.log('[OfflineCache] Cached ${checkpoints.length} checkpoints');
    } catch (e) {
      developer.log('[OfflineCache] Error caching checkpoints: $e');
    }
  }

  static Future<List<CheckpointMarker>?> getCachedCheckpoints() async {
    try {
      final fileInfo =
          await missionCacheManager.getFileFromCache(_checkpointsKey);
      if (fileInfo == null) {
        developer.log('[OfflineCache] No cached checkpoints found');
        return null;
      }

      final content = await fileInfo.file.readAsString();
      final list = jsonDecode(content) as List<dynamic>;

      final checkpoints = list.map((json) {
        final map = json as Map<String, dynamic>;
        return CheckpointMarker(
          id: map['id'] as String,
          name: map['name'] as String,
          description: map['description'] as String? ?? '',
          latitude: (map['latitude'] as num).toDouble(),
          longitude: (map['longitude'] as num).toDouble(),
          orderIndex: map['orderIndex'] as int? ?? 0,
          reached: map['reached'] as bool? ?? false,
        );
      }).toList();

      developer.log('[OfflineCache] Loaded ${checkpoints.length} checkpoints');
      return checkpoints;
    } catch (e) {
      developer.log('[OfflineCache] Error loading cached checkpoints: $e');
      return null;
    }
  }

  static Future<void> cacheNarratives(Map<String, String> narratives) async {
    try {
      await missionCacheManager.putFile(
        _narrativesKey,
        utf8.encode(jsonEncode(narratives)),
      );
      developer
          .log('[OfflineCache] Cached ${narratives.length} narrative entries');
    } catch (e) {
      developer.log('[OfflineCache] Error caching narratives: $e');
    }
  }

  static Future<Map<String, String>?> getCachedNarratives() async {
    try {
      final fileInfo =
          await missionCacheManager.getFileFromCache(_narrativesKey);
      if (fileInfo == null) return null;

      final content = await fileInfo.file.readAsString();
      final decoded = jsonDecode(content) as Map<String, dynamic>;
      return decoded.map((k, v) => MapEntry(k, v as String));
    } catch (e) {
      developer.log('[OfflineCache] Error loading cached narratives: $e');
      return null;
    }
  }
}
