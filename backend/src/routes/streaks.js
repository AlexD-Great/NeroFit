const express = require('express');
const router = express.Router();
const { Streak, User, UserStats } = require('../model/schemas');

// Get user's streak information
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const streak = await Streak.findOne({ userId })
      .populate('userId', 'name walletAddress avatar')
      .select('-__v');
    
    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak not found'
      });
    }
    
    res.json({
      success: true,
      data: streak
    });
  } catch (error) {
    console.error('Error fetching user streak:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user streak',
      error: error.message
    });
  }
});

// Update user's streak (called when user completes activity)
router.post('/update/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { activityDate = new Date() } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    let streak = await Streak.findOne({ userId });
    
    if (!streak) {
      // Create new streak record
      streak = new Streak({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: activityDate
      });
    } else {
      const activityDateObj = new Date(activityDate);
      const lastActivityDateObj = new Date(streak.lastActivityDate);
      
      // Check if activity is on a different day
      const daysDifference = Math.floor(
        (activityDateObj - lastActivityDateObj) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDifference === 1) {
        // Consecutive day - increment streak
        streak.currentStreak += 1;
        streak.lastActivityDate = activityDate;
        
        // Update longest streak if current is longer
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
      } else if (daysDifference === 0) {
        // Same day - no change needed
        // Just update last activity time if it's later
        if (activityDateObj > lastActivityDateObj) {
          streak.lastActivityDate = activityDate;
        }
      } else {
        // Streak broken - reset to 1
        if (streak.currentStreak > 0) {
          // Add to streak history before resetting
          streak.streakHistory.push({
            startDate: new Date(streak.lastActivityDate.getTime() - (streak.currentStreak - 1) * 24 * 60 * 60 * 1000),
            endDate: streak.lastActivityDate,
            duration: streak.currentStreak
          });
        }
        
        streak.currentStreak = 1;
        streak.lastActivityDate = activityDate;
      }
    }
    
    await streak.save();
    
    // Update user stats
    await UserStats.findOneAndUpdate(
      { userId },
      { 
        currentStreak: streak.currentStreak,
        lastUpdated: new Date()
      }
    );
    
    await streak.populate('userId', 'name walletAddress avatar');
    
    res.json({
      success: true,
      message: 'Streak updated successfully',
      data: streak
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update streak',
      error: error.message
    });
  }
});

// Reset user's streak (admin only)
router.post('/reset/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let streak = await Streak.findOne({ userId });
    
    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak not found'
      });
    }
    
    // Add current streak to history if it exists
    if (streak.currentStreak > 0) {
      streak.streakHistory.push({
        startDate: new Date(streak.lastActivityDate.getTime() - (streak.currentStreak - 1) * 24 * 60 * 60 * 1000),
        endDate: streak.lastActivityDate,
        duration: streak.currentStreak
      });
    }
    
    // Reset streak
    streak.currentStreak = 0;
    streak.lastActivityDate = null;
    
    await streak.save();
    
    // Update user stats
    await UserStats.findOneAndUpdate(
      { userId },
      { 
        currentStreak: 0,
        lastUpdated: new Date()
      }
    );
    
    await streak.populate('userId', 'name walletAddress avatar');
    
    res.json({
      success: true,
      message: 'Streak reset successfully',
      data: streak
    });
  } catch (error) {
    console.error('Error resetting streak:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset streak',
      error: error.message
    });
  }
});

// Get streak statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalUsers = await Streak.countDocuments();
    const activeStreaks = await Streak.countDocuments({ currentStreak: { $gt: 0 } });
    
    const avgCurrentStreak = await Streak.aggregate([
      { $group: { _id: null, avg: { $avg: '$currentStreak' } } }
    ]);
    
    const avgLongestStreak = await Streak.aggregate([
      { $group: { _id: null, avg: { $avg: '$longestStreak' } } }
    ]);
    
    const topStreaks = await Streak.find()
      .populate('userId', 'name walletAddress avatar')
      .sort({ currentStreak: -1 })
      .limit(10)
      .select('currentStreak longestStreak userId');
    
    const streakRanges = await Streak.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$currentStreak', 7] }, then: '1-6 days' },
                { case: { $lt: ['$currentStreak', 30] }, then: '7-29 days' },
                { case: { $lt: ['$currentStreak', 100] }, then: '30-99 days' },
                { case: { $lt: ['$currentStreak', 365] }, then: '100-364 days' }
              ],
              default: '365+ days'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        activeStreaks,
        avgCurrentStreak: avgCurrentStreak[0]?.avg || 0,
        avgLongestStreak: avgLongestStreak[0]?.avg || 0,
        topStreaks,
        streakRanges
      }
    });
  } catch (error) {
    console.error('Error fetching streak stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch streak stats',
      error: error.message
    });
  }
});

// Get streak leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, type = 'current' } = req.query; // current or longest
    
    const sortField = type === 'longest' ? 'longestStreak' : 'currentStreak';
    
    const leaderboard = await Streak.find()
      .populate('userId', 'name walletAddress avatar')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit))
      .select(`currentStreak longestStreak userId ${sortField}`);
    
    // Add rank to each entry
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1
    }));
    
    res.json({
      success: true,
      data: {
        leaderboard: leaderboardWithRank,
        type
      }
    });
  } catch (error) {
    console.error('Error fetching streak leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch streak leaderboard',
      error: error.message
    });
  }
});

// Get user's streak history
router.get('/user/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    const streak = await Streak.findOne({ userId });
    
    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak not found'
      });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const history = streak.streakHistory
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
      .slice(skip, skip + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: streak.streakHistory.length,
          pages: Math.ceil(streak.streakHistory.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching streak history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch streak history',
      error: error.message
    });
  }
});

// Check if user's streak is at risk (for notifications)
router.get('/user/:userId/risk-check', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const streak = await Streak.findOne({ userId });
    
    if (!streak || streak.currentStreak === 0) {
      return res.json({
        success: true,
        data: {
          atRisk: false,
          message: 'No active streak'
        }
      });
    }
    
    const now = new Date();
    const lastActivity = new Date(streak.lastActivityDate);
    const hoursSinceLastActivity = (now - lastActivity) / (1000 * 60 * 60);
    
    // Consider at risk if more than 20 hours since last activity
    const atRisk = hoursSinceLastActivity > 20;
    
    res.json({
      success: true,
      data: {
        atRisk,
        currentStreak: streak.currentStreak,
        hoursSinceLastActivity: Math.floor(hoursSinceLastActivity),
        message: atRisk 
          ? `Your ${streak.currentStreak}-day streak is at risk! Complete an activity soon.`
          : 'Your streak is safe for now.'
      }
    });
  } catch (error) {
    console.error('Error checking streak risk:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check streak risk',
      error: error.message
    });
  }
});

module.exports = router; 