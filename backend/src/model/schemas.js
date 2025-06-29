const mongoose = require("mongoose");

// User Schema - Main user profile
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${this.name}&background=8b5cf6&color=fff&size=40`;
      },
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// User Stats Schema - User's fitness statistics
const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    challengesCompleted: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    weeklyWorkouts: {
      type: Number,
      default: 0,
    },
    totalDistance: {
      type: Number,
      default: 0,
    },
    totalMinutes: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
    claimableTokens: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: String,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Challenge Schema - Available challenges
const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reward: {
      type: Number,
      required: true,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Cardio", "Strength", "Wellness", "Endurance"],
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dailyLimit: {
      type: Number,
      default: 1, // How many times per day this challenge can be completed
    },
  },
  {
    timestamps: true,
  }
);

// User Challenge Progress Schema - User's progress on specific challenges
const userChallengeProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    claimed: {
      type: Boolean,
      default: false,
    },
    claimedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for user challenge progress
userChallengeProgressSchema.index({ userId: 1, challengeId: 1, expiresAt: 1 });

// Activity Schema - User's activity history
const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["challenge", "workout", "badge", "token_claim"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reward: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Token Transaction Schema - Track token transactions
const tokenTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["earned", "claimed", "spent", "bonus"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
    },
    transactionHash: {
      type: String, // For blockchain transactions
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Badge Schema - Available badges
const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    criteria: {
      type: String,
      required: true,
    },
    reward: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// User Badge Schema - User's earned badges
const userBadgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for user badges
userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

// Streak Schema - Track user streaks
const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
    },
    streakHistory: [
      {
        startDate: Date,
        endDate: Date,
        duration: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the models
const User = mongoose.model("User", userSchema);
const UserStats = mongoose.model("UserStats", userStatsSchema);
const Challenge = mongoose.model("Challenge", challengeSchema);
const UserChallengeProgress = mongoose.model(
  "UserChallengeProgress",
  userChallengeProgressSchema
);
const Activity = mongoose.model("Activity", activitySchema);
const TokenTransaction = mongoose.model(
  "TokenTransaction",
  tokenTransactionSchema
);
const Badge = mongoose.model("Badge", badgeSchema);
const UserBadge = mongoose.model("UserBadge", userBadgeSchema);
const Streak = mongoose.model("Streak", streakSchema);

module.exports = {
  User,
  UserStats,
  Challenge,
  UserChallengeProgress,
  Activity,
  TokenTransaction,
  Badge,
  UserBadge,
  Streak,
};
