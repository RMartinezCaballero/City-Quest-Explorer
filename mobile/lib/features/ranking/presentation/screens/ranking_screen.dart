import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/games/presentation/providers/session_provider.dart';
import 'package:mobile/features/ranking/data/ranking_api.dart';

class RankingScreen extends ConsumerWidget {
  const RankingScreen({super.key});

  static const _gold = Color(0xFFD4A017);
  static const _dark = Color(0xFF0A0A1A);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rankingAsync = ref.watch(rankingProvider);
    final sessionState = ref.watch(sessionProvider);

    return Scaffold(
      backgroundColor: _dark,
      appBar: AppBar(
        backgroundColor: _dark,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _gold),
          onPressed: () => context.go('/map'),
        ),
        title: const Text(
          'RANKING',
          style: TextStyle(
            color: _gold,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            fontSize: 14,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: _gold),
            onPressed: () => ref.refresh(rankingProvider),
          ),
        ],
      ),
      body: Column(
        children: [
          // Banner score sesión activa
          if (sessionState.hasSession) _SessionScoreBanner(sessionState),

          // Lista de ranking
          Expanded(
            child: rankingAsync.when(
              data: (entries) => entries.isEmpty
                  ? _EmptyState(onRetry: () => ref.refresh(rankingProvider))
                  : _RankingList(
                      entries: entries,
                      currentTeamId: sessionState.session?.teamId,
                    ),
              loading: () => const Center(
                child: CircularProgressIndicator(color: _gold),
              ),
              error: (e, _) => _ErrorState(
                onRetry: () => ref.refresh(rankingProvider),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SessionScoreBanner extends StatelessWidget {
  final SessionState state;
  static const _gold = Color(0xFFD4A017);

  const _SessionScoreBanner(this.state);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            _gold.withValues(alpha: 0.15),
            _gold.withValues(alpha: 0.03),
          ],
        ),
        border: Border(
          bottom: BorderSide(color: _gold.withValues(alpha: 0.3)),
        ),
      ),
      child: Row(
        children: [
          const Icon(Icons.stars, color: _gold, size: 20),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'TU PUNTUACIÓN ACTUAL',
                style: TextStyle(
                  color: _gold,
                  fontSize: 10,
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${state.score} pts',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _RankingList extends StatelessWidget {
  final List<RankingEntry> entries;
  final String? currentTeamId;

  const _RankingList({required this.entries, this.currentTeamId});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: entries.length,
      separatorBuilder: (_, i) => const SizedBox(height: 8),
      itemBuilder: (_, i) {
        final entry = entries[i];
        final isMe = entry.teamId == currentTeamId;
        return _RankingCard(entry: entry, isMe: isMe);
      },
    );
  }
}

class _RankingCard extends StatelessWidget {
  final RankingEntry entry;
  final bool isMe;

  static const _gold = Color(0xFFD4A017);
  static const _surface = Color(0xFF111827);

  const _RankingCard({required this.entry, required this.isMe});

  @override
  Widget build(BuildContext context) {
    final isTop3 = entry.position <= 3;

    final medalColor = switch (entry.position) {
      1 => const Color(0xFFFFD700),
      2 => const Color(0xFFC0C0C0),
      3 => const Color(0xFFCD7F32),
      _ => Colors.white24,
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isMe
              ? _gold
              : isTop3
                  ? medalColor.withValues(alpha: 0.4)
                  : Colors.white.withValues(alpha: 0.06),
          width: isMe ? 1.5 : 1,
        ),
        boxShadow: isMe
            ? [BoxShadow(color: _gold.withValues(alpha: 0.12), blurRadius: 12)]
            : null,
      ),
      child: Row(
        children: [
          // Posición
          SizedBox(
            width: 36,
            child: Center(
              child: isTop3
                  ? Text(
                      ['🥇', '🥈', '🥉'][entry.position - 1],
                      style: const TextStyle(fontSize: 22),
                    )
                  : Text(
                      '#${entry.position}',
                      style: TextStyle(
                        color: isMe ? _gold : Colors.white38,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 12),
          // Nombre
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      entry.teamName,
                      style: TextStyle(
                        color: isMe ? _gold : Colors.white,
                        fontWeight:
                            isMe ? FontWeight.bold : FontWeight.normal,
                        fontSize: 15,
                      ),
                    ),
                    if (isMe) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: _gold.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                              color: _gold.withValues(alpha: 0.5)),
                        ),
                        child: const Text(
                          'TÚ',
                          style: TextStyle(
                            color: _gold,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          // Score
          Text(
            '${entry.score} pts',
            style: TextStyle(
              color: isMe ? _gold : Colors.white70,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final VoidCallback onRetry;
  static const _gold = Color(0xFFD4A017);

  const _EmptyState({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.leaderboard_outlined, color: _gold, size: 56),
          const SizedBox(height: 16),
          const Text(
            'Aún no hay jugadores en el ranking',
            style: TextStyle(color: Colors.white54, fontSize: 14),
          ),
          const SizedBox(height: 8),
          const Text(
            '¡Sé el primero en completar la misión!',
            style: TextStyle(color: Color(0xFF607080), fontSize: 12),
          ),
          const SizedBox(height: 20),
          TextButton(
            onPressed: onRetry,
            child: const Text('Actualizar', style: TextStyle(color: _gold)),
          ),
        ],
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  final VoidCallback onRetry;
  static const _gold = Color(0xFFD4A017);

  const _ErrorState({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.wifi_off, color: Colors.redAccent, size: 48),
          const SizedBox(height: 16),
          const Text(
            'No se pudo cargar el ranking',
            style: TextStyle(color: Colors.white54, fontSize: 14),
          ),
          const SizedBox(height: 8),
          const Text(
            'Verifica tu conexión e intenta de nuevo',
            style: TextStyle(color: Color(0xFF607080), fontSize: 12),
          ),
          const SizedBox(height: 20),
          OutlinedButton(
            onPressed: onRetry,
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: _gold),
              foregroundColor: _gold,
            ),
            child: const Text('Reintentar'),
          ),
        ],
      ),
    );
  }
}
