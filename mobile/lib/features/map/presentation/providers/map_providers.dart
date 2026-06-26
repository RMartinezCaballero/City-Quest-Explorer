import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

import 'package:mobile/features/map/domain/checkpoint_marker.dart';
import 'package:mobile/core/cache/checkpoint_controller.dart';

/// Checkpoints con estrategia cache-first.
/// - Primero carga datos hardcodeados (instantáneo)
/// - Luego intenta cargar desde caché
/// - Finalmente fetch desde API en background
final checkpointsProvider = Provider<List<CheckpointMarker>>((ref) {
  return ref.watch(checkpointControllerProvider).checkpoints;
});

/// Provider que indica si los checkpoints vienen de la API (vs hardcode/cache)
final checkpointsFromApiProvider = Provider<bool>((ref) {
  return ref.watch(checkpointControllerProvider).isFromApi;
});

/// Forzar recarga de checkpoints desde la API
final refreshCheckpointsProvider = Provider<void Function()>((ref) {
  return () => ref.read(checkpointControllerProvider.notifier).refresh();
});

/// Verifica permisos de ubicación. Devuelve true si están concedidos.
Future<bool> _checkLocationPermission() async {
  if (!await Geolocator.isLocationServiceEnabled()) return false;

  LocationPermission permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();
  }
  return permission != LocationPermission.denied &&
      permission != LocationPermission.deniedForever;
}

/// Provider de ubicación GPS del usuario (one-shot)
final userLocationProvider = FutureProvider<LatLng?>((ref) async {
  final hasPermission = await _checkLocationPermission();
  if (!hasPermission) return null;

  final pos = await Geolocator.getCurrentPosition(
    locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
  );
  return LatLng(pos.latitude, pos.longitude);
});

/// Stream continuo de posición GPS con verificación de permisos
final positionStreamProvider = StreamProvider<Position>((ref) async* {
  final hasPermission = await _checkLocationPermission();
  if (!hasPermission) return;

  yield* Geolocator.getPositionStream(
    locationSettings: const LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 5,
    ),
  );
});
