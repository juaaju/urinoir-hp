"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function LaporanPage() {
  const [userData, setUserData] = useState<{ name: string; nik: string } | null>(null);
  const [laporan, setLaporan] = useState<{ tanggal: string; hasil: string } | null>(null);

  useEffect(() => {
    // Ambil data user dari localStorage (yang sudah login)
    const name = localStorage.getItem("userName");
    const nik = localStorage.getItem("userNik");

    if (name && nik) {
      setUserData({ name, nik });

      // Dummy laporan untuk user ini
      setLaporan({
        tanggal: "2025-12-01",
        hasil: "Negatif", // bisa diganti Positif untuk testing
      });
    }
  }, []);

  const handleDownload = () => {
    if (!userData || !laporan) return;

    const csvContent = `Nama,NIK,Tanggal,Hasil\n${userData.name},${userData.nik},${laporan.tanggal},${laporan.hasil}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_urin_${userData.nik}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!userData || !laporan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Tidak ada data user, silakan login terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Laporan Urin Narkoba</h1>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </header>

      {/* Laporan User */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p><strong>Nama:</strong> {userData.name}</p>
          <p><strong>NIK:</strong> {userData.nik}</p>
          <p><strong>Tanggal:</strong> {laporan.tanggal}</p>
          <p>
            <strong>Hasil:</strong>{" "}
            <span className={laporan.hasil === "Positif" ? "text-red-600" : "text-green-600"}>
              {laporan.hasil}
            </span>
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}
