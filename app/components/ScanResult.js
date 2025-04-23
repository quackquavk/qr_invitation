'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ScanResult({ status, data, type = 'invitation', onScanAgain }) {
  // Play sound effect based on scan status
  useEffect(() => {
    playStatusSound(status);
  }, [status]);

  const playStatusSound = (status) => {
    try {
      if (typeof window !== 'undefined' && window.Audio) {
        const audio = new Audio(
          status === 'valid' ? '/sounds/success.mp3' :
          status === 'already-scanned' ? '/sounds/warning.mp3' :
          '/sounds/error.mp3'
        );
        audio.play().catch(e => console.log('Audio playback error:', e));
      }
    } catch (error) {
      console.log('Sound playback not supported');
    }
  };

  // Render appropriate icon based on status
  const renderStatusIcon = () => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-20 w-20 text-green-500" />;
      case 'already-scanned':
        return <AlertTriangle className="h-20 w-20 text-amber-500" />;
      case 'not-sold':
        return <AlertTriangle className="h-20 w-20 text-amber-500" />;
      case 'invalid':
      default:
        return <XCircle className="h-20 w-20 text-red-500" />;
    }
  };

  // Get the container style based on status
  const getContainerStyle = () => {
    switch (status) {
      case 'valid':
        return 'bg-green-50 border-green-200';
      case 'already-scanned':
        return 'bg-amber-50 border-amber-200';
      case 'not-sold':
        return 'bg-amber-50 border-amber-200';
      case 'invalid':
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  // Get status text based on status
  const getStatusText = () => {
    switch (status) {
      case 'valid':
        return type === 'ticket' ? 'Valid Ticket' : 'Valid Invitation';
      case 'already-scanned':
        return 'Already Scanned';
      case 'not-sold':
        return 'Ticket Not Sold';
      case 'invalid':
      default:
        return type === 'ticket' ? 'Invalid Ticket' : 'Invalid Invitation';
    }
  };

  // Get message text based on status
  const getStatusMessage = () => {
    switch (status) {
      case 'valid':
        return type === 'ticket' 
          ? 'Ticket has been successfully validated and marked as scanned.' 
          : 'Invitation has been successfully validated and marked as scanned.';
      case 'already-scanned':
        if (data && data.scannedAt) {
          const scanDate = new Date(data.scannedAt).toLocaleString();
          return `This ${type} has already been scanned on ${scanDate}.`;
        }
        return `This ${type} has already been scanned.`;
      case 'not-sold':
        return 'This ticket has not been sold yet.';
      case 'invalid':
      default:
        return `This ${type} is not valid or has been revoked.`;
    }
  };

  return (
    <div className={`border p-6 rounded-lg ${getContainerStyle()}`}>
      <div className="flex flex-col items-center mb-6">
        <div className="mb-4">
          {renderStatusIcon()}
        </div>
        
        <h2 className="text-xl font-bold text-center mb-2">
          {getStatusText()}
        </h2>
        
        <p className="text-center">
          {getStatusMessage()}
        </p>
      </div>
      
      {data && (
        <div className="bg-white p-4 rounded-lg border mb-6">
          <h3 className="font-semibold mb-2">Details:</h3>
          
          {type === 'ticket' ? (
            // Ticket details
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket #:</span>
                <span className="font-medium">{data.number}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">
                  {data.sold ? 'Sold' : 'Available'}
                </span>
              </div>
              
              {data.sold && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buyer:</span>
                    <span className="font-medium">{data.buyerName || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sold On:</span>
                    <span className="font-medium">
                      {data.soldAt ? new Date(data.soldAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Scan Status:</span>
                <span className="font-medium">
                  {data.scanned ? 'Scanned' : 'Not Scanned'}
                </span>
              </div>
            </div>
          ) : (
            // Invitation details
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{data.name || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Message:</span>
                <span className="font-medium">{data.message || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Scan Status:</span>
                <span className="font-medium">
                  {data.scanned ? 'Scanned' : 'Not Scanned'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={onScanAgain}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Scan Another QR Code
        </button>
      </div>
    </div>
  );
} 