import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nr_1/providers/wallet_provider.dart';
import 'package:nr_1/screens/dashboard_screen.dart'; // Add this import

class ConnectWalletButton extends StatelessWidget {
  const ConnectWalletButton({Key? key}) : super(key: key);

  void _navigateToDashboard(BuildContext context) {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const DashboardScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final walletProvider = Provider.of<WalletProvider>(context);

    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: walletProvider.isLoading
                ? null
                : () async {
                    // Connect wallet
                    await walletProvider.connectWallet();

                    // Check if connection was successful
                    if (walletProvider.isConnected) {
                      // Navigate to dashboard
                      _navigateToDashboard(context);
                    }
                  },
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: walletProvider.isLoading
                  ? const SizedBox(
                      height: 24,
                      width: 24,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : const Text(
                      'Connect MetaMask',
                      style: TextStyle(fontSize: 18),
                    ),
            ),
          ),
        ),
      ],
    );
  }
}
