# NeroFit Changelog

All notable changes to the NeroFit project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Fixed
- Nothing yet

### Removed
- Nothing yet

---

## [0.0.1] - 2025-05-29

### 🎯 Major Dashboard Overhaul

#### Added
- **Tab-based navigation system** with 4 distinct sections:
  - Overview: Quick actions, goals, and weekly progress
  - Active: In-progress challenges with progress tracking
  - Completed: Achievement showcase with earned tokens
  - Activity: Timeline of recent fitness activities
- **Clear tab indicators** with icons, labels, and count badges
- **Differentiated quick actions**:
  - "Strength Training" button → Routes to strength challenges
  - "Cardio Workout" button → Routes to cardio challenges
- **Completed challenges visibility** with dedicated tab
- **Achievement celebration** with congratulatory messages
- **Progress synchronization** between dashboard and challenges page
- **Smart data calculations** based on actual challenge completion
- **Enhanced UX elements**:
  - Visual hierarchy with proper spacing
  - Smooth transitions and hover effects
  - Contextual empty states with helpful CTAs
  - Responsive design for all screen sizes

#### Changed
- **Data synchronization**: Dashboard now uses exact same challenge data as challenges page
- **Stats calculation**: FIT tokens and completion counts now calculated dynamically from challenge data
- **Quick actions functionality**: Buttons now route to specific challenge categories instead of generic pages
- **Token display**: Shows "From X challenges" instead of generic "+25 this week"
- **Recent activity**: Now reflects actual completed challenges with proper timestamps

#### Fixed
- **Data mismatch** between dashboard and challenges page
- **Missing completed challenges view** - users can now see all their achievements
- **Unclear tab indication** - active tab now clearly highlighted with gradient background
- **Duplicate quick action functionality** - buttons now have distinct purposes
- **Inconsistent challenge progress** - progress bars now match actual completion status

#### Removed
- Generic weekly progress indicators that didn't match actual data
- Redundant challenge display sections
- Confusing navigation elements

---

## [0.0.2] - 2025-05-30

### 🏗️ Smart Contract Infrastructure

#### Added
- **FIT Token Contract (FITToken.sol)**:
  - ERC-20 compliant token with 18 decimals
  - 100 million max supply, 10 million initial supply
  - Automated reward distribution for fitness challenges
  - Streak bonus system (5% per day, max 50%)
  - Role-based access control for reward distributors
  - Pausable functionality and token burning
  - Challenge management with on-chain tracking
  - Predefined challenge rewards (Walk 1km: 10 FIT, Run 3km: 25 FIT, etc.)

- **Enhanced Fitness Contract (NeroFitnessV2.sol)**:
  - User registration and profile management
  - Workout logging with automatic FIT token rewards
  - Challenge creation, joining, and completion
  - Leaderboard system with fitness points
  - Level progression with experience points
  - Integration with FIT token contract

- **Development Infrastructure**:
  - `package.json` with Hardhat dependencies
  - `hardhat.config.js` with network configurations
  - `scripts/deploy.js` for contract deployment
  - `test/FITToken.test.js` with comprehensive test suite
  - `README.md` with complete documentation
  - `setup.sh` automated setup script
  - `.gitignore` for contract artifacts

### 🎨 Frontend Enhancements

#### Added
- **Challenges Page** (`/challenges`):
  - Comprehensive challenges listing with search functionality
  - Category and difficulty filters (Cardio, Strength, Wellness, Endurance)
  - Status filter for viewing active, completed, or all challenges
  - Grid layout with detailed challenge cards
  - Statistics section with user progress
  - Dynamic Labs authentication integration

- **Leaderboard Page** (`/leaderboard`):
  - Top 10 user rankings with podium display
  - Full leaderboard table with user stats
  - Time-based filters (Weekly, Monthly, All-time)
  - Current user rank highlighting
  - Ranking system with achievement badges
  - Responsive design with smooth animations

- **Profile Page** (`/profile`):
  - Comprehensive user profile management
  - Authentication protection with Dynamic Labs
  - Profile editing capabilities
  - User statistics and progress tracking
  - Activity feed with recent achievements
  - Badge collection and display system

#### Fixed
- **Header dropdown transparency** by updating background opacity
- **Hydration errors** when navigating to challenge pages
- **Authentication flow** with proper Dynamic Labs integration
- **Navigation consistency** across all pages
- **Responsive design** issues on mobile devices

