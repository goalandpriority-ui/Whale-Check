'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  const [txCount, setTxCount] = useState<number>(0)
  const [ethVolume, setEthVolume] = useState<number>(0)
  const [usdVolume, setUsdVolume] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    if (!address) return

    setLoading(true)
    setTxCount(0)
    setEthVolume(0)
    setUsdVolume(0)

    try {
      // 1️⃣ Fetch all transactions
      const res = await fetch(
        `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_BASESCAN_API_KEY}`
      )
      const data = await res.json()

      if (data.status !== "1") {
        setTxCount(0)
        setEthVolume(0)
        setUsdVolume(0)
        setLoading(false)
        return
      }

      const txs = data.result
      setTxCount(txs.length)

      // 2️⃣ Calculate total ETH sent
      const totalEth = txs.reduce((sum: number, tx: any) => {
        return sum + parseFloat(tx.value) / 1e18
      }, 0)
      setEthVolume(totalEth)

      // 3️⃣ Get current ETH price in USD
      const priceRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
      const priceData = await priceRes.json()
      const ethPrice = priceData.ethereum.usd
      setUsdVolume(totalEth * ethPrice)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  const classifyWallet = () => {
    if (txCount === 0) return "No Activity 💤"
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

          {!loading && (
            <div className="text-center mt-4">
              <p>Total Sent Transactions: {txCount}</p>
              <p>Total ETH Volume Sent: {ethVolume.toFixed(4)} ETH</p>
              <p>Total USD Volume: ${usdVolume.toFixed(2)}</p>
              <p className="text-2xl font-bold mt-2">{classifyWallet()}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
