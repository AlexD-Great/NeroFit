// MongoDB initialization script
// This script runs when the MongoDB Docker container starts

print("🚀 Initializing NeroFit database...");

// Switch to the nerofit database
db = db.getSiblingDB("nerofit");

// Create collections if they don't exist
db.createCollection("users");
db.createCollection("userstats");
db.createCollection("challenges");
db.createCollection("userchallenges");
db.createCollection("activities");
db.createCollection("tokentransactions");
db.createCollection("badges");
db.createCollection("userbadges");
db.createCollection("streaks");

// Create indexes for better performance
print("📊 Creating indexes...");

// Users collection indexes
db.users.createIndex({ walletAddress: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true, sparse: true });
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });

// UserStats collection indexes
db.userstats.createIndex({ userId: 1 }, { unique: true });
db.userstats.createIndex({ totalTokens: -1 });
db.userstats.createIndex({ challengesCompleted: -1 });
db.userstats.createIndex({ currentStreak: -1 });

// Challenges collection indexes
db.challenges.createIndex({ category: 1 });
db.challenges.createIndex({ difficulty: 1 });
db.challenges.createIndex({ isActive: 1 });
db.challenges.createIndex({ reward: -1 });

// UserChallenges collection indexes
db.userchallenges.createIndex({ userId: 1, challengeId: 1 }, { unique: true });
db.userchallenges.createIndex({ userId: 1, completed: 1 });
db.userchallenges.createIndex({ completedAt: -1 });
db.userchallenges.createIndex({ claimed: 1 });

// Activities collection indexes
db.activities.createIndex({ userId: 1 });
db.activities.createIndex({ type: 1 });
db.activities.createIndex({ createdAt: -1 });
db.activities.createIndex({ userId: 1, createdAt: -1 });

// TokenTransactions collection indexes
db.tokentransactions.createIndex({ userId: 1 });
db.tokentransactions.createIndex({ type: 1 });
db.tokentransactions.createIndex({ createdAt: -1 });
db.tokentransactions.createIndex({ status: 1 });

// Badges collection indexes
db.badges.createIndex({ isActive: 1 });
db.badges.createIndex({ reward: -1 });

// UserBadges collection indexes
db.userbadges.createIndex({ userId: 1, badgeId: 1 }, { unique: true });
db.userbadges.createIndex({ userId: 1 });
db.userbadges.createIndex({ awardedAt: -1 });

// Streaks collection indexes
db.streaks.createIndex({ userId: 1 }, { unique: true });
db.streaks.createIndex({ currentStreak: -1 });
db.streaks.createIndex({ longestStreak: -1 });

print("✅ Database initialization completed!");
print(
  "📊 Collections created: users, userstats, challenges, userchallenges, activities, tokentransactions, badges, userbadges, streaks"
);
print("🔍 Indexes created for optimal performance");
print("🎉 NeroFit database is ready for use!");
