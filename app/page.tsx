"use client"

import { useState } from "react"
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

// Temporary fixed ETH price (can upgrade later)
const ETH_PRICE = 3000

export default function Home() {
  const [address, setAddress] = useState("")
  const [totalTransfers, setTotalTransfers] = useState(0)
  const [swapTxCount, setSwapTxCount] = useState(0)
  const [volumeUSD, setVolumeUSD] = useState(0)
  const [category, setCategory] = useState("Shrimp 🦐")
  const [loading, setLoading] = useState(false)

  const analyzeWallet = async () => {
    if (!address) return
    setLoading(true)

    try {
      let pageKey: string | undefined = undefined
      let allTransfers: any[] = []

      // 🔥 Fetch outgoing ERC20 transfers
      do {
        const res = await alchemy.core.getAssetTransfers({
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: address,
          category: [AssetTransfersCategory.ERC20],
          withMetadata: true,
          pageKey,
        })

        allTransfers.push(...res.transfers)
        pageKey = res.pageKey
      } while (pageKey)

      pageKey = undefined

      // 🔥 Fetch incoming ERC20 transfers
      do {
        const res = await alchemy.core.getAssetTransfers({
          fromBlock: "0x0",
          toBlock: "latest",
          toAddress: address,
          category: [AssetTransfersCategory.ERC20],
          withMetadata: true,
          pageKey,
        })

        allTransfers.push(...res.transfers)
        pageKey = res.pageKey
      } while (pageKey)

      setTotalTransfers(allTransfers.length)

      // 🔥 Group transfers by transaction hash
      const txMap: Record<string, any[]> = {}

      for (const tx of allTransfers) {
        if (!tx.hash) continue
        if (!txMap[tx.hash]) txMap[tx.hash] = []
        txMap[tx.hash].push(tx)
      }

      let totalVolume = 0
      let swapCount = 0

      for (const hash in txMap) {
        const transfers = txMap[hash]

        let outgoing: any[] = []
        let incoming: any[] = []

        for (const t of transfers) {
          if (!t.asset) continue

          const symbol = t.asset.toUpperCase()

          // 🔥 Only count stablecoins + WETH (Base)
          if (
            symbol !== "USDC" &&
            symbol !== "USDBC" &&
            symbol !== "DAI" &&
            symbol !== "WETH"
          ) continue

          if (t.from?.toLowerCase() === address.toLowerCase()) {
            outgoing.push(t)
          }

          if (t.to?.toLowerCase() === address.toLowerCase()) {
            incoming.push(t)
          }
        }

        // 🔥 Swap pattern: at least 1 outgoing + 1 incoming
        if (outgoing.length > 0 && incoming.length > 0) {
          swapCount++

          for (const out of outgoing) {
            const actual = Number(out.value)

            if (isNaN(actual) || actual < 1) continue // ignore dust

            const symbol = out.asset?.toUpperCase()

            if (symbol === "WETH") {
              totalVolume += actual * ETH_PRICE
            } else {
              totalVolume += actual
            }
          }
        }
      }

      setSwapTxCount(swapCount)
      setVolumeUSD(totalVolume)

      // 🐋 Categorization
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
      console.error("Error analyzing wallet:", err)
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
      <h1>🐋 Base Whale Engine (Stable USD Mode)</h1>

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
        {loading ? "Analyzing..." : "Analyze Wallet"}
      </button>

      <div style={{ marginTop: "40px" }}>
        <h2>📊 Stable Swap Detection</h2>
        <p>Total ERC20 Transfers: {totalTransfers}</p>
        <p>Detected Swap Transactions: {swapTxCount}</p>
        <p>Estimated Trading Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
