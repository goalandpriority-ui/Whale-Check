'use client'

import { useState } from "react";

export default function BaseWhaleChecker() {
  const [walletAddress, setWalletAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!walletAddress) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/analyze?address=${walletAddress}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || "Failed to fetch wallet transactions");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch wallet transactions. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🐋 Base Whale Checker</h1>
      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="0x..."
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded mb-4 w-full"
      >
        {loading ? "Analyzing..." : "Analyze Wallet"}
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Total Transactions: {result.totalTransactions}</p>
          <p>Total Volume (USD): ${result.totalVolumeUSD.toLocaleString()}</p>
          <p>Category: {result.category}</p>
        </div>
      )}
    </div>
  );
}
