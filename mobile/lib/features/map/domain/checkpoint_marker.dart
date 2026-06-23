class CheckpointMarker {
  final String id;
  final String name;
  final String description;
  final double latitude;
  final double longitude;
  final int orderIndex;
  final bool reached;

  const CheckpointMarker({
    required this.id,
    required this.name,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.orderIndex,
    this.reached = false,
  });
}
