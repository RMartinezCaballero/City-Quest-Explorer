import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

import 'package:mobile/features/map/domain/checkpoint_marker.dart';

// Checkpoints piloto — El Manuscrito Prohibido, Cartagena de Indias
final checkpointsProvider = Provider<List<CheckpointMarker>>((ref) => [
      const CheckpointMarker(
        id: 'cp-01',
        name: 'Torre del Reloj',
        description: 'Punto de inicio. La misión comienza aquí.',
        latitude: 10.4227,
        longitude: -75.5514,
        orderIndex: 1,
      ),
      const CheckpointMarker(
        id: 'cp-02',
        name: 'Palacio de la Inquisición',
        description: 'Busca la marca del manuscrito en la fachada.',
        latitude: 10.4231,
        longitude: -75.5497,
        orderIndex: 2,
      ),
      const CheckpointMarker(
        id: 'cp-03',
        name: 'Iglesia del Santísimo',
        description: 'El tercer fragmento aguarda entre las sombras.',
        latitude: 10.4238,
        longitude: -75.5508,
        orderIndex: 3,
      ),
      const CheckpointMarker(
        id: 'cp-04',
        name: 'Castillo San Felipe',
        description: 'Las bóvedas guardan el secreto final.',
        latitude: 10.4231,
        longitude: -75.5403,
        orderIndex: 4,
      ),
      const CheckpointMarker(
        id: 'cp-05',
        name: 'Las Bóvedas',
        description: 'El manuscrito espera ser descubierto.',
        latitude: 10.4278,
        longitude: -75.5486,
        orderIndex: 5,
      ),
    ]);

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

// Provider de ubicación GPS del usuario (one-shot)
final userLocationProvider = FutureProvider<LatLng?>((ref) async {
  final hasPermission = await _checkLocationPermission();
  if (!hasPermission) return null;

  final pos = await Geolocator.getCurrentPosition(
    locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
  );
  return LatLng(pos.latitude, pos.longitude);
});

// Stream continuo de posición GPS con verificación de permisos
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
