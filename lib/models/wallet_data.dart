class WalletData {
  final String address;
  final double fitTokens;
  final bool challengeCompleted;

  WalletData({
    required this.address,
    required this.fitTokens,
    required this.challengeCompleted,
  });

  WalletData copyWith({
    String? address,
    double? fitTokens,
    bool? challengeCompleted,
  }) {
    return WalletData(
      address: address ?? this.address,
      fitTokens: fitTokens ?? this.fitTokens,
      challengeCompleted: challengeCompleted ?? this.challengeCompleted,
    );
  }
}
