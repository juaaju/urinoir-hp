"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, AlertCircle } from "lucide-react";

export default function CameraPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Debug client-only
  const [isSecure, setIsSecure] = useState(false);
  const [url, setUrl] = useState("");

  const startCamera = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser tidak mendukung akses kamera atau butuh HTTPS");
      }

      // Stop previous stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Pakai kamera depan saja
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error tidak diketahui");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera();

    setIsSecure(window.isSecureContext);
    setUrl(`${window.location.protocol}//${window.location.host}`);

    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white-600 flex items-center justify-center shadow-lg">
              <Image src="/logo.png" alt="Logo" width={32} height={32} priority />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Monitoring Urinoir</h1>
              <p className="text-sm text-gray-500">Save data urinoir system</p>
            </div>
          </div>
        </div>
      </header>

      {/* Kamera */}
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Camera className="w-8 h-8" />
            <h1 className="text-xl sm:text-2xl font-bold text-center">
              Foto Wajah Untuk Mendapatkan Hasil Urin
            </h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>Error:</strong> {error}
                <p className="mt-2">💡 Pastikan akses via HTTPS & matikan overlay apps</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Video kamera diperbesar */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[70vh] max-h-[90vh] bg-black rounded-lg"
            />
          </div>

          {/* Debug */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <strong>🔍 Debug:</strong>
            <div className="mt-2 space-y-1 font-mono text-xs">
              <div>HTTPS: {isSecure ? "✅" : "❌"}</div>
              <div>URL: {url}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
