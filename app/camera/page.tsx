"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, RefreshCw, AlertCircle } from "lucide-react";

export default function CameraPage() {
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Debug client-only
  const [isSecure, setIsSecure] = useState(false);
  const [url, setUrl] = useState("");

  const startCamera = async (mode: "user" | "environment") => {
    try {
      setLoading(true);
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser tidak mendukung akses kamera atau butuh HTTPS");
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setFacingMode(mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error tidak diketahui");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera("environment");

    setIsSecure(window.isSecureContext);
    setUrl(`${window.location.protocol}//${window.location.host}`);

    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const switchCamera = () => {
    startCamera(facingMode === "user" ? "environment" : "user");
  };

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
          <button
            onClick={() => console.log("Logout clicked")}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Kamera */}
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
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
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-[60vh] aspect-video bg-black rounded-lg"
            />

            <div className="p-4 space-y-3">
              <div className="text-center text-sm text-gray-600">
                Kamera: <strong>{facingMode === "user" ? "🤳 Depan" : "📷 Belakang"}</strong>
              </div>

              <button
                onClick={switchCamera}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Mengganti..." : `Ganti ke ${facingMode === "user" ? "Belakang" : "Depan"}`}
              </button>
            </div>
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
