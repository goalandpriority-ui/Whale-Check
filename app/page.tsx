"use client"

import { useState } from "react"

export default function Home() {
  const [address, setAddress] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    setResult(null)

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    })

    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>🐋 Base Whale Engine (Outgoing Volume)</h1>

      <input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: 400, padding: 10, marginTop: 20 }}
      />

      <br />

      <button
        onClick={handleAnalyze}
        style={{ marginTop: 20, padding: 10 }}
      >
        Analyze Wallet
      </button>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div style={{ marginTop: 30 }}>
          <p>Total Transactions: {result.totalTx}</p>
          <p>Total USD Volume: ${result.totalUSD}</p>
          <h2>{result.category}</h2>
        </div>
      )}
    </main>
  )
}
