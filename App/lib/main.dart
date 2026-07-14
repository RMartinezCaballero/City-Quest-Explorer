import 'package:flutter/material.dart';
import 'package:libro_homenaje/theme/app_theme.dart';
import 'package:libro_homenaje/screens/home/home_screen.dart';

void main() => runApp(const LibroApp());

class LibroApp extends StatelessWidget {
  const LibroApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Libro Homenaje',
      theme: AppTheme.light,
      routes: {
        '/': (_) => const HomeScreen(),
      },
    );
  }
}
