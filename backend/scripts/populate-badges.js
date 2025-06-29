const mongoose = require("mongoose");
require("dotenv").config();

// Import the Badge model
const { Badge } = require("../src/model/schemas");

// Badge data for the achievement system
const badgesData = [
  // Streak badges
  {
    name: "First Steps",
    icon: "👣",
    description: "Complete your first challenge",
    criteria: "challengesCompleted >= 1",
    reward: 5,
    isActive: true,
  },
  {
    name: "Consistency King",
    icon: "🔥",
    description: "Maintain a 7-day streak",
    criteria: "currentStreak >= 7",
    reward: 10,
    isActive: true,
  },
  {
    name: "Streak Master",
    icon: "⚡",
    description: "Maintain a 30-day streak",
    criteria: "currentStreak >= 30",
    reward: 25,
    isActive: true,
  },
  {
    name: "Unstoppable",
    icon: "🏆",
    description: "Maintain a 100-day streak",
    criteria: "currentStreak >= 100",
    reward: 50,
    isActive: true,
  },

  // Challenge completion badges
  {
    name: "Challenge Novice",
    icon: "🌟",
    description: "Complete 10 challenges",
    criteria: "challengesCompleted >= 10",
    reward: 15,
    isActive: true,
  },
  {
    name: "Challenge Warrior",
    icon: "⚔️",
    description: "Complete 50 challenges",
    criteria: "challengesCompleted >= 50",
    reward: 30,
    isActive: true,
  },
  {
    name: "Challenge Master",
    icon: "👑",
    description: "Complete 100 challenges",
    criteria: "challengesCompleted >= 100",
    reward: 60,
    isActive: true,
  },
  {
    name: "Challenge Legend",
    icon: "💎",
    description: "Complete 500 challenges",
    criteria: "challengesCompleted >= 500",
    reward: 150,
    isActive: true,
  },

  // Token earning badges
  {
    name: "Token Collector",
    icon: "🪙",
    description: "Earn 100 tokens",
    criteria: "totalTokens >= 100",
    reward: 10,
    isActive: true,
  },
  {
    name: "Token Hoarder",
    icon: "💰",
    description: "Earn 500 tokens",
    criteria: "totalTokens >= 500",
    reward: 25,
    isActive: true,
  },
  {
    name: "Token Millionaire",
    icon: "💎",
    description: "Earn 1000 tokens",
    criteria: "totalTokens >= 1000",
    reward: 50,
    isActive: true,
  },
  {
    name: "Token Billionaire",
    icon: "🏦",
    description: "Earn 5000 tokens",
    criteria: "totalTokens >= 5000",
    reward: 200,
    isActive: true,
  },

  // Weekly workout badges
  {
    name: "Weekly Warrior",
    icon: "📅",
    description: "Complete 3 workouts in a week",
    criteria: "weeklyWorkouts >= 3",
    reward: 15,
    isActive: true,
  },
  {
    name: "Weekly Champion",
    icon: "🏅",
    description: "Complete 5 workouts in a week",
    criteria: "weeklyWorkouts >= 5",
    reward: 25,
    isActive: true,
  },
  {
    name: "Weekly Legend",
    icon: "🏆",
    description: "Complete 7 workouts in a week",
    criteria: "weeklyWorkouts >= 7",
    reward: 40,
    isActive: true,
  },

  // Distance badges
  {
    name: "Distance Runner",
    icon: "🏃‍♂️",
    description: "Cover 50km total distance",
    criteria: "totalDistance >= 50",
    reward: 20,
    isActive: true,
  },
  {
    name: "Marathon Runner",
    icon: "🏃‍♀️",
    description: "Cover 100km total distance",
    criteria: "totalDistance >= 100",
    reward: 35,
    isActive: true,
  },
  {
    name: "Ultra Runner",
    icon: "🏃",
    description: "Cover 500km total distance",
    criteria: "totalDistance >= 500",
    reward: 75,
    isActive: true,
  },

  // Time badges
  {
    name: "Time Keeper",
    icon: "⏰",
    description: "Spend 10 hours exercising",
    criteria: "totalMinutes >= 600",
    reward: 15,
    isActive: true,
  },
  {
    name: "Time Master",
    icon: "⌛",
    description: "Spend 50 hours exercising",
    criteria: "totalMinutes >= 3000",
    reward: 30,
    isActive: true,
  },
  {
    name: "Time Legend",
    icon: "🕰️",
    description: "Spend 100 hours exercising",
    criteria: "totalMinutes >= 6000",
    reward: 60,
    isActive: true,
  },

  // Special achievement badges
  {
    name: "Early Bird",
    icon: "🌅",
    description: "Complete a challenge before 8 AM",
    criteria: "earlyBirdChallenge",
    reward: 10,
    isActive: true,
  },
  {
    name: "Night Owl",
    icon: "🦉",
    description: "Complete a challenge after 10 PM",
    criteria: "nightOwlChallenge",
    reward: 10,
    isActive: true,
  },
  {
    name: "Weekend Warrior",
    icon: "🎉",
    description: "Complete challenges on 3 consecutive weekends",
    criteria: "weekendWarrior",
    reward: 20,
    isActive: true,
  },
  {
    name: "Social Butterfly",
    icon: "🦋",
    description: "Share 5 challenge completions",
    criteria: "sharedChallenges >= 5",
    reward: 15,
    isActive: true,
  },
  {
    name: "Motivator",
    icon: "📢",
    description: "Inspire 10 other users",
    criteria: "inspiredUsers >= 10",
    reward: 25,
    isActive: true,
  },

  // Category-specific badges
  {
    name: "Cardio King",
    icon: "❤️",
    description: "Complete 25 cardio challenges",
    criteria: "cardioChallenges >= 25",
    reward: 20,
    isActive: true,
  },
  {
    name: "Strength Beast",
    icon: "💪",
    description: "Complete 25 strength challenges",
    criteria: "strengthChallenges >= 25",
    reward: 20,
    isActive: true,
  },
  {
    name: "Wellness Guru",
    icon: "🧘‍♀️",
    description: "Complete 25 wellness challenges",
    criteria: "wellnessChallenges >= 25",
    reward: 20,
    isActive: true,
  },
  {
    name: "Endurance Master",
    icon: "🏃‍♂️",
    description: "Complete 25 endurance challenges",
    criteria: "enduranceChallenges >= 25",
    reward: 20,
    isActive: true,
  },

  // Milestone badges
  {
    name: "First Week",
    icon: "📅",
    description: "Complete your first week of challenges",
    criteria: "firstWeekCompleted",
    reward: 10,
    isActive: true,
  },
  {
    name: "First Month",
    icon: "📆",
    description: "Complete your first month of challenges",
    criteria: "firstMonthCompleted",
    reward: 25,
    isActive: true,
  },
  {
    name: "First Year",
    icon: "🎊",
    description: "Complete your first year of challenges",
    criteria: "firstYearCompleted",
    reward: 100,
    isActive: true,
  },

  // Special event badges
  {
    name: "New Year Resolution",
    icon: "🎆",
    description: "Complete a challenge on New Year's Day",
    criteria: "newYearChallenge",
    reward: 15,
    isActive: true,
  },
  {
    name: "Birthday Challenge",
    icon: "🎂",
    description: "Complete a challenge on your birthday",
    criteria: "birthdayChallenge",
    reward: 20,
    isActive: true,
  },
  {
    name: "Holiday Hero",
    icon: "🎄",
    description: "Complete challenges during holidays",
    criteria: "holidayChallenges >= 5",
    reward: 30,
    isActive: true,
  },
];

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

