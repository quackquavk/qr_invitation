'use client';

import { useState } from 'react';

export default function DownloadQR({ qrRef, invitationData }) {
  const [downloading, setDownloading] = useState(false);
  
  const handleDownload = () => {
    if (!qrRef.current) return;
    
    try {
      setDownloading(true);
      
      // Create a canvas from the QR code image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const image = qrRef.current;
      
      // Set canvas dimensions to match QR code
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw QR code onto canvas
      context.drawImage(image, 0, 0, image.width, image.height);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `invitation-${invitationData?.name?.replace(/\s+/g, '-').toLowerCase() || 'qr'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    } finally {
      setDownloading(false);
    }
  };
  
  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="mt-2 px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium flex items-center justify-center gap-1"
    >
      {downloading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Downloading...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR
        </>
      )}
    </button>
  );
} 