import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/auth/auth_provider.dart';
import '../../data/auth_api.dart';

final authControllerProvider =
    StateNotifierProvider<AuthController, AuthState>(
  (ref) => AuthController(
    authApi: ref.watch(authApiProvider),
    authNotifier: ref.watch(authStateProvider.notifier),
  ),
);

class AuthController extends StateNotifier<AuthState> {
  final AuthApi authApi;
  final AuthStateNotifier authNotifier;

  AuthController({required this.authApi, required this.authNotifier})
      : super(authNotifier.state);

  Future<void> login({required String email, required String password}) async {
    await authApi.login(email: email, password: password);
    // onAuthStateChange en AuthStateNotifier actualiza el estado automáticamente.
    state = authNotifier.state;
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    await authApi.register(name: name, email: email, password: password);
    state = authNotifier.state;
  }

  Future<void> signOut() async {
    await authNotifier.signOut();
    state = authNotifier.state;
  }
}
