"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, AlertCircle } from "lucide-react";

export default function CameraPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [nik, setNik] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
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
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedPhoto(dataUrl);
    setSendSuccess(null);
  };

  const sendPhoto = async () => {
    if (!capturedPhoto) {
      setError("Silakan ambil foto terlebih dahulu");
      return;
    }
    if (!name || !nik) {
      setError("Nama dan NIK wajib diisi");
      return;
    }

    setSending(true);
    setError(null);
    setSendSuccess(null);

    try {
      const response = await fetch("https://kirimgambar.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nik, image: capturedPhoto }),
      });

      if (!response.ok) throw new Error(`Gagal kirim: ${response.statusText}`);
      setSendSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error kirim foto");
      setSendSuccess(false);
    } finally {
      setSending(false);
    }
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
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[70vh] max-h-[90vh] bg-black rounded-lg"
            />
          </div>

          {/* Tombol Capture */}
          <button
            onClick={capturePhoto}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition mb-4"
          >
            Ambil Foto
          </button>

          {/* Preview Foto */}
          {capturedPhoto && (
            <div className="mt-4 text-center">
              <h2 className="font-medium mb-2">Preview Foto</h2>
              <img
                src={capturedPhoto}
                alt="Captured"
                className="mx-auto rounded-lg border border-gray-300 max-w-full"
              />

              {/* Form Nama & NIK */}
              <div className="mt-4 space-y-3 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="Masukkan nama"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NIK</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="Masukkan NIK"
                    required
                  />
                </div>
              </div>

              {/* Tombol Kirim */}
              <button
                onClick={sendPhoto}
                disabled={sending}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
              >
                {sending ? "Mengirim..." : "Kirim Data"}
              </button>

              {/* Status Kirim */}
              {sendSuccess === true && <p className="mt-2 text-green-600">✅ Data berhasil dikirim!</p>}
              {sendSuccess === false && <p className="mt-2 text-red-600">❌ Gagal kirim data</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
