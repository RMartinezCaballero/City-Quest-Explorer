import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../widgets/auth_form.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _fadeCtrl;
  late final Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _fadeCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..forward();
    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeIn);
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFF0A0A1A), Color(0xFF1A0A2E), Color(0xFF0D1B2A)],
            ),
          ),
          child: SafeArea(
            child: FadeTransition(
              opacity: _fadeAnim,
              child: Column(
                children: [
                  const SizedBox(height: 48),
                  _buildHeader(context),
                  const SizedBox(height: 36),
                  _buildTabs(context),
                  Expanded(
                    child: const TabBarView(
                      children: [
                        SingleChildScrollView(
                          padding: EdgeInsets.only(bottom: 32),
                          child: AuthForm(mode: AuthFormMode.login),
                        ),
                        SingleChildScrollView(
                          padding: EdgeInsets.only(bottom: 32),
                          child: AuthForm(mode: AuthFormMode.register),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Column(
      children: [
        // Ícono con glow dorado
        Container(
          width: 88,
          height: 88,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Color.fromRGBO(212, 160, 23, 0.5),
                blurRadius: 32,
                spreadRadius: 4,
              ),
            ],
            gradient: const RadialGradient(
              colors: [Color(0xFF2C1A0E), Color(0xFF1A0A05)],
            ),
            border: Border.all(color: const Color(0xFFD4A017), width: 1.5),
          ),
          child: const Icon(Icons.menu_book, size: 44, color: Color(0xFFD4A017)),
        ),
        const SizedBox(height: 16),
        const Text(
          'CITY QUEST EXPLORER',
          style: TextStyle(
            color: Color(0xFFD4A017),
            fontSize: 18,
            fontWeight: FontWeight.w900,
            letterSpacing: 3,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            border: Border.all(color: Color.fromRGBO(212, 160, 23, 0.4)),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Text(
            '✦  El Manuscrito Prohibido  ✦',
            style: TextStyle(
              color: Color(0xFFBFA060),
              fontSize: 12,
              letterSpacing: 1.5,
            ),
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Cartagena de Indias · Colombia',
          style: TextStyle(color: Color(0xFF607080), fontSize: 11),
        ),
      ],
    );
  }

  Widget _buildTabs(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: Color.fromRGBO(255, 255, 255, 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Color.fromRGBO(255, 255, 255, 0.08)),
      ),
      child: TabBar(
        indicator: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: Color.fromRGBO(212, 160, 23, 0.15),
          border: Border.all(color: Color.fromRGBO(212, 160, 23, 0.6)),
        ),
        indicatorSize: TabBarIndicatorSize.tab,
        dividerColor: Colors.transparent,
        labelColor: const Color(0xFFD4A017),
        unselectedLabelColor: const Color(0xFF607080),
        labelStyle: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 0.5),
        tabs: const [
          Tab(text: 'Iniciar sesión'),
          Tab(text: 'Registrarse'),
        ],
      ),
    );
  }
}