#### Changed
- **Header navigation** now properly links to existing pages
- **Challenge page structure** with improved filtering and search
- **Profile page layout** with better organization of user data

---

## [1.0.0] - 2024-12-17

### 🚀 Initial Release

#### Added
- **Core Application Structure**:
  - Next.js 14 frontend with TypeScript
  - Node.js backend with Express
  - Dynamic Labs wallet integration
  - Responsive design with Tailwind CSS

- **Authentication System**:
  - Web3 wallet connection via Dynamic Labs
  - User session management
  - Protected routes and pages

- **Basic Pages**:
  - Landing page with hero section
  - Dashboard with basic user stats
  - Login/authentication flow
  - Header navigation component

- **Backend API**:
  - Express server with CORS configuration
  - Wallet connection endpoints
  - User data management
  - Token claiming functionality

- **Blockchain Integration**:
  - Ethereum wallet connectivity
  - Basic smart contract interaction setup
  - Paymaster utilities for gasless transactions

#### Technical Foundation
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, CORS
- **Blockchain**: Dynamic Labs, Ethereum, Web3
- **Development**: ESLint, Prettier, Git workflow

---

## [v1.2.0] - 2025-05-30

### 🎉 Major UX Improvements & Bug Fixes

This release addresses critical UX issues, resolves hydration errors, and implements fully functional token claiming with proper backend connectivity.

### ✅ Fixed Issues

#### **Hydration Errors Resolved**
- **Fixed**: Server/client HTML mismatch errors causing console warnings
- **Solution**: Created `ClientProvider.tsx` wrapper component with `"use client"` directive
- **Impact**: Eliminated all hydration warnings, smooth client-side rendering

#### **Backend API Connectivity**
- **Fixed**: API calls returning HTML instead of JSON (`unexpected token '<', '!DOCTYPE'...`)
- **Fixed**: Port configuration conflicts between frontend and backend
- **Solution**: 
  - Backend now runs on port 3001 (configurable via `PORT` environment variable)
  - Frontend runs on port 3000 (forced via `-p 3000` flag)
  - Updated API calls to point to correct backend URL (`http://localhost:3001`)

#### **Token Claiming Functionality**
- **Fixed**: Non-functional "Claim Now" button
- **Implemented**: Complete token claiming workflow with backend integration
- **Added**: Real-time feedback with loading states and success/error messages
- **Added**: Transaction hash display for successful claims
- **Added**: Automatic UI updates after successful token claims

#### **Dashboard UX Enhancements**
- **Removed**: Quick navigation section as requested
- **Added**: Clickable stats cards with hover effects
- **Improved**: Visual indicators for interactive elements
- **Enhanced**: Navigation flow between dashboard sections

#### **CORS Configuration**
- **Fixed**: Cross-origin request blocking between frontend and backend
- **Added**: Comprehensive CORS configuration supporting multiple localhost origins
- **Documented**: Dynamic Labs CORS setup requirements

### 🚀 New Features

#### **Enhanced Dashboard**
- **Claimable Tokens Alert**: Prominent notification when tokens are ready to claim
- **Interactive Stats Cards**: Click "Challenges" stat to navigate to completed challenges
- **Improved Tab Navigation**: Better visual feedback and count indicators
- **Real-time Updates**: UI automatically reflects token claims and challenge completions

#### **Backend API Endpoints**
- **Added**: `/api/challenges/claim-tokens` - Token claiming with validation
- **Added**: `/health` - Health check endpoint for monitoring
- **Enhanced**: Error handling and logging throughout API

#### **Development Experience**
- **Added**: Comprehensive setup instructions in README
- **Added**: Port conflict resolution guide
- **Added**: API testing commands with curl examples
- **Improved**: Environment variable documentation

### 🔧 Technical Improvements

#### **Client-Side Architecture**
```typescript
// New ClientProvider pattern
"use client";
export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider settings={dynamicSettings}>
      <WalletProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </WalletProvider>
    </DynamicContextProvider>
  );
}
```

#### **Backend Configuration**
```javascript
// Improved port handling
const PORT = process.env.PORT || process.env.port || 3001;

// Enhanced CORS setup
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    // ... additional origins
  ],
  credentials: true
}));
```

#### **API Error Handling**
```typescript
// Robust error handling in frontend
if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
}

const contentType = response.headers.get('content-type');
if (!contentType || !contentType.includes('application/json')) {
  throw new Error(`Expected JSON response but got: ${contentType}`);
}
```

