'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [txCount, setTxCount] = useState<number | null>(null)
  const [totalEth, setTotalEth] = useState<number | null>(null)
  const [totalUSD, setTotalUSD] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    if (!address) return

    setLoading(true)
    setTxCount(null)
    setTotalEth(null)
    setTotalUSD(null)

    try {
      // V2 API fetch
      const res = await fetch(
        `https://api.basescan.org/api/v2?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_BASESCAN_API_KEY}`
      )

      const data = await res.json()

      if (data.status === "1" && Array.isArray(data.result)) {
        setTxCount(data.result.length)

        // Calculate total ETH sent
        const totalWei = data.result.reduce((acc, tx) => {
          // Only count outgoing transactions
          if (tx.from.toLowerCase() === address.toLowerCase()) {
            return acc + Number(tx.value)
          }
          return acc
        }, 0)

        const totalEthValue = totalWei / 1e18
        setTotalEth(totalEthValue)

        // Convert to USD (you can replace this with real-time price fetch if needed)
        const ETH_USD_PRICE = 1900 // example price, change to dynamic if needed
        setTotalUSD(totalEthValue * ETH_USD_PRICE)
      } else {
        setTxCount(0)
        setTotalEth(0)
        setTotalUSD(0)
      }
    } catch (err) {
      console.error(err)
      setTxCount(0)
      setTotalEth(0)
      setTotalUSD(0)
    }

    setLoading(false)
  }

  const classifyWallet = () => {
    if (!txCount || txCount === 0) return "No Activity 💤"
    if (txCount < 10) return "Shrimp 🦐"
    if (txCount < 100) return "Dolphin 🐬"
    if (txCount < 1000) return "Whale 🐋"
    return "Mega Whale 🦈"
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold text-center">
        Base Whale Checker 🐋
      </h1>

      <p className="text-gray-400 text-center">
        Connect your wallet to analyze Base chain activity
      </p>

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
              <p>Total ETH Volume Sent: {totalEth?.toFixed(4)} ETH</p>
              <p>Total USD Volume: ${totalUSD?.toFixed(2)}</p>
              <p className="text-2xl font-bold mt-2">{classifyWallet()}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
