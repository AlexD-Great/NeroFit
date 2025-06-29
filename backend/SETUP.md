# NeroFit Backend Setup Guide

This guide will help you set up the NeroFit backend with MongoDB and populate it with initial data.

## Quick Start (Recommended)

### Option 1: Using Docker (Easiest)

1. **Start MongoDB with Docker:**

   ```bash
   cd backend
   docker-compose up -d mongodb
   ```

2. **Check if MongoDB is running:**

   ```bash
   npm run check:db
   ```

3. **Populate the database:**

   ```bash
   npm run populate:all
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Option 2: Using MongoDB Atlas (Cloud)

1. **Create a free MongoDB Atlas account:**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster
   - Get your connection string

2. **Set up environment variables:**

   ```bash
   # Create .env file in backend directory
   echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nerofit" > .env
   ```

3. **Check connection and populate:**
   ```bash
   npm run check:db
   npm run populate:all
   ```

### Option 3: Install MongoDB Locally

1. **Install MongoDB using Homebrew:**

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB service:**

   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

3. **Check and populate:**
   ```bash
   npm run check:db
   npm run populate:all
   ```

## Available Scripts

### Database Management

```bash
# Check MongoDB connection
npm run check:db

# Populate everything (challenges + badges)
npm run populate:all

# Populate only challenges
npm run populate:challenges

# Populate only badges
npm run populate:badges
```

### Development

```bash
# Start development server
npm run dev

# Start production server
npm start
```

## What Gets Populated

### Challenges (25+ items)

- **Cardio**: Running, walking, cycling, jumping rope
- **Strength**: Push-ups, squats, planks, lunges
- **Wellness**: Meditation, yoga, stretching, hydration
- **Endurance**: Longer duration activities

### Badges (40+ items)

- **Streak Badges**: For consistent activity
- **Completion Badges**: For reaching milestones
- **Token Badges**: For earning tokens
- **Time Badges**: For exercise time
- **Distance Badges**: For distance covered
- **Special Badges**: For unique achievements

## Database Structure

The database includes these collections:

- `users` - User profiles and wallet addresses
- `userstats` - User statistics and progress
- `challenges` - Available fitness challenges
- `userchallenges` - User progress on challenges
- `activities` - User activity feed
- `tokentransactions` - Token earning/spending history
- `badges` - Available achievement badges
- `userbadges` - User earned badges
- `streaks` - User streak tracking

## API Endpoints

After setup, you can access:

- **Challenges**: `GET /api/v1/challenges`
- **Badges**: `GET /api/v1/badges`
- **Users**: `GET /api/v1/users`
- **Statistics**: `GET /api/v1/challenges/stats`

## Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running:**

   ```bash
   npm run check:db
   ```

2. **If using Docker, check container status:**

   ```bash
   docker ps
   docker logs nerofit-mongodb
   ```

3. **If using local MongoDB, check service:**
   ```bash
   brew services list | grep mongodb
   ```

### Permission Issues

1. **Check file permissions:**

   ```bash
   ls -la scripts/
   ```

2. **Ensure Node.js can access the files:**
   ```bash
   chmod +x scripts/*.js
   ```

### Port Conflicts

If port 27017 is already in use:

1. **Find what's using the port:**

   ```bash
   lsof -i :27017
   ```

2. **Stop conflicting service or change MongoDB port in docker-compose.yml**

## Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nerofit

# Server Configuration
PORT=3001
NODE_ENV=development

# Blockchain Configuration (if needed)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
```

## Next Steps

After successful setup:

1. **Test the API:**

   ```bash
   curl http://localhost:3001/api/v1/challenges
   ```

2. **Start the frontend:**

   ```bash
   cd ../frontend
   npm run dev
   ```

3. **Connect frontend to backend:**
   - Update API base URL in frontend configuration
   - Test user registration and challenge completion

## Support

If you encounter issues:

1. Check the console output for error messages
2. Verify MongoDB connection with `npm run check:db`
3. Ensure all dependencies are installed with `npm install`
4. Review the API documentation in `API_DOCUMENTATION.md`
