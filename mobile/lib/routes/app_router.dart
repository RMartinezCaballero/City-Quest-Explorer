import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../features/auth/presentation/screens/login_screen.dart';
import '../features/auth/presentation/screens/register_screen.dart';
import '../features/map/presentation/screens/map_screen.dart';
import '../features/missions/presentation/screens/mission_detail_screen.dart';
import '../features/missions/presentation/screens/missions_screen.dart';
import '../features/profile/presentation/screens/profile_screen.dart';
import '../features/qr/presentation/screens/qr_screen.dart';
import '../features/ranking/presentation/screens/ranking_screen.dart';

const _publicRoutes = {'/login', '/register'};

class _SupabaseAuthListenable extends ChangeNotifier {
  late final StreamSubscription _sub;

  _SupabaseAuthListenable() {
    _sub = Supabase.instance.client.auth.onAuthStateChange.listen((_) {
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }
}

final appRouter = GoRouter(
  initialLocation: '/login',
  refreshListenable: _SupabaseAuthListenable(),
  redirect: (context, state) {
    final session = Supabase.instance.client.auth.currentSession;
    final isAuthenticated = session != null;
    final isPublic = _publicRoutes.contains(state.matchedLocation);

    if (!isAuthenticated && !isPublic) return '/login';
    if (isAuthenticated && isPublic) return '/map';
    return null;
  },
  routes: [
    GoRoute(path: '/login', builder: (ctx, s) => const LoginScreen()),
    GoRoute(path: '/register', builder: (ctx, s) => const RegisterScreen()),
    GoRoute(path: '/map', builder: (ctx, s) => const MapScreen()),
    GoRoute(path: '/qr', builder: (ctx, s) => const QrScreen()),
    GoRoute(path: '/missions', builder: (ctx, s) => const MissionsScreen()),
    GoRoute(
      path: '/missions/:id',
      builder: (_, state) => MissionDetailScreen(
        checkpointId: state.pathParameters['id']!,
      ),
    ),
    GoRoute(path: '/ranking', builder: (ctx, s) => const RankingScreen()),
    GoRoute(path: '/profile', builder: (ctx, s) => const ProfileScreen()),
  ],
);
