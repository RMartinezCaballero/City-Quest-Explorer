import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/network/api_client.dart';

final qrEventApiProvider = Provider<QrEventApi>(
  (ref) => QrEventApi(ref.watch(apiClientProvider)),
);

class QrEventApi {
  final ApiClient _client;
  QrEventApi(this._client);

  /// Envía evento QR_SCANNED al backend.
  /// [sessionId] — ID de la sesión de juego activa.
  /// [qrCode]    — Valor escaneado del QR.
  /// [checkpointId] — ID del checkpoint si el QR corresponde a uno.
  Future<Map<String, dynamic>> sendQrScanned({
    required String sessionId,
    required String qrCode,
    String? checkpointId,
  }) async {
    final res = await _client.dio.post(
      '/games/sessions/$sessionId/events',
      data: {
        'eventType': 'QR_SCANNED',
        'eventData': {'qrCode': qrCode},
        if (checkpointId != null) ...{'checkpointId': checkpointId},
      },
    );
    return (res.data as Map).cast<String, dynamic>();
  }
}
