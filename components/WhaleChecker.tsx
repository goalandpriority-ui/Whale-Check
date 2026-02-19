// components/WhaleChecker.tsx
'use client'

import { useState } from 'react'
import { Alchemy, Network, AssetTransfersCategory } from 'alchemy-sdk'

// Alchemy SDK config
const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_RPC!, // .env.local la irukura key
  network: Network.ETH_MAINNET, // Base chain ku if needed, replace Network.BASE_MAINNET
})

interface Transfer {
  blockNum: string
  from: string
  to: string
  value: string
  tokenSymbol: string
}

export default function WhaleChecker() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    setTransfers([])

    try {
      // 1️⃣ ERC20 Transfers fetch
      const response = await alchemy.core.getAssetTransfers({
        fromAddress: address,
        toAddress: address,
        category: [AssetTransfersCategory.ERC20],
        fromBlock: '0x0', // fetch from genesis
      })

      const formattedTransfers: Transfer[] = response.transfers.map((t: any) => ({
        blockNum: t.blockNum,
        from: t.from,
        to: t.to,
        value: t.value,
        tokenSymbol: t.asset,
      }))

      setTransfers(formattedTransfers)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">🐋 Base Whale Checker</h2>

      <input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <button
        onClick={handleAnalyze}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Wallet'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {transfers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">ERC20 Transfers</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {transfers.map((t, idx) => (
              <li key={idx} className="p-2 bg-white border rounded">
                <p>
                  <strong>{t.tokenSymbol}</strong>: {t.value}
                </p>
                <p>
                  From: {t.from} <br /> To: {t.to} <br /> Block: {parseInt(t.blockNum, 16)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {transfers.length === 0 && !loading && !error && (
        <p className="mt-4 text-gray-500">No transfers found 💤</p>
      )}
    </div>
  )
}
