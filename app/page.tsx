'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { formatEther } from 'viem'
import { useBalance } from 'wagmi'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: balance } = useBalance({
    address,
  })

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-2">🐳 Base Whale Check</h1>
      <p className="text-gray-400 mb-6">Check whale power on Base</p>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          className="px-6 py-3 rounded-lg bg-white text-black font-semibold"
        >
          🔗 Connect Wallet
        </button>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-green-400 font-mono">
            Connected: {address}
          </p>

          {balance && (
            <p className="text-xl">
              Balance: {Number(formatEther(balance.value)).toFixed(4)} ETH
            </p>
          )}

          <button
            onClick={() => disconnect()}
            className="px-4 py-2 rounded bg-red-600"
          >
            Disconnect
          </button>
        </div>
      )}
    </main>
  )
}
