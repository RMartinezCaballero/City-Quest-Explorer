import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Acerca de')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(
          'Libro Digital Homenaje',
          style: theme.textTheme.headlineMedium,
        ),
      ),
    );
  }
}
