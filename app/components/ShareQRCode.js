'use client';

import { useState, useEffect } from 'react';

export default function ShareQRCode({ invitationId, invitationData }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  
  // Generate the shareable link for this invitation
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/share/${invitationId}`
    : `/share/${invitationId}`;
  
  // Check if Web Share API is available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      setShareSupported(true);
    }
  }, []);
  
  // Direct share function using Web Share API
  const shareInvitation = async () => {
    try {
      setLoading(true);
      const name = invitationData?.name || 'Guest';
      
      await navigator.share({
        title: `Invitation for ${name}`,
        text: `Hi ${name}, please join us! Here's your invitation:`,
        url: shareUrl
      });
    } catch (error) {
      console.error('Error sharing invitation:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Functions to share the invitation via different methods
  const shareViaWhatsApp = () => {
    const name = invitationData?.name || 'Guest';
    const message = `Hi ${name}, please join us! Here's your invitation: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };
  
  const shareViaEmail = () => {
    const subject = "You're invited!";
    const body = `Hello ${invitationData?.name || ''},

Please join us! Here's your invitation link:
${shareUrl}

Looking forward to seeing you!`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
        Share Invitation
      </button>

      {showShareOptions && (
        <div className="mt-2 p-3 bg-gray-100 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Share via:</h3>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="p-3 bg-white rounded-md border border-gray-200 mb-4">
                <p className="text-xs text-gray-500 mb-1">Shareable link:</p>
                <p className="text-sm font-medium break-all">{shareUrl}</p>
              </div>
              
              {/* Direct share button when available */}
              {shareSupported && (
                <button
                  onClick={shareInvitation}
                  className="w-full mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share Directly
                </button>
              )}
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={shareViaWhatsApp}
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <div className="text-green-600 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.131.332.202.043.72.043.289-.1.491z" />
                    </svg>
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </button>
                
                <button
                  onClick={shareViaEmail}
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <div className="text-blue-600 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M20 4h-16c-1.1 0-1.99.9-1.99 2l-.01 12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <span className="text-xs">Email</span>
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <div className="text-blue-600 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                  </div>
                  <span className="text-xs">Copy Link</span>
                </button>
              </div>
              
              {copySuccess && (
                <div className="mt-2 text-center text-sm text-green-600">
                  Link copied to clipboard!
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 