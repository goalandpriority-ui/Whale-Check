"use client"

import { useState } from "react"
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk"

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

const BASE_USDC = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
const BASE_WETH = "0x4200000000000000000000000000000000000006"

export default function Home() {
  const [address, setAddress] = useState("")
  const [txCount, setTxCount] = useState(0)
  const [volumeUSD, setVolumeUSD] = useState(0)
  const [category, setCategory] = useState("Shrimp 🦐")
  const [loading, setLoading] = useState(false)

  const fetchAllTransfers = async (direction: "from" | "to", wallet: string) => {
    let allTransfers: any[] = []
    let pageKey: string | undefined = undefined

    do {
      const response = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        category: [AssetTransfersCategory.ERC20],
        withMetadata: true,
        ...(direction === "from"
          ? { fromAddress: wallet }
          : { toAddress: wallet }),
        pageKey,
      })

      allTransfers = [...allTransfers, ...response.transfers]
      pageKey = response.pageKey

    } while (pageKey)

    return allTransfers
  }

  const checkWhale = async () => {
    if (!address) return
    setLoading(true)

    try {
      const wallet = address.toLowerCase()

      const outgoing = await fetchAllTransfers("from", wallet)
      const incoming = await fetchAllTransfers("to", wallet)

      const txs = [...outgoing, ...incoming]
      setTxCount(txs.length)

      let totalUSD = 0

      for (const tx of txs) {
        const tokenAddress = tx.rawContract?.address?.toLowerCase()
        const tokenDecimals = Number(tx.rawContract?.decimals || 18)
        const rawValue = Number(tx.rawContract?.value || 0)

        if (!rawValue || !tokenAddress) continue

        const tokenAmount = rawValue / Math.pow(10, tokenDecimals)

        if (tokenAddress === BASE_USDC) {
          totalUSD += tokenAmount
        }

        else if (tokenAddress === BASE_WETH) {
          totalUSD += tokenAmount * 3000
        }
      }

      setVolumeUSD(totalUSD)

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
    <main style={{ padding: 40, background: "black", minHeight: "100vh", color: "white" }}>
      <h1>🐋 Base Whale Engine (ERC20 Mode - PRO)</h1>

      <input
        style={{ padding: 10, width: 400, marginTop: 20 }}
        placeholder="Paste wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br />

      <button
        onClick={checkWhale}
        style={{ marginTop: 20, padding: "10px 20px" }}
      >
        {loading ? "Analyzing..." : "Analyze Wallet"}
      </button>

      <div style={{ marginTop: 40 }}>
        <h2>📊 Full ERC20 Activity</h2>
        <p>Address: {address}</p>
        <p>Total ERC20 Transactions: {txCount}</p>
        <p>Estimated ERC20 Volume (USD): ${volumeUSD.toFixed(2)}</p>
        <p>Category: {category}</p>
      </div>
    </main>
  )
}
