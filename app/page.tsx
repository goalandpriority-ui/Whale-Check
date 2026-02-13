'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { walletConnect } from '@wagmi/connectors'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      
      <h1 className="text-4xl font-bold mb-4">
        Base Whale Checker 🐋
      </h1>

      <p className="text-gray-300 mb-8 text-center">
        Connect your wallet to check Base chain whale transactions
      </p>

      {!isConnected ? (
        <button
          onClick={() =>
            connect({
              connector: walletConnect({
                projectId: 'c56357101a152b811310071d8366d90',
              }),
            })
          }
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="text-center">
          <p className="mb-4">
            Connected:
          </p>

          <p className="bg-gray-800 px-4 py-2 rounded-lg">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>

          <button
            onClick={() => disconnect()}
            className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Disconnect
          </button>
        </div>
      )}
    </main>
  )
}
