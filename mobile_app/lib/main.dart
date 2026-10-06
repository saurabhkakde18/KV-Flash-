import 'package:flutter/material.dart';
import 'constants/app_theme.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const KVFlashApp());
}

class KVFlashApp extends StatelessWidget {
  const KVFlashApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KV Flash',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.gold,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.gold,
          surface: AppColors.cardBg,
          background: AppColors.background,
        ),
        fontFamily: 'sans-serif',
      ),
      home: const LoginScreen(),
    );
  }
}
