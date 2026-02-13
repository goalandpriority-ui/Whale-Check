'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

// You can replace this with a real ETH price API
const ETH_PRICE_USD = 1900 // Example: 1 ETH = $1900

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
      // V2 API endpoint
      const res = await fetch(
        `https://api.basescan.org/api/v2?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_BASESCAN_API}`
      )
      const data = await res.json()
      console.log('V2 API result:', data) // Debugging

      if (data.status === '1' && Array.isArray(data.result)) {
        // Filter only sent transactions
        const sentTxs = data.result.filter(
          (tx: any) => tx.from.toLowerCase() === address.toLowerCase()
        )

        setTxCount(sentTxs.length)

        // Sum total ETH sent
        const totalEth = sentTxs.reduce(
          (sum: number, tx: any) => sum + Number(tx.value) / 1e18,
          0
        )
        setEthVolume(totalEth)

        // USD volume
        setUsdVolume(totalEth * ETH_PRICE_USD)
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
            <div className="text-center mt-4 space-y-2">
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
