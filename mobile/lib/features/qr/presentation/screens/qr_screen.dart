import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:mobile/features/games/presentation/providers/session_provider.dart';

import '../providers/qr_providers.dart';

class QrScreen extends ConsumerStatefulWidget {
  const QrScreen({super.key});

  @override
  ConsumerState<QrScreen> createState() => _QrScreenState();
}

class _QrScreenState extends ConsumerState<QrScreen> {
  final _controller = MobileScannerController();
  bool _torchOn = false;

  static const _gold = Color(0xFFD4A017);
  static const _dark = Color(0xFF0A0A1A);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scanState = ref.watch(qrScanProvider);
    final sessionId = ref.watch(sessionProvider).sessionId;

    return Scaffold(
      backgroundColor: _dark,
      appBar: AppBar(
        backgroundColor: _dark,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _gold),
          onPressed: () {
            ref.read(qrScanProvider.notifier).reset();
            context.go('/map');
          },
        ),
        title: const Text(
          'ESCÁNER DE MISIÓN',
          style: TextStyle(
            color: _gold,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            fontSize: 14,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              _torchOn ? Icons.flash_on : Icons.flash_off,
              color: _torchOn ? _gold : Colors.grey,
            ),
            onPressed: () {
              _controller.toggleTorch();
              setState(() => _torchOn = !_torchOn);
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          // Cámara
          MobileScanner(
            controller: _controller,
            onDetect: (capture) {
              final code = capture.barcodes.firstOrNull?.rawValue;
              if (code == null) return;
              if (scanState.status == QrScanStatus.idle) {
                ref.read(qrScanProvider.notifier).processCode(
                  code,
                  sessionId: sessionId,
                );
              }
            },
          ),

          // Overlay oscuro con ventana de escaneo
          _ScanOverlay(),

          // Instrucción superior
          Positioned(
            top: 24,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: _gold.withValues(alpha: 0.4)),
                ),
                child: const Text(
                  'Apunta al código QR del checkpoint',
                  style: TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ),
            ),
          ),

          // Panel de resultado
          if (scanState.status != QrScanStatus.idle &&
              scanState.status != QrScanStatus.scanning)
            _ResultPanel(
              state: scanState,
              onClose: () {
                ref.read(qrScanProvider.notifier).reset();
                if (scanState.status == QrScanStatus.success) {
                  context.go('/map');
                }
              },
            ),

          // Indicador de procesando
          if (scanState.status == QrScanStatus.scanning)
            const Center(
              child: CircularProgressIndicator(color: _gold),
            ),
        ],
      ),
    );
  }
}

class _ScanOverlay extends StatelessWidget {
  static const _gold = Color(0xFFD4A017);

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final boxSize = size.width * 0.65;

    return Stack(
      children: [
        ColorFiltered(
          colorFilter: ColorFilter.mode(
            Colors.black.withValues(alpha: 0.55),
            BlendMode.srcOut,
          ),
          child: Stack(
            children: [
              Container(
                decoration: const BoxDecoration(
                  color: Colors.black,
                  backgroundBlendMode: BlendMode.dstOut,
                ),
              ),
              Center(
                child: Container(
                  width: boxSize,
                  height: boxSize,
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
            ],
          ),
        ),
        Center(
          child: SizedBox(
            width: boxSize,
            height: boxSize,
            child: CustomPaint(painter: _CornerPainter(_gold)),
          ),
        ),
      ],
    );
  }
}

class _CornerPainter extends CustomPainter {
  final Color color;
  _CornerPainter(this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    const len = 24.0;
    final r = 12.0;

    // Esquina TL
    canvas.drawLine(Offset(r, 0), Offset(len, 0), paint);
    canvas.drawLine(Offset(0, r), Offset(0, len), paint);
    canvas.drawArc(Rect.fromLTWH(0, 0, r * 2, r * 2), 3.14, -1.57, false, paint);
    // Esquina TR
    canvas.drawLine(Offset(size.width - len, 0), Offset(size.width - r, 0), paint);
    canvas.drawLine(Offset(size.width, r), Offset(size.width, len), paint);
    canvas.drawArc(Rect.fromLTWH(size.width - r * 2, 0, r * 2, r * 2), 1.57, -1.57, false, paint);
    // Esquina BL
    canvas.drawLine(Offset(0, size.height - len), Offset(0, size.height - r), paint);
    canvas.drawLine(Offset(r, size.height), Offset(len, size.height), paint);
    canvas.drawArc(Rect.fromLTWH(0, size.height - r * 2, r * 2, r * 2), 1.57, 1.57, false, paint);
    // Esquina BR
    canvas.drawLine(Offset(size.width, size.height - len), Offset(size.width, size.height - r), paint);
    canvas.drawLine(Offset(size.width - len, size.height), Offset(size.width - r, size.height), paint);
    canvas.drawArc(Rect.fromLTWH(size.width - r * 2, size.height - r * 2, r * 2, r * 2), 0, 1.57, false, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ResultPanel extends StatelessWidget {
  final QrScanState state;
  final VoidCallback onClose;

  static const _gold = Color(0xFFD4A017);
  static const _dark = Color(0xFF0A0A1A);

  const _ResultPanel({required this.state, required this.onClose});

  @override
  Widget build(BuildContext context) {
    final isSuccess = state.status == QrScanStatus.success;

    return Container(
      color: Colors.black87,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(32),
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSuccess ? _gold : Colors.redAccent,
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: (isSuccess ? _gold : Colors.redAccent)
                    .withValues(alpha: 0.2),
                blurRadius: 24,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                isSuccess ? Icons.check_circle_outline : Icons.error_outline,
                color: isSuccess ? _gold : Colors.redAccent,
                size: 56,
              ),
              const SizedBox(height: 16),
              Text(
                isSuccess ? '¡CÓDIGO REGISTRADO!' : 'ERROR',
                style: TextStyle(
                  color: isSuccess ? _gold : Colors.redAccent,
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                state.message ?? '',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white70, fontSize: 14),
              ),
              if (state.scannedCode != null) ...[
                const SizedBox(height: 8),
                Text(
                  state.scannedCode!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Color(0xFF607080),
                    fontSize: 11,
                    fontFamily: 'monospace',
                  ),
                ),
              ],
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: GestureDetector(
                  onTap: onClose,
                  child: Container(
                    height: 48,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      gradient: isSuccess
                          ? const LinearGradient(
                              colors: [Color(0xFFD4A017), Color(0xFF8A6A10)],
                            )
                          : null,
                      color: isSuccess ? null : const Color(0xFF2A0A0A),
                      border: isSuccess
                          ? null
                          : Border.all(color: Colors.redAccent),
                    ),
                    child: Center(
                      child: Text(
                        isSuccess ? 'VOLVER AL MAPA' : 'INTENTAR DE NUEVO',
                        style: TextStyle(
                          color: isSuccess ? _dark : Colors.redAccent,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
