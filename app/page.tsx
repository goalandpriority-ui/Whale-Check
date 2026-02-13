'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [txCount, setTxCount] = useState<number | null>(null)
  const [ethVolume, setEthVolume] = useState<number | null>(null)
  const [usdVolume, setUsdVolume] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    if (!address) return
    setLoading(true)

    try {
      // 1️⃣ Fetch transactions from BaseScan V2
      const res = await fetch(
        `https://api.basescan.org/api/v2?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_BASESCAN_API}`
      )
      const data = await res.json()

      if (data.status === "1" && Array.isArray(data.result)) {
        setTxCount(data.result.length)

        // 2️⃣ Calculate total ETH sent
        const totalWei = data.result.reduce((acc: number, tx: any) => {
          if (tx.from.toLowerCase() === address.toLowerCase()) {
            return acc + Number(tx.value)
          }
          return acc
        }, 0)
        const totalEth = totalWei / 1e18
        setEthVolume(totalEth)

        // 3️⃣ Fetch current ETH price in USD
        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        const priceData = await priceRes.json()
        const ethPrice = priceData.ethereum.usd || 0
        setUsdVolume(totalEth * ethPrice)
      } else {
        setTxCount(0)
        setEthVolume(0)
        setUsdVolume(0)
      }
    } catch (err) {
      console.error(err)
      setTxCount(0)
      setEthVolume(0)
      setUsdVolume(0)
    }

    setLoading(false)
  }

  const classifyWallet = () => {
    if (!txCount) return "No Activity 💤"
    if (txCount < 10) return "Shrimp 🦐"
    if (txCount < 100) return "Dolphin 🐬"
    if (txCount < 1000) return "Whale 🐋"
    return "Mega Whale 🦈"
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold text-center">Base Whale Checker 🐋</h1>
      <p className="text-gray-400 text-center">Connect your wallet to analyze Base chain activity</p>

      <ConnectButton />

      {isConnected && (
        <>
          <button
            onClick={fetchTransactions}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Analyze Wallet
          </button>

          {loading && <p>Loading transactions...</p>}

          {txCount !== null && !loading && (
            <div className="text-center mt-4">
              <p>Total Sent Transactions: {txCount}</p>
              <p>Total ETH Volume Sent: {ethVolume?.toFixed(4)} ETH</p>
              <p>Total USD Volume: ${usdVolume?.toFixed(2)}</p>
              <p className="text-2xl font-bold mt-2">{classifyWallet()}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
