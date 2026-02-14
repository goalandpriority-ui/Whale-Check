"use client";
import { useState } from "react";

export default function HomePage() {
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleAnalyze() {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ wallet }),
    });
    const data = await res.json();
    setResult(data);
  }

  return (
    <main style={{ padding: 40, backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
      <h1>🐋 Base Whale Engine (ERC20 Trading Mode)</h1>
      <input
        type="text"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        placeholder="Enter wallet address"
        style={{ padding: 8, width: "300px", marginRight: 10 }}
      />
      <button onClick={handleAnalyze} style={{ padding: 8 }}>Analyze Wallet</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <p>Transactions: {result.txCount}</p>
          <p>Total Volume: ${result.totalVolume}</p>
          <p>Category: {result.category}</p>
        </div>
      )}
    </main>
  );
}
