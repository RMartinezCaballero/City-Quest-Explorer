class RankingEntry {
  final String teamName;
  final int score;
  final int position;
  final DateTime calculatedAt;

  RankingEntry({
    required this.teamName,
    required this.score,
    required this.position,
    required this.calculatedAt,
  });

  factory RankingEntry.fromJson(Map<String, dynamic> json) {
    return RankingEntry(
      teamName: json['team']?['nombre'] ?? 'Equipo Anónimo',
      score: json['score'],
      position: json['position'],
      calculatedAt: DateTime.parse(json['calculatedAt']),
    );
  }
}
