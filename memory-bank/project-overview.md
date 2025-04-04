# Project Overview

## Purpose

The DappCon Ticket Validator is a suite of web applications designed to validate NFT tickets on the Gnosis Chain for events. It leverages the Unlock Protocol for NFT-based ticketing.

## Architecture

The project consists of three main components:

1. **Staff Validator App** - For event staff to scan and validate attendee tickets
2. **User Validator App** - For attendees to verify their own ticket status
3. **End User App** - Alternative user-facing validator implementation

## Technology Stack

- **Frontend**: React with TypeScript, built using Vite
- **Blockchain Interaction**: ethers.js for connecting to Gnosis Chain
- **Smart Contracts**: Unlock Protocol NFT contracts
- **QR Scanning**: react-qr-scanner for reading wallet addresses from QR codes
- **Deployment**: GitHub Pages for hosting the web applications

## Workflow

1. Event tickets are minted as NFTs using the Unlock Protocol
2. Attendees receive NFTs in their Ethereum wallets
3. At the event, staff use the validator app to scan attendee wallet addresses
4. The validator checks NFT ownership on the blockchain
5. The app displays whether the attendee has a valid ticket

## Key Features

- Real-time validation of NFT ownership
- QR code scanning for easy wallet address input
- Case-insensitive address handling
- Fallback to balance checking when direct ownership verification fails
- Debug mode for troubleshooting
