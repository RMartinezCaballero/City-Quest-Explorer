class Station {
  final String id;
  final String name;
  final String description;
  final double latitude;
  final double longitude;
  final int orderIndex;
  final String? qrCodeKey;
  final String? imageUrl;
  final String? audioUrl;

  Station({
    required this.id,
    required this.name,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.orderIndex,
    this.qrCodeKey,
    this.imageUrl,
    this.audioUrl,
  });

  factory Station.fromJson(Map<String, dynamic> json) {
    return Station(
      id: json['id'],
      name: json['name'] ?? 'Sin nombre',
      description: json['description'] ?? '',
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      orderIndex: json['order_index'] ?? 0,
      qrCodeKey: json['qr_code_key'],
      imageUrl: json['imageUrl'],
      audioUrl: json['audio_url'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'latitude': latitude,
    'longitude': longitude,
    'order_index': orderIndex,
    'qr_code_key': qrCodeKey,
    'imageUrl': imageUrl,
    'audio_url': audioUrl,
  };
}
