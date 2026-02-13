'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { createPublicClient, http, formatEther } from 'viem'
import { base } from 'viem/chains'

const publicClient = createPublicClient({
  chain: base,
  transport: http()
})

export default function Home() {
  const { address, isConnected } = useAccount()
  const [txCount, setTxCount] = useState<number | null>(null)
  const [volume, setVolume] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    if (!address) return

    setLoading(true)

    try {
      // 1️⃣ Get total sent transactions (nonce)
      const nonce = await publicClient.getTransactionCount({
        address: address as `0x${string}`
      })

      setTxCount(Number(nonce))

      // 2️⃣ Fetch transactions from BaseScan for volume
      const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API

      const res = await fetch(
        `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
      )

      const data = await res.json()

      if (data.status === "1") {
        let totalVolume = 0

        data.result.forEach((tx: any) => {
          if (tx.from.toLowerCase() === address.toLowerCase()) {
            totalVolume += Number(formatEther(BigInt(tx.value)))
          }
        })

        setVolume(totalVolume)
      } else {
        setVolume(0)
      }

    } catch (err) {
      console.error(err)
      setVolume(0)
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
            onClick={fetchData}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Analyze Wallet
          </button>

          {loading && <p>Analyzing on-chain data...</p>}

          {txCount !== null && !loading && (
            <div className="text-center mt-4 space-y-2">
              <p>Total Sent Transactions: {txCount}</p>
              <p>Total ETH Volume Sent: {volume?.toFixed(4)} ETH</p>
              <p className="text-2xl font-bold mt-2">
                {classifyWallet()}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
