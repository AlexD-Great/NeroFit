# NeroFit API Documentation

## Overview

The NeroFit API is a comprehensive fitness application backend that supports user management, challenge tracking, token rewards, badges, streaks, and activity monitoring. The API is built with Node.js, Express, and MongoDB.

## Base URL

```
http://localhost:3001
```

## Authentication

Currently, the API uses wallet-based authentication. Users are identified by their wallet addresses.

## API Endpoints

### Users Management

#### Get All Users

```http
GET /api/v1/users
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "walletAddress": "0x1234...5678",
      "avatar": "https://ui-avatars.com/api/?name=John&background=8b5cf6&color=fff&size=40",
      "joinedDate": "2024-03-01T00:00:00.000Z",
      "lastActive": "2024-03-15T10:30:00.000Z",
      "isActive": true
    }
  ]
}
```

#### Get User by Wallet Address

```http
GET /api/v1/users/wallet/{walletAddress}
```

#### Get User by ID

```http
GET /api/v1/users/{userId}
```

#### Register New User

```http
POST /api/v1/users/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "walletAddress": "0x1234...5678"
}
```

#### Update User Profile

```http
PUT /api/v1/users/{userId}
```

**Request Body:**

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Update User Last Active

```http
PATCH /api/v1/users/{userId}/active
```

#### Deactivate User

```http
DELETE /api/v1/users/{userId}
```

### User Statistics

#### Get User Stats

```http
GET /api/v1/user-stats/user/{userId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "stats_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "walletAddress": "0x1234...5678",
      "avatar": "https://ui-avatars.com/api/?name=John&background=8b5cf6&color=fff&size=40"
    },
    "totalTokens": 150,
    "challengesCompleted": 12,
    "currentStreak": 5,
    "weeklyWorkouts": 3,
    "totalDistance": 25.5,
    "totalMinutes": 180,
    "rank": 8,
    "claimableTokens": 25,
    "badges": ["🔥", "💪", "🧘‍♀️"],
    "lastUpdated": "2024-03-15T10:30:00.000Z"
  }
}
```

#### Get User Stats by Wallet

```http
GET /api/v1/user-stats/wallet/{walletAddress}
```

#### Update User Stats

```http
PUT /api/v1/user-stats/user/{userId}
```

#### Increment Specific Stat

```http
PATCH /api/v1/user-stats/user/{userId}/increment
```

**Request Body:**

```json
{
  "field": "challengesCompleted",
  "amount": 1
}
```

#### Get Leaderboard

```http
GET /api/v1/user-stats/leaderboard?limit=10&sortBy=totalTokens
```

#### Get User Rank

```http
GET /api/v1/user-stats/user/{userId}/rank?sortBy=totalTokens
```

### Challenges

#### Get All Challenges

```http
GET /api/v1/challenges?category=Cardio&difficulty=Medium&limit=20
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "challenge_id",
      "title": "Run 3km",
      "description": "Complete a 3 kilometer run",
      "reward": 25,
      "difficulty": "Medium",
      "category": "Cardio",
      "icon": "🏃‍♂️",
      "estimatedTime": "15-25 minutes",
      "timeLimit": "24 hours",
      "isActive": true,
      "dailyLimit": 1
    }
  ]
}
```

#### Get Challenge by ID

```http
GET /api/v1/challenges/{challengeId}
```

#### Create New Challenge (Admin)

```http
POST /api/v1/challenges
```

**Request Body:**

```json
{
  "title": "New Challenge",
  "description": "Challenge description",
  "reward": 20,
  "difficulty": "Easy",
  "category": "Cardio",
  "icon": "🚶‍♂️",
  "estimatedTime": "10-15 minutes",
  "timeLimit": "24 hours",
  "dailyLimit": 1
}
```

#### Update Challenge (Admin)

```http
PUT /api/v1/challenges/{challengeId}
```

#### Deactivate Challenge (Admin)

```http
DELETE /api/v1/challenges/{challengeId}
```

#### Get User's Challenges

```http
GET /api/v1/challenges/user/{userId}?status=active
```

**Status options:** `all`, `active`, `completed`, `claimed`

#### Start a Challenge

```http
POST /api/v1/challenges/user/{userId}/start/{challengeId}
```

#### Update Challenge Progress

```http
PATCH /api/v1/challenges/user/{userId}/progress/{challengeId}
```

**Request Body:**

```json
{
  "progress": 75
}
```

#### Complete a Challenge

```http
POST /api/v1/challenges/user/{userId}/complete/{challengeId}
```

#### Get Challenge Statistics

```http
GET /api/v1/challenges/stats/overview
```

### Activities

#### Get User's Activities

```http
GET /api/v1/activities/user/{userId}?type=challenge&limit=20&page=1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "activity_id",
        "userId": {
          "_id": "user_id",
          "name": "John Doe",
          "walletAddress": "0x1234...5678",
          "avatar": "https://ui-avatars.com/api/?name=John&background=8b5cf6&color=fff&size=40"
        },
        "type": "challenge",
        "title": "Completed \"Run 3km\"",
        "description": "Cardio challenge completed",
        "reward": 25,
        "icon": "🏃‍♂️",
        "metadata": { "challengeId": "challenge_id" },
        "createdAt": "2024-03-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

#### Get Activity by ID

```http
GET /api/v1/activities/{activityId}
```

#### Create New Activity

```http
POST /api/v1/activities
```

**Request Body:**

```json
{
  "userId": "user_id",
  "type": "challenge",
  "title": "Completed Challenge",
  "description": "Challenge completed successfully",
  "reward": 25,
  "icon": "🏃‍♂️",
  "metadata": { "challengeId": "challenge_id" }
}
```

#### Get Recent Activities

```http
GET /api/v1/activities/recent/{userId}?limit=5
```

#### Get Activity Statistics

```http
GET /api/v1/activities/user/{userId}/stats?period=week
```

**Period options:** `all`, `week`, `month`, `year`

#### Get Global Activity Feed (Admin)

```http
GET /api/v1/activities/global/feed?limit=50&type=challenge
```

#### Get Activities by Type

```http
GET /api/v1/activities/type/{type}?limit=20&page=1
```

### Token Transactions

#### Get User's Transactions

```http
GET /api/v1/token-transactions/user/{userId}?type=earned&status=completed&limit=20&page=1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "transaction_id",
        "userId": {
          "_id": "user_id",
          "name": "John Doe",
          "walletAddress": "0x1234...5678",
          "avatar": "https://ui-avatars.com/api/?name=John&background=8b5cf6&color=fff&size=40"
        },
        "type": "earned",
        "amount": 25,
        "description": "Completed challenge reward",
        "challengeId": {
          "_id": "challenge_id",
          "title": "Run 3km",
          "category": "Cardio"
        },
        "transactionHash": "0xabc...def",
        "status": "completed",
        "createdAt": "2024-03-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

