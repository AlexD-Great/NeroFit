# Database Population Scripts

This directory contains scripts to populate the NeroFit database with initial data for challenges and badges.

## Prerequisites

1. **MongoDB**: Make sure MongoDB is running locally or you have access to a MongoDB instance
2. **Environment Variables**: Set up your `.env` file with the MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/nerofit
   ```
3. **Dependencies**: Install the required dependencies:
   ```bash
   npm install
   ```

## Available Scripts

### 1. Master Script (`populate-all.js`)

The main script that can populate everything or specific parts of the database.

**Usage:**

```bash
# Populate everything (challenges + badges)
node scripts/populate-all.js
node scripts/populate-all.js all

# Populate only challenges
node scripts/populate-all.js challenges

# Populate only badges
node scripts/populate-all.js badges
```

### 2. Challenge Population (`populate-challenges.js`)

Populates the database with fitness challenges.

**Features:**

- 25+ diverse fitness challenges
- Multiple categories: Cardio, Strength, Wellness, Endurance
- Different difficulty levels: Easy, Medium, Hard
- Balanced reward system (8-30 tokens per challenge)
- Realistic time estimates and descriptions

**Usage:**

```bash
node scripts/populate-challenges.js
```

**Challenge Categories:**

- **Cardio**: Running, walking, cycling, jumping rope, etc.
- **Strength**: Push-ups, squats, planks, lunges, etc.
- **Wellness**: Meditation, yoga, stretching, hydration, etc.
- **Endurance**: Longer duration activities

### 3. Badge Population (`populate-badges.js`)

Populates the database with achievement badges.

**Features:**

- 40+ achievement badges
- Multiple badge types: Streak, Completion, Token, Time, Distance
- Progressive difficulty and rewards
- Motivational criteria and descriptions

**Usage:**

```bash
node scripts/populate-badges.js
```

**Badge Types:**

- **Streak Badges**: For maintaining consistent activity
- **Completion Badges**: For reaching challenge milestones
- **Token Badges**: For earning specific token amounts
- **Time Badges**: For spending time exercising
- **Distance Badges**: For covering distance milestones
- **Special Badges**: For unique achievements and events

## What Gets Populated

### Challenges

Each challenge includes:

- Title and description
- Reward amount (tokens)
- Difficulty level
- Category
- Icon (emoji)
- Estimated completion time
- Time limit
- Daily completion limit

### Badges

Each badge includes:

- Name and description
- Icon (emoji)
- Achievement criteria
- Reward amount
- Active status

## Database Statistics

After running the scripts, you'll see statistics including:

- Total number of challenges and badges
- Distribution by category and difficulty
- Total reward pools
- Sample entries

## Safety Features

- **Clear Existing Data**: Scripts clear existing data before inserting new data
- **Error Handling**: Comprehensive error handling with detailed messages
- **Database Connection**: Proper connection management
- **Validation**: Data validation through Mongoose schemas

## Customization

### Adding New Challenges

Edit `populate-challenges.js` and add new challenge objects to the `challengesData` array:

```javascript
{
  title: 'Your Challenge',
  description: 'Challenge description',
  reward: 15,
  difficulty: 'Medium',
  category: 'Cardio',
  icon: '🏃‍♂️',
  estimatedTime: '20 minutes',
  timeLimit: '24 hours',
  dailyLimit: 1
}
```

### Adding New Badges

Edit `populate-badges.js` and add new badge objects to the `badgesData` array:

```javascript
{
  name: 'Your Badge',
  icon: '🏆',
  description: 'Badge description',
  criteria: 'yourCriteria >= 10',
  reward: 20,
  isActive: true
}
```

## Running in Production

For production environments:

1. **Backup**: Always backup your database before running population scripts
2. **Environment**: Use proper MongoDB connection strings
3. **Validation**: Test scripts in a staging environment first
4. **Monitoring**: Monitor the script execution and database performance

## Troubleshooting

### Common Issues

1. **Connection Error**: Check your MongoDB connection string and ensure MongoDB is running
2. **Schema Error**: Ensure all required fields are provided in the data
3. **Permission Error**: Check database user permissions
4. **Memory Error**: For large datasets, consider running scripts in smaller batches

### Debug Mode

Add debug logging by setting the environment variable:

```bash
DEBUG=true node scripts/populate-all.js
```

## API Integration

After populating the database, you can use the REST API endpoints:

- **Challenges**: `GET /api/v1/challenges`
- **Badges**: `GET /api/v1/badges`
- **Statistics**: `GET /api/v1/challenges/stats`

## Support

For issues or questions:

1. Check the console output for error messages
2. Verify your MongoDB connection
3. Ensure all dependencies are installed
4. Review the API documentation in `API_DOCUMENTATION.md`
