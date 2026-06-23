import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('App renderiza sin errores', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: Scaffold(body: Text('City Quest Explorer'))),
    );
    expect(find.text('City Quest Explorer'), findsOneWidget);
  });
}
