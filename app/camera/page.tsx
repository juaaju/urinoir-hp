"use client";

import React, { useState, useEffect, useRef } from 'react';

const CameraPage = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        // Cek apakah browser mendukung getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(
            "Browser Anda tidak mendukung akses kamera. " +
            "Pastikan Anda mengakses melalui HTTPS atau gunakan browser modern."
          );
        }

        // Cek apakah sedang di HTTPS atau localhost
        const isSecureContext = window.isSecureContext;
        if (!isSecureContext) {
          throw new Error(
            "Akses kamera memerlukan koneksi aman (HTTPS). " +
            "Saat ini Anda mengakses melalui HTTP."
          );
        }

        // Request kamera dengan constraint yang lebih kompatibel
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user' // atau 'environment' untuk kamera belakang
          } 
        });
        
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setHasPermission(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      }
    };

    getCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const switchCamera = async () => {
    try {
      // Stop stream saat ini
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Ganti kamera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { exact: 'environment' } // Kamera belakang
        } 
      });
      
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      // Fallback ke kamera depan jika belakang tidak tersedia
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user'
          } 
        });
        
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (fallbackErr) {
        if (fallbackErr instanceof Error) {
          setError("Tidak bisa ganti kamera: " + fallbackErr.message);
        }
      }
    }
  };

  return (
    <div style={{ 
      textAlign: "center", 
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <h1 style={{ marginBottom: "16px" }}>📱 Akses Kamera HP</h1>
      
      {error && (
        <div style={{ 
          color: "white",
          backgroundColor: "#ef4444",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "16px",
          maxWidth: "600px",
          margin: "0 auto 16px"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {hasPermission ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "12px",
              marginTop: "16px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          />
          <button
            onClick={switchCamera}
            style={{
              marginTop: "16px",
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            🔄 Ganti Kamera
          </button>
        </>
      ) : (
        <div style={{
          padding: "40px",
          backgroundColor: "#f3f4f6",
          borderRadius: "12px",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <p style={{ fontSize: "18px", color: "#6b7280" }}>
            ⏳ Menunggu izin kamera...
          </p>
        </div>
      )}

      <div style={{
        marginTop: "32px",
        padding: "16px",
        backgroundColor: "#fef3c7",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "32px auto 0",
        fontSize: "14px",
        color: "#92400e"
      }}>
        <strong>💡 Tips:</strong>
        <ul style={{ textAlign: "left", marginTop: "8px" }}>
          <li>Pastikan mengakses melalui <strong>HTTPS</strong></li>
          <li>Izinkan akses kamera saat browser meminta</li>
          <li>Gunakan browser modern (Chrome, Safari, Firefox)</li>
          <li>Periksa pengaturan privasi di HP Anda</li>
        </ul>
      </div>
    </div>
  );
};

export default CameraPage;