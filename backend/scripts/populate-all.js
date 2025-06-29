const mongoose = require("mongoose");
require("dotenv").config();

// Import the population scripts
const { populateChallenges } = require("./populate-challenges");
const { populateBadges } = require("./populate-badges");

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/nerofit";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Display overall statistics
async function displayOverallStats() {
  try {
    const { Challenge, Badge } = require("../src/model/schemas");

    const totalChallenges = await Challenge.countDocuments();
    const totalBadges = await Badge.countDocuments();

    const challengeRewards = await Challenge.aggregate([
      { $group: { _id: null, total: { $sum: "$reward" } } },
    ]);

    const badgeRewards = await Badge.aggregate([
      { $group: { _id: null, total: { $sum: "$reward" } } },
    ]);

    console.log("\n🎯 Overall Database Statistics:");
    console.log("================================");
    console.log(`📊 Total Challenges: ${totalChallenges}`);
    console.log(`🏆 Total Badges: ${totalBadges}`);
    console.log(
      `💰 Total Challenge Rewards: ${challengeRewards[0]?.total || 0} tokens`
    );
    console.log(
      `🏅 Total Badge Rewards: ${badgeRewards[0]?.total || 0} tokens`
    );
    console.log(
      `💎 Total Reward Pool: ${
        (challengeRewards[0]?.total || 0) + (badgeRewards[0]?.total || 0)
      } tokens`
    );

    // Category breakdown for challenges
    const categoryStats = await Challenge.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalReward: { $sum: "$reward" },
        },
      },
    ]);

    console.log("\n📈 Challenge Categories:");
    categoryStats.forEach((stat) => {
      console.log(
        `  ${stat._id}: ${stat.count} challenges (${stat.totalReward} tokens)`
      );
    });

    // Difficulty breakdown for challenges
    const difficultyStats = await Challenge.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
          totalReward: { $sum: "$reward" },
        },
      },
    ]);

    console.log("\n📊 Challenge Difficulties:");
    difficultyStats.forEach((stat) => {
      console.log(
        `  ${stat._id}: ${stat.count} challenges (${stat.totalReward} tokens)`
      );
    });
  } catch (error) {
    console.error("❌ Error displaying overall stats:", error);
  }
}

// Main function
async function populateAll() {
  console.log("🚀 Starting complete database population...\n");
  console.log(
    "This will populate challenges and badges for the NeroFit application.\n"
  );

  try {
    // Connect to database
    await connectToDatabase();

    console.log("📋 Step 1: Populating Challenges...");
    console.log("====================================");

    // Clear and populate challenges
    const { Challenge } = require("../src/model/schemas");
    await Challenge.deleteMany({});

    // Import challenge data and insert directly
    const { challengesData } = require("./populate-challenges");
    const challenges = challengesData.map(
      (challenge) => new Challenge(challenge)
    );
    const challengeResult = await Challenge.insertMany(challenges);
    console.log(
      `✅ Successfully inserted ${challengeResult.length} challenges`
    );

    console.log("\n📋 Step 2: Populating Badges...");
    console.log("================================");

    // Clear and populate badges
    const { Badge } = require("../src/model/schemas");
    await Badge.deleteMany({});

    // Import badge data and insert directly
    const { badgesData } = require("./populate-badges");
    const badges = badgesData.map((badge) => new Badge(badge));
    const badgeResult = await Badge.insertMany(badges);
    console.log(`✅ Successfully inserted ${badgeResult.length} badges`);

    console.log("\n📋 Step 3: Final Statistics...");
    console.log("===============================");

    // Display overall statistics
    await displayOverallStats();

    console.log("\n✅ Complete database population finished successfully!");
    console.log("\n🎉 Your NeroFit database is now ready with:");
    console.log("   • A variety of fitness challenges");
    console.log("   • Achievement badges for motivation");
    console.log("   • Balanced reward system");
    console.log("   • Multiple difficulty levels");
    console.log("   • Different fitness categories");
  } catch (error) {
    console.error("❌ Error in complete population:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Function to run only challenges
async function populateChallengesOnly() {
  console.log("🚀 Starting challenge population only...\n");

  try {
    await connectToDatabase();

    const { Challenge } = require("../src/model/schemas");
    await Challenge.deleteMany({});

    const { challengesData } = require("./populate-challenges");
    const challenges = challengesData.map(
      (challenge) => new Challenge(challenge)
    );
    const result = await Challenge.insertMany(challenges);
    console.log(`✅ Successfully inserted ${result.length} challenges`);

    console.log("\n✅ Challenge population completed!");
  } catch (error) {
    console.error("❌ Error in challenge population:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Function to run only badges
async function populateBadgesOnly() {
  console.log("🚀 Starting badge population only...\n");

  try {
    await connectToDatabase();

    const { Badge } = require("../src/model/schemas");
    await Badge.deleteMany({});

    const { badgesData } = require("./populate-badges");
    const badges = badgesData.map((badge) => new Badge(badge));
    const result = await Badge.insertMany(badges);
    console.log(`✅ Successfully inserted ${result.length} badges`);

    console.log("\n✅ Badge population completed!");
  } catch (error) {
    console.error("❌ Error in badge population:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Run the appropriate function based on command
if (require.main === module) {
  switch (command) {
    case "challenges":
      populateChallengesOnly();
      break;
    case "badges":
      populateBadgesOnly();
      break;
    case "all":
    case undefined:
      populateAll();
      break;
    default:
      console.log("Usage:");
      console.log(
        "  node populate-all.js          - Populate everything (default)"
      );
      console.log("  node populate-all.js all      - Populate everything");
      console.log(
        "  node populate-all.js challenges - Populate challenges only"
      );
      console.log("  node populate-all.js badges   - Populate badges only");
      process.exit(1);
  }
}

module.exports = {
  populateAll,
  populateChallengesOnly,
  populateBadgesOnly,
};
