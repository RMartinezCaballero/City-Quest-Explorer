import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:libro_homenaje/models/category.dart';
import 'package:libro_homenaje/models/content.dart';

class ApiConfig {
  const ApiConfig({required this.baseUrl});

  final String baseUrl;

  Future<List<Category>> getCategories() async {
    final response = await http.get(Uri.parse("$baseUrl/categories"));
    if (response.statusCode != 200) {
      throw Exception("No se pudieron obtener las categorías");
    }
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    final items = data['data'] as List<dynamic>? ?? const [];
    return items.map((e) => Category.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Content>> getContent({String? categoryId}) async {
    final uri = categoryId == null
        ? Uri.parse("$baseUrl/content")
        : Uri.parse("$baseUrl/content?categoryId=$categoryId");
    final response = await http.get(uri);
    if (response.statusCode != 200) {
      throw Exception("No se pudo obtener el contenido");
    }
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    final items = data['data'] as List<dynamic>? ?? const [];
    return items.map((e) => Content.fromJson(e as Map<String, dynamic>)).toList();
  }
}

const api = ApiConfig(baseUrl: const String.fromEnvironment("API_BASE_URL", defaultValue: "http://10.0.2.2:3001"));

class SupabaseSignIn {
  static Future<void> maybeInitSupabase() async {
    // TODO: inicializar Supabase cuando se habilite backend en la nube.
  }
}
