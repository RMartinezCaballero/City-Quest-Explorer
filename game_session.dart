class GameSession {
  final String id;
  final String teamId;
  final String routeId;
  final String status; // ACTIVE, COMPLETED
  final int score;
  final String? currentStationId;
  final Map<String, DateTime> completedStations;
  final DateTime startedAt;

  GameSession({
    required this.id,
    required this.teamId,
    required this.routeId,
    required this.status,
    required this.score,
    this.currentStationId,
    required this.completedStations,
    required this.startedAt,
  });

  factory GameSession.fromJson(Map<String, dynamic> json) {
    return GameSession(
      id: json['id'],
      teamId: json['teamId'],
      routeId: json['routeId'],
      status: json['status'],
      score: json['score'] ?? 0,
      currentStationId: json['currentStationId'],
      completedStations:
          (json['completedStations'] as Map<String, dynamic>?)?.map(
            (k, v) => MapEntry(k, DateTime.parse(v as String)),
          ) ??
          {},
      startedAt: DateTime.parse(json['startedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'teamId': teamId,
      'routeId': routeId,
      'status': status,
      'score': score,
      'currentStationId': currentStationId,
      'completedStations': completedStations.map(
        (k, v) => MapEntry(k, v.toIso8601String()),
      ),
      'startedAt': startedAt.toIso8601String(),
    };
  }

  GameSession copyWith({
    String? id,
    String? teamId,
    String? routeId,
    String? status,
    int? score,
    String? currentStationId,
    Map<String, DateTime>? completedStations,
    DateTime? startedAt,
  }) {
    return GameSession(
      id: id ?? this.id,
      teamId: teamId ?? this.teamId,
      routeId: routeId ?? this.routeId,
      status: status ?? this.status,
      score: score ?? this.score,
      currentStationId: currentStationId ?? this.currentStationId,
      completedStations: completedStations ?? this.completedStations,
      startedAt: startedAt ?? this.startedAt,
    );
  }
}
