import 'package:flutter/material.dart';
import 'package:nr_1/services/wallet_service.dart';
import 'package:nr_1/screens/dashboard_screen.dart';

class ConnectWalletButton extends StatefulWidget {
  const ConnectWalletButton({Key? key}) : super(key: key);

  @override
  State<ConnectWalletButton> createState() => _ConnectWalletButtonState();
}

class _ConnectWalletButtonState extends State<ConnectWalletButton> {
  final WalletService _walletService = WalletService();
  bool _isLoading = false;
  String? _errorMessage;

  void _navigateToDashboard(
      String walletAddress, double fitTokens, bool challengeCompleted) {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => DashboardScreen(
          walletAddress: walletAddress,
          initialFitTokens: fitTokens,
          initialChallengeCompleted: challengeCompleted,
        ),
      ),
    );
  }

  Future<void> _connectWallet() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await _walletService.connectWallet();

      if (result['success']) {
        _navigateToDashboard(
          result['walletAddress'],
          result['fitTokens'],
          result['challengeCompleted'],
        );
      } else {
        setState(() {
          _errorMessage = result['error'];
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isMetaMaskAvailable = _walletService.isMetaMaskAvailable();

    return Column(
      children: [
        if (!isMetaMaskAvailable)
          const Padding(
            padding: EdgeInsets.only(bottom: 16.0),
            child: Text(
              'MetaMask is not available. Please open this app in a browser with the MetaMask extension installed.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.orange),
            ),
          ),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed:
                (_isLoading || !isMetaMaskAvailable) ? null : _connectWallet,
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: _isLoading
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
        if (_errorMessage != null)
          Padding(
            padding: const EdgeInsets.only(top: 16.0),
            child: Text(
              _errorMessage!,
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );
  }
}
