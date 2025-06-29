const express = require("express");
const router = express.Router();
const { Activity, User } = require("../model/schemas");

// Get user's activity feed
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, limit = 20, page = 1 } = req.query;

    const query = { userId };
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await Activity.find(query)
      .populate("userId", "name walletAddress avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Activity.countDocuments(query);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activities",
      error: error.message,
    });
  }
});

// Get activity by ID
router.get("/:activityId", async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId)
      .populate("userId", "name walletAddress avatar")
      .select("-__v");

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
      error: error.message,
    });
  }
});

// Create new activity
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      type,
      title,
      description,
      reward = 0,
      icon,
      metadata = {},
    } = req.body;

    if (!userId || !type || !title || !description || !icon) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: userId, type, title, description, icon",
      });
    }

    // Validate activity type
    const validTypes = ["challenge", "workout", "badge", "token_claim"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid activity type. Valid types: ${validTypes.join(", ")}`,
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

    const activity = new Activity({
      userId,
      type,
      title,
      description,
      reward,
      icon,
      metadata,
    });

    await activity.save();
    await activity.populate("userId", "name walletAddress avatar");

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create activity",
      error: error.message,
    });
  }
});

// Get recent activities (for dashboard)
router.get("/recent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 5 } = req.query;

    const activities = await Activity.find({ userId })
      .populate("userId", "name walletAddress avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("-__v");

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities",
      error: error.message,
    });
  }
});

// Get activity statistics for user
router.get("/user/:userId/stats", async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = "all" } = req.query; // all, week, month, year

    let dateFilter = {};
    if (period === "week") {
      dateFilter = {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      };
    } else if (period === "month") {
      dateFilter = {
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      };
    } else if (period === "year") {
      dateFilter = {
        createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      };
    }

    const query = { userId, ...dateFilter };

    const totalActivities = await Activity.countDocuments(query);
    const totalRewards = await Activity.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$reward" } } },
    ]);

    const typeStats = await Activity.aggregate([
      { $match: query },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const recentActivity = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(1)
      .select("createdAt type title");

    res.json({
      success: true,
      data: {
        totalActivities,
        totalRewards: totalRewards[0]?.total || 0,
        typeStats,
        lastActivity: recentActivity[0] || null,
        period,
      },
    });
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity stats",
      error: error.message,
    });
  }
});

// Get global activity feed (admin only)
router.get("/global/feed", async (req, res) => {
  try {
    const { limit = 50, type } = req.query;

    const query = {};
    if (type) query.type = type;

    const activities = await Activity.find(query)
      .populate("userId", "name walletAddress avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("-__v");

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching global activity feed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch global activity feed",
      error: error.message,
    });
  }
});

// Delete activity (admin only)
router.delete("/:activityId", async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findByIdAndDelete(activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.json({
      success: true,
      message: "Activity deleted successfully",
      data: { id: activityId },
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete activity",
      error: error.message,
    });
  }
});

// Get activities by type
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const validTypes = ["challenge", "workout", "badge", "token_claim"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid activity type. Valid types: ${validTypes.join(", ")}`,
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await Activity.find({ type })
      .populate("userId", "name walletAddress avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Activity.countDocuments({ type });

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching activities by type:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities by type",
      error: error.message,
    });
  }
});

module.exports = router;
