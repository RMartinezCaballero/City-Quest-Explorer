class Content {
  Content({
    required this.id,
    required this.title,
    required this.body,
    this.categoryId,
    this.authorId,
    required this.createdAt,
    this.updatedAt,
    this.coverUrl,
  });

  final String id;
  final String title;
  final String body;
  final String? categoryId;
  final String? authorId;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final String? coverUrl;

  factory Content.fromJson(Map<String, dynamic> json) => Content(
        id: json['id'] as String,
        title: json['title'] as String,
        body: json['body'] as String,
        categoryId: json['categoryId'] as String?,
        authorId: json['authorId'] as String?,
        createdAt: DateTime.parse(json['createdAt'] as String),
        updatedAt:
            json['updatedAt'] == null ? null : DateTime.parse(json['updatedAt'] as String),
        coverUrl: json['coverUrl'] as String?,
      );

  Map<String, dynamic> toJson() => <String, dynamic>{
        'id': id,
        'title': title,
        'body': body,
        'categoryId': categoryId,
        'authorId': authorId,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt?.toIso8601String(),
        'coverUrl': coverUrl,
      };
}
