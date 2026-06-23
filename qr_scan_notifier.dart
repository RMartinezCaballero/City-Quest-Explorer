import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/qr_event_api.dart';
import '../../games/presentation/providers/session_provider.dart';

/// Estados posibles para el flujo de escaneo
enum QrScanStatus { idle, scanning, success, error }

class QrScanState {
  final QrScanStatus status;
  final String? errorMessage;
  final int? pointsGained;

  QrScanState({required this.status, this.errorMessage, this.pointsGained});
}

/// Provider que orquesta el escaneo de códigos QR y sincroniza con la sesión activa
final qrScanProvider = StateNotifierProvider<QrScanNotifier, QrScanState>((
  ref,
) {
  final api = ref.watch(qrEventApiProvider);
  return QrScanNotifier(ref, api);
});

class QrScanNotifier extends StateNotifier<QrScanState> {
  final Ref _ref;
  final QrEventApi _api;

  QrScanNotifier(this._ref, this._api)
    : super(QrScanState(status: QrScanStatus.idle));

  /// Procesa el código QR, valida con el backend y actualiza la sesión automáticamente
  Future<void> processQrCode(String qrData) async {
    // 1. Obtener la sesión activa del sessionProvider
    final sessionState = _ref.read(sessionProvider);
    final sessionId = sessionState.value?.id;

    if (sessionId == null) {
      state = QrScanState(
        status: QrScanStatus.error,
        errorMessage: 'No hay una sesión de juego iniciada',
      );
      return;
    }

    // 1.5 IDEMPOTENCIA: Verificar si la estación ya fue completada localmente
    final isAlreadyCompleted =
        sessionState.value?.completedStations.containsKey(qrData) ?? false;
    if (isAlreadyCompleted) {
      state = QrScanState(
        status: QrScanStatus.error,
        errorMessage: 'Este fragmento del manuscrito ya ha sido recuperado.',
      );
      return;
    }

    state = QrScanState(status: QrScanStatus.scanning);

    try {
      // 2. Validar el QR con el backend NestJS
      final result = await _api.recordEvent(sessionId, qrData);

      // 3. ACTUALIZACIÓN AUTOMÁTICA: El éxito dispara cambios en el SessionNotifier
      final notifier = _ref.read(sessionProvider.notifier);
      final stationId = result['stationId'] ?? qrData;
      await notifier.updateCurrentStation(stationId);
      await notifier.addCompletedStation(stationId, DateTime.now());
      await notifier.updateLocalScore(result['points'] ?? 0);

      state = QrScanState(
        status: QrScanStatus.success,
        pointsGained: result['points'],
      );
    } catch (e) {
      state = QrScanState(
        status: QrScanStatus.error,
        errorMessage: e.toString(),
      );
    }
  }

  void reset() => state = QrScanState(status: QrScanStatus.idle);
}