### 📋 Environment Configuration

#### **Frontend (.env.local)**
```bash
# Required
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your-dynamic-environment-id

# Optional - Backend URL (defaults to http://localhost:3001)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

#### **Backend (.env)**
```bash
# Required
NERO_TESTNET_RPC=https://testnet-rpc.nerochain.io
PAYMASTER_ADDRESS=0x5a6680dFd4a77FEea0A7be291147768EaA2414ad
PORT=3001
```

### 🏃‍♂️ Running the Application

#### **Start Backend (Terminal 1)**
```bash
cd backend
PORT=3001 node src/server.js
```

#### **Start Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```

### 🧪 Testing

#### **Backend Health Check**
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok"}
```

#### **Token Claiming Test**
```bash
curl -X POST http://localhost:3001/api/challenges/claim-tokens \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x1234...","challengeId":"daily-steps","reward":100}'
# Expected: {"success":true,"message":"Successfully claimed 100 FIT tokens",...}
```

### 🐛 Known Issues Resolved

1. **Port Conflicts**: Resolved by proper port separation and environment variable handling
2. **Hydration Mismatches**: Fixed with client-side provider pattern
3. **API 404 Errors**: Resolved by correcting backend URL configuration
4. **Dynamic Labs CORS**: Documented solution requiring dashboard configuration
5. **Non-responsive UI**: Fixed with proper loading states and error handling

### 📚 Documentation Updates

- **Updated README**: Complete setup and troubleshooting guide
- **Added**: Port configuration instructions
- **Added**: Common error resolution steps
- **Added**: API testing examples
- **Enhanced**: Project structure documentation

### 🔄 Migration Notes

If upgrading from previous version:

1. **Update environment variables** as shown above
2. **Restart both servers** with correct port configuration
3. **Clear browser cache** to avoid cached API calls
4. **Update Dynamic Labs dashboard** to include `http://localhost:3000` in allowed origins

### 🎯 Next Steps

- [ ] Implement persistent token claiming state
- [ ] Add transaction history tracking
- [ ] Enhance error recovery mechanisms
- [ ] Add automated testing for API endpoints
- [ ] Implement real blockchain integration

---

## How to Update This Changelog

### For Developers

When making changes to the project, follow these guidelines:

1. **Choose the appropriate version bump**:
   - **MAJOR** (X.0.0): Breaking changes, major feature overhauls
   - **MINOR** (0.X.0): New features, significant improvements
   - **PATCH** (0.0.X): Bug fixes, small improvements

2. **Use the following categories**:
   - **Added**: New features, components, or functionality
   - **Changed**: Modifications to existing features
   - **Fixed**: Bug fixes and issue resolutions
   - **Removed**: Deleted features or deprecated functionality

3. **Writing good changelog entries**:
   - Use clear, descriptive language
   - Include the impact on users
   - Reference issue numbers when applicable
   - Group related changes together
   - Use emojis for visual organization (🎯 🏗️ 🎨 🚀 ⚡ 🐛 🔧)

4. **Before releasing**:
   - Move items from `[Unreleased]` to a new version section
   - Add the release date
   - Update version numbers in package.json
   - Create a git tag for the release

### Example Entry Format

```markdown
## [1.3.0] - 2024-12-20

### 🎨 New Feature Category

#### Added
- **Feature Name**: Detailed description of what was added
- **Component/Page updates**: Specific improvements made

#### Changed
- **Existing feature**: How it was modified and why
- **Performance improvements**: What was optimized

#### Fixed
- **Bug description**: What issue was resolved
- **UX improvement**: How user experience was enhanced

#### Removed
- **Deprecated feature**: What was removed and why
```

### Quick Reference

- 🎯 **Major Features**: Large new functionality
- 🏗️ **Infrastructure**: Backend, contracts, architecture
- 🎨 **Frontend**: UI/UX improvements, new pages
- 🚀 **Initial/Core**: Foundation and setup
- ⚡ **Performance**: Speed and optimization improvements
- 🐛 **Bug Fixes**: Issue resolutions
- 🔧 **Maintenance**: Refactoring, cleanup, dependencies
- 📚 **Documentation**: README, comments, guides
- 🧪 **Testing**: Test additions and improvements
- 🔒 **Security**: Security-related changes 