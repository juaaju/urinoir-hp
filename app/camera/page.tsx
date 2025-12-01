import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';

export default function CameraPage() {
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      setLoading(true);
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser tidak mendukung akses kamera atau butuh HTTPS");
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode } 
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
    startCamera('environment');
    return () => streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  const switchCamera = () => {
    startCamera(facingMode === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Camera className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Akses Kamera</h1>
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
            className="w-full aspect-video bg-black"
          />
          
          <div className="p-4 space-y-3">
            <div className="text-center text-sm text-gray-600">
              Kamera: <strong>{facingMode === 'user' ? '🤳 Depan' : '📷 Belakang'}</strong>
            </div>
            
            <button
              onClick={switchCamera}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Mengganti...' : `Ganti ke ${facingMode === 'user' ? 'Belakang' : 'Depan'}`}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <strong>🔍 Debug:</strong>
          <div className="mt-2 space-y-1 font-mono text-xs">
            <div>HTTPS: {window.isSecureContext ? '✅' : '❌'}</div>
            <div>URL: {window.location.protocol}//{window.location.host}</div>
          </div>
        </div>
      </div>
    </div>
  );
}