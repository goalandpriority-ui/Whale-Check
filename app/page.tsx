'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import WhaleChecker from '../components/WhaleChecker'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/wallet?address=${address}`)
        const result = await res.json()
        setData(result)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }

    fetchData()
  }, [address])

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Base Whale Checker 🐋</h1>

      {!isConnected ? (
        <button
          onClick={() => connect()}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="mb-2">
            <strong>Connected:</strong> {address}
          </p>

          <button
            onClick={() => disconnect()}
            className="mb-4 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect
          </button>

          {loading && <p>Checking wallet activity...</p>}

          {data && (
            <div className="border p-4 rounded-lg max-w-md w-full bg-white shadow">
              <h2 className="text-xl font-semibold mb-2">📊 Wallet Stats</h2>
              <p>
                <strong>Total Transactions:</strong> {data.totalTransactions}
              </p>

              <hr className="my-2" />

              <h3 className="font-semibold">💎 ETH Activity</h3>
              <p>
                <strong>ETH Volume:</strong> {data.ethVolume} ETH
              </p>
              <p>
                <strong>ETH USD Value:</strong> ${data.ethUsd}
              </p>
              <p>
                <strong>Current ETH Price:</strong> ${data.ethPrice}
              </p>

              <hr className="my-2" />

              <h3 className="font-semibold">🪙 ERC20 Activity</h3>
              <p>
                <strong>ERC20 Transactions:</strong> {data.erc20Transactions}
              </p>
              <p>
                <strong>ERC20 USD Volume:</strong> ${data.erc20UsdVolume}
              </p>

              <hr className="my-2" />

              <h2 className="text-blue-600 font-bold">
                🐋 Whale Status: {data.status}
              </h2>
            </div>
          )}

          {address && <WhaleChecker address={address} />}
        </>
      )}
    </main>
  )
}
