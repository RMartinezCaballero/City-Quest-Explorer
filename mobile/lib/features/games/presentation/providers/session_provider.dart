import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/games/data/session_api.dart';

// IDs del piloto de Cartagena — generados por prisma/seed.ts
// Deben coincidir con los registros en la DB de Supabase/NestJS.
const kPilotRouteId = '550e8400-e29b-41d4-a716-446655440010';
const kPilotCityId = '550e8400-e29b-41d4-a716-446655440001';

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
  SessionNotifier(this._api) : super(const SessionState());

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
    } catch (e) {
      state = SessionState(
        error: 'No se pudo conectar al servidor. Verifica tu conexión.',
      );
    }
  }

  /// Actualiza score desde el backend.
  Future<void> refresh() async {
    if (state.sessionId == null) return;
    try {
      final updated = await _api.getSession(state.sessionId!);
      state = state.copyWith(session: updated);
    } catch (_) {}
  }

  void clear() => state = const SessionState();
}
