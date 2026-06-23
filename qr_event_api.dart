import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';

final qrEventApiProvider = Provider(
  (ref) => QrEventApi(ref.watch(apiClientProvider)),
);

class QrEventApi {
  final Dio _dio;

  QrEventApi(this._dio);

  /// Registra el escaneo de un QR en el backend para validación y obtención de puntos
  Future<Map<String, dynamic>> recordEvent(
    String sessionId,
    String qrData,
  ) async {
    try {
      final response = await _dio.post(
        '/games/sessions/$sessionId/events',
        data: {'qrData': qrData},
      );
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw Exception(
        e.response?.data['message'] ?? 'Error al validar el código QR',
      );
    }
  }
}
