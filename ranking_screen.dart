import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/ranking_api.dart';
import '../../domain/models/ranking.dart';

class RankingScreen extends ConsumerWidget {
  final String routeId;

  const RankingScreen({super.key, required this.routeId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rankingAsync = FutureProvider(
      (ref) => ref.read(rankingApiProvider).getRankingsByRoute(routeId),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Clasificación Global',
          style: TextStyle(color: Color(0xFFD4AF37)),
        ),
        backgroundColor: Colors.black,
      ),
      body: ref
          .watch(rankingAsync)
          .when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, stack) => Center(child: Text('Error: $err')),
            data: (entries) {
              if (entries.isEmpty) {
                return const Center(
                  child: Text('No hay rankings para esta ruta aún.'),
                );
              }
              return ListView.builder(
                itemCount: entries.length,
                itemBuilder: (context, index) {
                  final entry = entries[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: _getPositionColor(entry.position),
                      child: Text(
                        '${entry.position}',
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                    title: Text(
                      entry.teamName,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    trailing: Text(
                      '${entry.score} pts',
                      style: const TextStyle(
                        color: Color(0xFFD4AF37),
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  );
                },
              );
            },
          ),
    );
  }

  Color _getPositionColor(int position) {
    switch (position) {
      case 1:
        return const Color(0xFFD4AF37); // Oro
      case 2:
        return const Color(0xFFC0C0C0); // Plata
      case 3:
        return const Color(0xFFCD7F32); // Bronce
      default:
        return Colors.grey.shade800;
    }
  }
}
