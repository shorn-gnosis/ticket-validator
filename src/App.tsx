import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import QRCodeScanner from './QRCodeScanner';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Use environment variable with fallback for development/testing
const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || 
  '0x9340184741D938453bF66D77d551Cc04Ab2F4925'; // Fallback address for development

// Interface for NFT details
interface NFTDetails {
  contractName: string;
  eventName: string;
}

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isValidTicket, setIsValidTicket] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nftDetails, setNftDetails] = useState<NFTDetails | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // Function to handle validation

  const checkTicketValidity = async () => {
    setIsLoading(true);
    setIsValidTicket(null); // Reset status

    if (!walletAddress) {
        console.error("Wallet address missing");
        setIsValidTicket(false);
        setIsLoading(false);
        return;
    }

    try {
      // Use JsonRpcProvider for read-only operations (no wallet connection needed)
      // This allows testing with any wallet address without connecting
      const provider = window.ethereum 
        ? new ethers.BrowserProvider(window.ethereum)
        : new ethers.JsonRpcProvider("https://rpc.gnosischain.com");
      
      console.log("Using provider:", provider.constructor.name);
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
      // Try to convert the address to checksummed format
      // This will throw an error if the address is invalid
      let checksummedAddress;
      try {
        checksummedAddress = ethers.getAddress(walletAddress);
      } catch (error) {
        console.error("Invalid wallet address format:", error);
        setIsValidTicket(false);
        setIsLoading(false);
        return;
      }

      let isValid = false;
      let contractName = "";
      let eventName = "";
      
      // Try to get contract name
      try {
        contractName = await contract.name();
        console.log(`Contract name: ${contractName}`);
      } catch (nameError) {
        console.error("Error getting contract name:", nameError);
        contractName = "Unlock Protocol NFT";
      }
      
      console.log(`Checking balance for ${walletAddress}`);
      // Use the already declared checksummedAddress variable
      const balance = await contract.balanceOf(checksummedAddress);
      console.log(`Balance for ${walletAddress}: ${balance}`);
      isValid = balance > 0n;
      if (isValid) {
        eventName = "Unlock Event";
      }
      
      setIsValidTicket(isValid);
      
      if (isValid) {
        setNftDetails({
          contractName: contractName,
          eventName: eventName
        });
      } else {
        setNftDetails(null);
      }
    } catch (providerError) {
        console.error("Error initializing provider/contract or during owner check:", providerError);
        setIsValidTicket(false);
    } finally {
        setIsLoading(false); // Ensure loading state is always reset
    }
  };

  const handleScan = (address: string) => {
    setWalletAddress(address);
    setShowScanner(false);
    setDebugInfo(`Successfully extracted address: ${address}`);
    // Reset validation status when scanning a new address
    setIsValidTicket(null);
    setNftDetails(null);
    // Don't automatically validate - let the user click the button
  };
  
  const handleCloseScanner = () => {
    setShowScanner(false);
    console.log('QR code scanning canceled');
  };
  
  const handleOpenScanner = () => {
    // Reset any previous errors
    setDebugInfo(null);
    setShowScanner(true);
    console.log('Opening QR code scanner, requesting back camera access...');
  };
  
  // Function to toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (!debugMode) {
      console.log('Debug mode enabled');
    } else {
      setDebugInfo(null);
      console.log('Debug mode disabled');
    }
  };

  return (
    <div className="App">
      <h1>NFT Ticket Validator</h1>
      
      {showScanner ? (
        <>
          <QRCodeScanner 
            onScan={handleScan} 
            onClose={handleCloseScanner}
            debug={debugMode}
          />
          <p className="scanner-instructions">
            Point your camera at a Metri wallet QR code to scan the wallet address
          </p>
          {debugMode && (
            <p className="debug-note">
              Debug mode is enabled. Raw QR code content will be displayed.
            </p>
          )}
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="wallet-input"
          />
          <div className="button-group">
            <button
              onClick={checkTicketValidity}
              disabled={isLoading || !walletAddress} // Disable if loading or no address
              className="validate-button"
            >
              {isLoading ? 'Checking...' : 'Validate Ticket'}
            </button>
            <button
              onClick={handleOpenScanner}
              disabled={isLoading}
              className="scan-button"
            >
              Scan QR Code
            </button>
            <button
              onClick={() => {
                setWalletAddress('');
                setIsValidTicket(null);
                setNftDetails(null);
                setDebugInfo(null);
              }}
              disabled={isLoading || !walletAddress}
              className="reset-button"
            >
              Reset
            </button>
          </div>
        </>
      )}

      {isLoading && <p>Checking ticket validity...</p>}
      {isValidTicket === true && <p className="valid">Valid Ticket!</p>}
      {isValidTicket === false && <p className="invalid">No valid ticket found!</p>}
      
      {debugMode && debugInfo && (
        <div className="debug-info">
          <h3>Debug Information</h3>
          <p>{debugInfo}</p>
        </div>
      )}
      
      <div className="info-box">
        <h3>Contract Information</h3>
        <p>NFT Contract: {NFT_CONTRACT_ADDRESS}</p>
        <p className="env-note">Using {import.meta.env.VITE_NFT_CONTRACT_ADDRESS ? 'custom' : 'default'} contract address</p>
        
        {nftDetails && (
          <div className="nft-details">
            <h3>NFT Details</h3>
            <p>Contract Name: {nftDetails.contractName}</p>
            <p>Event Name: {nftDetails.eventName}</p>
          </div>
        )}
      </div>
      
      <div className="debug-button-container">
        <button
          onClick={toggleDebugMode}
          className={`debug-button ${debugMode ? 'active' : ''}`}
        >
          {debugMode ? 'Disable Debug' : 'Enable Debug'}
        </button>
      </div>
    </div>
  );
}

export default App;
