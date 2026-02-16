"use client"

import { useState } from "react"
import { Alchemy, Network } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_RPC?.split("/v2/")[1],
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

// ✅ Base Uniswap V3 Router
const UNISWAP_V3_ROUTER = "0x2626664c2603336E57B271c5C0b26F421741e481".toLowerCase()

export default function Home() {
  const [address, setAddress] = useState("")
  const [txCount, setTxCount] = useState(0)
  const [uniTrades, setUniTrades] = useState(0)
  const [category, setCategory] = useState("Shrimp 🦐")
  const [loading, setLoading] = useState(false)

  const analyzeWallet = async () => {
    if (!address) return
    setLoading(true)

    try {
      const cleanAddress = address.trim()

      // ✅ 1️⃣ Get Real Transaction Count (Nonce)
      const totalTx = await alchemy.core.getTransactionCount(cleanAddress)
      setTxCount(totalTx)

      // ✅ 2️⃣ Fetch recent transactions (safe limit)
      const history = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: cleanAddress,
        category: ["external"],
        maxCount: 1000,
      })

      let uniswapCount = 0

      for (const tx of history.transfers as any[]) {
        if (tx.to && tx.to.toLowerCase() === UNISWAP_V3_ROUTER) {
          uniswapCount++
        }
      }

      setUniTrades(uniswapCount)

      // ✅ 3️⃣ Category Logic (Simple + Clean)
      let userCategory = "Shrimp 🦐"

      if (uniswapCount > 500) {
        userCategory = "Whale 🐋"
      } else if (uniswapCount > 200) {
        userCategory = "Shark 🦈"
      } else if (uniswapCount > 50) {
        userCategory = "Dolphin 🐬"
      }

      setCategory(userCategory)

    } catch (err) {
      console.error(err)
      alert("Error analyzing wallet")
    }

    setLoading(false)
  }

  // ✅ Share Text
  const shareText = `🐋 I am classified as "${category}" on Base Whale Engine!

🔹 Total Transactions: ${txCount}
🦄 Uniswap Trades: ${uniTrades}

Analyze your wallet now 👇`

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`
    window.open(twitterUrl, "_blank")
  }

  const shareFarcaster = () => {
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      shareText
    )}`
    window.open(farcasterUrl, "_blank")
  }

  return (
    <main
      style={{
        padding: "40px",
        background: "black",
        minHeight: "100vh",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <h1>🐋 Base Whale Engine</h1>

      <input
        style={{
          padding: "10px",
          width: "400px",
          marginTop: "20px",
          borderRadius: "8px",
        }}
        placeholder="Paste wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br />

      <button
        onClick={analyzeWallet}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Wallet"}
      </button>

      <div style={{ marginTop: "40px" }}>
        <h2>📊 Wallet Intelligence</h2>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Total Transactions:</strong> {txCount}</p>
        <p><strong>Uniswap Trades:</strong> {uniTrades}</p>
        <p><strong>Category:</strong> {category}</p>
      </div>

      {txCount > 0 && (
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={shareTwitter}
            style={{
              marginRight: "15px",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Share on Twitter
          </button>

          <button
            onClick={shareFarcaster}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Share on Farcaster
          </button>
        </div>
      )}
    </main>
  )
}
