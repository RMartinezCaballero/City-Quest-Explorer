import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../providers/auth_providers.dart';

enum AuthFormMode { login, register }

class AuthForm extends ConsumerStatefulWidget {
  final AuthFormMode mode;
  const AuthForm({super.key, required this.mode});

  @override
  ConsumerState<AuthForm> createState() => _AuthFormState();
}

class _AuthFormState extends ConsumerState<AuthForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  bool _busy = false;
  bool _obscure = true;

  static const _gold = Color(0xFFD4A017);
  static const _goldDim = Color(0xFF8A6A10);
  static const _surface = Color(0xFF111827);

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _nameCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _busy = true);
    try {
      final controller = ref.read(authControllerProvider.notifier);
      if (widget.mode == AuthFormMode.login) {
        await controller.login(
          email: _emailCtrl.text.trim(),
          password: _passwordCtrl.text,
        );
        if (mounted) context.go('/map');
      } else {
        await controller.register(
          name: _nameCtrl.text.trim(),
          email: _emailCtrl.text.trim(),
          password: _passwordCtrl.text,
        );
        if (mounted) {
          // Con "Confirm email" OFF, la sesión se activa inmediatamente.
          final session = Supabase.instance.client.auth.currentSession;
          if (session != null) {
            context.go('/map');
          } else {
            _nameCtrl.clear();
            _emailCtrl.clear();
            _passwordCtrl.clear();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                duration: const Duration(seconds: 5),
                backgroundColor: _surface,
                content: const Row(
                  children: [
                    Icon(Icons.mark_email_read, color: _gold),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        '¡Cuenta creada! Revisa tu email para confirmar tu registro.',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }
        }
      }
    } catch (e) {
      if (mounted) {
        final msg = _translateError(e.toString());
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFF2A0A0A),
            content: Row(
              children: [
                const Icon(Icons.warning_amber, color: Colors.redAccent),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(msg, style: const TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  InputDecoration _fieldDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFF607080)),
      prefixIcon: Icon(icon, color: _goldDim, size: 20),
      filled: true,
      fillColor: Color.fromRGBO(255, 255, 255, 0.04),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: Color.fromRGBO(255, 255, 255, 0.12)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: _gold, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.redAccent),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.redAccent),
      ),
      errorStyle: const TextStyle(color: Colors.redAccent),
    );
  }

  String _translateError(String error) {
    if (error.contains('Invalid login credentials')) return 'Email o contraseña incorrectos.';
    if (error.contains('Email not confirmed')) return 'Debes confirmar tu email antes de iniciar sesión.';
    if (error.contains('User already registered')) return 'Este email ya tiene una cuenta registrada.';
    if (error.contains('Password should be')) return 'La contraseña debe tener mínimo 6 caracteres.';
    if (error.contains('Unable to validate email')) return 'Formato de email inválido.';
    if (error.contains('session nula')) return 'No se pudo iniciar sesión. Intenta de nuevo.';
    return error.replaceAll('Exception: ', '').replaceAll('AuthException: ', '');
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 28, 24, 0),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (widget.mode == AuthFormMode.register) ...[
              TextFormField(
                controller: _nameCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: _fieldDecoration('Nombre completo', Icons.person_outline),
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Requerido' : null,
              ),
              const SizedBox(height: 16),
            ],
            TextFormField(
              controller: _emailCtrl,
              style: const TextStyle(color: Colors.white),
              keyboardType: TextInputType.emailAddress,
              decoration: _fieldDecoration('Correo electrónico', Icons.alternate_email),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Requerido' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _passwordCtrl,
              style: const TextStyle(color: Colors.white),
              obscureText: _obscure,
              decoration: _fieldDecoration('Contraseña', Icons.lock_outline).copyWith(
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscure ? Icons.visibility_off : Icons.visibility,
                    color: _goldDim,
                    size: 20,
                  ),
                  onPressed: () => setState(() => _obscure = !_obscure),
                ),
              ),
              validator: (v) => (v == null || v.length < 6) ? 'Mínimo 6 caracteres' : null,
            ),
            const SizedBox(height: 28),
            // Botón con gradiente dorado
            GestureDetector(
              onTap: _busy ? null : _submit,
              child: Container(
                height: 52,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: _busy
                      ? null
                      : const LinearGradient(
                          colors: [Color(0xFFD4A017), Color(0xFF8A6A10)],
                        ),
                  color: _busy ? Colors.white10 : null,
                  boxShadow: _busy
                      ? null
                      : [
                          BoxShadow(
                            color: Color.fromRGBO(212, 160, 23, 0.3),
                            blurRadius: 16,
                            offset: const Offset(0, 4),
                          ),
                        ],
                ),
                child: Center(
                  child: _busy
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: _gold,
                          ),
                        )
                      : Text(
                          widget.mode == AuthFormMode.login
                              ? '⚔  INICIAR MISIÓN'
                              : '✦  UNIRSE A LA MISIÓN',
                          style: const TextStyle(
                            color: Color(0xFF0A0A1A),
                            fontWeight: FontWeight.w900,
                            fontSize: 14,
                            letterSpacing: 1.5,
                          ),
                        ),
                ),
              ),
            ),
            if (widget.mode == AuthFormMode.login) ...[
              const SizedBox(height: 20),
              const Center(
                child: Text(
                  'Las puertas de Cartagena aguardan...',
                  style: TextStyle(color: Color(0xFF404858), fontSize: 11),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
