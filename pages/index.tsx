import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const analyzeWallet = async () => {
    setError("");
    setResult(null);

    if (!address) {
      setError("Address required");
      return;
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🐋 Whale Wallet Analyzer</h1>

      <input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: "400px", padding: "10px" }}
      />

      <button
        onClick={analyzeWallet}
        style={{ padding: "10px 20px", marginLeft: "10px" }}
      >
        Analyze
      </button>

      <div style={{ marginTop: "30px" }}>
        {error && <p style={{ color: "red" }}>❌ {error}</p>}

        {result && (
          <>
            <h2>📊 Results</h2>
            <p><b>Address:</b> {result.address}</p>
            <p><b>Total Volume:</b> {result.totalVolume} ETH</p>
            <p><b>Transactions:</b> {result.txCount}</p>
            <p><b>Category:</b> {result.category}</p>
          </>
        )}
      </div>
    </div>
  );
}
