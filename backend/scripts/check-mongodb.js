const mongoose = require("mongoose");
require("dotenv").config();

async function checkMongoDB() {
  console.log("🔍 Checking MongoDB connection...\n");

  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/nerofit";
  console.log(`📡 Attempting to connect to: ${mongoUri}\n`);

  try {
    // Set a short timeout for quick check
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log("✅ MongoDB is running and accessible!");
    console.log("🎉 You can now run the population scripts.");

    // Test a simple operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Database contains ${collections.length} collections`);

    await mongoose.connection.close();
    console.log("🔌 Connection closed");
  } catch (error) {
    console.log("❌ MongoDB is not accessible");
    console.log("\n🔧 To fix this, you have several options:\n");

    console.log("Option 1: Install MongoDB locally");
    console.log("==================================");
    console.log("1. Install MongoDB using Homebrew:");
    console.log("   brew tap mongodb/brew");
    console.log("   brew install mongodb-community");
    console.log("");
    console.log("2. Start MongoDB service:");
    console.log("   brew services start mongodb/brew/mongodb-community");
    console.log("");
    console.log("3. Verify it's running:");
    console.log("   brew services list | grep mongodb");
    console.log("");

    console.log("Option 2: Use MongoDB Atlas (Cloud)");
    console.log("====================================");
    console.log("1. Go to https://www.mongodb.com/atlas");
    console.log("2. Create a free account and cluster");
    console.log("3. Get your connection string");
    console.log("4. Add to your .env file:");
    console.log(
      "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nerofit"
    );
    console.log("");

    console.log("Option 3: Use Docker");
    console.log("=====================");
    console.log("1. Install Docker Desktop");
    console.log("2. Run MongoDB container:");
    console.log("   docker run -d --name mongodb -p 27017:27017 mongo:latest");
    console.log("3. Or use docker-compose (create docker-compose.yml):");
    console.log('   version: "3.8"');
    console.log("   services:");
    console.log("     mongodb:");
    console.log("       image: mongo:latest");
    console.log("       ports:");
    console.log('         - "27017:27017"');
    console.log("       volumes:");
    console.log("         - mongodb_data:/data/db");
    console.log("   volumes:");
    console.log("     mongodb_data:");
    console.log("");

    console.log("Option 4: Use SQLite (Alternative)");
    console.log("===================================");
    console.log(
      "If you prefer not to use MongoDB, we can modify the app to use SQLite instead."
    );
    console.log("This would require changing the database configuration.");
    console.log("");

    console.log("🔍 Current Error Details:");
    console.log("==========================");
    console.log(error.message);

    if (error.message.includes("ECONNREFUSED")) {
      console.log(
        "\n💡 This error means MongoDB is not running on your system."
      );
      console.log("   Try one of the options above to get MongoDB running.");
    }

    process.exit(1);
  }
}

// Run the check
if (require.main === module) {
  checkMongoDB();
}

module.exports = { checkMongoDB };
