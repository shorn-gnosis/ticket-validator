# Development Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Local Setup

### Clone the Repository

```bash
# Main repository
git clone https://github.com/aboutcircles/dappcon-ticket-seller.git
cd dappcon-ticket-seller

# For individual apps (if needed)
git clone https://github.com/shorn-gnosis/ticket-validator.git
git clone https://github.com/shorn-gnosis/ticket-validator-user.git
```

### Install Dependencies

Each application needs its dependencies installed separately:

```bash
# For the main repository apps
cd end-user-app
npm install

cd ../staff-app
npm install

# For individual repositories
cd ticket-validator
npm install

cd ../ticket-validator-user
npm install
```

## Running Locally

Each application can be run using the Vite development server:

```bash
# Start the development server
npm run dev
```

This will start a local server, typically at http://localhost:5173, with hot reloading enabled.

## Testing

### Manual Testing

1. Start the local development server
2. Open the app in a browser
3. Enter a wallet address (or scan a QR code in the staff app)
4. Verify that the validation works correctly

### Testing with Different Addresses

- Valid address (with NFT): Should show "Valid Ticket"
- Invalid address (without NFT): Should show "Invalid Ticket"
- Mixed-case address: Should work the same as lowercase (case-insensitive)

## Building for Production

```bash
# Build the application
npm run build
```

This creates a `dist` directory with the production-ready files.

## Deployment

The apps are deployed to GitHub Pages using:

```bash
# Deploy to GitHub Pages
npm run deploy
```

This runs the build process and then publishes the `dist` directory to the gh-pages branch.

## Common Development Tasks

### Updating the Contract Address

If you need to use a different NFT contract, update the `NFT_CONTRACT_ADDRESS` constant in the App.tsx file:

```typescript
const NFT_CONTRACT_ADDRESS = '0x9340184741D938453bF66D77d551Cc04Ab2F4925'; // Update this
```

### Adding New Features

1. Make changes to the code
2. Test locally
3. Commit and push to GitHub
4. Deploy using `npm run deploy`
