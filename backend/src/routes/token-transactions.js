const express = require("express");
const router = express.Router();
const {
  TokenTransaction,
  User,
  UserStats,
  Challenge,
} = require("../model/schemas");

// Get user's transaction history
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, status, limit = 20, page = 1 } = req.query;

    const query = { userId };
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await TokenTransaction.find(query)
      .populate("userId", "name walletAddress avatar")
      .populate("challengeId", "title category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await TokenTransaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user transactions",
      error: error.message,
    });
  }
});

// Create token transaction (earn tokens)
router.post("/earn", async (req, res) => {
  try {
    const { userId, amount, description, challengeId, transactionHash } =
      req.body;

    if (!userId || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, amount, description",
      });
    }

    const transaction = new TokenTransaction({
      userId,
      type: "earned",
      amount,
      description,
      challengeId,
      transactionHash,
      status: "completed",
    });

    await transaction.save();

    // Update user stats
    await UserStats.findOneAndUpdate(
      { userId },
      {
        $inc: {
          totalTokens: amount,
          claimableTokens: amount,
        },
        lastUpdated: new Date(),
      }
    );

    await transaction.populate("userId", "name walletAddress avatar");
    await transaction.populate("challengeId", "title category");

    res.status(201).json({
      success: true,
      message: "Tokens earned successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating earn transaction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create earn transaction",
      error: error.message,
    });
  }
});

// Claim tokens
router.post("/claim", async (req, res) => {
  try {
    const {
      userId,
      amount,
      description = "Token claim",
      transactionHash,
    } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, amount",
      });
    }

    const transaction = new TokenTransaction({
      userId,
      type: "claimed",
      amount,
      description,
      transactionHash,
      status: "pending",
    });

    await transaction.save();

    // Update user stats
    await UserStats.findOneAndUpdate(
      { userId },
      {
        $inc: {
          claimableTokens: -amount,
        },
        lastUpdated: new Date(),
      }
    );

    await transaction.populate("userId", "name walletAddress avatar");

    res.status(201).json({
      success: true,
      message: "Token claim initiated successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating claim transaction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create claim transaction",
      error: error.message,
    });
  }
});

module.exports = router;
