import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/map/domain/checkpoint_marker.dart';
import 'package:mobile/features/map/presentation/providers/map_providers.dart';
import 'package:mobile/features/missions/presentation/providers/geofence_provider.dart';

class MissionsScreen extends ConsumerWidget {
  const MissionsScreen({super.key});

  static const _gold = Color(0xFFD4A017);
  static const _dark = Color(0xFF0A0A1A);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final checkpoints = ref.watch(checkpointsProvider);
    final geofence = ref.watch(geofenceProvider);

    return Scaffold(
      backgroundColor: _dark,
      appBar: AppBar(
        backgroundColor: _dark,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _gold),
          onPressed: () => context.go('/map'),
        ),
        title: const Text(
          'MISIONES',
          style: TextStyle(
            color: _gold,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            fontSize: 14,
          ),
        ),
      ),
      body: Column(
        children: [
          // Banner de proximidad
          if (geofence.isNearCheckpoint)
            _ProximityBanner(checkpoint: geofence.nearbyCheckpoint!),
          // Lista de checkpoints
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: checkpoints.length,
              separatorBuilder: (_, i) => const SizedBox(height: 10),
              itemBuilder: (_, i) {
                final cp = checkpoints[i];
                final isNearby = geofence.nearbyCheckpoint?.id == cp.id;
                return _MissionCard(
                  checkpoint: cp,
                  isNearby: isNearby,
                  onTap: () => context.go('/missions/${cp.id}'),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _ProximityBanner extends StatelessWidget {
  final CheckpointMarker checkpoint;
  static const _gold = Color(0xFFD4A017);

  const _ProximityBanner({required this.checkpoint});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            _gold.withValues(alpha: 0.2),
            _gold.withValues(alpha: 0.05),
          ],
        ),
        border: Border(
          bottom: BorderSide(color: _gold.withValues(alpha: 0.4)),
        ),
      ),
      child: Row(
        children: [
          const Icon(Icons.location_on, color: _gold, size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              '¡Estás cerca de "${checkpoint.name}"! Escanea el QR.',
              style: const TextStyle(
                color: _gold,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MissionCard extends StatelessWidget {
  final CheckpointMarker checkpoint;
  final bool isNearby;
  final VoidCallback onTap;

  static const _gold = Color(0xFFD4A017);
  static const _surface = Color(0xFF111827);

  const _MissionCard({
    required this.checkpoint,
    required this.isNearby,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: _surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isNearby
                ? _gold
                : checkpoint.reached
                    ? Colors.green.withValues(alpha: 0.5)
                    : Colors.white.withValues(alpha: 0.08),
            width: isNearby ? 1.5 : 1,
          ),
          boxShadow: isNearby
              ? [
                  BoxShadow(
                    color: _gold.withValues(alpha: 0.15),
                    blurRadius: 16,
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            // Número de orden
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: checkpoint.reached
                    ? Colors.green.withValues(alpha: 0.15)
                    : isNearby
                        ? _gold.withValues(alpha: 0.15)
                        : Colors.white.withValues(alpha: 0.05),
                border: Border.all(
                  color: checkpoint.reached
                      ? Colors.green
                      : isNearby
                          ? _gold
                          : Colors.white24,
                ),
              ),
              child: Center(
                child: checkpoint.reached
                    ? const Icon(Icons.check, color: Colors.green, size: 18)
                    : Text(
                        '${checkpoint.orderIndex}',
                        style: TextStyle(
                          color: isNearby ? _gold : Colors.white54,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
              ),
            ),
            const SizedBox(width: 14),
            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    checkpoint.name,
                    style: TextStyle(
                      color: isNearby ? _gold : Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    checkpoint.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Color(0xFF607080),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            // Icono acción
            Icon(
              isNearby
                  ? Icons.qr_code_scanner
                  : Icons.chevron_right,
              color: isNearby ? _gold : Colors.white24,
            ),
          ],
        ),
      ),
    );
  }
}
