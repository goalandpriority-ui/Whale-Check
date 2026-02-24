'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import WhaleChecker from '../components/WhaleChecker'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const injectedConnector = connectors.find(
    (c) => c.id === 'injected'
  )

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        Base Whale Checker 🐋
      </h1>

      {!isConnected ? (
        injectedConnector ? (
          <button
            onClick={() => connect({ connector: injectedConnector })}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Connect Wallet
          </button>
        ) : (
          <p>No wallet connector found</p>
        )
      ) : (
        <>
          <p className="mb-2 break-all">
            <strong>Connected:</strong> {address}
          </p>

          <button
            onClick={() => disconnect()}
            className="mb-4 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect
          </button>

          {address && <WhaleChecker address={address} />}
        </>
      )}
    </main>
  )
}
