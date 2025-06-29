const express = require("express");
const router = express.Router();
const {
  Challenge,
  UserChallengeProgress,
  User,
  UserStats,
  Activity,
} = require("../model/schemas");

// Get all active challenges
router.get("/", async (req, res) => {
  try {
    const { category, difficulty, limit = 50 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const challenges = await Challenge.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("-__v");

    res.json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch challenges",
      error: error.message,
    });
  }
});

// Get challenge by ID
router.get("/:challengeId", async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId).select("-__v");

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch challenge",
      error: error.message,
    });
  }
});

// Create new challenge (admin only)
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      reward,
      difficulty,
      category,
      icon,
      estimatedTime,
      timeLimit,
      dailyLimit = 1,
    } = req.body;

    if (
      !title ||
      !description ||
      !reward ||
      !difficulty ||
      !category ||
      !icon ||
      !estimatedTime ||
      !timeLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const challenge = new Challenge({
      title,
      description,
      reward,
      difficulty,
      category,
      icon,
      estimatedTime,
      timeLimit,
      dailyLimit,
    });

    await challenge.save();

    res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      data: challenge,
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create challenge",
      error: error.message,
    });
  }
});

// Update challenge (admin only)
router.put("/:challengeId", async (req, res) => {
  try {
    const { challengeId } = req.params;
    const updateData = req.body;

    const challenge = await Challenge.findByIdAndUpdate(
      challengeId,
      updateData,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.json({
      success: true,
      message: "Challenge updated successfully",
      data: challenge,
    });
  } catch (error) {
    console.error("Error updating challenge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update challenge",
      error: error.message,
    });
  }
});

// Deactivate challenge (admin only)
router.delete("/:challengeId", async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findByIdAndUpdate(
      challengeId,
      { isActive: false },
      { new: true }
    ).select("-__v");

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.json({
      success: true,
      message: "Challenge deactivated successfully",
      data: challenge,
    });
  } catch (error) {
    console.error("Error deactivating challenge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate challenge",
      error: error.message,
    });
  }
});

// Get user's challenges (with progress)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { status = "all" } = req.query; // all, active, completed, claimed

    let progressQuery = { userId };

    if (status === "active") {
      progressQuery.completed = false;
    } else if (status === "completed") {
      progressQuery.completed = true;
      progressQuery.claimed = false;
    } else if (status === "claimed") {
      progressQuery.completed = true;
      progressQuery.claimed = true;
    }

    const userProgress = await UserChallengeProgress.find(progressQuery)
      .populate("challengeId")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: userProgress,
    });
  } catch (error) {
    console.error("Error fetching user challenges:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user challenges",
      error: error.message,
    });
  }
});

// Start a challenge for a user
router.post("/user/:userId/start/:challengeId", async (req, res) => {
  try {
    const { userId, challengeId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if challenge exists and is active
    const challenge = await Challenge.findById(challengeId);
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found or inactive",
      });
    }

    // Check if user already has an active progress for this challenge
    const existingProgress = await UserChallengeProgress.findOne({
      userId,
      challengeId,
      completed: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingProgress) {
      return res.status(409).json({
        success: false,
        message: "User already has an active progress for this challenge",
      });
    }

    // Calculate expiration time based on challenge timeLimit
    const expiresAt = new Date();
    if (challenge.timeLimit.includes("24 hours")) {
      expiresAt.setHours(expiresAt.getHours() + 24);
    } else if (challenge.timeLimit.includes("7 days")) {
      expiresAt.setDate(expiresAt.getDate() + 7);
    } else {
      // Default to 24 hours
      expiresAt.setHours(expiresAt.getHours() + 24);
    }

    // Create new progress
    const progress = new UserChallengeProgress({
      userId,
      challengeId,
      expiresAt,
    });

    await progress.save();

    // Populate challenge data
    await progress.populate("challengeId");

    res.status(201).json({
      success: true,
      message: "Challenge started successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error starting challenge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start challenge",
      error: error.message,
    });
  }
});

// Update challenge progress
router.patch("/user/:userId/progress/:challengeId", async (req, res) => {
  try {
    const { userId, challengeId } = req.params;
    const { progress: progressValue } = req.body;

    if (
      progressValue === undefined ||
      progressValue < 0 ||
      progressValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    const userProgress = await UserChallengeProgress.findOne({
      userId,
      challengeId,
      completed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: "Active challenge progress not found",
      });
    }

    userProgress.progress = progressValue;

    // Check if challenge is completed
    if (progressValue >= 100 && !userProgress.completed) {
      userProgress.completed = true;
      userProgress.completedAt = new Date();
    }

    await userProgress.save();
    await userProgress.populate("challengeId");

    res.json({
      success: true,
      message: "Progress updated successfully",
      data: userProgress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
      error: error.message,
    });
  }
});

// Complete a challenge
router.post("/user/:userId/complete/:challengeId", async (req, res) => {
  try {
    const { userId, challengeId } = req.params;

    const userProgress = await UserChallengeProgress.findOne({
      userId,
      challengeId,
      completed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: "Active challenge progress not found",
      });
    }

    // Mark as completed
    userProgress.progress = 100;
    userProgress.completed = true;
    userProgress.completedAt = new Date();

    await userProgress.save();

    // Update user stats
    await UserStats.findOneAndUpdate(
      { userId },
      {
        $inc: {
          challengesCompleted: 1,
          claimableTokens: userProgress.challengeId.reward,
        },
        lastUpdated: new Date(),
      }
    );

    // Create activity record
    const challenge = await Challenge.findById(challengeId);
    const activity = new Activity({
      userId,
      type: "challenge",
      title: `Completed "${challenge.title}"`,
      description: `${challenge.category} challenge completed`,
      reward: challenge.reward,
      icon: challenge.icon,
      metadata: { challengeId },
    });

    await activity.save();

    await userProgress.populate("challengeId");

    res.json({
      success: true,
      message: "Challenge completed successfully",
      data: {
        progress: userProgress,
        reward: challenge.reward,
      },
    });
  } catch (error) {
    console.error("Error completing challenge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete challenge",
      error: error.message,
    });
  }
});

// Get challenge statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const totalChallenges = await Challenge.countDocuments({ isActive: true });
    const totalCompletions = await UserChallengeProgress.countDocuments({
      completed: true,
    });
    const totalClaims = await UserChallengeProgress.countDocuments({
      claimed: true,
    });

    const categoryStats = await Challenge.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const difficultyStats = await Challenge.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalChallenges,
        totalCompletions,
        totalClaims,
        categoryStats,
        difficultyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching challenge stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch challenge stats",
      error: error.message,
    });
  }
});

module.exports = router;
