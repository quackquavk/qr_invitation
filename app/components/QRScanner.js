"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScanSuccess, onScanFailure }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const scannerInitializedRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const mountedRef = useRef(true);

  // Reset state when component mounts

  const qrCodeSuccessCallback = useCallback(
    (decodedText, decodedResult) => {
      if (!mountedRef.current) return;
      onScanSuccess(decodedText);
    },
    [onScanSuccess]
  );

  const startScanner = useCallback(() => {
    if (!mountedRef.current) return;
    if (scannerInitializedRef.current) return;

    try {
      setError(null);
      setIsScanning(true);

      const html5QrcodeScanner = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrcodeScanner;
      scannerInitializedRef.current = true;

      html5QrcodeScanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250, formats  : ["QR_CODE"] },
          qrCodeSuccessCallback,
          (errorMessage) => {
            if (!mountedRef.current) return;

            if (
              errorMessage.includes("No barcode or QR code detected") ||
              errorMessage.includes(
                "No MultiFormat Readers were able to detect the code"
              )
            ) {
              return;
            }

            if (onScanFailure) {
              onScanFailure(errorMessage);
            }
          }
        )
        .catch((err) => {
          if (!mountedRef.current) return;

          if (
            !err.toString().includes("No barcode or QR code detected") &&
            !err
              .toString()
              .includes("No MultiFormat Readers were able to detect the code")
          ) {
            setError("Failed to start scanner: " + err);
            setIsScanning(false);
            scannerInitializedRef.current = false;
          }
        });
    } catch (err) {
      if (!mountedRef.current) return;

      setError("Failed to initialize scanner: " + err);
      setIsScanning(false);
      scannerInitializedRef.current = false;
    }
  }, [onScanFailure, qrCodeSuccessCallback]);

  // Ensure scanner is fully stopped before restarting
  const ensureScanner = useCallback(async () => {
    try {
      if (scannerRef.current && scannerInitializedRef.current) {
        await scannerRef.current.stop();
      }
    } catch (err) {
      console.log("Error during scanner cleanup:", err);
    } finally {
      scannerRef.current = null;
      scannerInitializedRef.current = false;
    }
  }, []);

  const stopScanner = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      if (scannerRef.current && scannerInitializedRef.current) {
        await scannerRef.current.stop();
      }
    } catch (err) {
      console.log("Error stopping scanner:", err);
    } finally {
      if (mountedRef.current) {
        setIsScanning(false);
      }
      scannerRef.current = null;
      scannerInitializedRef.current = false;
    }
  }, []);

  // Initialize scanner once on mount
  useEffect(() => {
    // Only initialize once to prevent loops
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      // Reset any previous scanner instance first
      ensureScanner().then(() => {
        if (mountedRef.current) {
          startScanner();
        }
      });
    }

    // Clean up on component unmount
    return () => {
      stopScanner();
    };
  }, [ensureScanner, startScanner, stopScanner]);

  const restartScanner = useCallback(async () => {
    await stopScanner();

    // Wait to ensure everything is cleaned up
    setTimeout(() => {
      if (mountedRef.current) {
        startScanner();
      }
    }, 1000);
  }, [startScanner, stopScanner]);
  useEffect(() => {
    // Only initialize once to prevent loops
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      // Reset any previous scanner instance first
      ensureScanner().then(() => {
        if (mountedRef.current) {
          startScanner();
        }
      });
    }

    return () => {
      console.log("QRScanner unmounting, attempting to stop scanner.");
      stopScanner();
      scannerRef.current = null; // Explicitly nullify the instance
      scannerInitializedRef.current = false;
      mountedRef.current = false; // Ensure this is set in the cleanup
    };
  }, [ensureScanner, startScanner, stopScanner]);
  return (
    <div className="flex flex-col items-center">
      <div
        id="qr-reader"
        className="w-full h-64 max-w-md border border-gray-300 rounded-lg overflow-hidden"
      ></div>

      {error && <div className="text-red-500 mt-2">{error}</div>}

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
