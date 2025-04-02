import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

interface QRCodeScannerProps {
  onScan: (address: string) => void;
  onClose: () => void;
  debug?: boolean;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose, debug = false }) => {
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: { text: string } | null) => {
    if (data) {
      console.log('QR Code scanned:', data.text);
      
      // For debugging purposes, show the raw QR code content
      if (debug) {
        setError(`Raw QR code content: ${data.text.substring(0, 100)}${data.text.length > 100 ? '...' : ''}`);
      }
      
      let address = data.text;
      
      // Try to extract wallet address from QR code data
      // Handle different formats:
      
      // 1. Direct Ethereum address
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/i;
      
      // 2. Metri wallet format - based on the image, it might contain the address in a specific section
      // Look for wallet address in the QR code content
      const metriWalletRegex = /Wallet Address\s*[:=]?\s*(0x[a-fA-F0-9]{40})/i;
      const metriMatch = data.text.match(metriWalletRegex);
      
      if (metriMatch && metriMatch[1]) {
        // Extract address from Metri wallet format
        address = metriMatch[1];
        console.log('Extracted address from Metri wallet format:', address);
      }
      
      // 3. Look for any Ethereum address pattern in the text
      if (!ethAddressRegex.test(address)) {
        const anyEthAddressRegex = /(0x[a-fA-F0-9]{40})/i;
        const anyMatch = data.text.match(anyEthAddressRegex);
        if (anyMatch && anyMatch[1]) {
          address = anyMatch[1];
          console.log('Extracted address from general text:', address);
        }
      }
      
      // 4. JSON format (some QR codes might contain JSON with address)
      if (!ethAddressRegex.test(address)) {
        try {
          const jsonData = JSON.parse(data.text);
          if (jsonData.address && ethAddressRegex.test(jsonData.address)) {
            address = jsonData.address;
            console.log('Extracted address from JSON format:', address);
          } else if (jsonData.wallet && ethAddressRegex.test(jsonData.wallet)) {
            address = jsonData.wallet;
            console.log('Extracted wallet from JSON format:', address);
          } else {
            // Try to find any property that looks like an Ethereum address
            for (const key in jsonData) {
              if (typeof jsonData[key] === 'string' && ethAddressRegex.test(jsonData[key])) {
                address = jsonData[key];
                console.log(`Extracted address from JSON property ${key}:`, address);
                break;
              }
            }
          }
        } catch (e) {
          // Not JSON format, continue with other checks
          console.log('Not a valid JSON format:', e);
        }
      }
      
      // 5. URL format with address parameter or path component
      if (!ethAddressRegex.test(address)) {
        try {
          // Check URL parameters
          const url = new URL(data.text);
          const urlAddress = url.searchParams.get('address') || 
                             url.searchParams.get('wallet') || 
                             url.searchParams.get('a');
          
          if (urlAddress && ethAddressRegex.test(urlAddress)) {
            address = urlAddress;
            console.log('Extracted address from URL parameter:', address);
          } else {
            // Check if address is in the path
            const pathParts = url.pathname.split('/');
            for (const part of pathParts) {
              if (ethAddressRegex.test(part)) {
                address = part;
                console.log('Extracted address from URL path:', address);
                break;
              }
            }
          }
        } catch (e) {
          // Not URL format, continue with other checks
          console.log('Not a valid URL format:', e);
        }
      }
      
      // 6. Handle Metri profile URL directly
      if (!ethAddressRegex.test(address) && data.text.includes('app.metri.xyz/p/profile/')) {
        try {
          const metriProfileRegex = /app\.metri\.xyz\/p\/profile\/(0x[a-fA-F0-9]{40})/i;
          const metriProfileMatch = data.text.match(metriProfileRegex);
          if (metriProfileMatch && metriProfileMatch[1]) {
            address = metriProfileMatch[1];
            console.log('Extracted address from Metri profile URL:', address);
          }
        } catch (e) {
          console.log('Error parsing Metri profile URL:', e);
        }
      }
      
      // Final validation
      if (ethAddressRegex.test(address)) {
        onScan(address);
      } else {
        console.error('Could not extract valid wallet address from QR code');
        setError('Could not find a valid wallet address in the QR code. Raw content: ' + data.text.substring(0, 50) + '...');
      }
    }
  };

  const handleError = (err: Error) => {
    console.error('QR Scanner error:', err);
    setError('Error accessing camera: ' + err.message);
  };

  return (
    <div className="qr-scanner-container">
      <h3>Scan QR Code</h3>
      <div className="scanner-wrapper">
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button onClick={onClose} className="close-scanner-button">
        Cancel
      </button>
    </div>
  );
};

export default QRCodeScanner;
