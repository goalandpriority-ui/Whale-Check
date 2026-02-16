"use client"

import { useState } from "react"
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_RPC?.split("/v2/")[1],
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

// 🔥 Base USDC contract
const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913".toLowerCase()

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
      const transfers = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: address,
        category: [
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.ERC20,
        ],
        withMetadata: true,
      })

      const txs = transfers.transfers
      setTxCount(txs.length)

      let totalUSD = 0
      let totalEth = 0

      for (const tx of txs as any[]) {

        // 1️⃣ Native ETH transfers
        if (tx.category === "external" && tx.value) {
          totalEth += Number(tx.value)
        }

        // 2️⃣ ERC20 Transfers
        if (tx.category === "erc20") {

          const tokenAddress = tx.rawContract?.address?.toLowerCase()
          const tokenDecimals = Number(tx.rawContract?.decimals || 18)
          const rawValue = Number(tx.rawContract?.value || 0)

          const tokenAmount = rawValue / Math.pow(10, tokenDecimals)

          // If USDC, directly USD value
          if (tokenAddress === BASE_USDC) {
            totalUSD += tokenAmount
          }
        }
      }

      // Convert ETH to USD
      const priceRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
      const priceData = await priceRes.json()
      const ethPrice = priceData.ethereum.usd

      totalUSD += totalEth * ethPrice

      setVolumeUSD(totalUSD)

      // 🐋 Category Logic
      if (txs.length > 500 && totalUSD > 100000) {
        setCategory("Whale 🐋")
      } else if (txs.length > 200 || totalUSD > 10000) {
        setCategory("Shark 🦈")
      } else if (txs.length > 50 || totalUSD > 1000) {
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
      <h1>🐋 Base Whale Engine (Smart Volume Mode)</h1>

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
        <h2>📊 Full Base Smart Activity</h2>
        <p>Address: {address}</p>
        <p>Total Transactions: {txCount}</p>
        <p>Estimated Total Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
