import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';

class WalletService {
  static final WalletService _instance = WalletService._internal();

  factory WalletService() {
    return _instance;
  }

  WalletService._internal();

  final String _apiBaseUrl = 'https://nerofit.onrender.com';
  // WalletConnect session
  WalletConnect? _connector;

  // Initialize WalletConnect
  Future<WalletConnect> initWalletConnect() async {
    if (_connector != null) return _connector!;

    _connector = WalletConnect(
      bridge: 'https://bridge.walletconnect.org',
      clientMeta: const PeerMeta(
        name: 'Nero Fitness',
        description: 'A fitness app on Nero Chain',
        url: 'https://nerofitness.app',
        icons: ['https://your-icon-url.png'],
      ),
    );

    return _connector!;
  }

  // Connect wallet
  Future<Map<String, dynamic>> connectWallet() async {
    try {
      final connector = await initWalletConnect();

      if (!connector.connected) {
        final session = await connector.createSession(
          chainId: 1559, // Nero testnet chain ID
          onDisplayUri: (uri) async {
            // Launch wallet app with the URI
            final url = 'metamask://wc?uri=$uri';

            // Use the updated launchUrl method
            final Uri parsedUrl = Uri.parse(url);
            if (await canLaunchUrl(parsedUrl)) {
              await launchUrl(parsedUrl, mode: LaunchMode.externalApplication);
            } else {
              print('Could not launch MetaMask. URI: $uri');
              throw Exception(
                  'Could not launch MetaMask. Please install it or scan the QR code.');
            }
          },
        );

        if (session.accounts.isNotEmpty) {
          final walletAddress = session.accounts[0];
          final backendResult = await _connectWalletToBackend(walletAddress);

          return {
            'success': true,
            'walletAddress': walletAddress,
            'fitTokens': backendResult['fitTokens'],
            'challengeCompleted': backendResult['challengeCompleted']
          };
        } else {
          throw Exception('No accounts returned from MetaMask');
        }
      } else {
        final walletAddress = connector.session.accounts[0];
        final backendResult = await _connectWalletToBackend(walletAddress);

        return {
          'success': true,
          'walletAddress': walletAddress,
          'fitTokens': backendResult['fitTokens'],
          'challengeCompleted': backendResult['challengeCompleted']
        };
      }
    } catch (e) {
      print('Error connecting MetaMask: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  // Connect wallet to backend
  Future<Map<String, dynamic>> _connectWalletToBackend(
      String walletAddress) async {
    try {
      final response = await http.post(
        Uri.parse('$_apiBaseUrl/connect-wallet'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'walletAddress': walletAddress}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Execute the sponsored transaction
        if (data.containsKey('sponsoredTransaction')) {
          await _executeSponsoredTransaction(data['sponsoredTransaction']);
        }

        // Fetch user data
        return await fetchUserData(walletAddress);
      } else {
        throw Exception(
            'Failed to connect wallet to backend: ${response.statusCode}');
      }
    } catch (e) {
      print('Error connecting wallet to backend: $e');
      throw e;
    }
  }

  // Fetch user data
  Future<Map<String, dynamic>> fetchUserData(String walletAddress) async {
    try {
      final response = await http.get(
        Uri.parse('$_apiBaseUrl/user-data/$walletAddress'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'fitTokens': double.parse(data['fitTokens']),
          'challengeCompleted': data['challengeCompleted']
        };
      } else {
        throw Exception('Failed to fetch user data');
      }
    } catch (e) {
      print('Error fetching user data: $e');
      throw e;
    }
  }

  // Claim FIT tokens
  Future<Map<String, dynamic>> claimTokens(String walletAddress) async {
    try {
      final response = await http.post(
        Uri.parse('$_apiBaseUrl/claim-tokens'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'walletAddress': walletAddress}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Execute the sponsored transaction
        await _executeSponsoredTransaction(data['sponsoredTransaction']);

        // Refresh user data
        return await fetchUserData(walletAddress);
      } else {
        throw Exception('Failed to claim tokens');
      }
    } catch (e) {
      print('Error claiming tokens: $e');
      throw e;
    }
  }

  // Execute sponsored transaction
  Future<void> _executeSponsoredTransaction(
      Map<String, dynamic> sponsoredTx) async {
    try {
      // This would typically involve sending the sponsored transaction to the wallet
      // for signing, then submitting it to the network

      // For this example, we'll simulate the process
      print('Executing sponsored transaction: ${json.encode(sponsoredTx)}');

      // In a real implementation, you would:
      // 1. Send the transaction to the wallet for signing
      // 2. Submit the signed transaction to the network

      await Future.delayed(
          const Duration(seconds: 2)); // Simulate network delay
    } catch (e) {
      print('Error executing sponsored transaction: $e');
      throw e;
    }
  }

  // Disconnect wallet
  void disconnectWallet() {
    if (_connector != null && _connector!.connected) {
      _connector!.killSession();
    }
  }

  // Check if MetaMask is available
  bool isMetaMaskAvailable() {
    // In a real implementation, you would check if MetaMask is installed
    // For this example, we'll return true
    return true;
  }
}
