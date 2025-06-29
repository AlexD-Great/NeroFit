require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const connectWalletRoute = require("./routes/connect-wallet");
const userDataRoute = require("./routes/user-data");
const claimTokensRoute = require("./routes/claim-tokens");
const challengesRoute = require("./routes/challenges");

// Import new comprehensive routes
const usersRoute = require("./routes/users");
const userStatsRoute = require("./routes/user-stats");
const challengesNewRoute = require("./routes/challenges-new");
const activitiesRoute = require("./routes/activities");
const tokenTransactionsRoute = require("./routes/token-transactions");
const badgesRoute = require("./routes/badges");
const streaksRoute = require("./routes/streaks");

const app = express();
// Ensure PORT is properly read from environment
const PORT = parseInt(process.env.PORT) || 3001;
console.log(`Using PORT: ${PORT} (from env: ${process.env.PORT})`);

// Middleware
app.use(
  cors({
    origin: [
      "https://nero-fit-alexs-projects-d94d3fc6.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Legacy routes (for backward compatibility)
app.use("/api/connect-wallet", connectWalletRoute);
app.use("/api/user-data", userDataRoute);
app.use("/api/claim-tokens", claimTokensRoute);
app.use("/api/challenges", challengesRoute);

// New comprehensive routes
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/user-stats", userStatsRoute);
app.use("/api/v1/challenges", challengesNewRoute);
app.use("/api/v1/activities", activitiesRoute);
app.use("/api/v1/token-transactions", tokenTransactionsRoute);
app.use("/api/v1/badges", badgesRoute);
app.use("/api/v1/streaks", streaksRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API documentation endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    message: "NeroFit API Documentation",
    version: "1.0.0",
    endpoints: {
      // Legacy endpoints
      legacy: {
        connectWallet: "/api/connect-wallet",
        userData: "/api/user-data/:walletAddress",
        claimTokens: "/api/claim-tokens",
        challenges: "/api/challenges",
      },
      // New comprehensive endpoints
      v1: {
        users: {
          base: "/api/v1/users",
          endpoints: [
            "GET / - Get all users",
            "GET /wallet/:walletAddress - Get user by wallet",
            "GET /:userId - Get user by ID",
            "POST /register - Register new user",
            "PUT /:userId - Update user profile",
            "PATCH /:userId/active - Update last active",
            "DELETE /:userId - Deactivate user",
          ],
        },
        userStats: {
          base: "/api/v1/user-stats",
          endpoints: [
            "GET /user/:userId - Get user stats",
            "GET /wallet/:walletAddress - Get stats by wallet",
            "PUT /user/:userId - Update user stats",
            "PATCH /user/:userId/increment - Increment specific stat",
            "GET /leaderboard - Get leaderboard",
            "GET /user/:userId/rank - Get user rank",
          ],
        },
        challenges: {
          base: "/api/v1/challenges",
          endpoints: [
            "GET / - Get all challenges",
            "GET /:challengeId - Get challenge by ID",
            "POST / - Create new challenge",
            "PUT /:challengeId - Update challenge",
            "DELETE /:challengeId - Deactivate challenge",
            "GET /user/:userId - Get user challenges",
            "POST /user/:userId/start/:challengeId - Start challenge",
            "PATCH /user/:userId/progress/:challengeId - Update progress",
            "POST /user/:userId/complete/:challengeId - Complete challenge",
            "GET /stats/overview - Get challenge statistics",
          ],
        },
        activities: {
          base: "/api/v1/activities",
          endpoints: [
            "GET /user/:userId - Get user activities",
            "GET /:activityId - Get activity by ID",
            "POST / - Create new activity",
            "GET /recent/:userId - Get recent activities",
            "GET /user/:userId/stats - Get activity stats",
            "GET /global/feed - Get global activity feed",
            "GET /type/:type - Get activities by type",
          ],
        },
        tokenTransactions: {
          base: "/api/v1/token-transactions",
          endpoints: [
            "GET /user/:userId - Get user transactions",
            "POST /earn - Earn tokens",
            "POST /claim - Claim tokens",
          ],
        },
        badges: {
          base: "/api/v1/badges",
          endpoints: [
            "GET / - Get all badges",
            "GET /:badgeId - Get badge by ID",
            "POST / - Create new badge",
            "PUT /:badgeId - Update badge",
            "DELETE /:badgeId - Deactivate badge",
            "GET /user/:userId - Get user badges",
            "POST /award - Award badge to user",
            "DELETE /user/:userId/badge/:badgeId - Remove badge",
            "GET /stats/overview - Get badge statistics",
            "POST /check-qualifications/:userId - Check badge qualifications",
          ],
        },
        streaks: {
          base: "/api/v1/streaks",
          endpoints: [
            "GET /user/:userId - Get user streak",
            "POST /update/:userId - Update user streak",
            "POST /reset/:userId - Reset user streak",
            "GET /stats/overview - Get streak statistics",
            "GET /leaderboard - Get streak leaderboard",
            "GET /user/:userId/history - Get streak history",
            "GET /user/:userId/risk-check - Check streak risk",
          ],
        },
      },
    },
    documentation: "https://github.com/AlexD-Great/nero_backend",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Connected to Nero testnet at ${process.env.NERO_TESTNET_RPC}`);
  console.log(`Using Paymaster at address ${process.env.PAYMASTER_ADDRESS}`);
  console.log(`API Documentation available at /api/docs`);
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Nero Fitness API is running",
    version: "1.0.0",
    endpoints: {
      legacy:
        "/api/connect-wallet, /api/user-data, /api/claim-tokens, /api/challenges",
      v1: "/api/v1/users, /api/v1/user-stats, /api/v1/challenges, /api/v1/activities, /api/v1/token-transactions, /api/v1/badges, /api/v1/streaks",
    },
    documentation: "/api/docs",
    github: "https://github.com/AlexD-Great/nero_backend",
  });
});
