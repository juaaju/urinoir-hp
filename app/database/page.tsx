// pages/excelData.tsx
"use client"; // Menambahkan direktif "use client" agar ini menjadi Client Component

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ExcelData() {
  const [excelData, setExcelData] = useState<any[]>([]); // Data untuk disimpan dalam bentuk array of objects
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data Excel dari API Flask
  const fetchExcelData = async () => {
    try {
      const response = await fetch('https://unimposingly-unflaked-rayden.ngrok-free.dev/api/excel-data', {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      });
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data Excel');
      }
      
      const data = await response.json();
      setExcelData(data);
    } catch (error: any) {
      setError("Gagal memuat data Excel: " + error.message);
    }
};

  // Panggil fetchExcelData saat halaman pertama kali dimuat
  useEffect(() => {
    fetchExcelData();
  }, []);

  // Fungsi untuk menampilkan sebagian deskriptor
  const formatDescriptor = (descriptor: number[]) => {
    // Membatasi hanya 5 nilai pertama, jika ada lebih dari 5 nilai tampilkan "..."
    const maxLength = 5;
    const firstPart = descriptor.slice(0, maxLength);
    return firstPart.join(', ') + (descriptor.length > maxLength ? ', ...' : '');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white-600 flex items-center justify-center shadow-lg">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Monitoring Urinoir</h1>
              <p className="text-sm text-gray-500">Save data urinoir system</p>
            </div>
          </div>
          <button
            onClick={() => console.log("Logout clicked")} // Implementasikan fungsi logout sesuai kebutuhan
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Database</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Menampilkan data dalam bentuk tabel */}
          {excelData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-sm text-gray-700">
                <thead>
                  <tr className="bg-gray-100">
                    {/* Menampilkan header tabel dari kolom pertama */}
                    {Object.keys(excelData[0]).map((key) => (
                      <th key={key} className="py-2 px-4 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((row, index) => (
                    <tr key={index} className="border-t">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="py-2 px-4 max-w-[150px] truncate">
                          {Array.isArray(value) && value.every((val) => typeof val === 'number')
                            ? formatDescriptor(value) // Hanya tampilkan 5 nilai pertama dan "..."
                            : String(value) // Jika bukan array, tampilkan nilai biasa
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Menunggu data...</p>
          )}
        </div>
      </main>
    </div>
  );
}
