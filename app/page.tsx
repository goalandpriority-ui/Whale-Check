"use client"

import { useState } from "react"
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

// Base Token Addresses
const BASE_USDC = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
const BASE_WETH = "0x4200000000000000000000000000000000000006"

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
      const cleanAddress = address.toLowerCase()

      const transfers = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: cleanAddress,
        category: [AssetTransfersCategory.ERC20],
        withMetadata: true,
      })

      const txs = transfers.transfers
      setTxCount(txs.length)

      let totalUSD = 0

      for (const tx of txs as any[]) {
        const tokenAddress = tx.rawContract?.address?.toLowerCase()
        const tokenDecimals = Number(tx.rawContract?.decimals || 18)
        const rawValue = Number(tx.rawContract?.value || 0)

        if (!rawValue || !tokenAddress) continue

        const tokenAmount = rawValue / Math.pow(10, tokenDecimals)

        let usdValue = 0

        // ✅ Base USDC (1 USDC = $1)
        if (tokenAddress === BASE_USDC) {
          usdValue = tokenAmount
        }

        // ✅ Base WETH (Temporary ETH price = $3000)
        else if (tokenAddress === BASE_WETH) {
          usdValue = tokenAmount * 3000
        }

        totalUSD += usdValue
      }

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
      console.error("Error fetching transfers:", err)
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
      }}
    >
      <h1>🐋 Base Whale Engine (ERC20 Mode)</h1>

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
        <h2>📊 Full ERC20 Activity</h2>
        <p>Address: {address}</p>
        <p>Total ERC20 Transactions: {txCount}</p>
        <p>Estimated ERC20 Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
