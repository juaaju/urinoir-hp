"use client";

import React from "react";
import { Download } from "lucide-react";

export default function LaporanPage() {
  // Data dummy user
  const userData = {
    name: "Andi Rahmadiansah",
    nik: "1234567890123456",
    tanggal: "2025-12-01",
    hasil: "Negatif",
  };

  const handleDownload = () => {
    const csvContent = `Nama,NIK,Tanggal,Hasil\n${userData.name},${userData.nik},${userData.tanggal},${userData.hasil}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_urin_${userData.nik}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <div className="mb-4 space-y-1">
            <p className="text-gray-900 font-medium"><strong>Nama:</strong> {userData.name}</p>
            <p className="text-gray-900 font-medium"><strong>NIK:</strong> {userData.nik}</p>
            <p className="text-gray-900 font-medium"><strong>Tanggal:</strong> {userData.tanggal}</p>
            <p>
                <strong>Hasil:</strong>{" "}
                <span className={userData.hasil === "Positif" ? "text-red-700 font-semibold" : "text-green-700 font-semibold"}>
                {userData.hasil}
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
