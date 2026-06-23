import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/features/games/presentation/providers/session_provider.dart';
import 'package:mobile/features/map/domain/checkpoint_marker.dart';
import 'package:mobile/features/map/presentation/providers/map_providers.dart';

const _cartagenaCenter = LatLng(10.4231, -75.5486);

class MapScreen extends ConsumerWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final checkpoints = ref.watch(checkpointsProvider);
    final userLocationAsync = ref.watch(userLocationProvider);
    final sessionState = ref.watch(sessionProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('El Manuscrito Prohibido'),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner),
            tooltip: 'Escanear QR',
            onPressed: () => context.go('/qr'),
          ),
          IconButton(
            icon: const Icon(Icons.list),
            tooltip: 'Misiones',
            onPressed: () => context.go('/missions'),
          ),
          IconButton(
            icon: const Icon(Icons.leaderboard),
            tooltip: 'Ranking',
            onPressed: () => context.go('/ranking'),
          ),
          IconButton(
            icon: const Icon(Icons.person),
            tooltip: 'Perfil',
            onPressed: () => context.go('/profile'),
          ),
        ],
      ),
      body: Stack(
        children: [
          FlutterMap(
            options: const MapOptions(
              initialCenter: _cartagenaCenter,
              initialZoom: 15,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.cityquest.explorer',
              ),
              MarkerLayer(markers: _buildCheckpointMarkers(context, checkpoints)),
              userLocationAsync.when(
                data: (location) {
                  if (location == null) return const SizedBox.shrink();
                  return MarkerLayer(
                    markers: [
                      Marker(
                        point: location,
                        width: 20,
                        height: 20,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.blue,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                        ),
                      ),
                    ],
                  );
                },
                loading: () => const SizedBox.shrink(),
                error: (_, e) => const SizedBox.shrink(),
              ),
            ],
          ),
          // Banner sesión activa con score
          if (sessionState.hasSession)
            Positioned(
              bottom: 80,
              left: 16,
              right: 16,
              child: _SessionBanner(score: sessionState.score),
            ),
          // Botón iniciar misión si no hay sesión
          if (!sessionState.hasSession && !sessionState.isLoading)
            Positioned(
              bottom: 80,
              left: 16,
              right: 16,
              child: _StartSessionButton(
                onTap: () =>
                    ref.read(sessionProvider.notifier).startSoloSession(),
              ),
            ),
          // Loading al crear sesión
          if (sessionState.isLoading)
            const Positioned(
              bottom: 100,
              left: 0,
              right: 0,
              child: Center(
                child: CircularProgressIndicator(color: Color(0xFFD4A017)),
              ),
            ),
          // Error al crear sesión
          if (sessionState.error != null)
            Positioned(
              bottom: 80,
              left: 16,
              right: 16,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF2A0A0A),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.redAccent),
                ),
                child: Text(
                  sessionState.error!,
                  style: const TextStyle(color: Colors.redAccent, fontSize: 12),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.refresh(userLocationProvider),
        tooltip: 'Mi ubicación',
        child: const Icon(Icons.my_location),
      ),
    );
  }

  List<Marker> _buildCheckpointMarkers(
    BuildContext context,
    List<CheckpointMarker> checkpoints,
  ) {
    return checkpoints.map((CheckpointMarker cp) {
      return Marker(
        point: LatLng(cp.latitude, cp.longitude),
        width: 48,
        height: 48,
        child: GestureDetector(
          onTap: () => _showCheckpointInfo(context, cp.name, cp.description),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: cp.reached ? Colors.green : Colors.deepPurple,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '${cp.orderIndex}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Icon(
                cp.reached ? Icons.check_circle : Icons.location_on,
                color: cp.reached ? Colors.green : Colors.deepPurple,
                size: 28,
              ),
            ],
          ),
        ),
      );
    }).toList();
  }

  void _showCheckpointInfo(
    BuildContext context,
    String name,
    String description,
  ) {
    showModalBottomSheet(
      context: context,
      builder: (_) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(name, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            Text(description),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.qr_code_scanner),
                label: const Text('Escanear QR'),
                onPressed: () {
                  Navigator.pop(context);
                  context.go('/qr');
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SessionBanner extends StatelessWidget {
  final int score;
  static const _gold = Color(0xFFD4A017);

  const _SessionBanner({required this.score});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF111827),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _gold.withValues(alpha: 0.5)),
        boxShadow: [
          BoxShadow(color: _gold.withValues(alpha: 0.15), blurRadius: 12),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.stars, color: _gold, size: 18),
          const SizedBox(width: 8),
          const Text(
            'MISIÓN ACTIVA',
            style: TextStyle(
              color: _gold,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
            ),
          ),
          const Spacer(),
          Text(
            '$score pts',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}

class _StartSessionButton extends StatelessWidget {
  final VoidCallback onTap;
  static const _gold = Color(0xFFD4A017);
  static const _dark = Color(0xFF0A0A1A);

  const _StartSessionButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: const LinearGradient(
            colors: [Color(0xFFD4A017), Color(0xFF8A6A10)],
          ),
          boxShadow: [
            BoxShadow(
              color: _gold.withValues(alpha: 0.3),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: const Center(
          child: Text(
            '⚔  INICIAR MISIÓN',
            style: TextStyle(
              color: _dark,
              fontWeight: FontWeight.w900,
              fontSize: 14,
              letterSpacing: 2,
            ),
          ),
        ),
      ),
    );
  }
}
