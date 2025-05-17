import 'package:flutter/material.dart';
import 'package:nr_1/widgets/connect_wallet_button.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Icon(
                Icons.fitness_center,
                size: 80,
                color: Colors.purple,
              ),
              const SizedBox(height: 24),
              Text(
                'Nero Fitness Challenge',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Connect your wallet to start earning FIT tokens through fitness challenges. All transactions are gasless!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 48),
              const ConnectWalletButton(),
              const SizedBox(height: 24),
              Text(
                'Powered by Nero Paymaster',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
