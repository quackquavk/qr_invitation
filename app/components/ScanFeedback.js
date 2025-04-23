'use client';

import { useEffect, useState } from 'react';

export default function ScanFeedback({ status, invitation, onReset }) {
  const [animationState, setAnimationState] = useState('initial');
  
  useEffect(() => {
    // Start animation immediately
    setAnimationState('animate');
    
    // Reset after animation completes
    const timer = setTimeout(() => {
      setAnimationState('completed');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const renderIcon = () => {
    if (status === 'success') {
      return (
        <div className="relative">
          <div className={`w-24 h-24 rounded-full ${animationState === 'animate' ? 'scale-110' : ''} bg-green-100 flex items-center justify-center transition-all duration-300`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-12 h-12 text-green-600 ${animationState === 'animate' ? 'scale-110' : ''} transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className={`absolute inset-0 rounded-full bg-green-500 ${animationState === 'animate' ? 'opacity-20 scale-150' : 'opacity-0 scale-100'} transition-all duration-1000`}></div>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <div className={`w-24 h-24 rounded-full ${animationState === 'animate' ? 'scale-110' : ''} bg-red-100 flex items-center justify-center transition-all duration-300`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-12 h-12 text-red-600 ${animationState === 'animate' ? 'scale-110' : ''} transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className={`absolute inset-0 rounded-full bg-red-500 ${animationState === 'animate' ? 'opacity-20 scale-150' : 'opacity-0 scale-100'} transition-all duration-1000`}></div>
        </div>
      );
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 overflow-hidden">
        <div className="flex flex-col items-center">
          {renderIcon()}
          
          <h2 className="text-2xl font-bold mt-6 mb-2 text-center">
            {status === 'success' ? 'Access Granted' : 'Access Denied'}
          </h2>
          
          <p className="text-gray-600 text-center mb-4">
            {status === 'success' 
              ? 'QR code verified successfully' 
              : invitation?.scanned 
                ? 'This invitation has already been scanned' 
                : 'Invalid or expired QR code'}
          </p>
          
          {invitation && (
            <div className="w-full bg-gray-50 rounded-md p-4 mb-4 border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-700">Invitation Details:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {invitation.name}</p>
                <p><span className="font-medium">Email:</span> {invitation.email}</p>
                <p><span className="font-medium">Created:</span> {new Date(invitation.createdAt).toLocaleString()}</p>
                {invitation.scanned && (
                  <p>
                    <span className="font-medium">First Scanned:</span> {new Date(invitation.scannedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 w-full">
            <button
              onClick={onReset}
              className={`w-full py-2 px-4 rounded-md text-white font-medium
                ${status === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                transition-colors duration-200`}
            >
              {status === 'success' ? 'Continue' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 