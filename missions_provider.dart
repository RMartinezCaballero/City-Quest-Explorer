import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/core/network/api_client.dart';
import '../../domain/models/station.dart';
import '../../../core/services/media_cache_service.dart';

/// Provider que gestiona la lista de misiones con soporte offline (caché local)
final missionsProvider =
    StateNotifierProvider<MissionsNotifier, AsyncValue<List<Station>>>((ref) {
      return MissionsNotifier(
        ref.watch(apiClientProvider),
        ref.watch(mediaCacheServiceProvider),
      );
    });

class MissionsNotifier extends StateNotifier<AsyncValue<List<Station>>> {
  final Dio _dio;
  final MediaCacheService _cacheService;
  static const _storageKey = 'cached_missions_list';

  MissionsNotifier(this._dio, this._cacheService)
    : super(const AsyncValue.loading()) {
    // Intentar cargar caché al inicializar
    _loadFromCache();
  }

  /// Obtiene las misiones del servidor y actualiza la caché local
  Future<void> fetchMissions(String storyId) async {
    try {
      final response = await _dio.get('/stories/$storyId/stations');
      final List data = response.data;
      final stations = data.map((json) => Station.fromJson(json)).toList();

      // Guardar en persistencia para uso offline futuro
      await _saveToCache(stations);

      // Pre-cachear audios de R2 en segundo plano
      final audioUrls = stations.map((s) => s.audioUrl).toList();
      _cacheService.preCacheMedia(audioUrls);

      state = AsyncValue.data(stations);
    } catch (e, stack) {
      // Si falla la red (offline), mantenemos los datos de la caché si existen
      if (state.value == null || state.value!.isEmpty) {
        state = AsyncValue.error(e, stack);
      }
    }
  }

  Future<void> _loadFromCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_storageKey);

      if (jsonString != null) {
        final List decoded = jsonDecode(jsonString);
        final stations = decoded.map((item) => Station.fromJson(item)).toList();

        // Si estamos cargando, mostramos los datos cacheados inmediatamente
        if (state is AsyncLoading) {
          state = AsyncValue.data(stations);
        }
      }
    } catch (_) {
      // Fallo silencioso de caché
    }
  }

  Future<void> _saveToCache(List<Station> stations) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = jsonEncode(stations.map((s) => s.toJson()).toList());
    await prefs.setString(_storageKey, jsonString);
  }
}
