"use client"

import { useState } from "react"
import { Alchemy, Network } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_RPC?.split("/v2/")[1],
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

// 🔥 Uniswap / DEX Routers list (Base chain)
const DEX_ROUTERS = [
  "0x1f98431c8ad98523631ae4a59f267346ea31f984", // Example Uniswap router
  // Add other Base DEX router addresses here in lowercase
].map((addr) => addr.toLowerCase())

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

      // 1️⃣ Fetch all ERC20 transfers from wallet
      const transfers = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: cleanAddress,
        category: ["erc20"],
        withMetadata: true,
      })

      const txs = transfers.transfers

      // 2️⃣ Filter only DEX router trades
      const dexTxs = txs.filter((tx: any) => {
        const toAddr = tx.to?.toLowerCase()
        return DEX_ROUTERS.includes(toAddr)
      })

      setTxCount(dexTxs.length)

      let totalUSD = 0

      for (const tx of dexTxs as any[]) {
        const tokenAddress = tx.rawContract?.address?.toLowerCase()
        const tokenDecimals = Number(tx.rawContract?.decimals || 18)
        const rawValue = Number(tx.rawContract?.value || 0)
        const tokenAmount = rawValue / Math.pow(10, tokenDecimals)

        // Convert token to USD
        let usdValue = tokenAmount
        // For simplicity, USDC or USDT directly add (can extend to fetch USD prices)
        if (tokenAddress === "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913") {
          usdValue = tokenAmount
        } else {
          // For other tokens, fetch price via Coingecko
          try {
            const priceRes = await fetch(
              `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
            )
            const priceData = await priceRes.json()
            usdValue = tokenAmount * (priceData[tokenAddress]?.usd || 0)
          } catch {
            usdValue = 0
          }
        }

        totalUSD += usdValue
      }

      setVolumeUSD(totalUSD)

      // 🐋 Category Logic
      if (dexTxs.length > 500 && totalUSD > 100000) {
        setCategory("Whale 🐋")
      } else if (dexTxs.length > 200 || totalUSD > 10000) {
        setCategory("Shark 🦈")
      } else if (dexTxs.length > 50 || totalUSD > 1000) {
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
      <h1>🐋 Base Whale Engine (DEX-only Mode)</h1>

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
