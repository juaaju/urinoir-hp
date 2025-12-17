"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SensorCard } from "@/components/SensorCard";

type GasData = {
  aseton_ppm: number;
  alkohol_ppm: number;
  amoniak_ppm: number;
  timestamp: number;
};

type DetectResponse = {
  data: GasData;
  status: "Aman" | "Terindikasi";
};

type StatusResponse = {
  status: string;
  timestamp: number;
};

export default function DashboardPage() {
  const [gasData, setGasData] = useState<GasData | null>(null);
  const [detectStatus, setDetectStatus] = useState<string>("Loading...");
  const [processStatus, setProcessStatus] = useState<string>("Loading...");

  const fetchData = async () => {
    try {
      // Fetch sensor detect
      const detectRes = await fetch("http://localhost:5099/detect", {
        cache: "no-store",
      });
      const detectJson: DetectResponse = await detectRes.json();
      setGasData(detectJson.data);
      setDetectStatus(detectJson.status);

      // Fetch process status
      const statusRes = await fetch("http://localhost:5099/status", {
        cache: "no-store",
      });
      const statusJson: StatusResponse = await statusRes.json();
      setProcessStatus(statusJson.status);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-refresh every 3 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (name: string, value: number | undefined): "normal" | "warning" | "danger" => {
    if (!value) return "normal";
    switch (name) {
      case "Aseton":
        return value >= 1 ? "danger" : "normal";
      case "Alkohol":
        return value >= 100 ? "danger" : "normal";
      case "Amoniak":
        return value >= 10 ? "warning" : "normal";
      default:
        return "normal";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <p className="text-sm text-gray-500">Data Sensor</p>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Status Proses</h3>
            <p className="text-xl font-medium text-gray-900">{processStatus}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Deteksi Status</h3>
            <p
              className={`text-xl font-bold ${
                detectStatus === "Terindikasi Narkoba" ? "text-red-600" : "text-green-600"
              }`}
            >
              {detectStatus}
            </p>
          </div>
        </div>

        {/* Gas Sensors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gasData ? (
            <>
              <SensorCard
                name="Aseton"
                value={gasData.aseton_ppm}
                unit="ppm"
                status={getStatus("Aseton", gasData.aseton_ppm)}
              />
              <SensorCard
                name="Alkohol"
                value={gasData.alkohol_ppm}
                unit="ppm"
                status={getStatus("Alkohol", gasData.alkohol_ppm)}
              />
              <SensorCard
                name="Amoniak"
                value={gasData.amoniak_ppm}
                unit="ppm"
                status={getStatus("Amoniak", gasData.amoniak_ppm)}
              />
            </>
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Loading sensor data...
            </div>
          )}
        </div>

        {/* Last Updated */}
        {gasData && (
          <p className="mt-6 text-sm text-gray-500 text-center">
            Last Updated: {new Date(gasData.timestamp * 1000).toLocaleString('id-ID')}
          </p>
        )}
      </main>
    </div>
  );
}