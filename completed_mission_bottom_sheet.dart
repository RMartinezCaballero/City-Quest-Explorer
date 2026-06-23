import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../map/domain/checkpoint_marker.dart';

class CompletedMissionBottomSheet extends StatelessWidget {
  final CheckpointMarker checkpoint;
  final DateTime completedAt;

  const CompletedMissionBottomSheet({
    super.key,
    required this.checkpoint,
    required this.completedAt,
  });

  static const _gold = Color(0xFFD4AF37);
  static const _dark = Color(0xFF0A0A1A);

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy - HH:mm');

    return Container(
      decoration: const BoxDecoration(
        color: _dark,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        border: Border(top: BorderSide(color: _gold, width: 2)),
      ),
      padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle superior
          Container(
            width: 45,
            height: 4,
            decoration: BoxDecoration(
              color: _gold.withOpacity(0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 24),

          // Foto del lugar con borde dorado sutil
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _gold.withOpacity(0.5), width: 1),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(19),
              child: AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                  checkpoint.imageUrl ??
                      'https://via.placeholder.com/400x225?text=Cartagena+Secret',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: Colors.grey.shade900,
                    child: const Icon(
                      Icons.fort_rounded,
                      color: _gold,
                      size: 48,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Título estilizado
          Text(
            checkpoint.name.toUpperCase(),
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: _gold,
              fontSize: 22,
              fontWeight: FontWeight.w900,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 12),

          // Badge de completitud
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.green.withOpacity(0.5)),
            ),
            child: const Text(
              'FRAGMENTO RECUPERADO',
              style: TextStyle(
                color: Colors.green,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Información de tiempo
          const Text(
            'HALLADO EL',
            style: TextStyle(
              color: Colors.white54,
              fontSize: 10,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            dateFormat.format(completedAt),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w500,
              fontFamily: 'Courier', // Estilo máquina de escribir/manuscrito
            ),
          ),
        ],
      ),
    );
  }
}
