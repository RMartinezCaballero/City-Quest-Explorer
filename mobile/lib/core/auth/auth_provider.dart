import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthState {
  final Session? session;
  final bool isLoading;

  const AuthState({required this.session, required this.isLoading});

  bool get isAuthenticated => session != null;
  String? get accessToken => session?.accessToken;
  User? get user => session?.user;

  AuthState copyWith({Session? session, bool? isLoading}) {
    return AuthState(
      session: session ?? this.session,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

final authStateProvider = StateNotifierProvider<AuthStateNotifier, AuthState>(
  (ref) => AuthStateNotifier(),
);

class AuthStateNotifier extends StateNotifier<AuthState> {
  late final StreamSubscription<AuthState> _sub;

  AuthStateNotifier()
      : super(AuthState(
          session: Supabase.instance.client.auth.currentSession,
          isLoading: false,
        )) {
    // Guardar suscripción para cancelarla en dispose.
    _sub = Supabase.instance.client.auth.onAuthStateChange
        .map((data) => AuthState(session: data.session, isLoading: false))
        .listen((newState) => state = newState);
  }

  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }

  Future<void> signOut() async {
    state = state.copyWith(isLoading: true);
    await Supabase.instance.client.auth.signOut();
    state = const AuthState(session: null, isLoading: false);
  }
}
