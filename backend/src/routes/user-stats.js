const express = require("express");
const router = express.Router();
const { UserStats, User } = require("../model/schemas");

// Get user stats by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userStats = await UserStats.findOne({ userId })
      .populate("userId", "name walletAddress avatar")
      .select("-__v");

    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: "User stats not found",
      });
    }

    res.json({
      success: true,
      data: userStats,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
      error: error.message,
    });
  }
});

// Get user stats by wallet address
router.get("/wallet/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await User.findOne({
      walletAddress: walletAddress.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userStats = await UserStats.findOne({ userId: user._id })
      .populate("userId", "name walletAddress avatar")
      .select("-__v");

    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: "User stats not found",
      });
    }

    res.json({
      success: true,
      data: userStats,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
      error: error.message,
    });
  }
});

// Update user stats
router.put("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be directly updated
    delete updateData.userId;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const userStats = await UserStats.findOneAndUpdate(
      { userId },
      { ...updateData, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).populate("userId", "name walletAddress avatar");

    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: "User stats not found",
      });
    }

    res.json({
      success: true,
      message: "User stats updated successfully",
      data: userStats,
    });
  } catch (error) {
    console.error("Error updating user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user stats",
      error: error.message,
    });
  }
});

// Increment specific stat
router.patch("/user/:userId/increment", async (req, res) => {
  try {
    const { userId } = req.params;
    const { field, amount = 1 } = req.body;

    if (!field) {
      return res.status(400).json({
        success: false,
        message: "Field to increment is required",
      });
    }

    const allowedFields = [
      "totalTokens",
      "challengesCompleted",
      "weeklyWorkouts",
      "totalDistance",
      "totalMinutes",
      "currentStreak",
    ];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: `Invalid field. Allowed fields: ${allowedFields.join(", ")}`,
      });
    }

    const updateQuery = {};
    updateQuery[field] = amount;
    updateQuery.lastUpdated = new Date();

    const userStats = await UserStats.findOneAndUpdate(
      { userId },
      { $inc: updateQuery },
      { new: true, runValidators: true }
    ).populate("userId", "name walletAddress avatar");

    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: "User stats not found",
      });
    }

    res.json({
      success: true,
      message: `${field} incremented successfully`,
      data: userStats,
    });
  } catch (error) {
    console.error("Error incrementing user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to increment user stats",
      error: error.message,
    });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { limit = 10, sortBy = "totalTokens" } = req.query;

    const allowedSortFields = [
      "totalTokens",
      "challengesCompleted",
      "currentStreak",
      "weeklyWorkouts",
      "totalDistance",
      "totalMinutes",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field. Allowed fields: ${allowedSortFields.join(
          ", "
        )}`,
      });
    }

    const sortQuery = {};
    sortQuery[sortBy] = -1; // Descending order

    const leaderboard = await UserStats.find()
      .populate("userId", "name walletAddress avatar joinedDate lastActive")
      .sort(sortQuery)
      .limit(parseInt(limit))
      .select("-__v");

    // Add rank to each entry
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1,
    }));

    res.json({
      success: true,
      data: leaderboardWithRank,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
});

// Get user rank
router.get("/user/:userId/rank", async (req, res) => {
  try {
    const { userId } = req.params;
    const { sortBy = "totalTokens" } = req.query;

    const userStats = await UserStats.findOne({ userId });

    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: "User stats not found",
      });
    }

    // Count users with higher stats
    const rankQuery = {};
    rankQuery[sortBy] = { $gt: userStats[sortBy] };

    const rank = await UserStats.countDocuments(rankQuery);

    res.json({
      success: true,
      data: {
        userId,
        rank: rank + 1,
        value: userStats[sortBy],
        sortBy,
      },
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user rank",
      error: error.message,
    });
  }
});

// Reset user stats (admin only)
router.delete("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userStats = await UserStats.findOneAndUpdate(
      { userId },
      {
        totalTokens: 0,
        challengesCompleted: 0,
        currentStreak: 0,
        weeklyWorkouts: 0,
        totalDistance: 0,
        totalMinutes: 0,
        rank: 0,
        claimableTokens: 0,
        badges: [],
        lastUpdated: new Date(),
      },
      { new: true, runValidators: true }
    ).populate("userId", "name walletAddress avatar");

    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: "User stats not found",
      });
    }

    res.json({
      success: true,
      message: "User stats reset successfully",
      data: userStats,
    });
  } catch (error) {
    console.error("Error resetting user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset user stats",
      error: error.message,
    });
  }
});

module.exports = router;
