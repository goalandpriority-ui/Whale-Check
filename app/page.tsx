"use client"

import { useState } from "react"
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

const UNISWAP_ROUTER =
  "0x2626664c2603336e57b271c5c0b26f421741e481"

export default function Home() {
  const [address, setAddress] = useState("")
  const [totalTx, setTotalTx] = useState(0)
  const [swapTx, setSwapTx] = useState(0)
  const [volumeUSD, setVolumeUSD] = useState(0)
  const [category, setCategory] = useState("Shrimp 🦐")
  const [loading, setLoading] = useState(false)

  const analyzeWallet = async () => {
    if (!address) return
    setLoading(true)

    try {
      let pageKey: string | undefined = undefined
      let allTransfers: any[] = []

      do {
        const response = await alchemy.core.getAssetTransfers({
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: address,
          category: [
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.ERC20,
          ],
          pageKey,
        })

        allTransfers.push(...response.transfers)
        pageKey = response.pageKey
      } while (pageKey)

      setTotalTx(allTransfers.length)

      // Filter Uniswap interactions
      const swaps = allTransfers.filter(
        (tx) =>
          tx.to &&
          tx.to.toLowerCase() === UNISWAP_ROUTER
      )

      setSwapTx(swaps.length)

      let totalVolume = 0

      for (const tx of swaps) {
        if (tx.value) {
          totalVolume += Number(tx.value) * 3000
        }
      }

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
    <main
      style={{
        padding: "40px",
        background: "black",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1>🐋 Base Whale Engine (Fast Mode)</h1>

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
        <h2>📊 Wallet Activity</h2>
        <p>Total Transactions: {totalTx}</p>
        <p>Uniswap Swap Transactions: {swapTx}</p>
        <p>Estimated Trading Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
