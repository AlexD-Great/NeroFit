const express = require("express");
const router = express.Router();
const {
  Badge,
  UserBadge,
  User,
  UserStats,
  Activity,
} = require("../model/schemas");

// Get all active badges
router.get("/", async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const badges = await Badge.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("-__v");

    res.json({
      success: true,
      data: badges,
    });
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch badges",
      error: error.message,
    });
  }
});

// Get badge by ID
router.get("/:badgeId", async (req, res) => {
  try {
    const { badgeId } = req.params;

    const badge = await Badge.findById(badgeId).select("-__v");

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      });
    }

    res.json({
      success: true,
      data: badge,
    });
  } catch (error) {
    console.error("Error fetching badge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch badge",
      error: error.message,
    });
  }
});

// Create new badge (admin only)
router.post("/", async (req, res) => {
  try {
    const { name, icon, description, criteria, reward = 0 } = req.body;

    if (!name || !icon || !description || !criteria) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, icon, description, criteria",
      });
    }

    const badge = new Badge({
      name,
      icon,
      description,
      criteria,
      reward,
    });

    await badge.save();

    res.status(201).json({
      success: true,
      message: "Badge created successfully",
      data: badge,
    });
  } catch (error) {
    console.error("Error creating badge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create badge",
      error: error.message,
    });
  }
});

// Update badge (admin only)
router.put("/:badgeId", async (req, res) => {
  try {
    const { badgeId } = req.params;
    const updateData = req.body;

    const badge = await Badge.findByIdAndUpdate(badgeId, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      });
    }

    res.json({
      success: true,
      message: "Badge updated successfully",
      data: badge,
    });
  } catch (error) {
    console.error("Error updating badge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update badge",
      error: error.message,
    });
  }
});

// Deactivate badge (admin only)
router.delete("/:badgeId", async (req, res) => {
  try {
    const { badgeId } = req.params;

    const badge = await Badge.findByIdAndUpdate(
      badgeId,
      { isActive: false },
      { new: true }
    ).select("-__v");

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      });
    }

    res.json({
      success: true,
      message: "Badge deactivated successfully",
      data: badge,
    });
  } catch (error) {
    console.error("Error deactivating badge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate badge",
      error: error.message,
    });
  }
});

// Get user's badges
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userBadges = await UserBadge.find({ userId })
      .populate("badgeId")
      .sort({ earnedAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: userBadges,
    });
  } catch (error) {
    console.error("Error fetching user badges:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user badges",
      error: error.message,
    });
  }
});

// Award badge to user
router.post("/award", async (req, res) => {
  try {
    const { userId, badgeId } = req.body;

    if (!userId || !badgeId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, badgeId",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if badge exists and is active
    const badge = await Badge.findById(badgeId);
    if (!badge || !badge.isActive) {
      return res.status(404).json({
        success: false,
        message: "Badge not found or inactive",
      });
    }

    // Check if user already has this badge
    const existingUserBadge = await UserBadge.findOne({ userId, badgeId });
    if (existingUserBadge) {
      return res.status(409).json({
        success: false,
        message: "User already has this badge",
      });
    }

    // Award the badge
    const userBadge = new UserBadge({
      userId,
      badgeId,
    });

    await userBadge.save();

    // Update user stats with badge
    await UserStats.findOneAndUpdate(
      { userId },
      {
        $push: { badges: badge.icon },
        lastUpdated: new Date(),
      }
    );

    // Create activity record
    const activity = new Activity({
      userId,
      type: "badge",
      title: `Earned "${badge.name}" badge`,
      description: badge.description,
      reward: badge.reward,
      icon: badge.icon,
      metadata: { badgeId },
    });

    await activity.save();

    // If badge has a reward, add it to user stats
    if (badge.reward > 0) {
      await UserStats.findOneAndUpdate(
        { userId },
        {
          $inc: {
            totalTokens: badge.reward,
            claimableTokens: badge.reward,
          },
          lastUpdated: new Date(),
        }
      );
    }

    await userBadge.populate("badgeId");

    res.status(201).json({
      success: true,
      message: "Badge awarded successfully",
      data: {
        userBadge,
        reward: badge.reward,
      },
    });
  } catch (error) {
    console.error("Error awarding badge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to award badge",
      error: error.message,
    });
  }
});

// Remove badge from user (admin only)
router.delete("/user/:userId/badge/:badgeId", async (req, res) => {
  try {
    const { userId, badgeId } = req.params;

    const userBadge = await UserBadge.findOneAndDelete({ userId, badgeId });

    if (!userBadge) {
      return res.status(404).json({
        success: false,
        message: "User badge not found",
      });
    }

    // Remove badge from user stats
    const badge = await Badge.findById(badgeId);
    if (badge) {
      await UserStats.findOneAndUpdate(
        { userId },
        {
          $pull: { badges: badge.icon },
          lastUpdated: new Date(),
        }
      );
    }

    res.json({
      success: true,
      message: "Badge removed successfully",
      data: { userId, badgeId },
    });
  } catch (error) {
    console.error("Error removing badge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove badge",
      error: error.message,
    });
  }
});

// Get badge statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const totalBadges = await Badge.countDocuments({ isActive: true });
    const totalAwards = await UserBadge.countDocuments();

    const badgeStats = await Badge.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "userbadges",
          localField: "_id",
          foreignField: "badgeId",
          as: "awards",
        },
      },
      {
        $project: {
          name: 1,
          icon: 1,
          awardCount: { $size: "$awards" },
        },
      },
      { $sort: { awardCount: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalBadges,
        totalAwards,
        badgeStats,
      },
    });
  } catch (error) {
    console.error("Error fetching badge stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch badge stats",
      error: error.message,
    });
  }
});

// Check if user qualifies for badges (automated check)
router.post("/check-qualifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user stats
    const userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: "User stats not found",
      });
    }

    // Get all active badges
    const badges = await Badge.find({ isActive: true });

    const qualifiedBadges = [];

    for (const badge of badges) {
      // Check if user already has this badge
      const existingBadge = await UserBadge.findOne({
        userId,
        badgeId: badge._id,
      });
      if (existingBadge) continue;

      // Check qualification based on criteria
      let qualifies = false;

      if (badge.criteria.includes("challengesCompleted")) {
        const requiredCount = parseInt(badge.criteria.match(/\d+/)[0]);
        if (userStats.challengesCompleted >= requiredCount) {
          qualifies = true;
        }
      } else if (badge.criteria.includes("currentStreak")) {
        const requiredCount = parseInt(badge.criteria.match(/\d+/)[0]);
        if (userStats.currentStreak >= requiredCount) {
          qualifies = true;
        }
      } else if (badge.criteria.includes("totalTokens")) {
        const requiredCount = parseInt(badge.criteria.match(/\d+/)[0]);
        if (userStats.totalTokens >= requiredCount) {
          qualifies = true;
        }
      }

      if (qualifies) {
        qualifiedBadges.push(badge);
      }
    }

    res.json({
      success: true,
      data: {
        qualifiedBadges,
        count: qualifiedBadges.length,
      },
    });
  } catch (error) {
    console.error("Error checking badge qualifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check badge qualifications",
      error: error.message,
    });
  }
});

module.exports = router;
