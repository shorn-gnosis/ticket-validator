# Contract Interface

## Unlock Protocol Overview

The Unlock Protocol is a decentralized access control protocol that enables creators to monetize their content, software, or communities without relying on a middleman. For this project, we use it to issue and validate event tickets as NFTs.

## Key Contracts

1. **Unlock Contract** - The main factory contract that creates and manages locks
2. **PublicLock Contract** - Individual NFT membership contract created by the Unlock factory

## Contract Addresses

- **NFT Contract Address**: `0x9340184741D938453bF66D77d551Cc04Ab2F4925` (on Gnosis Chain)

## Important Functions

### For Validation

```javascript
// Check if a user has a valid ticket
function getHasValidKey(address _user) external view returns (bool);

// Get the number of valid keys owned by an address
function balanceOf(address _owner) external view returns (uint256);

// Check if a specific key is valid
function isValidKey(uint _tokenId) external view returns (bool);
```

### Implementation in Our Apps

Our validator apps primarily use the `balanceOf` function to check if a wallet owns any valid tickets:

```typescript
// Normalize the address to lowercase for case-insensitive comparison
const normalizedAddress = walletAddress.toLowerCase();
const balance = await contract.balanceOf(normalizedAddress);
const isValid = balance > 0n;
```

## ABI for Interaction

The minimal ABI needed for validation includes:

```javascript
[
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)"
]
```

## Common Issues

1. **Case Sensitivity**: Ethereum addresses are case-insensitive for the hexadecimal part but can include a checksum in the capitalization. Always normalize addresses to lowercase when comparing.

2. **Contract Versioning**: Different versions of the PublicLock contract might implement functions differently. Our implementation is compatible with recent versions of the Unlock Protocol.

3. **RPC Endpoints**: The apps use `https://rpc.gnosischain.com` as the default RPC endpoint for Gnosis Chain, but will use the browser's provider (e.g., MetaMask) if available.
