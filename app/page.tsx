"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<string | null>(null);

  const checkWhale = () => {
    const isWhale = Math.random() > 0.5;
    setResult(isWhale ? "🐋 You are a WHALE!" : "🐟 Not a whale yet!");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-[#020617] to-[#020024]">
      <h1 className="text-3xl font-bold mb-2">🐋 Whale Check</h1>
      <p className="text-sm text-gray-400 mb-6">
        Check if you are a crypto whale
      </p>

      <button
        onClick={checkWhale}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
      >
        Check Whale 🧠
      </button>

      {result && (
        <div className="mt-6 text-xl font-bold animate-pulse">
          {result}
        </div>
      )}
    </main>
  );
}
