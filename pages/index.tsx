import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeWallet = async () => {
    setError("");
    setResult(null);

    if (!address.trim()) {
      setError("Wallet address is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "Arial",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 32 }}>🐋 Whale Wallet Analyzer</h1>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{
            padding: 12,
            width: 420,
            borderRadius: 8,
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={analyzeWallet}
          style={{
            padding: 12,
            marginLeft: 10,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 20, color: "red" }}>
          ❌ {error}
        </p>
      )}

      {result && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            backgroundColor: "#1e293b",
            borderRadius: 12,
            width: 500,
          }}
        >
          <h3>📊 Results</h3>

          <p>
            <b>Address:</b> {result.address}
          </p>

          <p>
            <b>Total Volume:</b> ${result.volumeUSD}
          </p>

          <p>
            <b>Transactions:</b> {result.transactions}
          </p>

          <p>
            <b>Category:</b> {result.category}
          </p>
        </div>
      )}
    </div>
  );
}
