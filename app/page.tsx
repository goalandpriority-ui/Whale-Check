"use client";

import { useState } from "react";

export default function Home() {
  const [connected, setConnected] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#020617] text-white flex flex-col items-center justify-center px-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🐋</span>
        <h1 className="text-2xl font-bold">Whale Check</h1>
      </div>

      {/* Status Card */}
      <div className="bg-[#020617]/80 border border-white/10 rounded-xl p-6 w-full max-w-sm text-center">
        
        <p className="text-sm text-white/70 mb-4">
          {connected
            ? "Wallet connected successfully 🎉"
            : "Connect your wallet to check whale status"}
        </p>

        {/* Button */}
        {!connected ? (
          <button
            onClick={() => setConnected(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 transition rounded-lg py-2 font-semibold"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            className="w-full bg-green-600 rounded-lg py-2 font-semibold cursor-default"
          >
            Connected ✅
          </button>
        )}
      </div>

      {/* Footer text */}
      <p className="text-xs text-white/40 mt-6">
        UI demo · Wallet logic coming soon
      </p>
    </main>
  );
}
