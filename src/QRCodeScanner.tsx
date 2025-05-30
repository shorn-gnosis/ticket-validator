import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';

interface QRCodeScannerProps {
  onScan: (address: string) => void;
  onClose: () => void;
  debug?: boolean;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose, debug = false }) => {
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

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

  // Get available camera devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        console.log("Requesting camera permission...");
        // First, request camera permission with explicit video constraints
        await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
          } 
        });
        
        // Then get list of available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        
        // Try to select a back camera automatically using various detection methods
        
        // Method 1: Look for explicit back/rear/environment naming in labels
        const explicitBackCamera = videoDevices.find(device => {
          const label = device.label.toLowerCase();
          return label.includes('back') || 
                 label.includes('environment') || 
                 label.includes('rear');
        });
        
        // Method 2: If we have exactly 2 cameras, the back camera is often listed second on mobile
        // but might be the first on laptops with external webcams
        const likelyBackCamera = videoDevices.length === 2 ? 
          (navigator.userAgent.toLowerCase().includes('mobile') ? videoDevices[1] : videoDevices[0]) 
          : null;
        
        // Method 3: If we have more than 2 cameras, we'll use the last one as a fallback
        const fallbackCamera = videoDevices.length > 0 ? videoDevices[videoDevices.length - 1] : null;
        
        // Log all available cameras for debugging
        videoDevices.forEach((device, index) => {
          console.log(`Camera ${index + 1}:`, device.label || `Camera ${index + 1}`);
        });
        
        // Use the most reliable camera detection we have
        if (explicitBackCamera) {
          console.log('Found explicit back camera:', explicitBackCamera.label);
          setSelectedDeviceId(explicitBackCamera.deviceId);
        } else if (likelyBackCamera) {
          console.log('Using likely back camera:', likelyBackCamera.label);
          setSelectedDeviceId(likelyBackCamera.deviceId);
        } else if (fallbackCamera) {
          console.log('Using fallback camera:', fallbackCamera.label);
          setSelectedDeviceId(fallbackCamera.deviceId);
        }
      } catch (error) {
        console.error('Error getting camera devices:', error);
        setError('Error accessing camera: ' + (error instanceof Error ? error.message : String(error)));
      }
    };
    
    getDevices();
  }, []);
  
  const handleError = (err: Error) => {
    console.error('QR Scanner error:', err);
    setError('Error accessing camera: ' + err.message);
  };

  return (
    <div className="qr-scanner-container">
      <h3>Scan QR Code</h3>
      <p className="camera-info">
        {devices.length === 0 ? "Accessing camera..." : 
          selectedDeviceId ? 
            `Using: ${devices.find(d => d.deviceId === selectedDeviceId)?.label || "Selected camera"}` :
            "Using back camera (environment-facing)"}
      </p>
      <div className="scanner-wrapper">
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
          facingMode="environment"
          constraints={selectedDeviceId 
            ? { deviceId: { exact: selectedDeviceId } }
            : { facingMode: { exact: "environment" } }
          }
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {devices.length > 0 && (
        <div className="camera-selection">
          <p><strong>Camera not working?</strong> Try a different one:</p>
          <select 
            value={selectedDeviceId || ''} 
            onChange={(e) => {
              setSelectedDeviceId(e.target.value);
              // Reset any previous errors when changing camera
              setError(null);
            }}
            className="camera-select"
          >
            <option value="">Auto (Back Camera)</option>
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
                {device.label && device.label.toLowerCase().includes('back') && ' (Back)'}
                {device.label && device.label.toLowerCase().includes('front') && ' (Front)'}
              </option>
            ))}
          </select>
          <div className="camera-note">
            <small>If scanning doesn't work, try the front camera. Some devices label cameras incorrectly.</small>
          </div>
        </div>
      )}
      <button onClick={onClose} className="close-scanner-button">
        Cancel
      </button>
    </div>
  );
};

export default QRCodeScanner;
