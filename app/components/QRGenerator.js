'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import DownloadQR from './DownloadQR';
import ShareQRCode from './ShareQRCode';

export default function QRGenerator({ invitationId, invitationData }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const qrImageRef = useRef(null);

  // Generate QR code when component mounts
  useEffect(() => {
    const generateQR = async () => {
      try {
        // The QR will encode our invitation URL with the ID
        const invitationUrl = `${window.location.origin}/verify/${invitationId}`;
        const dataUrl = await QRCode.toDataURL(invitationUrl, {
          errorCorrectionLevel: 'H',
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (invitationId) {
      generateQR();
    }
  }, [invitationId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!qrDataUrl) {
    return <div className="text-red-500">Failed to generate QR code</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <img 
          ref={qrImageRef}
          src={qrDataUrl} 
          alt="Invitation QR Code" 
          className="w-64 h-64" 
        />
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center">
        Scan this QR code at the event entrance
      </div>
      <div className="flex gap-2 mt-2">
        <DownloadQR qrRef={qrImageRef} invitationData={invitationData} />
      </div>
      <ShareQRCode 
        invitationId={invitationId} 
        invitationData={invitationData} 
      />
    </div>
  );
} 