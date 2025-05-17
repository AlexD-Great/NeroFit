import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nr_1/providers/wallet_provider.dart';

class TokenDisplay extends StatelessWidget {
  const TokenDisplay({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final walletProvider = Provider.of<WalletProvider>(context);

    return Card(
      color: Colors.purple[900],
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.fitness_center, color: Colors.white),
                SizedBox(width: 8),
                Text(
                  'FIT Tokens',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              '${walletProvider.fitTokens.toStringAsFixed(2)} FIT',
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Complete fitness challenges to earn more!',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
