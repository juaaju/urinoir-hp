"use client";

import React from "react";
import { Download } from "lucide-react";
import Image from "next/image";
export default function LaporanPage() {
  // Data dummy user dengan beberapa data histori
  const userData = [
    {
      name: "Andi Rahmadiansah",
      nik: "1234567890123456",
      tanggal: "2025-12-01",
      hasil: "Negatif",
    },
    {
      name: "Andi Rahmadiansah",
      nik: "1234567890123456",
      tanggal: "2025-12-02",
      hasil: "Positif",
    },
    {
      name: "Andi Rahmadiansah",
      nik: "1234567890123456",
      tanggal: "2025-12-03",
      hasil: "Negatif",
    },
  ];

  // Function untuk generate CSV dari semua data
  const handleDownload = () => {
    const csvHeader = "Nama,NIK,Tanggal,Hasil\n";
    const csvContent = userData
      .map(
        (data) =>
          `${data.name},${data.nik},${data.tanggal},${data.hasil}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan_urin.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white-600 flex items-center justify-center shadow-lg">
              <Image src="/logo.png" alt="Logo" width={32} height={32} priority />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Monitoring Urinoir</h1>
              <p className="text-sm text-gray-500">Laporan narkoba</p>
            </div>
          </div>
        </div>
      </header>

      {/* Laporan User Histori */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {userData.map((data, index) => (
            <div key={index} className="p-4 border-b border-gray-300">
              <p className="text-gray-900 font-medium">
                <strong>Nama:</strong> {data.name}
              </p>
              <p className="text-gray-900 font-medium">
                <strong>NIK:</strong> {data.nik}
              </p>
              <p className="text-gray-900 font-medium">
                <strong>Tanggal:</strong> {data.tanggal}
              </p>
              <p className="text-gray-900 font-medium">
                <strong>Hasil:</strong>{" "}
                <span
                  className={
                    data.hasil === "Positif"
                      ? "text-red-700 font-semibold"
                      : "text-green-700 font-semibold"
                  }
                >
                  {data.hasil}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Tombol Download Laporan Semua Data */}
        <button
          onClick={handleDownload}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
        >
          <Download className="inline-block mr-2 w-5 h-5" />
          Download Laporan
        </button>
      </div>
    </div>
  );
}
