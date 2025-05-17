import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nr_1/providers/wallet_provider.dart';
import 'package:nr_1/widgets/token_display.dart';
import 'package:nr_1/widgets/claim_button.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch user data when dashboard is loaded
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<WalletProvider>(context, listen: false).fetchUserData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final walletProvider = Provider.of<WalletProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Fitness Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              walletProvider.disconnectWallet();
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => walletProvider.fetchUserData(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Card(
                  color: Colors.grey[850],
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Connected Wallet',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${walletProvider.walletAddress.substring(0, 6)}...${walletProvider.walletAddress.substring(walletProvider.walletAddress.length - 4)}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const TokenDisplay(),
                const SizedBox(height: 32),
                const Text(
                  'Fitness Challenge',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  color: Colors.grey[850],
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              walletProvider.challengeCompleted
                                  ? Icons.check_circle
                                  : Icons.pending,
                              color: walletProvider.challengeCompleted
                                  ? Colors.green
                                  : Colors.orange,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              walletProvider.challengeCompleted
                                  ? 'Challenge Completed!'
                                  : 'Challenge in Progress',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: walletProvider.challengeCompleted
                                    ? Colors.green
                                    : Colors.orange,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Complete daily fitness activities to earn FIT tokens. All transactions are gasless thanks to Nero Paymaster!',
                          style: TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 24),
                        const ClaimButton(),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
