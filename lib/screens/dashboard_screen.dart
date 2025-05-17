import 'package:flutter/material.dart';
import 'package:nr_1/services/wallet_service.dart';
import 'package:nr_1/screens/login_screen.dart';

class DashboardScreen extends StatefulWidget {
  final String walletAddress;
  final double initialFitTokens;
  final bool initialChallengeCompleted;

  const DashboardScreen({
    Key? key,
    required this.walletAddress,
    required this.initialFitTokens,
    required this.initialChallengeCompleted,
  }) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late String _walletAddress;
  late double _fitTokens;
  late bool _challengeCompleted;
  bool _isLoading = false;
  final WalletService _walletService = WalletService();

  @override
  void initState() {
    super.initState();
    _walletAddress = widget.walletAddress;
    _fitTokens = widget.initialFitTokens;
    _challengeCompleted = widget.initialChallengeCompleted;

    // Refresh data when screen loads
    _refreshUserData();
  }

  Future<void> _refreshUserData() async {
    try {
      final userData = await _walletService.fetchUserData(_walletAddress);
      setState(() {
        _fitTokens = userData['fitTokens'];
        _challengeCompleted = userData['challengeCompleted'];
      });
    } catch (e) {
      print('Error refreshing user data: $e');
      // Show error message if needed
    }
  }

  Future<void> _claimTokens() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final result = await _walletService.claimTokens(_walletAddress);
      setState(() {
        _fitTokens = result['fitTokens'];
        _challengeCompleted = result['challengeCompleted'];
      });
    } catch (e) {
      print('Error claiming tokens: $e');
      // Show error message if needed
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _disconnectWallet() {
    _walletService.disconnectWallet();
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const LoginScreen()),
    );
  }

  String _shortenAddress(String address) {
    if (address.length < 10) return address;
    return '${address.substring(0, 6)}...${address.substring(address.length - 4)}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nero Fitness'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _disconnectWallet,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refreshUserData,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome, ${_shortenAddress(_walletAddress)}',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 24),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Your FIT Tokens',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '$_fitTokens',
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Daily Challenge',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Complete 5,000 steps today',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        LinearProgressIndicator(
                          value: _challengeCompleted ? 1.0 : 0.7,
                          minHeight: 10,
                          backgroundColor: Colors.grey[300],
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Theme.of(context).primaryColor,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _challengeCompleted
                              ? 'Challenge completed!'
                              : '3,500 / 5,000 steps',
                          style: TextStyle(
                            color: _challengeCompleted
                                ? Colors.green
                                : Colors.grey[700],
                          ),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isLoading || !_challengeCompleted
                                ? null
                                : _claimTokens,
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 12.0),
                              child: _isLoading
                                  ? const SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : const Text(
                                      'Claim 10 FIT Tokens',
                                      style: TextStyle(fontSize: 16),
                                    ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const Spacer(),
                const Center(
                  child: Text(
                    'Powered by Nero Chain',
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 14,
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
