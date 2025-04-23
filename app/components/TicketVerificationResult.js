'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function TicketVerificationResult({ status }) {
  const [verificationStatus, setVerificationStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const processVerification = async () => {
      // Only process if it's a valid ticket that hasn't been scanned yet
      if (status.success && status.status === 'valid') {
        setLoading(true);
        
        try {
          // Call the verification API to mark the ticket as scanned
          const response = await fetch(`/api/verify/ticket/${status.ticket.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          const data = await response.json();
          
          if (response.ok) {
            // Update the status with the response data
            setVerificationStatus({
              ...status,
              message: 'Ticket successfully verified and marked as scanned.',
              ticket: data.ticket
            });
            
            // Play success sound
            playSound('success');
          } else {
            // Handle errors
            if (data.alreadyScanned) {
              setVerificationStatus({
                success: false,
                message: `This ticket has already been scanned on ${new Date(data.ticket.scannedAt).toLocaleString()}.`,
                status: 'already-scanned',
                ticket: data.ticket
              });
              playSound('warning');
            } else if (data.isSold === false) {
              setVerificationStatus({
                success: false,
                message: 'This ticket has not been sold yet.',
                status: 'not-sold',
                ticket: data.ticket
              });
              playSound('error');
            } else {
              setVerificationStatus({
                success: false,
                message: data.message || 'Failed to verify ticket.',
                status: 'error',
                ticket: data.ticket
              });
              playSound('error');
            }
          }
        } catch (error) {
          console.error('Error during verification:', error);
          setVerificationStatus({
            success: false,
            message: 'Error processing verification. Please try again.',
            status: 'error'
          });
          playSound('error');
        } finally {
          setLoading(false);
        }
      } else {
        // For non-valid tickets, play the appropriate sound
        if (status.status === 'already-scanned') {
          playSound('warning');
        } else {
          playSound('error');
        }
      }
    };
    
    processVerification();
  }, [status]);
  
  const playSound = (type) => {
    try {
      if (typeof window !== 'undefined' && window.Audio) {
        const audio = new Audio(
          type === 'success' ? '/sounds/success.mp3' :
          type === 'warning' ? '/sounds/warning.mp3' :
          '/sounds/error.mp3'
        );
        audio.play().catch(e => console.log('Audio playback failed:', e));
      }
    } catch (error) {
      console.log('Sound playback not supported');
    }
  };
  
  const getStatusIcon = () => {
    switch (verificationStatus.status) {
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
  
  const getStatusColor = () => {
    switch (verificationStatus.status) {
      case 'valid':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'already-scanned':
      case 'not-sold':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'invalid':
      default:
        return 'bg-red-50 border-red-200 text-red-700';
    }
  };
  
  const getStatusTitle = () => {
    switch (verificationStatus.status) {
      case 'valid':
        return 'Valid Ticket';
      case 'already-scanned':
        return 'Already Scanned';
      case 'not-sold':
        return 'Ticket Not Sold';
      case 'invalid':
      default:
        return 'Invalid Ticket';
    }
  };

  return (
    <div className={`mb-6 p-6 rounded-md border ${getStatusColor()}`}>
      {loading ? (
        <div className="flex flex-col items-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl font-bold text-center">
            Processing Verification...
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            <div className="mb-4">
              {getStatusIcon()}
            </div>
            
            <div className="text-xl font-bold text-center">
              {getStatusTitle()}
            </div>
            
            <p className="text-center mt-2">
              {verificationStatus.message}
            </p>
          </div>
          
          {verificationStatus.ticket && (
            <div className="bg-white p-4 rounded-md border mt-4">
              <h3 className="font-semibold mb-2 text-gray-700">Ticket Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Ticket Number</p>
                  <p className="font-medium">#{verificationStatus.ticket.number}</p>
                </div>
                {verificationStatus.ticket.sold && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Buyer Name</p>
                      <p className="font-medium">{verificationStatus.ticket.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sold Date</p>
                      <p className="font-medium">{new Date(verificationStatus.ticket.soldAt).toLocaleDateString()}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {verificationStatus.ticket.scanned ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Scanned
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Not Scanned
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 