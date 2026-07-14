import 'package:flutter/material.dart';

class AppTheme {
  static const surface = Color(0xFFfaf9f5);
  static const surfaceContainerLow = Color(0xFFf4f4f0);
  static const primary = Color(0xFF9a4028);
  static const onPrimary = Color(0xFFffffff);
  static const primaryContainer = Color(0xFFb9573e);
  static const secondary = Color(0xFF006972);
  static const onSecondary = Color(0xFFffffff);
  static const secondaryContainer = Color(0xFF9ff0fb);
  static const onSecondaryContainer = Color(0xFF066f79);
  static const tertiary = Color(0xFF8b4c11);
  static const tertiaryContainer = Color(0xFFa96428);
  static const onSurface = Color(0xFF1b1c1a);
  static const onSurfaceVariant = Color(0xFF56423d);
  static const outline = Color(0xFF89726c);
  static const outlineVariant = Color(0xFFdcc0ba);

  static ThemeData get light => ThemeData(
        useMaterial3: true,
        colorSchemeSeed: primary,
        scaffoldBackgroundColor: surface,
        appBarTheme: const AppBarTheme(
          backgroundColor: surface,
          foregroundColor: onSurface,
          elevation: 0,
          centerTitle: true,
        ),
      );
}
