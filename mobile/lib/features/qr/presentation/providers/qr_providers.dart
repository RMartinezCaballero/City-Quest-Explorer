import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/qr/data/qr_event_api.dart';

enum QrScanStatus { idle, scanning, success, error }

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
  (ref) => QrScanNotifier(ref.watch(qrEventApiProvider)),
);

class QrScanNotifier extends StateNotifier<QrScanState> {
  final QrEventApi _api;
  QrScanNotifier(this._api) : super(const QrScanState());

  /// Procesa un código QR escaneado.
  /// Si hay sessionId activa lo reporta al backend; si no, solo muestra el código.
  Future<void> processCode(String code, {String? sessionId}) async {
    if (state.status == QrScanStatus.scanning) return; // evitar doble disparo
    state = state.copyWith(status: QrScanStatus.scanning, scannedCode: code);

    try {
      if (sessionId != null) {
        await _api.sendQrScanned(sessionId: sessionId, qrCode: code);
      }
      state = state.copyWith(
        status: QrScanStatus.success,
        message: sessionId != null
            ? '¡QR registrado! +15 puntos'
            : 'Código: $code',
      );
    } catch (e) {
      state = state.copyWith(
        status: QrScanStatus.error,
        message: 'Error al registrar QR. Intenta de nuevo.',
      );
    }
  }

  void reset() => state = const QrScanState();
}
