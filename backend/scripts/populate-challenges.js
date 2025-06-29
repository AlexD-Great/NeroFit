const mongoose = require("mongoose");
require("dotenv").config();

// Import the Challenge model
const { Challenge } = require("../src/model/schemas");

// Challenge data based on the mock data
const challengesData = [
  {
    title: "Walk 1km",
    description: "Take a 1 kilometer walk today",
    reward: 10,
    difficulty: "Easy",
    category: "Cardio",
    icon: "🚶‍♂️",
    estimatedTime: "10-15 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Run 3km",
    description: "Complete a 3 kilometer run",
    reward: 25,
    difficulty: "Medium",
    category: "Cardio",
    icon: "🏃‍♂️",
    estimatedTime: "15-25 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Drink 8 Glasses of Water",
    description: "Stay hydrated throughout the day",
    reward: 15,
    difficulty: "Easy",
    category: "Wellness",
    icon: "💧",
    estimatedTime: "Throughout the day",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "30-Minute Workout",
    description: "Complete a 30-minute strength training session",
    reward: 30,
    difficulty: "Medium",
    category: "Strength",
    icon: "💪",
    estimatedTime: "30 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "10,000 Steps",
    description: "Reach 10,000 steps today",
    reward: 20,
    difficulty: "Medium",
    category: "Cardio",
    icon: "👟",
    estimatedTime: "Throughout the day",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "15-Minute Meditation",
    description: "Practice mindfulness for 15 minutes",
    reward: 12,
    difficulty: "Easy",
    category: "Wellness",
    icon: "🧘‍♀️",
    estimatedTime: "15 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "20-Minute Yoga",
    description: "Complete a relaxing yoga session",
    reward: 16,
    difficulty: "Easy",
    category: "Wellness",
    icon: "🧘‍♀️",
    estimatedTime: "20 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "50 Push-ups",
    description: "Complete 50 push-ups in sets",
    reward: 18,
    difficulty: "Medium",
    category: "Strength",
    icon: "💪",
    estimatedTime: "10-15 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Cycle 5km",
    description: "Complete a 5 kilometer bike ride",
    reward: 22,
    difficulty: "Medium",
    category: "Cardio",
    icon: "🚴‍♂️",
    estimatedTime: "20-30 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Plank for 2 Minutes",
    description: "Hold a plank position for 2 minutes",
    reward: 14,
    difficulty: "Medium",
    category: "Strength",
    icon: "🏋️‍♂️",
    estimatedTime: "5 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  // Additional challenges for variety
  {
    title: "Squat Challenge",
    description: "Complete 100 bodyweight squats",
    reward: 20,
    difficulty: "Medium",
    category: "Strength",
    icon: "🏋️‍♀️",
    estimatedTime: "15-20 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Burpee Challenge",
    description: "Complete 30 burpees",
    reward: 25,
    difficulty: "Hard",
    category: "Cardio",
    icon: "⚡",
    estimatedTime: "10-15 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Mountain Climbers",
    description: "Complete 50 mountain climbers",
    reward: 16,
    difficulty: "Medium",
    category: "Cardio",
    icon: "🏔️",
    estimatedTime: "8-12 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Jump Rope",
    description: "Jump rope for 10 minutes",
    reward: 18,
    difficulty: "Medium",
    category: "Cardio",
    icon: "⏰",
    estimatedTime: "10 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Lunges",
    description: "Complete 40 walking lunges",
    reward: 16,
    difficulty: "Medium",
    category: "Strength",
    icon: "🚶‍♀️",
    estimatedTime: "12-15 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Wall Sit",
    description: "Hold a wall sit for 3 minutes",
    reward: 12,
    difficulty: "Medium",
    category: "Strength",
    icon: "🧱",
    estimatedTime: "5 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Stretching Session",
    description: "Complete a 20-minute stretching routine",
    reward: 14,
    difficulty: "Easy",
    category: "Wellness",
    icon: "🤸‍♀️",
    estimatedTime: "20 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Deep Breathing",
    description: "Practice deep breathing for 10 minutes",
    reward: 10,
    difficulty: "Easy",
    category: "Wellness",
    icon: "🫁",
    estimatedTime: "10 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Cold Shower",
    description: "Take a 2-minute cold shower",
    reward: 15,
    difficulty: "Hard",
    category: "Wellness",
    icon: "🚿",
    estimatedTime: "5 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Gratitude Journal",
    description: "Write down 3 things you are grateful for",
    reward: 8,
    difficulty: "Easy",
    category: "Wellness",
    icon: "📝",
    estimatedTime: "5 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "High Knees",
    description: "Complete 100 high knees",
    reward: 14,
    difficulty: "Medium",
    category: "Cardio",
    icon: "🦵",
    estimatedTime: "8-10 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Tricep Dips",
    description: "Complete 30 tricep dips",
    reward: 16,
    difficulty: "Medium",
    category: "Strength",
    icon: "💪",
    estimatedTime: "10-12 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Side Plank",
    description: "Hold side plank for 1 minute each side",
    reward: 12,
    difficulty: "Medium",
    category: "Strength",
    icon: "⚖️",
    estimatedTime: "5 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Jumping Jacks",
    description: "Complete 50 jumping jacks",
    reward: 12,
    difficulty: "Easy",
    category: "Cardio",
    icon: "🌟",
    estimatedTime: "5-8 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
  },
  {
    title: "Arm Circles",
    description: "Complete 50 arm circles forward and backward",
    reward: 8,
    difficulty: "Easy",
    category: "Strength",
    icon: "🌀",
    estimatedTime: "5 minutes",
    timeLimit: "24 hours",
    dailyLimit: 1,
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

// Clear existing challenges
async function clearChallenges() {
  try {
    const result = await Challenge.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} existing challenges`);
  } catch (error) {
    console.error("❌ Error clearing challenges:", error);
    throw error;
  }
}

// Insert challenges
async function insertChallenges() {
  try {
    const challenges = challengesData.map(
      (challenge) => new Challenge(challenge)
    );
    const result = await Challenge.insertMany(challenges);
    console.log(`✅ Successfully inserted ${result.length} challenges`);
    return result;
  } catch (error) {
    console.error("❌ Error inserting challenges:", error);
    throw error;
  }
}

// Display challenge statistics
async function displayStats() {
  try {
    const totalChallenges = await Challenge.countDocuments();
    const categoryStats = await Challenge.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const difficultyStats = await Challenge.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]);

    console.log("\n📊 Challenge Statistics:");
    console.log(`Total Challenges: ${totalChallenges}`);

    console.log("\n📈 By Category:");
    categoryStats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count} challenges`);
    });

    console.log("\n📊 By Difficulty:");
    difficultyStats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count} challenges`);
    });

    const totalReward = await Challenge.aggregate([
      { $group: { _id: null, total: { $sum: "$reward" } } },
    ]);
    console.log(`\n💰 Total Reward Pool: ${totalReward[0]?.total || 0} tokens`);
  } catch (error) {
    console.error("❌ Error displaying stats:", error);
  }
}

// Display sample challenges
async function displaySampleChallenges() {
  try {
    const samples = await Challenge.find()
      .limit(5)
      .select("title category difficulty reward");
    console.log("\n🎯 Sample Challenges:");
    samples.forEach((challenge, index) => {
      console.log(
        `${index + 1}. ${challenge.title} (${challenge.category}, ${
          challenge.difficulty
        }) - ${challenge.reward} tokens`
      );
    });
  } catch (error) {
    console.error("❌ Error displaying sample challenges:", error);
  }
}

// Main function
async function populateChallenges() {
  console.log("🚀 Starting challenge population script...\n");

  try {
    // Connect to database
    await connectToDatabase();

    // Clear existing challenges
    await clearChallenges();

    // Insert new challenges
    await insertChallenges();

    // Display statistics
    await displayStats();

    // Display sample challenges
    await displaySampleChallenges();

    console.log("\n✅ Challenge population completed successfully!");
  } catch (error) {
    console.error("❌ Error in challenge population:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
if (require.main === module) {
  populateChallenges();
}

module.exports = {
  populateChallenges,
  challengesData,
};
