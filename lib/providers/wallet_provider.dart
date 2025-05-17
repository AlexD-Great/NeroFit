import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_web3/flutter_web3.dart';

class WalletProvider extends ChangeNotifier {
  final String _apiBaseUrl = 'https://nerofit.onrender.com';

  bool _isConnected = false;
  String _walletAddress = '';
  double _fitTokens = 0;
  bool _challengeCompleted = false;
  bool _isLoading = false;

  // Track taps for the challenge
  int _tapCount = 0;
  final int _requiredTaps = 5;

  // Ethereum provider
  Web3Provider? _provider;

  bool get isConnected => _isConnected;
  String get walletAddress => _walletAddress;
  double get fitTokens => _fitTokens;
  bool get challengeCompleted => _challengeCompleted;
  bool get isLoading => _isLoading;
  int get tapCount => _tapCount;
  int get requiredTaps => _requiredTaps;
  bool get hasCompletedTapChallenge => _tapCount >= _requiredTaps;

  // Method to increment tap count
  void incrementTapCount() {
    if (_tapCount < _requiredTaps) {
      _tapCount++;
      notifyListeners();
    }
  }

  // Method to reset tap count
  void resetTapCount() {
    _tapCount = 0;
    notifyListeners();
  }

  // Check if MetaMask is available
  bool isMetaMaskAvailable() {
    return Ethereum.isSupported;
  }

  // Connect wallet using MetaMask
  Future<void> connectWallet() async {
    _isLoading = true;
    notifyListeners();

    try {
      // Check if MetaMask is available
      if (!isMetaMaskAvailable()) {
        throw Exception(
            'MetaMask is not available. Please install MetaMask extension.');
      }

      // Request account access
      final accounts = await ethereum!.requestAccount();

      if (accounts.isNotEmpty) {
        _walletAddress = accounts[0];

        // Initialize provider
        _provider = Web3Provider(ethereum!);

        // Switch to Nero testnet if not already on it
        try {
          await ethereum!.walletSwitchChain(1559); // Nero testnet chain ID
        } catch (e) {
          // If the chain is not added, add it
          await ethereum!.walletAddChain(
            chainId: 1559,
            chainName: 'Nero Testnet',
            nativeCurrency: CurrencyParams(
              name: 'NERO',
              symbol: 'NERO',
              decimals: 18,
            ),
            rpcUrls: ['https://testnet-rpc.nerochain.io'],
          );
        }

        // Connect to backend
        await _connectWalletToBackend();
      } else {
        throw Exception('No accounts found. Please unlock MetaMask.');
      }
    } catch (e) {
      print('Error connecting wallet: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Connect wallet to backend
  Future<void> _connectWalletToBackend() async {
    try {
      final response = await http.post(
        Uri.parse('$_apiBaseUrl/connect-wallet'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'walletAddress': _walletAddress}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _isConnected = true;

        // Execute the sponsored transaction
        await _executeSponsoredTransaction(data['sponsoredTransaction']);

        // Fetch user data
        await fetchUserData();
      } else {
        throw Exception('Failed to connect wallet to backend');
      }
    } catch (e) {
      print('Error connecting wallet to backend: $e');
      _isConnected = false;
    }

    notifyListeners();
  }

  // Fetch user data
  Future<void> fetchUserData() async {
    if (!_isConnected) return;

    try {
      final response = await http.get(
        Uri.parse('$_apiBaseUrl/user-data/$_walletAddress'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _fitTokens = double.parse(data['fitTokens']);
        _challengeCompleted = data['challengeCompleted'];

        // Reset tap count when fetching new data
        resetTapCount();
      } else {
        throw Exception('Failed to fetch user data');
      }
    } catch (e) {
      print('Error fetching user data: $e');
    }

    notifyListeners();
  }

  // Claim FIT tokens
  Future<void> claimTokens() async {
    if (!_isConnected || !hasCompletedTapChallenge) return;

    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_apiBaseUrl/claim-tokens'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'walletAddress': _walletAddress}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Execute the sponsored transaction
        await _executeSponsoredTransaction(data['sponsoredTransaction']);

        // Reset tap count after successful claim
        resetTapCount();

        // Refresh user data
        await fetchUserData();
      } else {
        throw Exception('Failed to claim tokens');
      }
    } catch (e) {
      print('Error claiming tokens: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Execute sponsored transaction
  Future<void> _executeSponsoredTransaction(
      Map<String, dynamic> sponsoredTx) async {
    try {
      if (_provider == null) {
        throw Exception('Provider not initialized');
      }

      final transaction = sponsoredTx['transaction'];

      // Create a TransactionRequest object for MetaMask
      final transactionRequest = TransactionRequest(
        to: transaction['to'],
        from: transaction['from'],
        data: transaction['data'],
        gasLimit: transaction['gasLimit'],
        // For sponsored transactions, we don't need to specify gasPrice
        // The Paymaster will cover the gas costs
      );

      // Send the transaction to MetaMask for signing
      final signer = _provider!.getSigner();
      final txResponse = await signer.sendTransaction(transactionRequest);

      // Wait for the transaction to be mined
      final receipt = await txResponse.wait();

      print('Transaction executed successfully!');
      print('Transaction hash: ${receipt.transactionHash}');
    } catch (e) {
      print('Error executing sponsored transaction: $e');
      throw e;
    }
  }

  // Disconnect wallet
  void disconnectWallet() {
    _isConnected = false;
    _walletAddress = '';
    _fitTokens = 0;
    _challengeCompleted = false;
    _provider = null;

    // Reset tap count
    resetTapCount();

    notifyListeners();
  }
}
