import 'package:dio/dio.dart';
import '../domain/models/ranking.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/network/api_client.dart';

final rankingApiProvider = Provider(
  (ref) => RankingApi(ref.watch(apiClientProvider)),
);

class RankingApi {
  final Dio _dio;
  final String _baseUrl = 'http://localhost:3000/api';

  RankingApi(this._dio);

  Future<List<RankingEntry>> getRankingsByRoute(String routeId) async {
    try {
      final response = await _dio.get('$_baseUrl/routes/$routeId/rankings');
      final List data = response.data;
      return data.map((json) => RankingEntry.fromJson(json)).toList();
    } catch (e) {
      // Manejo de error silencioso para el ranking
      return [];
    }
  }
}
