'use client';

import { useState, useEffect, useRef } from 'react';
import QRScanner from '../components/QRScanner';
import { useRouter } from 'next/navigation';
import ScanResult from '../components/ScanResult';

export default function ScanPage() {
  const [scanning, setScanning] = useState(true); // Start with scanning active
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanItemType, setScanItemType] = useState('ticket'); // Only ticket is used now
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const scannerInstanceRef = useRef(null);

  const handleScanSuccess = async (result) => {
    try {
      if (loading) return;
      setLoading(true);
      
      console.log('QR Code Detected:', result);
      
      // Extract the scanned URL - we only get the text value now
      const scannedUrl = result;
      
      const type = 'ticket';
      let id = null;
      
      // Extract the ticket ID from the URL
      if (scannedUrl && scannedUrl.includes('/ticket/')) {
        const match = scannedUrl.match(/\/ticket\/([^\/]+)/);
        if (match && match[1]) {
          id = match[1];
        }
      } else {
        throw new Error('Invalid ticket QR code format');
      }
      
      if (!id) {
        throw new Error('Could not extract ticket ID from QR code');
      }
      
      // Set the item type
      setScanItemType(type);
      
      // Call the verification endpoint
      const verifyEndpoint = `/api/verify/ticket/${id}`;
      
      console.log('Verifying ticket:', id);
      const response = await fetch(verifyEndpoint, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }
      
      const data = await response.json();
      console.log('Verification result:', data);
      
      // Display the result and stop scanning
      setScanning(false);
      setScanResult({
        status: data.status,
        data: data.item
      });
    } catch (error) {
      console.error('Scan Error:', error);
      setScanning(false);
      setScanResult({
        status: 'invalid',
        data: null
      });
      setError(error.message || 'Failed to process QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleScanFailure = (error) => {
    console.error('Scanner Error:', error);
    setError('Camera access error: ' + error);
    setScanning(false);
  };

  // Restart scanning
  const restartScanning = () => {
    setScanResult(null);
    setError(null);
    setScanning(true);
  };

  const onAssignScannerRef = (ref) => {
    scannerInstanceRef.current = ref;
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Scan Ticket QR Code</h1>
      
      {!scanning && !scanResult && error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={restartScanning}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}
      
      {scanning ? (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="relative mb-4">
            <QRScanner 
              onScanSuccess={handleScanSuccess}
              onScanFailure={handleScanFailure}
            />
            
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Position the QR code within the scanner frame. Hold the device steady.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : scanResult && (
        <ScanResult 
          status={scanResult.status} 
          data={scanResult.data}
          type={scanItemType}
          onScanAgain={restartScanning} 
        />
      )}
      
      <div className="bg-gray-100 p-4 rounded-lg mt-6">
        <h2 className="font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Ensure good lighting for optimal scanning.</li>
          <li>Hold the device steady while scanning.</li>
          <li>Make sure the entire QR code is visible in the scanner frame.</li>
          <li>The system will automatically verify the code once detected.</li>
        </ol>
      </div>
    </div>
  );
} 