#### Earn Tokens

```http
POST /api/v1/token-transactions/earn
```

**Request Body:**

```json
{
  "userId": "user_id",
  "amount": 25,
  "description": "Challenge completion reward",
  "challengeId": "challenge_id",
  "transactionHash": "0xabc...def"
}
```

#### Claim Tokens

```http
POST /api/v1/token-transactions/claim
```

**Request Body:**

```json
{
  "userId": "user_id",
  "amount": 50,
  "description": "Token claim",
  "transactionHash": "0xabc...def"
}
```

### Badges

#### Get All Badges

```http
GET /api/v1/badges?limit=50
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "badge_id",
      "name": "Consistency King",
      "icon": "🔥",
      "description": "Maintained a 7-day streak",
      "criteria": "currentStreak >= 7",
      "reward": 10,
      "isActive": true
    }
  ]
}
```

#### Get Badge by ID

```http
GET /api/v1/badges/{badgeId}
```

#### Create New Badge (Admin)

```http
POST /api/v1/badges
```

**Request Body:**

```json
{
  "name": "New Badge",
  "icon": "🏆",
  "description": "Badge description",
  "criteria": "challengesCompleted >= 10",
  "reward": 15
}
```

#### Update Badge (Admin)

```http
PUT /api/v1/badges/{badgeId}
```

#### Deactivate Badge (Admin)

```http
DELETE /api/v1/badges/{badgeId}
```

#### Get User's Badges

```http
GET /api/v1/badges/user/{userId}
```

#### Award Badge to User

```http
POST /api/v1/badges/award
```

**Request Body:**

```json
{
  "userId": "user_id",
  "badgeId": "badge_id"
}
```

#### Remove Badge from User (Admin)

```http
DELETE /api/v1/badges/user/{userId}/badge/{badgeId}
```

#### Get Badge Statistics

```http
GET /api/v1/badges/stats/overview
```

#### Check Badge Qualifications

```http
POST /api/v1/badges/check-qualifications/{userId}
```

### Streaks

#### Get User's Streak

```http
GET /api/v1/streaks/user/{userId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "streak_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "walletAddress": "0x1234...5678",
      "avatar": "https://ui-avatars.com/api/?name=John&background=8b5cf6&color=fff&size=40"
    },
    "currentStreak": 5,
    "longestStreak": 12,
    "lastActivityDate": "2024-03-15T00:00:00.000Z",
    "streakHistory": [
      {
        "startDate": "2024-03-01T00:00:00.000Z",
        "endDate": "2024-03-07T00:00:00.000Z",
        "duration": 7
      }
    ]
  }
}
```

#### Update User's Streak

```http
POST /api/v1/streaks/update/{userId}
```

**Request Body:**

```json
{
  "activityDate": "2024-03-15T10:30:00.000Z"
}
```

#### Reset User's Streak (Admin)

```http
POST /api/v1/streaks/reset/{userId}
```

#### Get Streak Statistics

```http
GET /api/v1/streaks/stats/overview
```

#### Get Streak Leaderboard

```http
GET /api/v1/streaks/leaderboard?limit=10&type=current
```

**Type options:** `current`, `longest`

#### Get User's Streak History

```http
GET /api/v1/streaks/user/{userId}/history?limit=20&page=1
```

#### Check Streak Risk

```http
GET /api/v1/streaks/user/{userId}/risk-check
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Data Types

### Challenge Categories

- `Cardio`
- `Strength`
- `Wellness`
- `Endurance`

### Challenge Difficulties

- `Easy`
- `Medium`
- `Hard`

### Activity Types

- `challenge`
- `workout`
- `badge`
- `token_claim`

### Transaction Types

- `earned`
- `claimed`
- `spent`
- `bonus`

### Transaction Status

- `pending`
- `completed`
- `failed`

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

The API supports CORS with the following origins:

- `https://nero-fit-alexs-projects-d94d3fc6.vercel.app`
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:3002`

## Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "ok"
}
```

## API Documentation

```http
GET /api/docs
```

Returns comprehensive API documentation with all available endpoints.

## Legacy Endpoints

For backward compatibility, the following legacy endpoints are still available:

- `/api/connect-wallet`
- `/api/user-data`
- `/api/claim-tokens`
- `/api/challenges`

## Database Schema

The API uses MongoDB with the following collections:

- `users` - User profiles
- `userstats` - User statistics
- `challenges` - Available challenges
- `userchallengeprogress` - User challenge progress
- `activities` - User activities
- `tokentransactions` - Token transactions
- `badges` - Available badges
- `userbadges` - User badge assignments
- `streaks` - User streaks

## Development

To run the API locally:

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3001`.
