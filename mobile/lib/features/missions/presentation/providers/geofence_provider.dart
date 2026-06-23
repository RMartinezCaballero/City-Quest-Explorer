import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:mobile/features/map/domain/checkpoint_marker.dart';
import 'package:mobile/features/map/presentation/providers/map_providers.dart';

// Nota: positionStreamProvider en map_providers.dart ya valida permisos.

const double kGeofenceRadiusMeters = 50.0;

class GeofenceState {
  final Position? position;
  final CheckpointMarker? nearbyCheckpoint;
  final double? distanceToNearest;

  const GeofenceState({
    this.position,
    this.nearbyCheckpoint,
    this.distanceToNearest,
  });

  bool get isNearCheckpoint => nearbyCheckpoint != null;
}

// Detecta si el usuario está cerca de algún checkpoint
// Usa positionStreamProvider de map_providers (ya maneja permisos)
final geofenceProvider = Provider<GeofenceState>((ref) {
  final posAsync = ref.watch(positionStreamProvider);
  final checkpoints = ref.watch(checkpointsProvider);

  return posAsync.when(
    data: (pos) {
      CheckpointMarker? nearest;
      double minDist = double.infinity;

      for (final cp in checkpoints) {
        final dist = Geolocator.distanceBetween(
          pos.latitude,
          pos.longitude,
          cp.latitude,
          cp.longitude,
        );
        if (dist < minDist) {
          minDist = dist;
          nearest = cp;
        }
      }

      return GeofenceState(
        position: pos,
        nearbyCheckpoint: minDist <= kGeofenceRadiusMeters ? nearest : null,
        distanceToNearest: minDist,
      );
    },
    loading: () => const GeofenceState(),
    error: (_, e) => const GeofenceState(),
  );
});
