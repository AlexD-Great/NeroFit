import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nr_1/providers/wallet_provider.dart';

class ClaimButton extends StatelessWidget {
  const ClaimButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final walletProvider = Provider.of<WalletProvider>(context);

    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed:
            (!walletProvider.challengeCompleted || walletProvider.isLoading)
                ? null
                : () => walletProvider.claimTokens(),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.green,
          disabledBackgroundColor: Colors.grey,
        ),
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
                  'Claim FIT Tokens',
                  style: TextStyle(fontSize: 18),
                ),
        ),
      ),
    );
  }
}
