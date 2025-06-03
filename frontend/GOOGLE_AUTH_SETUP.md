# Google Authentication Setup Guide

## Quick Start (Using Temporary Client ID)

The app is now configured with a temporary Web3Auth client ID that should work for testing Google authentication immediately.

## Setting Up Your Own Web3Auth Client ID

For production use, you should create your own Web3Auth client ID:

### 1. Create Web3Auth Account
1. Go to [Web3Auth Dashboard](https://dashboard.web3auth.io)
2. Sign up or log in
3. Create a new project

### 2. Configure Your Project
1. Set **Project Name**: NeroFit
2. Set **Network**: Testnet
3. Add your domain (e.g., `http://localhost:3000` for development)

### 3. Get Your Client ID
1. Copy the **Client ID** from your project dashboard
2. Create a `.env.local` file in the frontend directory:

```bash
# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_client_id_here

# Optional: Custom Google OAuth (if you want your own Google app)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# NERO Configuration
NEXT_PUBLIC_NERO_RPC_URL=https://rpc-testnet.nerochain.io
NEXT_PUBLIC_NERO_CHAIN_ID=689
```

### 4. Configure Social Logins (Optional)
If you want to customize the Google login experience:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy the Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Testing

1. Restart your development server: `npm run dev`
2. Go to `/login`
3. Click "Continue with Google"
4. You should see the Google OAuth popup

## Troubleshooting

- **"Google authentication not available"**: Check that Web3Auth client ID is set
- **OAuth popup blocked**: Allow popups for localhost in your browser
- **"Invalid client ID"**: Verify the client ID is correct and the domain is whitelisted
- **Connection timeout**: Check your internet connection and try again

## Current Status

✅ **Google Authentication**: Enabled with temporary client ID  
✅ **MetaMask Connection**: Available as fallback  
✅ **NERO Network**: Configured for testnet  
⚠️ **Production Ready**: Replace temporary client ID with your own 