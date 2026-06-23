import 'dart:io';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

class MediaCacheService {
  final Dio _dio;

  MediaCacheService(this._dio);

  /// Descarga un archivo de R2 y devuelve la ruta local.
  /// Si el archivo ya existe, no lo descarga de nuevo.
  Future<String?> getLocalPath(String? remoteUrl) async {
    if (remoteUrl == null || remoteUrl.isEmpty) return null;

    try {
      final directory = await getApplicationDocumentsDirectory();
      final fileName = p.basename(Uri.parse(remoteUrl).path);
      final localPath = p.join(directory.path, 'media', fileName);
      final file = File(localPath);

      if (await file.exists()) {
        return localPath;
      }

      // Crear directorio si no existe
      await file.parent.create(recursive: true);

      // Descarga desde Cloudflare R2
      await _dio.download(remoteUrl, localPath);
      
      return localPath;
    } catch (e) {
      print('Error al cachear media: $e');
      return null;
    }
  }

  /// Descarga una lista de URLs en segundo plano
  Future<void> preCacheMedia(List<String?> urls) async {
    for (final url in urls) {
      if (url != null) {
        await getLocalPath(url);
      }
    }
  }
}

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/network/api_client.dart';

final mediaCacheServiceProvider = Provider((ref) => MediaCacheService(ref.watch(apiClientProvider)));