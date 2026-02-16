"use client"

import { useState } from "react"
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_RPC?.split("/v2/")[1],
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

// 🔥 Add known Base DEX router addresses here (example placeholders)
const DEX_ROUTERS = [
  "0xE592427A0AEce92De3Edee1F18E0157C05861564".toLowerCase(), // Uniswap V3 Router
]

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
      // 🔥 FULL BASE HISTORY
      const transfers = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: address,
        category: [AssetTransfersCategory.EXTERNAL],
        withMetadata: true,
      })

      const txs = transfers.transfers
      setTxCount(txs.length)

      let totalEth = 0

      for (const tx of txs as any[]) {
        const to = tx.to?.toLowerCase()

        // Only count if interacting with DEX router
        if (to && DEX_ROUTERS.includes(to)) {
          if (tx.value) {
            totalEth += Number(tx.value)
          }
        }
      }

      // Fetch ETH price
      const priceRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
      const priceData = await priceRes.json()
      const ethPrice = priceData.ethereum.usd

      const usdVolume = totalEth * ethPrice
      setVolumeUSD(usdVolume)

      // Category Logic
      if (txs.length > 500 && usdVolume > 100000) {
        setCategory("Whale 🐋")
      } else if (txs.length > 200 || usdVolume > 10000) {
        setCategory("Shark 🦈")
      } else if (txs.length > 50 || usdVolume > 1000) {
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
      <h1>🐋 Base Whale Engine (DEX Accurate Mode)</h1>

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
        {loading ? "Analyzing..." : "Analyze Wallet"}
      </button>

      <div style={{ marginTop: "40px" }}>
        <h2>📊 Full Base DEX Activity</h2>
        <p>Address: {address}</p>
        <p>Total Transactions: {txCount}</p>
        <p>Estimated DEX ETH Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
