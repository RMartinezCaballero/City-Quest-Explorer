import 'dart:developer' as developer;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/cache/checkpoint_api.dart';
import 'package:mobile/core/cache/offline_cache_service.dart';
import 'package:mobile/features/map/domain/checkpoint_marker.dart';

/// Checkpoints duros (fallback instantáneo cuando no hay caché ni API)
/// 10 misiones M1–M10 del Mission Pack Cartagena
const List<CheckpointMarker> _hardcodedCheckpoints = [
  CheckpointMarker(
    id: 'cp-01',
    name: 'Baluarte Santa Catalina',
    description: 'M1 — Juramento en la Muralla. La piedra despierta cuando caminas con intención.',
    latitude: 10.4236,
    longitude: -75.5532,
    orderIndex: 1,
  ),
  CheckpointMarker(
    id: 'cp-02',
    name: 'Plaza de la Aduana',
    description: 'M2 — La Aduana del Tiempo. Encuentra el QR entre los soportales.',
    latitude: 10.4225,
    longitude: -75.5501,
    orderIndex: 2,
  ),
  CheckpointMarker(
    id: 'cp-03',
    name: 'Castillo San Felipe',
    description: 'M3 — El Cálculo del Castillo. La ciudad se alinea en sus murallas.',
    latitude: 10.4231,
    longitude: -75.5403,
    orderIndex: 3,
  ),
  CheckpointMarker(
    id: 'cp-04',
    name: 'La Popa',
    description: 'M4 — Viento de La Popa. El mirador guarda el siguiente fragmento.',
    latitude: 10.4210,
    longitude: -75.5340,
    orderIndex: 4,
  ),
  CheckpointMarker(
    id: 'cp-05',
    name: 'Camellón de los Mártires',
    description: 'M5 — Sendero con Tolerancia. Busca la señal oculta en el Camellón.',
    latitude: 10.4245,
    longitude: -75.5470,
    orderIndex: 5,
  ),
  CheckpointMarker(
    id: 'cp-06',
    name: 'Getsemaní',
    description: 'M6 — Santo Domingo: Cifrado de Piedra. Descifra el mensaje en el barrio.',
    latitude: 10.4247,
    longitude: -75.5525,
    orderIndex: 6,
  ),
  CheckpointMarker(
    id: 'cp-07',
    name: 'Calle de la Amargura',
    description: 'M7 — Observación. Señales ocultas en la calle más famosa.',
    latitude: 10.4253,
    longitude: -75.5495,
    orderIndex: 7,
  ),
  CheckpointMarker(
    id: 'cp-08',
    name: 'Bocagrande',
    description: 'M8 — Registro del Regreso. Busca el QR en el malecón.',
    latitude: 10.4080,
    longitude: -75.5550,
    orderIndex: 8,
  ),
  CheckpointMarker(
    id: 'cp-09',
    name: 'Pastelillo',
    description: 'M9 — Peligro Controlado. La ciudad evalúa decisiones, no prisa.',
    latitude: 10.4150,
    longitude: -75.5480,
    orderIndex: 9,
  ),
  CheckpointMarker(
    id: 'cp-10',
    name: 'Muelle de los Pegasos',
    description: 'M10 — Capítulo Final. El Manuscrito te espera en la bahía.',
    latitude: 10.4200,
    longitude: -75.5430,
    orderIndex: 10,
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
