import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nr_1/providers/wallet_provider.dart';

class ConnectWalletButton extends StatelessWidget {
  const ConnectWalletButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final walletProvider = Provider.of<WalletProvider>(context);
    final bool isMetaMaskAvailable = walletProvider.isMetaMaskAvailable();

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
            onPressed: (walletProvider.isLoading || !isMetaMaskAvailable)
                ? null
                : () => walletProvider.connectWallet(),
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
