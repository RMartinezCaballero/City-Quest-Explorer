import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/map/domain/checkpoint_marker.dart';
import 'package:mobile/features/map/presentation/providers/map_providers.dart';
import 'package:mobile/features/missions/presentation/providers/geofence_provider.dart';

// Narrativa por checkpoint — El Manuscrito Prohibido
const _narratives = {
  'cp-01': '''El año es 1610. Un manuscrito de poder inconmensurable ha desaparecido de las bóvedas del Santo Oficio.

Tu misión comienza aquí, bajo la Torre del Reloj, donde los agentes del Virrey interceptaron al último mensajero.

Dicen que el reloj marca la hora exacta en que el manuscrito cruzó estas murallas. Observa bien.''',
  'cp-02': '''El Palacio de la Inquisición guarda más secretos que condenas.

Entre sus piedras hay una marca — una serpiente mordiéndose la cola — que solo los iniciados reconocen. Es la señal del Círculo del Manuscrito.

Encuentra la marca antes de que los guardias te descubran.''',
  'cp-03': '''La Iglesia del Santísimo fue el último refugio del monje Fray Anselmo, portador del tercer fragmento.

Cuentan que escondió su parte del manuscrito en un lugar donde "la luz nunca toca el suelo". Busca entre las sombras del altar.

El tiempo se agota. El Inquisidor Mayor ya está en camino.''',
  'cp-04': '''Las murallas del Castillo San Felipe han resistido piratas y corsarios. Pero no resisten los secretos.

En las bóvedas subterráneas, un general leal al Rey escondió el penúltimo fragmento. Dicen que los murciélagos guardan el camino.

Cuidado — la oscuridad tiene ojos aquí.''',
  'cp-05': '''Las Bóvedas. El destino final.

Aquí, donde los esclavos susurraban oraciones en lenguas olvidadas, el manuscrito completo espera ser reunido.

Tienes los fragmentos. Tienes el conocimiento. Solo falta el último código para abrir lo que nunca debió cerrarse.

¿Estás listo para conocer la verdad?''',
};

class MissionDetailScreen extends ConsumerWidget {
  final String checkpointId;
  const MissionDetailScreen({super.key, required this.checkpointId});

  static const _gold = Color(0xFFD4A017);
  static const _dark = Color(0xFF0A0A1A);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final checkpoints = ref.watch(checkpointsProvider);
    final geofence = ref.watch(geofenceProvider);

    final cp = checkpoints.firstWhere(
      (c) => c.id == checkpointId,
      orElse: () => const CheckpointMarker(
        id: '',
        name: 'Misión desconocida',
        description: '',
        latitude: 0,
        longitude: 0,
        orderIndex: 0,
      ),
    );

    final narrative = _narratives[checkpointId] ?? cp.description;
    final isNearby = geofence.nearbyCheckpoint?.id == checkpointId;
    final distance = geofence.distanceToNearest;

    return Scaffold(
      backgroundColor: _dark,
      body: CustomScrollView(
        slivers: [
          // AppBar con número de misión
          SliverAppBar(
            backgroundColor: _dark,
            expandedHeight: 180,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: _gold),
              onPressed: () => context.go('/missions'),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Color(0xFF1A0A2E), Color(0xFF0A0A1A)],
                  ),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: _gold, width: 1.5),
                          color: _gold.withValues(alpha: 0.1),
                        ),
                        child: Center(
                          child: Text(
                            '${cp.orderIndex}',
                            style: const TextStyle(
                              color: _gold,
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        cp.name.toUpperCase(),
                        style: const TextStyle(
                          color: _gold,
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Estado de proximidad
                  _ProximityStatus(
                    isNearby: isNearby,
                    distance: distance,
                  ),
                  const SizedBox(height: 24),

                  // Separador decorativo
                  Row(
                    children: [
                      const Expanded(child: Divider(color: Color(0xFF2A2A3A))),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Text(
                          '✦  EL MANUSCRITO  ✦',
                          style: TextStyle(
                            color: _gold.withValues(alpha: 0.6),
                            fontSize: 10,
                            letterSpacing: 2,
                          ),
                        ),
                      ),
                      const Expanded(child: Divider(color: Color(0xFF2A2A3A))),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Narrativa
                  Text(
                    narrative,
                    style: const TextStyle(
                      color: Color(0xFFD0C8B8),
                      fontSize: 15,
                      height: 1.8,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Botón QR — solo activo si está cerca
                  _QrButton(isNearby: isNearby),
                  const SizedBox(height: 16),

                  // Botón mapa
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () => context.go('/map'),
                      icon: const Icon(Icons.map_outlined, size: 18),
                      label: const Text('Ver en el mapa'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white54,
                        side: const BorderSide(color: Color(0xFF2A2A3A)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProximityStatus extends StatelessWidget {
  final bool isNearby;
  final double? distance;
  static const _gold = Color(0xFFD4A017);

  const _ProximityStatus({required this.isNearby, this.distance});

  @override
  Widget build(BuildContext context) {
    final distText = distance != null
        ? distance! < 1000
            ? '${distance!.toStringAsFixed(0)} m'
            : '${(distance! / 1000).toStringAsFixed(1)} km'
        : '—';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isNearby
            ? _gold.withValues(alpha: 0.08)
            : Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isNearby
              ? _gold.withValues(alpha: 0.5)
              : Colors.white.withValues(alpha: 0.08),
        ),
      ),
      child: Row(
        children: [
          Icon(
            isNearby ? Icons.location_on : Icons.location_searching,
            color: isNearby ? _gold : Colors.white38,
            size: 20,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isNearby
                      ? '¡Estás en la zona!'
                      : 'Dirígete al checkpoint',
                  style: TextStyle(
                    color: isNearby ? _gold : Colors.white54,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                Text(
                  isNearby
                      ? 'Escanea el código QR para registrar tu llegada.'
                      : 'Distancia aproximada: $distText',
                  style: const TextStyle(
                    color: Color(0xFF607080),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QrButton extends StatelessWidget {
  final bool isNearby;
  static const _gold = Color(0xFFD4A017);
  static const _dark = Color(0xFF0A0A1A);

  const _QrButton({required this.isNearby});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isNearby ? () => context.go('/qr') : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        height: 54,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: isNearby
              ? const LinearGradient(
                  colors: [Color(0xFFD4A017), Color(0xFF8A6A10)],
                )
              : null,
          color: isNearby ? null : Colors.white.withValues(alpha: 0.05),
          border: isNearby
              ? null
              : Border.all(color: Colors.white.withValues(alpha: 0.1)),
          boxShadow: isNearby
              ? [
                  BoxShadow(
                    color: _gold.withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.qr_code_scanner,
                color: isNearby ? _dark : Colors.white24,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                isNearby
                    ? 'ESCANEAR CÓDIGO QR'
                    : 'ACÉRCATE AL CHECKPOINT',
                style: TextStyle(
                  color: isNearby ? _dark : Colors.white24,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
