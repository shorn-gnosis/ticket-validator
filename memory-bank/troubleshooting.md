# Troubleshooting Guide

## Common Issues and Solutions

### Validation Issues

#### Case Sensitivity Problems

**Issue**: Validation fails with mixed-case wallet addresses but works with lowercase addresses.

**Solution**: Ensure all address comparisons are case-insensitive by normalizing addresses to lowercase:

```typescript
// Fix: Normalize address before passing to contract
const normalizedAddress = walletAddress.toLowerCase();
const balance = await contract.balanceOf(normalizedAddress);
```

#### Contract Connection Failures

**Issue**: Unable to connect to the NFT contract, errors like "missing revert data" or "call exception".

**Solutions**:
1. Check that you're using the correct contract address
2. Verify that you're connected to the Gnosis Chain network
3. Ensure the contract ABI matches the deployed contract version
4. Try using a different RPC endpoint if the default one is having issues

#### QR Code Scanner Not Working

**Issue**: QR code scanner doesn't activate or doesn't read codes properly.

**Solutions**:
1. Ensure the browser has camera permissions
2. Use a well-lit environment for scanning
3. Try a different browser if issues persist
4. Fall back to manual address entry

### Development Issues

#### Local Development Server Problems

**Issue**: `npm run dev` fails to start the development server.

**Solutions**:
1. Check that all dependencies are installed (`npm install`)
2. Verify that the correct Node.js version is installed
3. Check for port conflicts and use a different port if needed (`npm run dev -- --port 3000`)

#### Build Failures

**Issue**: `npm run build` fails with errors.

**Solutions**:
1. Check for TypeScript errors in the code
2. Ensure all imports are correct
3. Verify that all required environment variables are set

### Deployment Issues

#### GitHub Pages Deployment Failures

**Issue**: `npm run deploy` fails to deploy to GitHub Pages.

**Solutions**:
1. Ensure you have the correct permissions for the repository
2. Check that the gh-pages branch is set up correctly
3. Verify that the build process completes successfully before deployment

#### App Works Locally But Not When Deployed

**Issue**: The app works fine in local development but fails when deployed.

**Solutions**:
1. Check for hardcoded localhost URLs in the code
2. Ensure all paths are relative, not absolute
3. Verify that the correct base path is set in the Vite config for GitHub Pages

### Blockchain Interaction Issues

#### Slow Validation

**Issue**: Validation takes a long time to complete.

**Solutions**:
1. Check the RPC endpoint performance
2. Consider implementing a loading indicator
3. Cache results for repeated validations of the same address

#### Invalid Contract Calls

**Issue**: Contract calls fail with "invalid parameters" or similar errors.

**Solutions**:
1. Double-check the contract ABI
2. Ensure parameters are formatted correctly (e.g., BigInt for numeric values)
3. Verify that the contract has the expected functions
