'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const analyzeWallet = async () => {
    if (!address) return
    setLoading(true)

    try {
      const res = await fetch(`/api/analyze?address=${address}`)
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
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
            onClick={analyzeWallet}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Analyze Wallet
          </button>

          {loading && <p>Scanning blockchain...</p>}

          {data && !loading && (
            <div className="text-center mt-4 space-y-2">
              <p>Total Transactions: {data.txCount}</p>
              <p>Current ETH Balance: {data.balance.toFixed(4)} ETH</p>
              <p>Recent Volume (last 300 blocks): {data.volume.toFixed(4)} ETH</p>
              <p className="text-2xl font-bold mt-2">{data.type}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
