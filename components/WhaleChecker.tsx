'use client'

import { useState } from 'react'

interface WhaleCheckerProps {
  address: string
}

interface ApiResponse {
  wallet: string
  totalTransactions: number
  ethVolume: string
  ethUsd: string
  erc20Transactions: number
  erc20UsdVolume: string
  totalUsd: string
  ethPrice: number
  status: string
}

export default function WhaleChecker({ address }: WhaleCheckerProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState('')

  const checkWhale = async () => {
    if (!address) return

    setLoading(true)
    setError('')
    setData(null)

    try {
      const res = await fetch(`/api/wallet?address=${address}`)
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      setData(result)
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 border rounded-xl shadow-md bg-white mt-6 w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">🐋 Whale Checker</h2>

      <p className="mb-3 text-sm break-all">
        <strong>Wallet:</strong> {address}
      </p>

      <button
        onClick={checkWhale}
        disabled={loading}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? 'Checking...' : 'Check Whale Status'}
      </button>

      {error && (
        <p className="text-red-500 mt-4 font-medium">{error}</p>
      )}

      {data && (
        <div className="mt-6 space-y-3 text-sm">
          <div>Total Transactions: {data.totalTransactions}</div>
          <div>ETH Volume: {data.ethVolume} ETH</div>
          <div>ETH USD: ${data.ethUsd}</div>
          <div>ERC20 Transactions: {data.erc20Transactions}</div>
          <div>ERC20 USD Volume: ${data.erc20UsdVolume}</div>
          <div className="font-bold text-lg">
            Total USD Volume: ${data.totalUsd}
          </div>
          <div className="text-xl font-bold mt-2">
            Status: {data.status}
          </div>
        </div>
      )}
    </div>
  )
}
