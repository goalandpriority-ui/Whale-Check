"use client";

import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeWallet = async () => {
    if (!address) {
      setError("Enter wallet address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetch(`/api/analyze?address=${address}`);
      const result = await res.json();

      if (!res.ok) {
        setError("API Error");
        return;
      }

      setData(result);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🐋 Whale Wallet Analyzer</h1>

      <input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={analyzeWallet}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Analyze
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "20px" }}>
          <h2>Results</h2>
          <p><strong>Address:</strong> {data.address}</p>
          <p><strong>Total Volume:</strong> {data.totalVolumeETH} ETH</p>
          <p><strong>Category:</strong> {data.category}</p>

          <h3>Transactions</h3>

          {data.transactions?.length === 0 && (
            <p>No transactions found</p>
          )}

          {data.transactions?.length > 0 &&
            data.transactions.map((tx: any) => (
              <div
                key={tx.hash}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <p><strong>Hash:</strong> {tx.hash}</p>
                <p><strong>Value:</strong> {Number(tx.value) / 1e18} ETH</p>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
