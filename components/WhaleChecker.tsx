'use client'

import { useState } from 'react'
import { Alchemy, Network, AssetTransfersCategory } from 'alchemy-sdk'

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

// Alchemy configuration
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(settings)

export default function WhaleChecker({ address }: WhaleCheckerProps) {
  const [loading, setLoading] = useState(false)
  const [transfers, setTransfers] = useState<TokenTransfer[]>([])
  const [error, setError] = useState<string>('')

  const fetchTransfers = async () => {
    if (!address) return

    setLoading(true)
    setError('')
    setTransfers([])

    try {
      const response = await alchemy.core.getAssetTransfers({
        fromAddress: address,
        toAddress: address,
        category: [
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.ERC1155,
        ],
        order: 'desc',
        maxCount: '0x19', // 25 in hex
      })

      const formatted: TokenTransfer[] = response.transfers.map((t) => ({
        blockNum: t.blockNum,
        from: t.from || '-',
        to: t.to || '-',
        value: t.value?.toString() || '0',
        asset: t.asset || 'ETH',
      }))

      setTransfers(formatted)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch token transfers')
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
        onClick={fetchTransfers}
        disabled={loading}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? 'Fetching Transfers...' : 'Check Transfers'}
      </button>

      {error && (
        <p className="text-red-500 mt-3 font-medium">
          {error}
        </p>
      )}

      {transfers.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Block</th>
                <th className="border px-3 py-2">From</th>
                <th className="border px-3 py-2">To</th>
                <th className="border px-3 py-2">Asset</th>
                <th className="border px-3 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{t.blockNum}</td>
                  <td className="border px-3 py-2 break-all">{t.from}</td>
                  <td className="border px-3 py-2 break-all">{t.to}</td>
                  <td className="border px-3 py-2">{t.asset}</td>
                  <td className="border px-3 py-2">{t.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {transfers.length === 0 && !loading && !error && (
        <p className="mt-4 text-gray-500">
          No transfers found 💤
        </p>
      )}
    </div>
  )
}
