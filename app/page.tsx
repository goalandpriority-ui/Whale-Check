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
  const [volumeUSD, setVolumeUSD] = useState(0)
  const [category, setCategory] = useState("Shrimp 🦐")
  const [loading, setLoading] = useState(false)

  const checkWhale = async () => {
    if (!address) return
    setLoading(true)

    try {
      // Get current block
      const currentBlock = await alchemy.core.getBlockNumber()

      // Approx 1 year blocks on Base (~2.3M)
      const fromBlock = currentBlock - 2300000

      // 1️⃣ Get Transactions (last 1 year)
      const transfers = await alchemy.core.getAssetTransfers({
        fromBlock: `0x${fromBlock.toString(16)}`,
        toBlock: "latest",
        fromAddress: address,
        category: [AssetTransfersCategory.EXTERNAL],
        withMetadata: true,
      })

      const txs = transfers.transfers
      setTxCount(txs.length)

      // 2️⃣ Calculate ETH Volume from tx value
      let totalEth = 0

      txs.forEach((tx: any) => {
        if (tx.value) {
          totalEth += Number(tx.value)
        }
      })

      // 3️⃣ Get ETH Price (simple Coingecko fetch)
      const priceRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
      const priceData = await priceRes.json()
      const ethPrice = priceData.ethereum.usd

      const usdVolume = totalEth * ethPrice
      setVolumeUSD(usdVolume)

      // 4️⃣ Category Logic
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
      <h1>🐋 Base Whale Engine (1Y Advanced)</h1>

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
        <h2>📊 1 Year Activity</h2>
        <p>Address: {address}</p>
        <p>Transactions: {txCount}</p>
        <p>Estimated ETH Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
