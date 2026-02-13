'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  const { address, isConnected } = useAccount()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Base Whale Checker 🐋
      </h1>

      <p className="text-gray-400">
        Connect your wallet to check Base chain whale transactions
      </p>

      {/* Wallet Connect Button */}
      <ConnectButton />

      {isConnected && (
        <p className="text-green-400 mt-4">
          Connected: {address}
        </p>
      )}
    </div>
  )
}
