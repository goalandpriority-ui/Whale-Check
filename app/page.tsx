"use client"

import { useState } from "react"
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_RPC?.split("/v2/")[1],
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

export default function Home() {
  const [address, setAddress] = useState("")
  const [txCount, setTxCount] = useState(0)
  const [category, setCategory] = useState("Shrimp")
  const [loading, setLoading] = useState(false)

  const checkWhale = async () => {
    if (!address) return

    setLoading(true)

    try {
      const history = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        category: [AssetTransfersCategory.EXTERNAL], // ✅ FIXED
      })

      const count = history.transfers.length
      setTxCount(count)

      if (count > 100) {
        setCategory("Whale 🐋")
      } else if (count > 20) {
        setCategory("Dolphin 🐬")
      } else {
        setCategory("Shrimp 🦐")
      }

    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: "40px", background: "black", minHeight: "100vh", color: "white" }}>
      <h1>🐋 Base Whale Engine</h1>

      <input
        style={{ padding: "10px", width: "400px", marginTop: "20px" }}
        placeholder="Paste wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br />

      <button
        onClick={checkWhale}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        {loading ? "Checking..." : "Check Whale"}
      </button>

      <div style={{ marginTop: "40px" }}>
        <h2>🐳 Whale Leaderboard</h2>
        <p>Address: {address}</p>
        <p>Transactions: {txCount}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
