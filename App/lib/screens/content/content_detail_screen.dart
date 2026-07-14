import 'package:flutter/material.dart';
import 'package:libro_homenaje/theme/app_theme.dart';
import 'package:libro_homenaje/models/content.dart';

class ContentDetailScreen extends StatefulWidget {
  final Content content;

  const ContentDetailScreen({super.key, required this.content});

  @override
  State<ContentDetailScreen> createState() => _ContentDetailScreenState();
}

class _ContentDetailScreenState extends State<ContentDetailScreen> {
  bool _isOffline = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(widget.content.title)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.content.coverUrl != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  widget.content.coverUrl!,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const SizedBox.shrink(),
                ),
              ),
            const SizedBox(height: 16),
            Text(widget.content.title, style: theme.textTheme.headlineMedium),
            const SizedBox(height: 8),
            Text(
              'Activado',
              style: theme.textTheme.bodySmall?.copyWith(color: AppTheme.onSurfaceVariant),
            ),
            const SizedBox(height: 16),
            Text(widget.content.body, style: theme.textTheme.bodyLarge),
          ],
        ),
      ),
      floatingActionButton: IconButton(
        onPressed: () {
          setState(() => _isOffline = !_isOffline);
        },
        icon: Icon(_isOffline ? Icons.offline_share_rounded : Icons.download_rounded),
      ),
    );
  }
}
