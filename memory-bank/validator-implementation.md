# Validator Implementation

## Core Validation Logic

The ticket validation process follows these steps:

1. **Input Wallet Address**: Either manually entered or scanned via QR code
2. **Connect to Blockchain**: Using ethers.js to connect to Gnosis Chain
3. **Contract Interaction**: Query the NFT contract to check ticket ownership
4. **Result Display**: Show whether the ticket is valid or invalid

## Key Code Snippets

### Setting Up the Contract Connection

```typescript
// Use JsonRpcProvider for read-only operations or browser provider if available
const provider = window.ethereum 
  ? new ethers.BrowserProvider(window.ethereum)
  : new ethers.JsonRpcProvider("https://rpc.gnosischain.com");

// Initialize contract with ABI
const contract = new ethers.Contract(
  NFT_CONTRACT_ADDRESS,
  [
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function tokenURI(uint256 tokenId) view returns (string)"
  ],
  provider
);
```

### Validating Ticket Ownership

```typescript
// Normalize address to lowercase for case-insensitive comparison
const normalizedAddress = walletAddress.toLowerCase();
const balance = await contract.balanceOf(normalizedAddress);
const isValid = balance > 0n;
```

### QR Code Scanning

The staff validator app includes QR code scanning functionality to easily input wallet addresses:

```typescript
const handleScan = (address: string) => {
  setWalletAddress(address);
  setShowScanner(false);
  // Reset validation status when scanning a new address
  setIsValidTicket(null);
  setNftDetails(null);
};
```

## Error Handling

The implementation includes robust error handling for various scenarios:

1. **Invalid Address Format**: Checks if the input is a valid Ethereum address
2. **Contract Call Failures**: Handles errors when contract calls fail
3. **Network Connectivity Issues**: Provides feedback when the blockchain connection fails

## Optimizations

1. **Case Insensitivity**: Addresses are normalized to lowercase to handle mixed-case inputs
2. **Fallback Provider**: Uses browser provider when available, falls back to RPC endpoint
3. **Contract Name Caching**: Attempts to get the contract name but provides a default if it fails
