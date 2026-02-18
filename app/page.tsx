"use client";

import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeWallet = async () => {
    if (!address) {
      setError("Please enter a wallet address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🐋 Whale Wallet Analyzer</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{
            padding: "10px",
            width: "400px",
            marginRight: "10px",
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
      </div>

      {loading && <p style={{ marginTop: "20px" }}>Analyzing wallet...</p>}

      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>
          ❌ {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>📊 Results</h2>
          <p><strong>Address:</strong> {result.address}</p>
          <p><strong>Total Transactions:</strong> {result.txCount}</p>
          <p><strong>Category:</strong> {result.category}</p>
        </div>
      )}
    </main>
  );
}
