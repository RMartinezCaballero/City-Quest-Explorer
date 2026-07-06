import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/cache/offline_cache_service.dart';
import 'package:mobile/features/games/data/session_api.dart';

class SessionState {
  final GameSession? session;
  final bool isLoading;
  final String? error;

  const SessionState({
    this.session,
    this.isLoading = false,
    this.error,
  });

  bool get hasSession => session != null;
  String? get sessionId => session?.id;
  int get score => session?.score ?? 0;

  SessionState copyWith({
    GameSession? session,
    bool? isLoading,
    String? error,
  }) =>
      SessionState(
        session: session ?? this.session,
        isLoading: isLoading ?? this.isLoading,
        error: error,
      );
}

final sessionProvider =
    StateNotifierProvider<SessionNotifier, SessionState>(
  (ref) => SessionNotifier(ref.watch(sessionApiProvider)),
);

class SessionNotifier extends StateNotifier<SessionState> {
  final SessionApi _api;
  SessionNotifier(this._api) : super(const SessionState()) {
    // Intentar restaurar sesión desde caché al iniciar
    _restoreFromCache();
  }

  /// Restaura la sesión desde el caché local (para offline resume)
  Future<void> _restoreFromCache() async {
    final saved = await SessionCacheService.getSavedSession();
    if (saved != null && saved.status == 'ACTIVE') {
      state = SessionState(
        session: GameSession(
          id: saved.sessionId,
          teamId: saved.teamId,
          routeId: saved.routeId,
          status: saved.status,
          score: saved.score,
        ),
      );
    }

    // Intentar refrescar desde la API (validar que la sesión sigue activa)
    if (state.hasSession) {
      try {
        final updated = await _api.getSession(state.sessionId!);
        state = SessionState(session: updated);
      } catch (_) {
        // Si falla la red, mantener los datos cacheados
      }
    }
  }

  /// Inicia sesión solo. Si ya existe una activa la reutiliza.
  Future<void> startSoloSession() async {
    if (state.isLoading) return;
    state = state.copyWith(isLoading: true, error: null);

    try {
      final session = await _api.createSoloSession(
        routeId: kPilotRouteId,
        cityId: kPilotCityId,
      );
      state = SessionState(session: session);
      // Persistir en caché local
      await SessionCacheService.saveSession(
        sessionId: session.id,
        teamId: session.teamId,
        routeId: session.routeId,
        score: session.score,
        status: session.status,
      );
    } catch (e) {
      state = SessionState(
        error: 'No se pudo conectar al servidor. Verifica tu conexión.',
      );
    }
  }

  /// Actualiza score desde el backend y persiste localmente.
  Future<void> refresh() async {
    if (state.sessionId == null) return;
    try {
      final updated = await _api.getSession(state.sessionId!);
      state = state.copyWith(session: updated);
      // Actualizar caché local
      await SessionCacheService.saveSession(
        sessionId: updated.id,
        teamId: updated.teamId,
        routeId: updated.routeId,
        score: updated.score,
        status: updated.status,
      );
    } catch (_) {
      // Si falla la red, mantener datos cacheados
    }
  }

  /// Actualiza el score localmente (para modo offline)
  Future<void> updateScoreOffline(int increment) async {
    if (state.session == null) return;
    final newScore = state.score + increment;
    final updated = GameSession(
      id: state.session!.id,
      teamId: state.session!.teamId,
      routeId: state.session!.routeId,
      status: state.session!.status,
      score: newScore,
    );
    state = state.copyWith(session: updated);
    // Persistir score actualizado localmente
    await SessionCacheService.saveSession(
      sessionId: updated.id,
      teamId: updated.teamId,
      routeId: updated.routeId,
      score: newScore,
      status: updated.status,
    );
  }

  /// Finaliza la sesión localmente y limpia caché
  Future<void> finishOffline() async {
    if (state.session == null) return;
    final updated = GameSession(
      id: state.session!.id,
      teamId: state.session!.teamId,
      routeId: state.session!.routeId,
      status: 'COMPLETED',
      score: state.score + 100, // Bonus de misión completa
    );
    state = SessionState(session: updated);
    await SessionCacheService.clearSession();
  }

  void clear() {
    SessionCacheService.clearSession();
    state = const SessionState();
  }
}
