import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/session_api.dart';
import '../../domain/models/game_session.dart';

final sessionProvider =
    StateNotifierProvider<SessionNotifier, AsyncValue<GameSession?>>((ref) {
      return SessionNotifier(ref.read(sessionApiProvider));
    });

class SessionNotifier extends StateNotifier<AsyncValue<GameSession?>> {
  final SessionApi _api;
  static const _storageKey = 'active_game_session';

  SessionNotifier(this._api) : super(const AsyncValue.loading()) {
    _loadPersistedSession();
  }

  Future<void> _loadPersistedSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_storageKey);
      if (jsonString != null) {
        final session = GameSession.fromJson(jsonDecode(jsonString));
        // Opcional: Podrías verificar aquí si la sesión sigue activa en el backend
        state = AsyncValue.data(session);
      } else {
        state = const AsyncValue.data(null);
      }
    } on FormatException catch (e, stack) {
      // Si el JSON guardado está corrupto, limpiamos
      state = AsyncValue.error(e, stack);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> startNewGame(String routeId) async {
    state = const AsyncValue.loading();
    try {
      final session = await _api.startSoloSession(routeId);

      await _persistSession(session);
      state = AsyncValue.data(session);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> clearSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_storageKey);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  /// Sincroniza el estado local con el servidor
  Future<void> refreshSession() async {
    final currentSession = state.value;
    if (currentSession == null) return;

    try {
      final updatedSession = await _api.getSessionStatus(currentSession.id);
      await _persistSession(updatedSession);
      state = AsyncValue.data(updatedSession);
    } catch (e) {
      // Si falla la red, mantenemos el estado local pero notificamos el error si es necesario
    }
  }

  /// Actualiza el score localmente y persiste el cambio
  Future<void> updateLocalScore(int points) async {
    await state.whenData((session) async {
      if (session != null) {
        final updatedSession = session.copyWith(score: session.score + points);
        await _persistSession(updatedSession);
        state = AsyncValue.data(updatedSession);
      }
    });
  }

  /// Actualiza la estación actual localmente y persiste el cambio
  Future<void> updateCurrentStation(String stationId) async {
    await state.whenData((session) async {
      if (session != null) {
        final updatedSession = session.copyWith(currentStationId: stationId);
        await _persistSession(updatedSession);
        state = AsyncValue.data(updatedSession);
      }
    });
  }

  /// Agrega una estación a la lista de completadas y persiste el cambio
  Future<void> addCompletedStation(
    String stationId,
    DateTime completedAt,
  ) async {
    await state.whenData((session) async {
      if (session != null) {
        if (!session.completedStations.containsKey(stationId)) {
          final updatedSession = session.copyWith(
            completedStations: {
              ...session.completedStations,
              stationId: completedAt,
            },
          );
          await _persistSession(updatedSession);
          state = AsyncValue.data(updatedSession);
        }
      }
    });
  }

  /// Método privado para centralizar el guardado en SharedPreferences
  Future<void> _persistSession(GameSession session) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = jsonEncode(session.toJson());
    await prefs.setString(_storageKey, jsonString);
  }
}
