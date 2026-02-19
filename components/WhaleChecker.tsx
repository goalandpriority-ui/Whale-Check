'use client'

import { useState } from 'react'
import { Alchemy, Network } from 'alchemy-sdk'

interface TokenTransfer {
  blockNum: string
  from: string
  to: string
  value: string
  asset: string
}

interface WhaleCheckerProps {
  address: string
}

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(settings)

export default function WhaleChecker({ address }: WhaleCheckerProps) {
  const [loading, setLoading] = useState(false)
  const [transfers, setTransfers] = useState<TokenTransfer[]>([])
  const [error, setError] = useState('')

  const fetchTransfers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await alchemy.core.getAssetTransfers({
        fromAddress: address,
        toAddress: address,
        category: ['external', 'erc20', 'erc721', 'erc1155'],
        order: 'desc',
        maxCount: 25,
      })

      const tokenTransfers: TokenTransfer[] = response.transfers.map((t: any) => ({
        blockNum: t.blockNum,
        from: t.from,
        to: t.to,
        value: t.value || '0',
        asset: t.asset || t.tokenSymbol || 'ETH',
      }))
      setTransfers(tokenTransfers)
    } catch (err: any) {
      console.error(err)
      setError('Failed to fetch token transfers')
    }
    setLoading(false)
  }

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">Whale Checker</h2>
      <p className="mb-2">Address: {address}</p>
      <button
        onClick={fetchTransfers}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? 'Fetching...' : 'Check Transfers'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {transfers.length > 0 && (
        <table className="table-auto mt-4 w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1">Block</th>
              <th className="px-2 py-1">From</th>
              <th className="px-2 py-1">To</th>
              <th className="px-2 py-1">Asset</th>
              <th className="px-2 py-1">Value</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t, i) => (
              <tr key={i} className="border-t">
                <td className="px-2 py-1">{t.blockNum}</td>
                <td className="px-2 py-1">{t.from}</td>
                <td className="px-2 py-1">{t.to}</td>
                <td className="px-2 py-1">{t.asset}</td>
                <td className="px-2 py-1">{t.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {transfers.length === 0 && !loading && !error && (
        <p className="mt-2 text-gray-500">No transfers found 💤</p>
      )}
    </div>
  )
}
