import 'dart:developer' as developer;
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/cache/offline_cache_service.dart';
import 'package:mobile/features/games/presentation/providers/session_provider.dart';
import 'package:mobile/features/qr/data/qr_event_api.dart';

enum QrScanStatus { idle, scanning, success, error, offline }

class QrScanState {
  final QrScanStatus status;
  final String? scannedCode;
  final String? message;

  const QrScanState({
    this.status = QrScanStatus.idle,
    this.scannedCode,
    this.message,
  });

  QrScanState copyWith({
    QrScanStatus? status,
    String? scannedCode,
    String? message,
  }) =>
      QrScanState(
        status: status ?? this.status,
        scannedCode: scannedCode ?? this.scannedCode,
        message: message ?? this.message,
      );
}

final qrScanProvider = StateNotifierProvider<QrScanNotifier, QrScanState>(
  (ref) => QrScanNotifier(ref.watch(qrEventApiProvider), ref),
);

class QrScanNotifier extends StateNotifier<QrScanState> {
  final QrEventApi _api;
  final Ref _ref;

  QrScanNotifier(this._api, this._ref) : super(const QrScanState());

  /// Procesa un código QR escaneado.
  /// Si hay sessionId activa lo reporta al backend.
  /// Si falla la red, lo encola para sincronización posterior.
  Future<void> processCode(String code, {String? sessionId}) async {
    if (state.status == QrScanStatus.scanning) return;
    state = state.copyWith(status: QrScanStatus.scanning, scannedCode: code);

    if (sessionId != null) {
      try {
        await _api.sendQrScanned(sessionId: sessionId, qrCode: code);

        // Actualizar score local con el bonus offline
        await _ref.read(sessionProvider.notifier).updateScoreOffline(15);

        state = state.copyWith(
          status: QrScanStatus.success,
          message: '¡QR registrado! +15 puntos',
        );
      } on DioException catch (e) {
        if (e.type == DioExceptionType.connectionTimeout ||
            e.type == DioExceptionType.receiveTimeout ||
            e.type == DioExceptionType.connectionError) {
          // Sin conexión — encolar para después
          await _queueOffline(code, sessionId);
          state = state.copyWith(
            status: QrScanStatus.offline,
            message: 'Sin conexión. QR guardado para enviar después.',
          );
        } else {
          state = state.copyWith(
            status: QrScanStatus.error,
            message: 'Error al registrar QR. Intenta de nuevo.',
          );
        }
      } catch (e) {
        // Error genérico — asumir offline
        await _queueOffline(code, sessionId);
        state = state.copyWith(
          status: QrScanStatus.offline,
          message: 'Sin conexión. QR guardado para enviar después.',
        );
      }
    } else {
      // Sin sesión activa — solo mostrar el código
      state = state.copyWith(
        status: QrScanStatus.success,
        message: 'Código: $code',
      );
    }
  }

  /// Guarda el evento en la cola offline para sincronizar después
  Future<void> _queueOffline(String code, String? sessionId) async {
    final pendingNotifier = _ref.read(pendingEventsProvider.notifier);
    pendingNotifier.addEvent({
      'qrCode': code,
      'sessionId': sessionId,
      'timestamp': DateTime.now().toIso8601String(),
    });
    developer.log('[QrScan] QR queued offline: $code');
  }

  /// Sincroniza todos los eventos pendientes con el backend
  /// Usa while loop para evitar desfase de índices al eliminar.
  Future<int> syncPendingEvents() async {
    final notifier = _ref.read(pendingEventsProvider.notifier);
    int synced = 0;

    while (_ref.read(pendingEventsProvider).isNotEmpty) {
      final event = _ref.read(pendingEventsProvider).first;
      try {
        await _api.sendQrScanned(
          sessionId: event['sessionId'] as String,
          qrCode: event['qrCode'] as String,
        );
        notifier.removeEvent(0);
        synced++;
        developer.log('[QrScan] Synced offline event: ${event['qrCode']}');
      } on DioException {
        // Si sigue sin conexión, detener el sync
        break;
      }
    }
    return synced;
  }

  void reset() => state = const QrScanState();
}
