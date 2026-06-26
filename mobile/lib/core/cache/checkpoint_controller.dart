import 'dart:developer' as developer;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/cache/checkpoint_api.dart';
import 'package:mobile/core/cache/offline_cache_service.dart';
import 'package:mobile/features/map/domain/checkpoint_marker.dart';

/// Checkpoints duros (fallback instantáneo cuando no hay caché ni API)
const List<CheckpointMarker> _hardcodedCheckpoints = [
  CheckpointMarker(
    id: 'cp-01',
    name: 'Torre del Reloj',
    description: 'Punto de inicio. La misión comienza aquí.',
    latitude: 10.4227,
    longitude: -75.5514,
    orderIndex: 1,
  ),
  CheckpointMarker(
    id: 'cp-02',
    name: 'Palacio de la Inquisición',
    description: 'Busca la marca del manuscrito en la fachada.',
    latitude: 10.4231,
    longitude: -75.5497,
    orderIndex: 2,
  ),
  CheckpointMarker(
    id: 'cp-03',
    name: 'Iglesia del Santísimo',
    description: 'El tercer fragmento aguarda entre las sombras.',
    latitude: 10.4238,
    longitude: -75.5508,
    orderIndex: 3,
  ),
  CheckpointMarker(
    id: 'cp-04',
    name: 'Castillo San Felipe',
    description: 'Las bóvedas guardan el secreto final.',
    latitude: 10.4231,
    longitude: -75.5403,
    orderIndex: 4,
  ),
  CheckpointMarker(
    id: 'cp-05',
    name: 'Las Bóvedas',
    description: 'El manuscrito espera ser descubierto.',
    latitude: 10.4278,
    longitude: -75.5486,
    orderIndex: 5,
  ),
];

/// Estado del controller de checkpoints.
class CheckpointState {
  final List<CheckpointMarker> checkpoints;
  final bool isLoading;
  final bool isFromCache;
  final bool isFromApi;
  final String? error;

  const CheckpointState({
    required this.checkpoints,
    this.isLoading = false,
    this.isFromCache = false,
    this.isFromApi = false,
    this.error,
  });

  CheckpointState copyWith({
    List<CheckpointMarker>? checkpoints,
    bool? isLoading,
    bool? isFromCache,
    bool? isFromApi,
    String? error,
  }) =>
      CheckpointState(
        checkpoints: checkpoints ?? this.checkpoints,
        isLoading: isLoading ?? this.isLoading,
        isFromCache: isFromCache ?? this.isFromCache,
        isFromApi: isFromApi ?? this.isFromApi,
        error: error,
      );
}

final checkpointControllerProvider =
    StateNotifierProvider<CheckpointController, CheckpointState>((ref) {
  final api = ref.watch(checkpointApiProvider);
  return CheckpointController(api);
});

class CheckpointController extends StateNotifier<CheckpointState> {
  final CheckpointApi _api;
  bool _fetchedOnce = false;

  CheckpointController(this._api)
      : super(CheckpointState(checkpoints: _hardcodedCheckpoints)) {
    _init();
  }

  Future<void> _init() async {
    // 1. Intentar cargar desde caché primero
    final cached = await OfflineCacheService.getCachedCheckpoints();
    if (cached != null && cached.isNotEmpty) {
      state = state.copyWith(
        checkpoints: cached,
        isFromCache: true,
      );
      developer.log('[CheckpointCtrl] Loaded ${cached.length} from cache');
    }

    // 2. Fetch desde API en background
    await _fetchFromApi();
  }

  Future<void> _fetchFromApi() async {
    state = state.copyWith(isLoading: true);
    try {
      final apiCheckpoints = await _api.fetchCheckpoints();

      if (apiCheckpoints.isNotEmpty) {
        // Cachear y actualizar estado
        await OfflineCacheService.cacheCheckpoints(apiCheckpoints);
        state = state.copyWith(
          checkpoints: apiCheckpoints,
          isFromApi: true,
          isFromCache: false,
          isLoading: false,
          error: null,
        );
        developer.log('[CheckpointCtrl] Updated from API: ${apiCheckpoints.length}');
      }
    } catch (e) {
      developer.log('[CheckpointCtrl] API fetch failed (offline?): $e');
      state = state.copyWith(
        isLoading: false,
        error: _fetchedOnce ? null : 'No se pudieron cargar los checkpoints',
      );
    } finally {
      _fetchedOnce = true;
    }
  }

  /// Forzar recarga desde API
  Future<void> refresh() => _fetchFromApi();
}
