import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nr_1/providers/wallet_provider.dart';
import 'package:nr_1/screens/onboarding_screen.dart';
import 'package:nr_1/screens/dashboard_screen.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ChangeNotifierProvider(
      create: (context) => WalletProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nero Fitness',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.purple,
        scaffoldBackgroundColor: Colors.grey[900],
        cardColor: Colors.grey[850],
        textTheme: Theme.of(context).textTheme.apply(
              bodyColor: Colors.white,
              displayColor: Colors.white,
            ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.purple,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
      ),
      home: kIsWeb
          ? Consumer<WalletProvider>(
              builder: (context, walletProvider, child) {
                return walletProvider.isConnected
                    ? const DashboardScreen()
                    : const OnboardingScreen();
              },
            )
          : const PlatformNotSupportedScreen(),
    );
  }
}

class PlatformNotSupportedScreen extends StatelessWidget {
  const PlatformNotSupportedScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(
                Icons.error_outline,
                size: 80,
                color: Colors.orange,
              ),
              SizedBox(height: 24),
              Text(
                'Platform Not Supported',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 16),
              Text(
                'This app requires MetaMask which is only available in web browsers. Please open this app in a web browser with the MetaMask extension installed.',
                style: TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
