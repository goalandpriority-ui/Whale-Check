"use client"

import { useState } from "react"
import { Alchemy, Network } from "alchemy-sdk"
import { ethers } from "ethers"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

// Uniswap V3 Swap Event Signature
const SWAP_EVENT =
  "0xc42079f94a6350d7e6235f29174924f928c4e1e5a7e52e6d2e0dfeadf8e7b4f1"

async function analyzeUniswapVolume(wallet: string) {
  const latestBlock = await alchemy.core.getBlockNumber()

  const blocksPerDay = 43200
  const days = 547 // 1.5 years
  const fromBlock = latestBlock - blocksPerDay * days

  const paddedAddress = ethers.zeroPadValue(wallet, 32)

  const logs = await alchemy.core.getLogs({
    fromBlock,
    toBlock: "latest",
    topics: [
      SWAP_EVENT,
      null,
      paddedAddress,
    ],
  })

  let totalUSD = 0

  for (const log of logs) {
    const data = log.data

    const amount0 = BigInt("0x" + data.slice(2, 66))
    const amount1 = BigInt("0x" + data.slice(66, 130))

    const abs0 = amount0 < 0n ? -amount0 : amount0
    const abs1 = amount1 < 0n ? -amount1 : amount1

    const biggest = abs0 > abs1 ? abs0 : abs1

    const volumeETH = Number(biggest) / 1e18
    totalUSD += volumeETH * 3000
  }

  return {
    swapCount: logs.length,
    volumeUSD: totalUSD,
  }
}

export default function Home() {
  const [address, setAddress] = useState("")
  const [txCount, setTxCount] = useState(0)
  const [volumeUSD, setVolumeUSD] = useState(0)
  const [category, setCategory] = useState("Shrimp 🦐")
  const [loading, setLoading] = useState(false)

  const checkWhale = async () => {
    if (!address) return
    setLoading(true)

    try {
      const wallet = address.toLowerCase()

      const result = await analyzeUniswapVolume(wallet)

      setTxCount(result.swapCount)
      setVolumeUSD(result.volumeUSD)

      if (result.volumeUSD > 100000) {
        setCategory("Whale 🐋")
      } else if (result.volumeUSD > 10000) {
        setCategory("Shark 🦈")
      } else if (result.volumeUSD > 1000) {
        setCategory("Dolphin 🐬")
      } else {
        setCategory("Shrimp 🦐")
      }

    } catch (error) {
      console.error("Error analyzing swaps:", error)
    }

    setLoading(false)
  }

  return (
    <main
      style={{
        padding: "40px",
        background: "black",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1>🐋 Base Whale Engine (Uniswap V3 PRO)</h1>

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
        onClick={checkWhale}
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
        {loading ? "Analyzing Swaps..." : "Analyze Trading Volume"}
      </button>

      <div style={{ marginTop: "40px" }}>
        <h2>📊 Uniswap Trading Activity (Last 1.5 Years)</h2>
        <p>Address: {address}</p>
        <p>Total Swap Transactions: {txCount}</p>
        <p>Estimated Trading Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
