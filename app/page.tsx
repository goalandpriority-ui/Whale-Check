"use client";

import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeWallet = async () => {
    if (!address) {
      setError("Please enter wallet address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetch(`/api/analyze?address=${address}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "API Error");
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
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1 style={{ fontSize: "28px" }}>🐋 Whale Wallet Analyzer</h1>

      <input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={analyzeWallet}
        style={{
          marginTop: "15px",
          padding: "12px 20px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        Analyze
      </button>

      {loading && <p style={{ marginTop: "20px" }}>Analyzing wallet...</p>}

      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>
          {error}
        </p>
      )}

      {data && (
        <div style={{ marginTop: "30px" }}>
          <h2>📊 Results</h2>

          <p><strong>Address:</strong> {data.address}</p>
          <p><strong>Total Volume:</strong> {data.totalVolumeETH} ETH</p>
          <p><strong>Category:</strong> {data.category}</p>

          <h3 style={{ marginTop: "20px" }}>Transactions</h3>

          {data.transactions?.length === 0 && (
            <p>No transactions found</p>
          )}

          {data.transactions?.map((tx: any) => (
            <div
              key={tx.hash}
              style={{
                border: "1px solid #eee",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            >
              <p><strong>Hash:</strong> {tx.hash}</p>
              <p>
                <strong>Value:</strong>{" "}
                {Number(tx.value) / 1e18} ETH
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
