'use client';

import { useState } from "react";

interface WalletData {
  totalTxCount: number;
  totalVolumeUSD: number;
  category: string;
}

export default function Page() {
  const [address, setAddress] = useState("");
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCategory = (score: number) => {
    if (score <= 5) return "🦐 Shrimp";
    if (score <= 10) return "🐬 Dolphin";
    if (score <= 15) return "🐳 Whale";
    return "🐋 Big Whale";
  };

  const analyzeWallet = async () => {
    setError("");
    setWalletData(null);

    if (!address) {
      setError("Address required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/analyze?address=${address}`);
      if (!res.ok) throw new Error("Failed to fetch wallet data");
      const data = await res.json();

      const finalScore = data.totalVolumeUSD / 1000 + data.totalTxCount / 1000;
      const category = getCategory(finalScore);

      setWalletData({
        totalTxCount: data.totalTxCount,
        totalVolumeUSD: data.totalVolumeUSD,
        category,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🐋 Whale Wallet Analyzer</h1>

      <input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={analyzeWallet}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded mb-4 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {walletData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">📊 Results</h2>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Total Volume:</strong> ${walletData.totalVolumeUSD.toLocaleString()}</p>
          <p><strong>Transactions:</strong> {walletData.totalTxCount}</p>
          <p><strong>Category:</strong> {walletData.category}</p>
        </div>
      )}
    </div>
  );
}
