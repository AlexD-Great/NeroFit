const express = require("express");
const router = express.Router();
const { User, UserStats } = require("../model/schemas");

// Get all users (for admin purposes)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// Get user by wallet address
router.get("/wallet/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await User.findOne({
      walletAddress: walletAddress.toLowerCase(),
      isActive: true,
    }).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, walletAddress } = req.body;

    if (!name || !email || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, walletAddress",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { walletAddress: walletAddress.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email or wallet address",
      });
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      walletAddress: walletAddress.toLowerCase(),
    });

    await user.save();

    // Create user stats
    const userStats = new UserStats({
      userId: user._id,
    });

    await userStats.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          walletAddress: user.walletAddress,
          avatar: user.avatar,
          joinedDate: user.joinedDate,
        },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
});

// Update user profile
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, avatar } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updateData, lastActive: new Date() },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
});

// Update user last active
router.patch("/:userId/active", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { lastActive: new Date() },
      { new: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User activity updated",
      data: { lastActive: user.lastActive },
    });
  } catch (error) {
    console.error("Error updating user activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user activity",
      error: error.message,
    });
  }
});

// Deactivate user (soft delete)
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deactivated successfully",
      data: { id: user._id, isActive: user.isActive },
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate user",
      error: error.message,
    });
  }
});

module.exports = router;
