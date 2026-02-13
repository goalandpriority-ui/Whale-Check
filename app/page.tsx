'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Base Whale Checker 🐋
      </h1>

      <p className="text-gray-400 text-center">
        Connect your wallet to check Base chain whale transactions
      </p>

      <ConnectButton />

      {isConnected && (
        <p className="text-green-400 mt-4">
          Connected: {address}
        </p>
      )}
    </div>
  )
}
