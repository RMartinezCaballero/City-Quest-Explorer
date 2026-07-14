import 'package:flutter/material.dart';
import '../content/content_detail_screen.dart';
import '../../models/content.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final items = <Content>[
      Content(
        id: '1',
        title: 'Contenido 1',
        body: 'Ejemplo',
        createdAt: DateTime.now(),
      ),
      Content(
        id: '2',
        title: 'Contenido 2',
        body: 'Ejemplo',
        createdAt: DateTime.now(),
      ),
    ];

    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(title: const Text('Libro Homenaje')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemBuilder: (context, index) {
          final item = items[index];
          final coverUrl = item.coverUrl;

          return Hero(
            tag: 'content-${item.id}',
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => ContentDetailScreen(content: item),
                    ),
                  );
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: theme.cardTheme.color,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.fromBorderSide(
                      BorderSide(color: theme.colorScheme.outlineVariant, width: 1),
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        if (coverUrl != null)
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(
                              coverUrl!,
                              width: 64,
                              height: 64,
                              fit: BoxFit.cover,
                              errorBuilder: (ctx, err, s) => const SizedBox.shrink(),
                            ),
                          ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(item.title, style: theme.textTheme.headlineSmall),
                        ),
                        Icon(Icons.chevron_right_rounded, color: theme.colorScheme.outline),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
        separatorBuilder: (context, index) => SizedBox(height: 12),
        itemCount: items.length,
      ),
    );
  }
}
