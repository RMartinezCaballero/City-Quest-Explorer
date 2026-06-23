import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/auth/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  static const _gold = Color(0xFFD4A017);
  static const _dark = Color(0xFF0A0A1A);
  static const _surface = Color(0xFF111827);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: _dark,
      appBar: AppBar(
        backgroundColor: _dark,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _gold),
          onPressed: () => context.go('/map'),
        ),
        title: const Text(
          'PERFIL',
          style: TextStyle(
            color: _gold,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            fontSize: 14,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const SizedBox(height: 16),
            // Avatar
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: _gold, width: 1.5),
                color: _gold.withValues(alpha: 0.1),
              ),
              child: const Icon(Icons.person, color: _gold, size: 40),
            ),
            const SizedBox(height: 16),
            // Nombre
            Text(
              user?.userMetadata?['name'] as String? ?? 'Agente',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            // Email
            Text(
              user?.email ?? '',
              style: const TextStyle(color: Color(0xFF607080), fontSize: 13),
            ),
            const SizedBox(height: 32),
            // Info card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '✦  EL MANUSCRITO PROHIBIDO',
                    style: TextStyle(
                      color: _gold,
                      fontSize: 11,
                      letterSpacing: 1.5,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _InfoRow(label: 'Misión', value: 'Cartagena de Indias'),
                  _InfoRow(label: 'Estado', value: 'En progreso'),
                  _InfoRow(label: 'ID de agente', value: user?.id.substring(0, 8) ?? '—'),
                ],
              ),
            ),
            const Spacer(),
            // Botón de logout
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  await ref.read(authStateProvider.notifier).signOut();
                  // El router redirige a /login automáticamente via el guard.
                },
                icon: const Icon(Icons.logout, size: 18, color: Colors.redAccent),
                label: const Text(
                  'Cerrar sesión',
                  style: TextStyle(color: Colors.redAccent),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.redAccent),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF607080), fontSize: 13)),
          Text(value, style: const TextStyle(color: Colors.white70, fontSize: 13)),
        ],
      ),
    );
  }
}