// Clear existing badges
async function clearBadges() {
  try {
    const result = await Badge.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} existing badges`);
  } catch (error) {
    console.error("❌ Error clearing badges:", error);
    throw error;
  }
}

// Insert badges
async function insertBadges() {
  try {
    const badges = badgesData.map((badge) => new Badge(badge));
    const result = await Badge.insertMany(badges);
    console.log(`✅ Successfully inserted ${result.length} badges`);
    return result;
  } catch (error) {
    console.error("❌ Error inserting badges:", error);
    throw error;
  }
}

// Display badge statistics
async function displayStats() {
  try {
    const totalBadges = await Badge.countDocuments();
    const activeBadges = await Badge.countDocuments({ isActive: true });

    const rewardStats = await Badge.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$reward" },
          avg: { $avg: "$reward" },
        },
      },
    ]);

    console.log("\n🏆 Badge Statistics:");
    console.log(`Total Badges: ${totalBadges}`);
    console.log(`Active Badges: ${activeBadges}`);
    console.log(`Total Reward Pool: ${rewardStats[0]?.total || 0} tokens`);
    console.log(
      `Average Reward: ${Math.round(rewardStats[0]?.avg || 0)} tokens`
    );

    // Group by reward ranges
    const rewardRanges = await Badge.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ["$reward", 10] }, then: "1-9 tokens" },
                { case: { $lt: ["$reward", 25] }, then: "10-24 tokens" },
                { case: { $lt: ["$reward", 50] }, then: "25-49 tokens" },
                { case: { $lt: ["$reward", 100] }, then: "50-99 tokens" },
              ],
              default: "100+ tokens",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("\n💰 Reward Distribution:");
    rewardRanges.forEach((range) => {
      console.log(`  ${range._id}: ${range.count} badges`);
    });
  } catch (error) {
    console.error("❌ Error displaying stats:", error);
  }
}

// Display sample badges
async function displaySampleBadges() {
  try {
    const samples = await Badge.find()
      .limit(10)
      .select("name icon description reward criteria");
    console.log("\n🎯 Sample Badges:");
    samples.forEach((badge, index) => {
      console.log(
        `${index + 1}. ${badge.icon} ${badge.name} - ${badge.reward} tokens`
      );
      console.log(`   ${badge.description}`);
      console.log(`   Criteria: ${badge.criteria}\n`);
    });
  } catch (error) {
    console.error("❌ Error displaying sample badges:", error);
  }
}

// Main function
async function populateBadges() {
  console.log("🚀 Starting badge population script...\n");

  try {
    // Connect to database
    await connectToDatabase();

    // Clear existing badges
    await clearBadges();

    // Insert new badges
    await insertBadges();

    // Display statistics
    await displayStats();

    // Display sample badges
    await displaySampleBadges();

    console.log("\n✅ Badge population completed successfully!");
  } catch (error) {
    console.error("❌ Error in badge population:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
if (require.main === module) {
  populateBadges();
}

module.exports = {
  populateBadges,
  badgesData,
};
