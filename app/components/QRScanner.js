'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner({ onScanSuccess, onScanFailure }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const scannerInitializedRef = useRef(false);
  
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    onScanSuccess(decodedText);
  };

  const startScanner = () => {
    if (scannerInitializedRef.current) return;
    
    setError(null);
    setIsScanning(true);

    try {
      const html5QrcodeScanner = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrcodeScanner;
      scannerInitializedRef.current = true;

      html5QrcodeScanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        qrCodeSuccessCallback,
        (errorMessage) => {
          // This is just for errors during scanning, not when a QR code can't be found
          console.error(errorMessage);
        }
      ).catch(err => {
        setError('Failed to start scanner: ' + err);
        setIsScanning(false);
        scannerInitializedRef.current = false;
      });
    } catch (err) {
      console.error('Error initializing scanner:', err);
      setError('Failed to initialize scanner: ' + err);
      setIsScanning(false);
      scannerInitializedRef.current = false;
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerInitializedRef.current) {
      console.log('Stopping scanner...');
      scannerRef.current.stop().then(() => {
        console.log('Scanner stopped successfully');
        setIsScanning(false);
        scannerInitializedRef.current = false;
      }).catch(err => {
        console.error('Failed to stop scanner:', err);
      });
    }
  };

  // Initialize scanner once on mount
  useEffect(() => {
    console.log('Initializing scanner...');
    if (!scannerInitializedRef.current) {
      startScanner();
    }
    
    // Clean up on component unmount
    return () => {
      console.log('Cleaning up scanner...');
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => {
          console.error('Failed to stop scanner on unmount:', err);
        });
        scannerInitializedRef.current = false;
      }
    };
  }, []);

  const restartScanner = () => {
    stopScanner();
    // Short delay to ensure previous instance is fully stopped
    setTimeout(() => {
      scannerInitializedRef.current = false;
      startScanner();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center">
      <div id="qr-reader" className="w-full h-64 max-w-md border border-gray-300 rounded-lg overflow-hidden"></div>
      
      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
      
      <div className="mt-4">
        {!isScanning ? (
          <button 
            onClick={restartScanner}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Restart Scanning
          </button>
        ) : (
          <button 
            onClick={stopScanner}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Pause Scanning
          </button>
        )}
      </div>
    </div>
  );
} 