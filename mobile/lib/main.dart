import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'routes/app_router.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');

  await Supabase.initialize(
    url: dotenv.env['SUPABASE_URL']!,
    anonKey: dotenv.env['SUPABASE_ANON_KEY']!, // ignore: deprecated_member_use
  );

  runApp(const ProviderScope(child: CityQuestApp()));
}

class CityQuestApp extends StatelessWidget {
  const CityQuestApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'City Quest Explorer',
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFD4A017),
          secondary: Color(0xFF8A6A10),
          surface: Color(0xFF0D1B2A),
        ),
        scaffoldBackgroundColor: const Color(0xFF0A0A1A),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0A0A1A),
          foregroundColor: Color(0xFFD4A017),
          elevation: 0,
        ),
      ),
      routerConfig: appRouter,
    );
  }
}
