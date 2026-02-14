'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    txCount: number
    balance: number
    tokenVolumeUSD: number
    type: string
  } | null>(null)

  const analyzeWallet = async () => {
    if (!address) return

    setLoading(true)
    setData(null)

    try {
      const res = await fetch(`/api/analyze?address=${address}`)
      const result = await res.json()

      if (result.error) {
        alert(result.error)
      } else {
        setData(result)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to analyze wallet")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">

      <div className="max-w-xl w-full text-center space-y-6">

        <h1 className="text-4xl font-bold">
          Base Whale Checker 🐋
        </h1>

        <p className="text-gray-400">
          Connect your wallet to analyze Base chain trading activity
        </p>

        <div className="flex justify-center">
          <ConnectButton />
        </div>

        {isConnected && (
          <>
            <button
              onClick={analyzeWallet}
              className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
            >
              Analyze Wallet
            </button>

            {loading && (
              <p className="text-gray-400 mt-4">
                🔎 Scanning blockchain...
              </p>
            )}

            {data && !loading && (
              <div className="bg-zinc-900 rounded-xl p-6 mt-6 space-y-3 text-left">

                <div className="flex justify-between">
                  <span>Total Transactions</span>
                  <span>{data.txCount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>ETH Balance</span>
                  <span>{data.balance.toFixed(4)} ETH</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Token Volume</span>
                  <span>
                    ${data.tokenVolumeUSD.toLocaleString(undefined, {
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>

                <div className="border-t border-zinc-700 pt-4 text-center text-2xl font-bold">
                  {data.type}
                </div>

              </div>
            )}
          </>
        )}

      </div>

    </div>
  )
}
