class Category {
  Category({
    required this.id,
    required this.name,
    this.description,
    this.parentId,
  });

  final String id;
  final String name;
  final String? description;
  final String? parentId;

  factory Category.fromJson(Map<String, dynamic> json) => Category(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String?,
        parentId: json['parentId'] as String?,
      );

  Map<String, dynamic> toJson() => <String, dynamic>{
        'id': id,
        'name': name,
        'description': description,
        'parentId': parentId,
      };
}
