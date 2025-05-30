# NFT Ticket Validator

A simple web application to validate NFT tickets for events. This app allows event staff to verify if a wallet address holds a valid NFT ticket issued by the Unlock Protocol contract.

## Features

- Wallet address validation
- NFT ownership verification using ERC-721 balanceOf/ownerOf methods
- Test functionality with known valid wallet addresses
- Read-only blockchain access (no wallet connection required)
- Clear validation results display

## Contract Information

The NFT contract address is configured through an environment variable:
- `VITE_NFT_CONTRACT_ADDRESS`: Set in the `.env` file in the root directory

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- ethers.js
- Vite

## Getting Started

```bash
# Copy the example environment file and configure it
cp .env.example .env
# Edit .env to set your contract address

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How It Works

The app verifies NFT ticket ownership by:

1. First attempting to use the `ownerOf` method to check if the wallet owns a specific token ID
2. If that fails, falling back to the `balanceOf` method to check if the wallet holds any tokens from the contract

This dual verification approach ensures compatibility with different ERC-721 implementations.