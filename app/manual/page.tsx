"use client";

import { useState } from "react";

export default function ManualInputPage() {
  const [aseton, setAseton] = useState("");
  const [alkohol, setAlkohol] = useState("");
  const [amoniak, setAmoniak] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://unimposingly-unflaked-rayden.ngrok-free.dev/update-gas-manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aseton_ppm: parseFloat(aseton),
          alkohol_ppm: parseFloat(alkohol),
          amoniak_ppm: parseFloat(amoniak),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("❌ " + (data.error || "Gagal mengirim data"));
      } else {
        setMessage("✅ Data berhasil diperbarui!");
      }
    } catch (err) {
      setMessage("❌ Tidak dapat terhubung ke server");
    }

    setLoading(false);
  };

  return (
    <main className="p-8 max-w-xl mx-auto font-sans">
      {/* <h1 className="text-3xl font-bold mb-6">Input Manual Sensor Gas</h1> */}

      <form onSubmit={submitManual} className="space-y-4">

        {/* Aseton */}
        <div>
          <label className="block font-medium mb-1">Aseton (ppm)</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border rounded-lg"
            value={aseton}
            onChange={(e) => setAseton(e.target.value)}
            required
          />
        </div>

        {/* Alkohol */}
        <div>
          <label className="block font-medium mb-1">Alkohol (ppm)</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border rounded-lg"
            value={alkohol}
            onChange={(e) => setAlkohol(e.target.value)}
            required
          />
        </div>

        {/* Amoniak */}
        <div>
          <label className="block font-medium mb-1">Amoniak (ppm)</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border rounded-lg"
            value={amoniak}
            onChange={(e) => setAmoniak(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Mengirim..." : "Refresh"}
        </button>
      </form>

      {/* Pesan sukses/error */}
      {message && (
        <p className="mt-4 text-lg text-center">{message}</p>
      )}
    </main>
  );
}
