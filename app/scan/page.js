'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import QRScanner from '../components/QRScanner';
import { useRouter } from 'next/navigation';
import ScanResult from '../components/ScanResult';

// Define specific error messages for OPERATIONAL errors
const ERROR_MESSAGES = {
  VERIFICATION_FAILED: 'Failed to verify the ticket with the server.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNEXPECTED_ERROR: 'An unexpected error occurred while processing the QR code.',
  INVALID_SERVER_RESPONSE: 'Received an invalid response from the server.',
};

export default function ScanPage() {
  const [scanning, setScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null); // Will hold { status: '...', data: ... }
  const [error, setError] = useState(null); // Holds OPERATIONAL error message string
  const [scanItemType, setScanItemType] = useState('ticket');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(1);
  const router = useRouter();
  const isProcessingRef = useRef(false);

  const handleScanSuccess = useCallback(async (result) => {
    if (loading || isProcessingRef.current) {
      console.log('Scan ignored: Already processing.');
      return;
    }

    isProcessingRef.current = true;
    setLoading(true);
    setError(null); // Clear previous operational errors
    setScanResult(null); // Clear previous results initially
    // Keep scanning visual off while processing, even if result is 'invalid'
    setScanning(false);

    try {
      const scannedUrl = result;
      const type = 'ticket'; // Assuming only tickets

      // 1. Validate Input QR Data Type and Format
      if (typeof scannedUrl !== 'string' || !scannedUrl || !scannedUrl.includes(`/${type}/`)) {
        console.warn('Scan Result: Invalid QR code format or type. URL:', scannedUrl);
        // --- SET INVALID RESULT DIRECTLY ---
        setScanResult({ status: 'invalid', data: null });
        // No operational error, just an invalid QR content.
        // Keep scanning=false (shows result), loading=false (in finally)
        return; // Exit early
      }

      // 2. Extract ID
      let id = null;
      const match = scannedUrl.match(`\/${type}\/([^\\/?#]+)`);
      if (match && match[1]) {
        id = match[1];
      }

      if (!id) {
        console.warn('Scan Result: Could not extract ID from QR code. URL:', scannedUrl);
        // --- SET INVALID RESULT DIRECTLY ---
        setScanResult({ status: 'invalid', data: null });
        // No operational error, just invalid QR content.
        // Keep scanning=false (shows result), loading=false (in finally)
        return; // Exit early
      }

      // --- If QR format/ID extraction is successful, proceed to verification ---
      setScanItemType(type);

      // 3. Make API Call (Operational part starts here)
      const verifyEndpoint = `/api/verify/${type}/${id}`;
      let response;
      try {
        response = await fetch(verifyEndpoint, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
             'Accept': 'application/json',
           },
        });
      } catch (networkError) {
        console.error('Network Error during fetch:', networkError);
        // This IS an operational error
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      // 4. Handle API Response (Operational part)
      let data;
      if (!response.ok) {
        let errorDetail = `Status code: ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetail = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (parseError) {
          errorDetail = response.statusText || errorDetail;
          console.warn('Could not parse error response body as JSON.');
        }
        console.error('API Error:', errorDetail);
        // This IS an operational error
        throw new Error(`${ERROR_MESSAGES.VERIFICATION_FAILED} (${errorDetail})`);
      }

      // Response is OK (2xx)
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON Parsing Error on successful response:', parseError);
        // This IS an operational error (unexpected server behavior)
        throw new Error(ERROR_MESSAGES.INVALID_SERVER_RESPONSE);
      }

      // 5. Validate API Response Data structure (Operational part)
      if (!data || typeof data.state !== 'string' || typeof data.ticket === 'undefined') {
          console.error('Invalid data structure received from API:', data);
          // This IS an operational error (unexpected server behavior)
          throw new Error(ERROR_MESSAGES.INVALID_SERVER_RESPONSE);
      }

      // --- Success Case ---
      console.log('Verification successful:', data);
      setScanResult({
        status: data.state, // API determines final state (valid, already_used, etc.)
        data: data.ticket
      });
      // scanning remains false, loading=false (in finally)

    } catch (operationalError) {
      // --- Central OPERATIONAL Error Handling ---
      // This block now only catches errors from fetch, API response issues,
      // unexpected server data, or other code errors AFTER QR validation.
      console.error('handleScanSuccess Operational Error:', operationalError);

      // Set the user-facing OPERATIONAL error message
      setError(operationalError.message || ERROR_MESSAGES.UNEXPECTED_ERROR);

      // Ensure result is cleared and scanning remains stopped
      setScanResult(null);
      setScanning(false);

    } finally {
      // --- Cleanup ---
      setLoading(false);
      isProcessingRef.current = false;
      // Note: setScanning(false) was already called earlier in all paths
      console.log('Processing finished.');
    }
  }, [loading]); // Dependency array remains [loading]

  const handleScanFailure = useCallback((errorMsg) => {
     const ignoredErrors = [
        "NotAllowedError", "NotFoundErr", "No barcode or QR code detected",
        "No MultiFormat Readers were able to detect the code"
     ];
     const isIgnoredError = ignoredErrors.some(ignored => errorMsg?.includes(ignored));

     if (errorMsg && !isIgnoredError) {
        console.error('Scanner Error:', errorMsg);
        let displayError = `Scanner error: ${errorMsg}`;
         if (errorMsg.includes("Permission denied") || errorMsg.includes("NotAllowedError")) {
             displayError = "Camera permission denied. Please grant access in your browser settings.";
         } else if (errorMsg.includes("Requested device not found") || errorMsg.includes("NotFoundErr")) {
             displayError = "Camera not found or is busy. Please ensure it's connected and not used by another app.";
         }
        // Treat significant scanner errors as operational errors
        setError(displayError);
        setScanning(false);
        setScanResult(null);
     } else if (errorMsg) {
        console.log('Scanner Info:', errorMsg);
     }
  }, []);

  const restartScanning = useCallback(() => {
    setScanResult(null);
    setError(null); // Clear operational errors
    setLoading(false);
    setScanning(true);
    setKey(prevKey => prevKey + 1);
    isProcessingRef.current = false;
  }, []);

  // --- RETURN JSX (No changes needed here from the previous version) ---
  return (
    <div className="container mx-auto max-w-lg px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Scan Ticket QR Code</h1>

      {/* --- Operational Error Display Area --- */}
      {!scanning && error && ( // Shows only for NETWORK/SERVER/UNEXPECTED errors
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={restartScanning}
            className="mt-3 block w-full sm:w-auto sm:inline-block sm:ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Scan Again
          </button>
        </div>
      )}

      {/* --- Scanner Area --- */}
      {scanning ? (
        <div className="bg-white p-4 rounded-lg shadow mb-6 relative">
          <div className="mb-4">
            <QRScanner
              key={key}
              onScanSuccess={handleScanSuccess}
              onScanFailure={handleScanFailure}
            />
          </div>
           {loading && ( // Shows during API verification
             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg z-10">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
               <p className="text-white ml-3">Verifying...</p>
             </div>
           )}
          {!loading && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Position the QR code inside the frame.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* --- Scan Result Area --- */}
      {!scanning && scanResult && ( // Shows for VALID, INVALID, ALREADY_USED etc. statuses
        <ScanResult
          status={scanResult.status}
          data={scanResult.data}
          type={scanItemType}
          onScanAgain={restartScanning}
        />
      )}

      {/* --- General Instructions --- */}
      <div className="bg-gray-100 p-4 rounded-lg mt-6">
        <h2 className="font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
          <li>Ensure good lighting for optimal scanning.</li>
          <li>Hold the device steady while scanning.</li>
          <li>Make sure the entire QR code is visible in the scanner frame.</li>
          <li>The system will automatically verify the code once detected.</li>
        </ol>
      </div>
    </div>
  );
}