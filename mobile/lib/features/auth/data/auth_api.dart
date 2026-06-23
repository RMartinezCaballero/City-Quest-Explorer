import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

final authApiProvider = Provider<AuthApi>((ref) => AuthApi());

class AuthApi {
  final _auth = Supabase.instance.client.auth;

  Future<Session> login({
    required String email,
    required String password,
  }) async {
    final res = await _auth.signInWithPassword(
      email: email,
      password: password,
    );
    if (res.session == null) throw Exception('Login fallido: sesión nula');
    return res.session!;
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final res = await _auth.signUp(
      email: email,
      password: password,
      data: {'name': name},
    );
    // Supabase lanza excepción si el email ya existe con confirmación pendiente,
    // pero si llega aquí con user nulo es un error inesperado.
    if (res.user == null) {
      throw Exception('No se pudo crear la cuenta. Intenta de nuevo.');
    }
  }
}
