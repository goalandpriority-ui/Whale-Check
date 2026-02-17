"use client"

import { useState } from "react"
import { Alchemy, Network } from "alchemy-sdk"
import { ethers } from "ethers"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

// Uniswap V3 Swap event signature
const SWAP_TOPIC =
  "0xc42079f94a6350d7e6235f29174924f928f0b8b4f6eaf5e3e1a1f8c6f6e5c5f"

const ETH_PRICE = 3000

export default function Home() {
  const [address, setAddress] = useState("")
  const [swapCount, setSwapCount] = useState(0)
  const [volumeUSD, setVolumeUSD] = useState(0)
  const [category, setCategory] = useState("Shrimp 🦐")
  const [loading, setLoading] = useState(false)

  const analyzeWallet = async () => {
    if (!address) return
    setLoading(true)

    try {
      const history = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: address,
        category: ["external"],
        maxCount: "0x3e8",
      })

      let swaps = 0
      let totalVolume = 0

      for (const tx of history.transfers) {
        if (!tx.hash) continue

        const receipt = await alchemy.core.getTransactionReceipt(tx.hash)
        if (!receipt || !receipt.logs) continue

        for (const log of receipt.logs) {
          if (log.topics[0]?.toLowerCase() === SWAP_TOPIC) {
            swaps++

            // crude volume estimate from log data
            const amountHex = log.data.slice(0, 66)
            const amount = Number(ethers.BigNumber.from(amountHex).toString())

            const ethAmount = amount / 1e18
            totalVolume += ethAmount * ETH_PRICE
          }
        }
      }

      setSwapCount(swaps)
      setVolumeUSD(totalVolume)

      if (totalVolume > 100000) {
        setCategory("Whale 🐋")
      } else if (totalVolume > 10000) {
        setCategory("Shark 🦈")
      } else if (totalVolume > 1000) {
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
    <main style={{
      padding: "40px",
      background: "black",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Arial",
    }}>
      <h1>🐋 Base Real Swap Detector</h1>

      <input
        style={{
          padding: "12px",
          width: "420px",
          marginTop: "20px",
          borderRadius: "6px",
          border: "none",
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
          padding: "12px 24px",
          borderRadius: "6px",
          border: "none",
          background: "#1f6feb",
          color: "white",
          cursor: "pointer",
        }}
      >
        {loading ? "Scanning swaps..." : "Analyze Swaps"}
      </button>

      <div style={{ marginTop: "40px" }}>
        <h2>📊 Real Swap Detection</h2>
        <p>Detected Swaps: {swapCount}</p>
        <p>Estimated Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
